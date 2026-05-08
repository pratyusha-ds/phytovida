import type { Response } from "express";
import type { ApiResponse } from "@repo/types";

export const sendResponse = <T>(
	res: Response,
	status: number,
	payload: ApiResponse<T>,
) => {
	return res.status(status).json(payload);
};
