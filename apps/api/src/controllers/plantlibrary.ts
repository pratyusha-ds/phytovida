import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { sql, eq, ilike } from "drizzle-orm";
import { plants } from "../db/schema.js";
import type { PerenualPlant } from "@repo/types";
import { cloudinaryUpload } from "../utils/cloudinaryUpload.js";

const PERENUAL_BASE_URL = "https://perenual.com/api";
const API_KEY = process.env.PERENUAL_API_KEY;
const MAX_BATCH_SIZE = 30;

// ---------- Paywall detection helpers ----------

function isPaywallImage(url: string | null | undefined): boolean {
  if (!url) return true;
  return url.includes("/image/upgrade_access");
}

function isPaywallDetailsResponse(data: any): boolean {
  return (
    !data?.id ||
    !data?.common_name ||
    (typeof data?.message === "string" &&
      data.message.toLowerCase().includes("upgrade")) ||
    (typeof data?.X === "string" && data.X.toLowerCase().includes("upgrade"))
  );
}

async function safeImageUpload(
  rawUrl: string | null | undefined,
  plantId: number | string,
): Promise<string | null> {
  if (isPaywallImage(rawUrl)) return null;
  try {
    return await cloudinaryUpload(rawUrl);
  } catch {
    console.log(`Image upload failed for plant ${plantId}, skipping`);
    return null;
  }
}

// Search plants by name using Perenual API
export const getPlantByName = async (req: Request, res: Response) => {
  try {
    const name = (req.query.name as string)?.trim();
    if (!name) {
      return res
        .status(400)
        .json({ error: "Name query parameter is required" });
    }

    const MIN_RESULTS = 5;
    const MAX_PAGES = 5; // safety cap to avoid hammering Perenual

    const collected: {
      id: string;
      name: string;
      imageUrl: string | null;
      watering: string | null;
      sunlight: string | null;
    }[] = [];

    let currentPage = Number(req.query.page ?? 1);
    let lastPage = 1;
    let pagesFetched = 0;

    while (collected.length < MIN_RESULTS && pagesFetched < MAX_PAGES) {
      const params = new URLSearchParams({
        key: API_KEY!,
        q: name,
        page: String(currentPage),
      });

      const url = `${PERENUAL_BASE_URL}/v2/species-list?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.error(
          `Perenual search failed: ${response.status} ${response.statusText}`,
        );
        // If first page fails, return error. Otherwise return what we have.
        if (pagesFetched === 0) {
          return res
            .status(502)
            .json({ error: "Failed to fetch from Perenual" });
        }
        break;
      }

      const json = (await response.json()) as {
        data: PerenualPlant[];
        total: number;
        current_page: number;
        last_page: number;
      };

      lastPage = json.last_page;
      pagesFetched++;

      const goodPlants = json.data
        .filter((plant) => !isPaywallImage(plant.default_image?.medium_url))
        .map((plant) => ({
          id: String(plant.id),
          name: plant.common_name,
          imageUrl: plant.default_image?.medium_url ?? null,
          watering: plant.watering ?? null,
          sunlight: plant.sunlight?.join(", ") ?? null,
        }));

      collected.push(...goodPlants);

      // If no more pages, stop
      if (currentPage >= lastPage) break;

      currentPage++;

      // Small delay to avoid hitting Perenual's rate limit
      await new Promise((r) => setTimeout(r, 200));
    }

    return res.status(200).json({
      data: collected,
      pagination: {
        total: collected.length,
        currentPage: 1,
        lastPage,
        hasNextPage: false,
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

    // Detect paywall response BEFORE doing any work
    if (isPaywallDetailsResponse(plant)) {
      return res.status(403).json({
        error: "Premium plant — details not available on free plan",
        premium: true,
      });
    }

    // Cloudinary upload (skips paywall images automatically)
    const imageUrl = await safeImageUpload(
      plant.default_image?.medium_url,
      plant.id,
    );
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
    let paywalledCount = 0;

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
      const plant = (await response.json()) as PerenualPlant;
      // Skip paywalled plants so we don't store garbage rows
      if (isPaywallDetailsResponse(plant)) {
        paywalledCount++;
        await new Promise((r) => setTimeout(r, 200));
        continue;
      }

      validPlants.push(plant);

      // Small delay between requests to stay under Perenual's limit
      await new Promise((r) => setTimeout(r, 200));
    }

    // Upload images (sequentially, skips paywall placeholders automatically)
    const plantsWithImages: {
      plant: PerenualPlant;
      imageUrl: string | null;
    }[] = [];
    for (const plant of validPlants) {
      const imageUrl = await safeImageUpload(
        plant.default_image?.medium_url,
        plant.id,
      );
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
