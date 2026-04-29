import type { Request, Response } from "express";
import { plants, usersPlants } from "../db/schema.js";
import { db } from "../db/index.js";
import { and, eq } from "drizzle-orm";
import { addUserPlant } from "../services/user-plants.js";
import { addWateringLog } from "../services/plant-logs.js";

export const createUserPlantController = async (req: Request, res: Response) => {
	const userId = req.userId || "";
	const { plantId, phase, wateringFrequency, lastWateredDate } = req.body;

	const answer = await addUserPlant({ userId, plantId, phase, wateringFrequency, lastWateredDate });

	answer.match(async (data) => {
		const userPlant = data[0];

		if (!!userPlant?.lastWateredDate) {
			const logWateringAns = await addWateringLog(userPlant.id, userId, userPlant.lastWateredDate);
			logWateringAns.match(() => { }, (logError) => {
				switch (logError.reason) {
					case "UserPlantNotFound":
						return res.status(404).json({ error: true, message: logError.message });
					case "Unauthorized":
						return res.status(403).json({ error: true, message: logError.message });
					default:
						return res.status(500).json({ error: true, message: logError.message });
				}
			});
		}
		return res.status(201).json(data);
	}, (error) => {
		switch (error.reason) {
			case "UserNotFound":
				return res.status(404).json({ error: true, message: error.message });
			case "PlantNotFound":
				return res.status(404).json({ error: true, message: error.message });
			default:
				return res.status(500).json({ error: true, message: error.message });
		}
	})
}

export const readUserPlantsController = async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;

    if (!userId) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized: Missing user authentication.",
      });
    }

    // pagination
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);
    const offset = (page - 1) * limit;

    // total count (for pagination meta)
    const totalResult = await db
      .select({ count: usersPlants.id })
      .from(usersPlants)
      .where(eq(usersPlants.userId, userId)); // ownership check

    const total = totalResult.length;

    // main query with join
    const data = await db
      .select({
        id: usersPlants.id,
        plantId: usersPlants.plantId,
        wateringFrequency: usersPlants.wateringFrequency,
        lastWateredDate: usersPlants.lastWateredDate,
        plantName: plants.name,
        plantImg: plants.imageUrl,
        minTemp: plants.minTemp,
        maxTemp: plants.maxTemp,
      })
      .from(usersPlants)
      .leftJoin(plants, eq(usersPlants.plantId, plants.id))
      .where(eq(usersPlants.userId, userId)) // ownership check
      .limit(limit)
      .offset(offset);

    return res.status(200).json({
      data,
      pagination: {
        page,
        limit,
        total,
        hasNextPage: offset + limit < total,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Failed to fetch your plants",
    });
  }
};

export const readUserPlantController = async (req: Request, res: Response) => {
  try {
    const userPlantId = req.params.plantId as string;
    const userId = req.userId!;

    if (!userId) {
      return res.status(401).json({
        error: true,
        message: "Unauthorized: Missing user authentication.",
      });
    }

    if (!userPlantId || isNaN(Number(userPlantId))) {
      return res.status(400).json({
        error: true,
        message: "Your plant ID is invalid or missing!",
      });
    }

    const result = await db
      .select({
        id: usersPlants.id,
        plantId: usersPlants.plantId,
        wateringFrequency: usersPlants.wateringFrequency,
        lastWateredDate: usersPlants.lastWateredDate,
        plantName: plants.name,
        plantImg: plants.imageUrl,
        minTemp: plants.minTemp,
        maxTemp: plants.maxTemp,
      })
      .from(usersPlants)
      .leftJoin(plants, eq(usersPlants.plantId, plants.id))
      .where(
        and(
          eq(usersPlants.userId, userId), // ownership check
          eq(usersPlants.id, Number(userPlantId)),
        ),
      )
      .limit(1);

    const data = result[0] ?? null;

    if (!data) {
      return res.status(404).json({
        error: true,
        message: "Plant not found",
      });
    }

    return res.status(200).json({
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: true,
      message: "Failed to fetch your plant",
    });
  }
};
