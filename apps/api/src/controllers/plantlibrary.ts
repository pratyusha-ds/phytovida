import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { sql, eq, ilike } from "drizzle-orm";
import { plants, sourceSync } from "../db/schema.js";
import type { PerenualPlant, PerenualResponse } from "@repo/types";

const PERENUAL_BASE_URL = "https://perenual.com/api";
const API_KEY = process.env.PERENUAL_API_KEY;
const MAX_REQUESTS = 100;

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

        const isAtPageLimit = syncRecord.lastFetchedPage >= MAX_REQUESTS;
        const isAtTotalPages = syncRecord.totalPages !== null && syncRecord.lastFetchedPage >= syncRecord.totalPages;

        if (isAtPageLimit || isAtTotalPages) {
            return res.status(200).json({ inserted: 0, exhausted: true });
        }

        const nextPage = syncRecord.lastFetchedPage + 1;

        await db
            .update(sourceSync)
            .set({ status: "running", lastRunAt: new Date() })
            .where(eq(sourceSync.source, "perenual"));

        const response = await fetch(
            `${PERENUAL_BASE_URL}/v2/species-list?key=${API_KEY}&page=${nextPage}`
        );

    if (!response.ok) {
      throw new Error(`Perenual API error: ${response.status}`);
    }

    let data: PerenualResponse;
    try {
      data = (await response.json()) as PerenualResponse;
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      throw parseError;
    }

    const plantRows = data.data.map((plant: PerenualPlant) => ({
      id: String(plant.id),
      name: plant.common_name,
      imageUrl: plant.default_image?.medium_url ?? null,
      minTemp: plant.hardiness?.min ? parseInt(plant.hardiness.min) : null,
      maxTemp: plant.hardiness?.max ? parseInt(plant.hardiness.max) : null,
    }));

    await db
      .insert(plants)
      .values(plantRows)
      .onConflictDoUpdate({
        target: plants.id,
        set: {
          name: sql`excluded.name`,
          imageUrl: sql`excluded.image_url`,
          minTemp: sql`excluded.min_temp`,
          maxTemp: sql`excluded.max_temp`,
        },
      });

        await db
            .update(sourceSync)
            .set({
                lastFetchedPage: nextPage,
                totalPages: data.last_page,
                status: "idle",
                errorMessage: null,
            })
            .where(eq(sourceSync.source, "perenual"));

        res.status(200).json({
            inserted: plantRows.length,
            exhausted: nextPage >= MAX_REQUESTS || nextPage >= data.last_page,
        });

    } catch (error) {
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
        await db
            .update(sourceSync)
            .set({ status: "error", errorMessage: (error as Error).message })
            .where(eq(sourceSync.source, "perenual"));

        res.status(500).json({ error: "Failed to fetch plants from Perenual" });
    }
};
