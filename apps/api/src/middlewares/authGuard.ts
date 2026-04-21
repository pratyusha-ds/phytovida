import type { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";

export async function authGuard(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const auth = getAuth(req);

	if (!auth.isAuthenticated) {
		res.status(403).json({
			error: true,
			message: "Unauthorized. Please log in to access this resource.",
		});
		return;
	}

	req.userId = auth.userId;
	next();
}
