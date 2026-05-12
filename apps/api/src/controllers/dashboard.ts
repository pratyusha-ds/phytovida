import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { userSettings, usersPlants, plants } from "../db/schema.js";
import { selectPlantsThatNeedWatering } from "../services/user-plants.js";
import { findUserById } from "./user-settings.js";
import { User } from "../../types/user.js";

export const getDashboard = async (req: Request, res: Response) => {
  const userId = req.userId!;
  let user: User | undefined = undefined;

  const userAnswer = await findUserById(userId);

  userAnswer.match(
    (data) => {
      user = data;
    },
    (error) => {
      return res.status(error.status).json({ error: true, message: error.message });
    }
  )

  const answer = await selectPlantsThatNeedWatering(userId);

  answer.match(
    (data) => {
      res.status(200).json({location: user?.homeLocation, plants: data});
    },
    (error) => {
      switch (error.reason) {
        case "Unauthorized": { return res.status(403).json({ error: true, message: error.message }); break; }
        default: { return res.status(500).json({ error: true, message: error.message }); break; }
      }
    }
  )


}
export const getDashboardData = async (req: Request, res: Response) => {
  const { userId } = req.params;

  if (!userId || typeof userId !== "string") {
    res.status(400).json({ error: "User ID is required" });
    return;
  }

  try {
    const settingsRows = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId))
      .limit(1);

    let settings;

    if (settingsRows.length === 0) {
      const newSettings = await db
        .insert(userSettings)
        .values({
          userId: userId,
          homeLocation: "London",
        })
        .returning();
      settings = newSettings[0];
    } else {
      settings = settingsRows[0];
    }

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
      location: settings?.homeLocation ?? "Leipzig",
      plants: userPlantsList,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Dashboard Error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

export const updateUserLocation = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { location } = req.body;

  if (!userId || typeof userId !== "string") {
    res.status(400).json({ error: "User ID is required" });
    return;
  }

  if (!location || typeof location !== "string" || !location.trim()) {
    res.status(400).json({ error: "A valid location is required" });
    return;
  }

  try {
    const updated = await db
      .update(userSettings)
      .set({ homeLocation: location.trim() })
      .where(eq(userSettings.userId, userId))
      .returning();

    const [updatedSettings] = updated;

    if (!updatedSettings) {
      res.status(404).json({ error: "User settings not found" });
      return;
    }

    res.json({ location: updatedSettings.homeLocation });
  } catch (err) {
    console.log("Update location error", err);
    res.status(500).json({ error: "Failed to update location" });
  }
};