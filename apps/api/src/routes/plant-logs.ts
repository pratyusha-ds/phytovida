import { Router } from "express";
import {
	createPlantLogController,
	deletePlantLogController,
	readPlantLogController,
	readPlantLogsController,
	updatePlantLogController,
} from "../controllers/plant-logs.js";

const router: Router = Router({ mergeParams: true });

// fetch logs
router.get("/", readPlantLogsController);

// endpoint for creating watering log
router.post("/", createPlantLogController);
// fetch single log data
router.get("/:logId", readPlantLogController);
// updating watering log
router.patch("/:logId", updatePlantLogController);
// deleting watering log
router.delete("/:logId", deletePlantLogController);

export default router;
