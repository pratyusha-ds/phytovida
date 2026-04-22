import type { Request, Response, NextFunction } from "express";
import { Webhook } from "svix";

export const checkWebhookSecret = (req: Request, res: Response, next: NextFunction) => {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        return res.status(500).json({ error: "Internal server error" });
    }

    const payload = req.body;

    const svixId = req.headers["svix-id"];
    const svixTimestamp = req.headers["svix-timestamp"];
    const svixSignature = req.headers["svix-signature"];

    if (!svixId || !svixTimestamp || !svixSignature) {
        return res.status(400).json({ error: "Missing svix headers" });
    }

    const wh = new Webhook(WEBHOOK_SECRET);

    try {
        const event = wh.verify(payload, {
            "svix-id": String(svixId),
            "svix-timestamp": String(svixTimestamp),
            "svix-signature": String(svixSignature),
        });
        req.body = event;
        next();
    } catch (err) {
        return res.status(401).json({ error: `Invalid signature! ${err}` });
    }
}