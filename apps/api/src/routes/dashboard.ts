import { Router } from "express";
import { getDashboardData, updateUserLocation  } from "../controllers/dashboard.js";

const router: Router = Router();

router.get("/:userId", getDashboardData);
router.patch("/user/:userId/location", updateUserLocation);

export default router;
