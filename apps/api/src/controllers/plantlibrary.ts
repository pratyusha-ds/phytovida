import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { sql } from "drizzle-orm";
import { plants } from "../db/schema.js";
import type { PerenualPlant, PerenualResponse } from "@repo/types";

const PERENUAL_BASE_URL = "https://perenual.com/api";
const API_KEY = process.env.PERENUAL_API_KEY;

export const getPlantsData = async (req: Request, res: Response) => {

    try {
        const response = await fetch(
            `${PERENUAL_BASE_URL}/species-list?key=${API_KEY}&page=1`
        );

        if (!response.ok) {
            throw new Error(`Perenual API error: ${response.status}`);
        }

        const data = await response.json() as PerenualResponse;

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

    } catch (error) {
        console.error("Error fetching all plants:", error);
        res.status(500).json({ error: "Failed to fetch plants from db" });
    }

};