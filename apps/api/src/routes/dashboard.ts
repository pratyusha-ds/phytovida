import { Router } from "express";
import { getDashboard, getDashboardData, updateUserLocation  } from "../controllers/dashboard.js";

const router: Router = Router();

router.get("/", getDashboard);
router.patch("/:userId/location", updateUserLocation);

export default router;
