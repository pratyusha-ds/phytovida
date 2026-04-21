import { Router } from "express";
import dashboardRoutes from "./dashboard.js";
import logRoutes from "./plant-logs.js";
import { authGuard } from "../middlewares/authGuard.js";

const router: Router = Router();

router.use("/dashboard", dashboardRoutes);
router.use("/my-plants/:plantId/logs", authGuard, logRoutes);

export default router;
