import { Router } from "express";
import { deleteBlobImage } from "../controllers/blob.controller";

const router = Router();

router.get("/blob", (req, res) => {
  res.send("69");
});
router.patch("/blob/:blobURL-:tableName-:recordId", deleteBlobImage);

export default router;
