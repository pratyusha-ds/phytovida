import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { plants, plantWateringLogs, usersPlants } from "../db/schema.js";
import { and, desc, eq, gte, lte } from "drizzle-orm";

type Params = {
	plantId: string;
	logId: number;
};

export const plantLogController = async (
	req: Request<Params>,
	res: Response,
) => {
	try {
		const { logId, plantId } = req.params;
		const userId = req.userId!;

		if (!plantId) {
			return res.status(400).json({
				error: true,
				message: "Plant ID is required!",
			});
		}

		if (!logId) {
			return res.status(400).json({
				error: true,
				message: "Log ID is required!",
			});
		}

		const data = await db
			.select({
				id: plantWateringLogs.id,
				plantId: plantWateringLogs.plantId,
				wateredAt: plantWateringLogs.wateredAt,
				plantName: plants.name,
				plantImage: plants.imageUrl,
			})
			.from(plantWateringLogs)
			.innerJoin(
				usersPlants,
				eq(plantWateringLogs.plantId, usersPlants.plantId),
			)
			.innerJoin(plants, eq(usersPlants.plantId, plants.id))
			.where(
				and(
					eq(plantWateringLogs.id, Number(logId)),
					eq(usersPlants.userId, userId),
					eq(plantWateringLogs.plantId, plantId),
				),
			)
			.limit(1);

		if (!data[0]?.id) {
			return res.status(404).json({
				error: true,
				message: "Plant watering log not found!",
			});
		}

		res.status(200).json({
			data: data[0],
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Failed to fetch plant log" });
	}
};

export const plantLogsController = async (req: Request, res: Response) => {
	try {
		// Query params
		const page = Number(req.query?.page ?? 1);
		const limit = Number(req.query?.limit ?? 10);
		const from = req.query.from as string | undefined;
		const plantId = req.params.plantId as string;
		const to = req.query.to as string | undefined;

		if (!req.userId) {
			return res.status(401).json({
				error: true,
				message: "Unauthorized: Missing user authentication.",
			});
		}

		if (!plantId) {
			res.status(404).json({
				error: true,
				message: "Plant ID is required!",
			});
			return;
		}

		const offset = (page - 1) * limit;

		const filters = [
			eq(plantWateringLogs.plantId, plantId),
			eq(plantWateringLogs.userId, req.userId),
		];

		if (from) {
			filters.push(gte(plantWateringLogs.wateredAt, new Date(from)));
		}

		if (to) {
			filters.push(lte(plantWateringLogs.wateredAt, new Date(to)));
		}

		const data = await db
			.select({
				id: plantWateringLogs.id,
				plantId: plantWateringLogs.plantId,
				wateredAt: plantWateringLogs.wateredAt,
				plantName: plants.name,
				plantImage: plants.imageUrl,
			})
			.from(plantWateringLogs)
			.innerJoin(plants, eq(plantWateringLogs.plantId, plants.id))
			.where(filters.length ? and(...filters) : undefined)
			.orderBy(desc(plantWateringLogs.wateredAt))
			.limit(limit)
			.offset(offset);

		const totalResult = await db
			.select({ count: plantWateringLogs.id })
			.from(plantWateringLogs)
			.where(filters.length ? and(...filters) : undefined);

		const total = totalResult.length;

		res.status(200).json({
			data,
			pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Failed to fetch plant logs" });
	}
};

export const createPlantLogController = async (
	req: Request<Pick<Params, "plantId">>,
	res: Response,
) => {
	try {
		const userId = req.userId;
		const plantId = req.params.plantId;

		if (!userId) {
			res.status(401).json({
				error: true,
				message: "Unauthorized: Missing user authentication.",
			});
			return;
		}

		// ownership check
		const ownership = await db
			.select()
			.from(usersPlants)
			.where(
				and(eq(usersPlants.plantId, plantId), eq(usersPlants.userId, userId)),
			)
			.limit(1);

		if (!ownership.length) {
			return res.status(403).json({
				error: true,
				message: "Forbidden: You do not have access to this plant.",
			});
		}

		const [log] = await db
			.insert(plantWateringLogs)
			.values({
				userId,
				plantId,
			})
			.returning();

		return res.status(201).json({
			data: log,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: true,
			message: "Failed to create plant log",
		});
	}
};

export const deletePlantLogController = async (
	req: Request<Pick<Params, "plantId" | "logId">>,
	res: Response,
) => {
	try {
		const userId = req.userId!;
		const { plantId, logId } = req.params;

		// ownership check
		const ownership = await db
			.select()
			.from(usersPlants)
			.where(
				and(eq(usersPlants.plantId, plantId), eq(usersPlants.userId, userId)),
			)
			.limit(1);

		if (!ownership.length) {
			return res.status(403).json({
				error: true,
				message: "Forbidden: You do not have access to this plant.",
			});
		}

		// ensure log belongs to plant + user
		const deleted = await db
			.delete(plantWateringLogs)
			.where(
				and(
					eq(plantWateringLogs.id, Number(logId)),
					eq(plantWateringLogs.plantId, plantId),
					eq(plantWateringLogs.userId, userId),
				),
			)
			.returning();

		if (!deleted.length) {
			return res.status(404).json({
				error: true,
				message: "Plant log not found.",
			});
		}

		return res.status(200).json({
			message: "Plant log deleted successfully.",
			data: deleted[0],
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: true,
			message: "Failed to delete plant log",
		});
	}
};

type Body = {
	wateredAt?: string;
};

export const updatePlantLogController = async (
	req: Request<Pick<Params, "plantId" | "logId">, {}, Body>,
	res: Response,
) => {
	try {
		const userId = req.userId!;
		const { plantId, logId } = req.params;
		const { wateredAt } = req.body;

		// ownership check
		const ownership = await db
			.select()
			.from(usersPlants)
			.where(
				and(eq(usersPlants.plantId, plantId), eq(usersPlants.userId, userId)),
			)
			.limit(1);

		if (!ownership.length) {
			return res.status(403).json({
				error: true,
				message: "Forbidden: You do not have access to this plant.",
			});
		}

		// update log
		const updated = await db
			.update(plantWateringLogs)
			.set({
				...(wateredAt ? { wateredAt: new Date(wateredAt) } : {}),
			})
			.where(
				and(
					eq(plantWateringLogs.id, Number(logId)),
					eq(plantWateringLogs.plantId, plantId),
					eq(plantWateringLogs.userId, userId),
				),
			)
			.returning();

		if (!updated.length) {
			return res.status(404).json({
				error: true,
				message: "Plant log not found.",
			});
		}

		return res.status(200).json({
			message: "Plant log updated successfully.",
			data: updated[0],
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: true,
			message: "Failed to update plant log",
		});
	}
};
