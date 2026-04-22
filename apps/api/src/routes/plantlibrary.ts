import { Router } from "express";
import { getPlantsData } from "../controllers/plantlibrary.js";

const router: Router = Router();

router.get("/plants", getPlantsData);

export default router;
