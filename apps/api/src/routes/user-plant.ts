import { Router } from "express";
import {
	readUserPlantController,
	readUserPlantsController,
} from "../controllers/user-plant.js";

const router: Router = Router({ mergeParams: true });

// fetch user plants
router.get("/", readUserPlantsController);
router.get("/:plantId", readUserPlantController);

export default router;
