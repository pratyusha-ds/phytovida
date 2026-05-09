import { db } from "../db/index.js";
import { userSettings } from "../db/schema.js";
import { errAsync, okAsync } from "neverthrow";

export const saveUserId = async (userId: string) => {
    try {
        return okAsync(await db.insert(userSettings).values({ userId }));
    } catch (error) {
        return errAsync({ reason: "DatabaseError", message: error })
    }
}