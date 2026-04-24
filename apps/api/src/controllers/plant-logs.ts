import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { plantWateringLogs, usersPlants } from "../db/schema.js";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { sendResponse } from "../helper/response.js";

type Params = {
	plantId: number;
	logId: number;
};

export const readPlantLogController = async (
	req: Request<{ plantId: string; logId: string }>,
	res: Response,
) => {
	try {
		const userId = req.userId!;
		const userPlantId = Number(req.params.plantId);
		const logId = Number(req.params.logId);

		if (isNaN(userPlantId) && isNaN(logId)) {
			return sendResponse(res, 400, {
				error: true,
				message: "Invalid params",
				success: false,
			});
		}

		const data = await db
			.select({
				id: plantWateringLogs.id,
				userPlantId: plantWateringLogs.userPlantId,
				wateredAt: plantWateringLogs.wateredAt,
			})
			.from(plantWateringLogs)
			.innerJoin(usersPlants, eq(plantWateringLogs.userPlantId, usersPlants.id))
			.where(
				and(
					eq(plantWateringLogs.id, logId),
					eq(plantWateringLogs.userPlantId, userPlantId),
					eq(usersPlants.userId, userId), // ownership
				),
			)
			.limit(1);

		if (!data.length) {
			return sendResponse(res, 404, {
				error: true,
				message: "Plant log not found",
				success: false,
			});
		}

		sendResponse(res, 200, {
			data: data[0],
			message: "Plant log fetched successfully.",
			success: true,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error: "Failed to fetch plant log" });
	}
};

export const readPlantLogsController = async (req: Request, res: Response) => {
	try {
		const page = Math.max(1, Number(req.query.page) || 1);
		const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
		const from = req.query.from as string | undefined;
		const to = req.query.to as string | undefined;

		const userPlantId = Number(req.params.plantId);

		if (isNaN(userPlantId)) {
			return sendResponse(res, 400, {
				error: true,
				message: "Invalid userPlantId",
				success: false,
			});
		}

		const offset = (page - 1) * limit;

		const filters = [
			eq(plantWateringLogs.userPlantId, userPlantId),
			eq(usersPlants.userId, req.userId!), // ownership check
		];

		if (from) filters.push(gte(plantWateringLogs.wateredAt, new Date(from)));
		if (to) filters.push(lte(plantWateringLogs.wateredAt, new Date(to)));

		const data = await db
			.select({
				id: plantWateringLogs.id,
				userPlantId: plantWateringLogs.userPlantId,
				wateredAt: plantWateringLogs.wateredAt,
			})
			.from(plantWateringLogs)
			.innerJoin(usersPlants, eq(plantWateringLogs.userPlantId, usersPlants.id))
			.where(and(...filters))
			.orderBy(desc(plantWateringLogs.wateredAt))
			.limit(limit)
			.offset(offset);

		const totalResult = await db
			.select({ count: plantWateringLogs.id })
			.from(plantWateringLogs)
			.innerJoin(usersPlants, eq(plantWateringLogs.userPlantId, usersPlants.id))
			.where(and(...filters));

		const total = totalResult.length;

		return sendResponse(res, 200, {
			data,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit),
				hasNextPage: page * limit < total,
			},
			message: "Plant logs fetched successfully.",
			success: true,
		});
	} catch (error) {
		console.log(error);

		sendResponse(res, 500, {
			error: true,
			message: "Failed to fetch plant logs",
			success: false,
		});
	}
};

export const createPlantLogController = async (
	req: Request<Pick<Params, "plantId">>,
	res: Response,
) => {
	try {
		const userId = req.userId;
		const plantId = req.params.plantId ? Number(req.params.plantId) : undefined;

		if (!userId) {
			return sendResponse(res, 401, {
				error: true,
				message: "Unauthorized: Missing user authentication.",
				success: false,
			});
		}

		if (!plantId || isNaN(Number(plantId))) {
			return sendResponse(res, 404, {
				error: true,
				success: false,
				message: "Plant ID is invalid or missing!",
			});
		}

		console.log(plantId, userId);

		// ownership check
		const ownership = await db
			.select()
			.from(usersPlants)
			.where(and(eq(usersPlants.id, plantId), eq(usersPlants.userId, userId)))
			.limit(1);

		console.log(ownership);

		if (!ownership.length) {
			return sendResponse(res, 403, {
				error: true,
				message: "Forbidden: You do not have access to this plant.",
				success: false,
			});
		}

		const [log] = await db
			.insert(plantWateringLogs)
			.values({
				userId,
				userPlantId: plantId,
			})
			.returning();

		sendResponse(res, 201, {
			data: log,
			message: "Plant log created successfully.",
			success: true,
		});
	} catch (error) {
		console.log(error);
		sendResponse(res, 500, {
			error: true,
			message: "Failed to create plant log",
			success: false,
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

		if (!plantId || isNaN(Number(plantId))) {
			return sendResponse(res, 400, {
				error: true,
				message: "Plant ID is invalid or missing",
				success: false,
			});
		}

		if (!logId) {
			return sendResponse(res, 400, {
				error: true,
				message: "Log ID is required",
				success: false,
			});
		}

		// ownership check
		const ownership = await db
			.select()
			.from(usersPlants)
			.where(and(eq(usersPlants.id, plantId), eq(usersPlants.userId, userId)))
			.limit(1);

		if (!ownership.length) {
			return sendResponse(res, 403, {
				error: true,
				message: "Forbidden: You do not have access to this plant.",
				success: false,
			});
		}

		// ensure log belongs to plant + user
		const deleted = await db
			.delete(plantWateringLogs)
			.where(
				and(
					eq(plantWateringLogs.id, Number(logId)),
					eq(plantWateringLogs.userPlantId, plantId),
					eq(plantWateringLogs.userId, userId),
				),
			)
			.returning();

		if (!deleted.length) {
			return sendResponse(res, 404, {
				error: true,
				message: "Plant log not found.",
				success: false,
			});
		}

		sendResponse(res, 200, {
			message: "Plant log deleted successfully.",
			data: deleted[0],
			success: true,
		});
	} catch (error) {
		console.log(error);
		sendResponse(res, 500, {
			error: true,
			message: "Failed to delete plant log",
			success: false,
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
			.where(and(eq(usersPlants.id, plantId), eq(usersPlants.userId, userId)))
			.limit(1);

		if (!ownership.length) {
			return sendResponse(res, 403, {
				error: true,
				message: "Forbidden: You do not have access to this plant.",
				success: false,
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
					eq(plantWateringLogs.userPlantId, plantId),
					eq(plantWateringLogs.userId, userId),
				),
			)
			.returning();

		if (!updated.length) {
			return sendResponse(res, 404, {
				error: true,
				message: "Plant log not found.",
				success: false,
			});
		}

		sendResponse(res, 200, {
			message: "Plant log updated successfully.",
			data: updated[0],
			success: true,
		});
	} catch (error) {
		console.log(error);
		sendResponse(res, 500, {
			error: true,
			message: "Failed to update plant log",
			success: false,
		});
	}
};
