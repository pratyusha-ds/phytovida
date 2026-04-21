import { Router } from "express";
import dashboardRoutes from "./dashboard.js";
import logRoutes from "./plant-logs.js";
import { authorize } from "../middlewares/authorize.js";

const router: Router = Router();

router.use("/dashboard", dashboardRoutes);
router.use("/my-plants/:plantId/logs", authorize, logRoutes);

export default router;
