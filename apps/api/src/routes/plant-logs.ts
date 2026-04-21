import { Router } from "express";
import {
	plantLogController,
	plantLogsController,
} from "../controllers/plant-logs.js";

const router: Router = Router({ mergeParams: true });

router.get("/", plantLogsController);
router.get("/:logId", plantLogController);

export default router;
