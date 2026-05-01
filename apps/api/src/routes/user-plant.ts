import { Router } from "express";
import {
  createUserPlantController,
  readUserPlantController,
  readUserPlantsController,
  updateUserPlantController,
} from "../controllers/user-plant.js";
import { readAllUserLogsController } from "../controllers/plant-logs.js";
import { validateUserPlantInput, validateUserPlantUpdateInput } from "../middlewares/user-plant.js";

const router: Router = Router({ mergeParams: true });

router.post("/", validateUserPlantInput, createUserPlantController);

router.get("/", readUserPlantsController);
router.get("/logs", readAllUserLogsController);
router.get("/:plantId", readUserPlantController);

router.patch("/:userPlantId", validateUserPlantUpdateInput, updateUserPlantController);

export default router;
