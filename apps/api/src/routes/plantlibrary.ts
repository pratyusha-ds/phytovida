import { Router } from "express";
import { getPlantsData, getPlants,getPlantByName, getPlantById } from "../controllers/plantlibrary.js";

const router: Router = Router();

router.get("/", getPlants);
router.post("/seed", getPlantsData)
router.get("/search", getPlantByName);
router.get("/:id", getPlantById);

export default router;
