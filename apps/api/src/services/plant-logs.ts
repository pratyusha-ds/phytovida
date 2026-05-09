import { db } from "../db/index.js";
import { usersPlants, plantWateringLogs } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { errAsync, okAsync } from "neverthrow";

export const addWateringLog = async (userPlantId: number, userId: string, wateredAt: Date) => {
    try {
        // Check if the userPlantId belongs to the user
        const userPlant = await db.select()
            .from(usersPlants)
            .where(eq(usersPlants.id, userPlantId))
            .limit(1);

        if (userPlant.length === 0) {
            return errAsync({ reason: "UserPlantNotFound", message: "The specified plant does not belong to the user." });
        }

        if (userPlant[0]?.userId !== userId) {
            return errAsync({ reason: "Unauthorized", message: "The specified plant does not belong to the user." });
        }

        // If it does, add a new watering log entry for the plant
        return okAsync(await db.insert(plantWateringLogs).values({
            userPlantId,
            userId,
            wateredAt
        }).returning());
    } catch (error) {
        return errAsync({ reason: "InternalServerError", message: `${error} An error occurred while adding the watering log.` });
    }
}