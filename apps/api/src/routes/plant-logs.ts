import { Router } from "express";
import {
	createPlantLogController,
	deletePlantLogController,
	plantLogController,
	plantLogsController,
	updatePlantLogController,
} from "../controllers/plant-logs.js";

const router: Router = Router({ mergeParams: true });

// fetch logs
router.get("/", plantLogsController);

// endpoint for creating watering log
router.post("/", createPlantLogController);
// fetch single log data
router.get("/:logId", plantLogController);
// updating watering log
router.patch("/:logId", updatePlantLogController);
// deleting watering log
router.delete("/:logId", deletePlantLogController);

export default router;
