import { eq } from "drizzle-orm";
import { UserPlantCreation, UserPlantUpdate } from "../../types/user-plant.js";
import { db } from "../db/index.js";
import { userSettings, usersPlants, plants } from "../db/schema.js";
import { errAsync, okAsync } from "neverthrow";

type Field =
    | { name: "phase"; value: string }
    | { name: "wateringFrequency"; value: number | null };

export const addUserPlant = async (userPlant: UserPlantCreation) => {
    try {
        const userId = userPlant.userId;
        // Check if user exists in the database
        const user = await db
            .select()
            .from(userSettings)
            .where(eq(userSettings.userId, userPlant.userId))
            .limit(1);

        if (user.length === 0) {
            return errAsync({ reason: "UserNotFound", message: "User not found in the database" });
        }

        // Check if plant exists in the database
        const plantFromDb = await db.select()
            .from(plants)
            .where(eq(plants.id, userPlant.plantId))
            .limit(1);

        if (plantFromDb.length === 0) {
            return errAsync({ reason: "PlantNotFound", message: "Plant not found in the database" });
        }

        // If it does, add it to the user's collection with the provided details
        return okAsync(await db.insert(usersPlants).values(userPlant).returning());
    } catch (error) {
        return errAsync({ reason: "InternalServerError", message: `${error} An error occurred while adding the plant to the user's collection.` });
    }
}

export const updateUserPlant = async (userId: string, userPlantId: number, fields: Field[]) => {
    try {

        // check if user plant id exists and it belongs to the authenticated user
        const userPlantsFromDb = await db
            .select()
            .from(usersPlants)
            .where(eq(usersPlants.id, userPlantId));


        if (userPlantsFromDb.length === 0) {
            return errAsync({ reason: "UserPlantNotFound", message: `Plant was not found.` })
        }

        const userPlantFromDb = userPlantsFromDb[0];

        if (userPlantFromDb?.userId !== userId) {
            return errAsync({ reason: "Unauthorized", message: "User does not have access to this plant" })
        }

        const objectToUpdate: UserPlantUpdate = {};

        fields.forEach(({ name, value }) => {
            switch (name) {
                case "phase": { objectToUpdate.phase = value; break; }
                case "wateringFrequency": { objectToUpdate.wateringFrequency = value; break; };
            }
        })
        return okAsync(await db
            .update(usersPlants)
            .set(objectToUpdate)
            .where(eq(usersPlants.id, userPlantId))
            .returning()
        );

    } catch (error) {
        return errAsync({ reason: "InternalServerError", message: `${error} An error occured while updating user's plant` })
    }
}

export const deleteUserPlant = async (userId: string, userPlantId: number) => {
    try {
        const userPlantsFromDb = await db
            .select()
            .from(usersPlants)
            .where(eq(usersPlants.id, userPlantId));


        if (userPlantsFromDb.length === 0) {
            return errAsync({ reason: "UserPlantNotFound", message: `Plant was not found.` })
        }

        const userPlantFromDb = userPlantsFromDb[0];

        if (userPlantFromDb?.userId !== userId) {
            return errAsync({ reason: "Unauthorized", message: "User does not have access to this plant" })
        }

        return okAsync(await db
            .delete(usersPlants)
            .where(eq(usersPlants.id, userPlantId)));
    } catch (error: any) {
        return errAsync({ reason: "InternalServerError", message: `${error} An error occured while updating user's plant` })
    }

}