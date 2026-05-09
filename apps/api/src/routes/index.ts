import { Router } from "express";

// routes
import dashboardRoutes from "./dashboard.js";
import logRoutes from "./plant-logs.js";
import userPlantRoutes from "./user-plant.js";
import authRoutes from "./auth.js";
import plantRoutes from "./plantlibrary.js";

// middleware
import { authGuard } from "../middlewares/authGuard.js";

const router: Router = Router();

// auth routes
router.use("/auth", authRoutes);

// dashboard routes
router.use("/dashboard", dashboardRoutes);

// plants routes
router.use("/plants", plantRoutes);

// user plants routes
router.use("/my-plants", authGuard, userPlantRoutes);

router.use("/my-plants/:plantId/logs", authGuard, logRoutes);

export default router;
