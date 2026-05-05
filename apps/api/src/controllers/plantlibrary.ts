import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { sql, eq, ilike } from "drizzle-orm";
import { plants, sourceSync } from "../db/schema.js";
import type { PerenualPlant } from "@repo/types";
import { cloudinaryUpload } from "../utils/cloudinaryUpload.js";

const PERENUAL_BASE_URL = "https://perenual.com/api";
const API_KEY = process.env.PERENUAL_API_KEY;
const MAX_PLANT_ID = 100;

export const getPlantsData = async (req: Request, res: Response) => {

  try {
    let syncRecord = await db
      .select()
      .from(sourceSync)
      .where(eq(sourceSync.source, "perenual"))
      .then((rows) => rows[0]);

    if (!syncRecord) {
      const inserted = await db
        .insert(sourceSync)
        .values({ source: "perenual" })
        .returning();
      syncRecord = inserted[0];
    }

    if (!syncRecord) {
      throw new Error("Failed to create sync record");
    }

    const isExhausted = syncRecord.lastFetchedId >= MAX_PLANT_ID;

    if (isExhausted) {
      return res.status(200).json({ inserted: 0, exhausted: true });
    }

    const nextId = syncRecord.lastFetchedId + 1;

    await db
      .update(sourceSync)
      .set({ status: "running", lastRunAt: new Date() })
      .where(eq(sourceSync.source, "perenual"));

    const response = await fetch(
      `${PERENUAL_BASE_URL}/v2/species/details/${nextId}?key=${API_KEY}`
    );

    if (!response.ok) {
      await db
        .update(sourceSync)
        .set({ lastFetchedId: nextId })
        .where(eq(sourceSync.source, "perenual"));

      return res.status(200).json({ inserted: 0, skipped: nextId });
    }

    const plant = (await response.json()) as PerenualPlant;

    console.log("Sample plant from API:", response);


    let imageUrl: string | null = null;
    try {
      imageUrl = await cloudinaryUpload(plant.default_image?.medium_url);
    } catch {
      console.log(`Image upload failed for plant ${plant.id}, skipping`)
    }

    await db
      .insert(plants)
      .values({
        id: String(plant.id),
        name: plant.common_name,
        imageUrl,
        watering: plant.watering ?? null,
        sunlight: plant.sunlight?.join(", ") ?? null,
        hardiness: plant.hardiness ? JSON.stringify(plant.hardiness) : null,
      })
      .onConflictDoUpdate({
        target: plants.id,
        set: {
          name: sql`excluded.name`,
          imageUrl: sql`excluded.image_url`,
          watering: sql`excluded.watering`,
          sunlight: sql`excluded.sunlight`,
          hardiness: sql`excluded.hardiness`,
        }
      })

    await db
      .update(sourceSync)
      .set({
        lastFetchedId: nextId,
        status: "idle",
        errorMessage: null,
      })
      .where(eq(sourceSync.source, "perenual"));

    res.status(200).json({
      inserted: 1,
      exhausted: nextId >= MAX_PLANT_ID,
    });

  } catch (error) {
    await db
      .update(sourceSync)
      .set({ status: "error", errorMessage: (error as Error).message })
      .where(eq(sourceSync.source, "perenual"));
    console.error("getPlants error:", error);
    res.status(500).json({ error: "Failed to fetch plants from db" });
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
