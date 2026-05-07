import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { sql, eq, ilike } from "drizzle-orm";
import { plants } from "../db/schema.js";
import type { PerenualPlant } from "@repo/types";
import { cloudinaryUpload } from "../utils/cloudinaryUpload.js";

const PERENUAL_BASE_URL = "https://perenual.com/api";
const API_KEY = process.env.PERENUAL_API_KEY;
const MAX_BATCH_SIZE = 30;

// Search plants by name using Perenual API
export const getPlantByName = async (req: Request, res: Response) => {
  try {
    const name = (req.query.name as string)?.trim();
    if (!name) {
      return res
        .status(400)
        .json({ error: "Name query parameter is required" });
    }
    const page = Number(req.query.page ?? 1);
    const params = new URLSearchParams({
      key: API_KEY!,
      q: name,
      page: String(page),
    });

    const url = `${PERENUAL_BASE_URL}/v2/species-list?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        `Perenual search failed: ${response.status} ${response.statusText}`,
      );
      return res.status(502).json({ error: "Failed to fetch from Perenual" });
    }
    const json = (await response.json()) as {
      data: PerenualPlant[];
      total: number;
      current_page: number;
      last_page: number;
    };
    const mapped = json.data.map((plant) => ({
      id: String(plant.id),
      name: plant.common_name,
      imageUrl: plant.default_image?.medium_url ?? null,
      watering: plant.watering ?? null,
      sunlight: plant.sunlight?.join(", ") ?? null,
    }));
    return res.status(200).json({
      data: mapped,
      pagination: {
        total: json.total,
        currentPage: json.current_page,
        lastPage: json.last_page,
        hasNextPage: json.current_page < json.last_page,
      },
    });
  } catch (error) {
    console.error("getPlantByName error:", error);
    return res.status(500).json({ error: "Failed to search plants" });
  }
};

//get plants by id
export const getPlantById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID parameter is required" });
    }

    //DB check
    const existing = await db
      .select()
      .from(plants)
      .where(eq(plants.id, String(id)))
      .limit(1)
      .then((rows) => rows[0]);

    if (existing) {
      return res.status(200).json({ data: existing, cached: true });
    }
    //case when not in DB, fetch from Perenual
    const url = `${PERENUAL_BASE_URL}/v2/species/details/${id}?key=${API_KEY}`;
    const response = await fetch(url);

    if (response.status === 404) {
      return res.status(404).json({ error: "Plant not found" });
    }

    if (!response.ok) {
      console.error(
        `Perenual details failed: ${response.status} ${response.statusText}`,
      );
      return res.status(502).json({ error: "Failed to fetch plant details" });
    }
    const plant = (await response.json()) as PerenualPlant;

    // cloudinary upload
    let imageUrl: string | null = null;
    try {
      imageUrl = await cloudinaryUpload(plant.default_image?.medium_url);
    } catch {
      console.log(`Image upload failed for plant ${plant.id}, skipping`);
    }
    const mapped = {
      id: String(plant.id),
      name: plant.common_name,
      imageUrl,
      watering: plant.watering ?? null,
      sunlight: plant.sunlight?.join(", ") ?? null,
      hardiness: plant.hardiness ? JSON.stringify(plant.hardiness) : null,
    };

    // Persist for next time. onConflictDoNothing handles the race
    // where two requests for the same id arrive simultaneously.
    await db
      .insert(plants)
      .values(mapped)
      .onConflictDoNothing({ target: plants.id });
    return res.status(200).json({ data: mapped, cached: false });
  } catch (error) {
    console.error("getPlantById error:", error);
    return res.status(500).json({ error: "Failed to fetch plant" });
  }
};

export const getPlantsData = async (req: Request, res: Response) => {
  try {
    const lastPlant = await db
      .select({ id: plants.id })
      .from(plants)
      .orderBy(sql`cast(id as int) desc`)
      .limit(1)
      .then((rows) => rows[0]);

    const startId = lastPlant ? Number(lastPlant.id) + 1 : 1;
    const idsToFetch = Array.from(
      { length: MAX_BATCH_SIZE },
      (_, i) => startId + i,
    );

    // Sequential fetch with delay — avoids burst that triggers 429
    const validPlants: PerenualPlant[] = [];
    let rateLimited = false;

    for (const id of idsToFetch) {
      const response = await fetch(
        `${PERENUAL_BASE_URL}/v2/species/details/${id}?key=${API_KEY}`,
      );

      if (response.status === 429) {
        console.warn(`Rate limited at id ${id}, stopping early`);
        rateLimited = true;
        break;
      }

      if (!response.ok) {
        // 404 or other — skip this id, continue
        continue;
      }

      validPlants.push((await response.json()) as PerenualPlant);

      // Small delay between requests to stay under Perenual's limit
      await new Promise((r) => setTimeout(r, 200));
    }

    // Upload images (also sequentially to avoid Cloudinary bursts)
    const plantsWithImages: {
      plant: PerenualPlant;
      imageUrl: string | null;
    }[] = [];
    for (const plant of validPlants) {
      let imageUrl: string | null = null;
      try {
        imageUrl = await cloudinaryUpload(plant.default_image?.medium_url);
      } catch {
        console.log(`Image upload failed for plant ${plant.id}, skipping`);
      }
      plantsWithImages.push({ plant, imageUrl });
    }

    if (plantsWithImages.length > 0) {
      await db
        .insert(plants)
        .values(
          plantsWithImages.map(({ plant, imageUrl }) => ({
            id: String(plant.id),
            name: plant.common_name,
            imageUrl,
            watering: plant.watering ?? null,
            sunlight: plant.sunlight?.join(", ") ?? null,
            hardiness: plant.hardiness ? JSON.stringify(plant.hardiness) : null,
          })),
        )
        .onConflictDoUpdate({
          target: plants.id,
          set: {
            name: sql`excluded.name`,
            imageUrl: sql`excluded.image_url`,
            watering: sql`excluded.watering`,
            sunlight: sql`excluded.sunlight`,
            hardiness: sql`excluded.hardiness`,
          },
        });
    }

    if (rateLimited) {
      return res.status(429).json({
        error: "Perenual rate limit reached",
        inserted: plantsWithImages.length,
        rateLimited: true,
      });
    }

    return res.status(200).json({
      inserted: plantsWithImages.length,
      rateLimited: false,
    });
  } catch (err) {
    console.error("getPlantsData error:", err);
    res.status(500).json({ error: "Failed to fetch plants from Perenual" });
  }
};

export const getPlants = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const search = (req.query.search as string) ?? "";

    const offset = (page - 1) * limit;

    const whereClause = search ? ilike(plants.name, `%${search}%`) : undefined;

    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(plants)
      .where(whereClause);

    if (!totalResult[0]) {
      throw new Error("Count query returned no rows");
    }
    const total = Number(totalResult[0].count);

    const allPlants = await db
      .select()
      .from(plants)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    const hasNextPage = offset + limit < total;

    res.status(200).json({
      data: allPlants,
      pagination: { total, hasNextPage },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch plants from Perenual" });
  }
};
