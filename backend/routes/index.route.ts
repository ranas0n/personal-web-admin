import { Router } from "express";
import stackRouter from "./stacks.route";
import projectRouter from "./projects.route";
import blobRouter from "./blob.route";
import generalrouter from "./general.route";

const router = Router();

router.use(stackRouter);
router.use(projectRouter);
router.use(blobRouter);
router.use(generalrouter);

export default router;
