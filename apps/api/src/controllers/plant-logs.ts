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

		if (!plantId) {
			res.status(404).json({
				error: true,
				message: "Plant ID is required!",
			});
			return;
		}

		const offset = (page - 1) * limit;

		const filters = [eq(plantWateringLogs.plantId, plantId)];

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
