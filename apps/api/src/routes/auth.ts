import express, { Router } from "express";
import { registerUser } from "../controllers/auth.js";
import { checkWebhookSecret } from "../middlewares/auth.js";

const router: Router = Router();

router.post(
	"/register/clerk",
	express.raw({ type: "application/json" }),
	checkWebhookSecret,
	registerUser,
);

export default router;
