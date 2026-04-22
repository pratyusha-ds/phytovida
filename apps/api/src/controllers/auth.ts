import type { Request, Response } from "express";
import { saveUserId } from "../services/auth.js";

export const registerUser = async (req: Request, res: Response) => {
    const event = req.body;

    if (!event || !event.data || !event.data.id) {
        return res.status(400).json({ error: "Invalid request body" });
    }

    if (event.type !== "user.created") {
        return res.status(400).json({ error: "Unsupported event type" });
    }

    const userId = event.data.id;

    const result = await saveUserId(userId);

    result.match(() => {
        res.status(201).json({ message: "Registered user save into database successfully" });
    }, () => {
        res.status(500).json({ error: "Failed to save user ID into database" });
    })
}