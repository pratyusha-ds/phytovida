import { Router } from "express";
import { getPlantsData } from "../controllers/plantlibrary.js";

const router: Router = Router();

router.get("/", getPlantsData);

export default router;
