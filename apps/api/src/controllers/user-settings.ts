import { errAsync, okAsync } from "neverthrow"
import { db } from "../db/index.js"
import { userSettings } from "../db/schema.js"
import { eq } from "drizzle-orm"

export const findUserById = async (userId: string) => {
    try {
        const user = await db
            .select()
            .from(userSettings)
            .where(eq(userSettings.userId, userId));

        if (user.length === 0) {
            return errAsync({ reason: "UserNotFound", status: 404, message: `User with id ${userId} was not found` })
        }

        return okAsync(user[0])
    } catch (error) {
        return errAsync({ reason: "InternalServerError", status: 500, message: `${error} An error occured while returning user data` })
    }
}