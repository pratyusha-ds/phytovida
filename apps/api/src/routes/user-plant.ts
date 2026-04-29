import { Router } from "express";
import {
  createUserPlantController,
  readUserPlantController,
  readUserPlantsController,
} from "../controllers/user-plant.js";
import { readAllUserLogsController } from "../controllers/plant-logs.js";
import { validateUserPlantInput } from "../middlewares/user-plant.js";

const router: Router = Router({ mergeParams: true });

router.post("/", validateUserPlantInput, createUserPlantController);

router.get("/", readUserPlantsController);
router.get("/logs", readAllUserLogsController);
router.get("/:plantId", readUserPlantController);

export default router;
