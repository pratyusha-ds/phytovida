import { Router } from "express";
import { getDashboardData } from "../controllers/dashboard.js";

const router: Router = Router();

router.get("/:userId", getDashboardData);

export default router;
