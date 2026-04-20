import { Request, Response } from "express";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { userSettings, usersPlants, plants } from "../db/schema.js";

export const getDashboardData = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId || typeof userId !== "string") {
    res.status(400).json({ error: "User ID is required" });
    return;
  }

  try {
    const settings = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1);

    const userPlantsList = await db
      .select({
        id: usersPlants.id,
        name: plants.name,
        image: plants.imageUrl,
        waterFrequency: usersPlants.wateringFrequency,
        lastWatered: usersPlants.lastWateredDate,
      })
      .from(usersPlants)
      .leftJoin(plants, eq(usersPlants.plantId, plants.id))
      .where(eq(usersPlants.userId, userId));

    res.json({
      location: settings[0]?.homeLocation || "London, UK",
      plants: userPlantsList,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};
