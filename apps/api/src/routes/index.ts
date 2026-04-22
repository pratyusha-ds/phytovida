import { Router } from "express";

// routes
import dashboardRoutes from "./dashboard.js";
import logRoutes from "./plant-logs.js";
import userPlantRoutes from "./user-plant.js";

// middleware
import { authGuard } from "../middlewares/authGuard.js";

const router: Router = Router();

router.use("/dashboard", dashboardRoutes);

// user plants
router.use("/my-plants", /* authGuard */ userPlantRoutes); // TODO: uncomment authGuard middleware IF user have plants data
router.use("/my-plants/:plantId/logs", authGuard, logRoutes);

export default router;
