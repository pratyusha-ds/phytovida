import { Router } from "express";
import { registerUser } from "../controllers/auth.js";
import { checkWebhookSecret } from "../middlewares/auth.js";

const router: Router = Router();

router.post("/register/clerk", checkWebhookSecret, registerUser);

export default router;