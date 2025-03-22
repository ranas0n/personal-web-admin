import { Router } from "express";
import { getRowCount } from "../controllers/general.controller";

const router = Router();

router.get("/row-count/:table", getRowCount);

export default router;
