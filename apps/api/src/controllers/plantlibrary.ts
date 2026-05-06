import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { sql, eq, ilike } from "drizzle-orm";
import { plants } from "../db/schema.js";
import type { PerenualPlant } from "@repo/types";
import { cloudinaryUpload } from "../utils/cloudinaryUpload.js";

const PERENUAL_BASE_URL = "https://perenual.com/api";
const API_KEY = process.env.PERENUAL_API_KEY;
const MAX_BATCH_SIZE = 100;

export const getPlantsData = async (req: Request, res: Response) => {

  try {
    const lastPlant = await db
      .select({ id: plants.id })
      .from(plants)
      .orderBy(sql`cast(id as int) desc`)
      .limit(1)
      .then(rows => rows[0]);

    const startId = lastPlant ? Number(lastPlant.id) + 1 : 1;
    const idsToFetch = Array.from({ length: MAX_BATCH_SIZE }, (_, i) => startId + i);

    const results = await Promise.all(
      idsToFetch.map(async (id) => {
        const response = await fetch(
          `${PERENUAL_BASE_URL}/v2/species/details/${id}?key=${API_KEY}`
        );
        if (!response.ok) return null;
        return (await response.json()) as PerenualPlant;
      })
    );

    const validPlants = results.filter(Boolean) as PerenualPlant[];

    const plantsWithImages = await Promise.all(
      validPlants.map(async (plant) => {
        let imageUrl: string | null = null;
        try {
          imageUrl = await cloudinaryUpload(plant.default_image?.medium_url);
        } catch {
          console.log(`Image upload failed for plant ${plant.id}, skipping`)
        }
        return { plant, imageUrl };
      })
    );

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
        }))
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

    res.status(200).json( {inserted: plantsWithImages.length })

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

    const allPlants = await db.select().from(plants).where(whereClause).limit(limit).offset(offset);

    const hasNextPage = offset + limit < total;

    res.status(200).json({
      data: allPlants,
      pagination: { total, hasNextPage }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch plants from Perenual" });
  }
};
