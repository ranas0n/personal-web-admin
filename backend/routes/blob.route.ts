import { Router } from "express";
import { deleteBlobImage } from "../controllers/blob.controller";

const router = Router();

router.patch("/blob/:blobURL-:tableName-:recordId", deleteBlobImage);

export default router;
