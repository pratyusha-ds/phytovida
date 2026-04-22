import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { eq } from "drizzle-orm";
import { plants } from "../db/schema.js";

export const getPlantsData = async (req: Request, res: Response) => {

};