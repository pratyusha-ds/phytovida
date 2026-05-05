import type { Request, Response, NextFunction } from "express";
import type { UserPlantUpdate } from "../../types/user-plant.js";
export const validateUserPlantInput = (req: Request, res: Response, next: NextFunction) => {
    const data = req.body;
    if (!data) {
        return res.status(400).json({ error: "Missing request body" });
    }

    const { plantId, phase, wateringFrequency, lastWateredDate } = data;

    if (!plantId || typeof plantId !== "string") {
        return res.status(400).json({ error: "Missing or invalid plantId" });
    }

    if (!phase || typeof phase !== "string" || !["planning", "growing"].includes(phase)) {
        return res.status(400).json({ error: "Missing or invalid phase" });
    }

    if (wateringFrequency && (typeof wateringFrequency !== "number" || wateringFrequency <= 0)) {
        return res.status(400).json({ error: "Invalid wateringFrequency" });
    }

    if (lastWateredDate) {
        if (!(lastWateredDate instanceof Date) && isNaN(Date.parse(lastWateredDate))) {
            return res.status(400).json({ error: "Invalid lastWateredDate" });
        } else {
            req.body.lastWateredDate = new Date(lastWateredDate);
        }
    }

    next();
}

export const validateUserPlantUpdateInput = (req: Request, res: Response, next: NextFunction) => {
    const { fields } = req.body;

    if (!fields || fields.length === 0) {
        return res.status(204).json({ message: "No fields to update" });
    }

    for (let index = 0; index < fields.length; index++) {
        const field = fields[index];
        if (field.name === undefined || field.value === undefined) {
            console.log("ERROR")
            return res.status(400).json({ error: true, message: "Wrong format" })
        }

        switch (field.name) {
            case "wateringFrequency": {
                if (!!field.value) {
                    if (isNaN(Number(field.value)) || Number(field.value < 1)) {
                        return res.status(400).json({ error: true, message: "Watering Frequency must be null or a valid pozitive number" })
                    }
                    req.body.fields[index]["value"] = Number(field.value);
                }
                break;
            }
            case "phase": {
                if (field.value !== "growing") {
                    return res.status(400).json({ error: true, message: "Phase can be updated only to growing." })
                }
                break;
            }
            default: return res.status(400).json({ error: true, message: `${field.name} Invalid field` })
        }
    };

    return next();
}