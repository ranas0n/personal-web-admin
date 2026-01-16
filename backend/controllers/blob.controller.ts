import { del } from "@vercel/blob";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import prisma from "../database/prismaClient";
import { handleValidationErrors, handleError } from "../utils/errorHandler";

export const deleteBlobImage = async (req: Request, res: Response) => {
  const result = validationResult(req);
  const validationError = handleValidationErrors(result, res);
  if (validationError) return;

  const { blobURL, tableName, recordId } = req.params;

  if (!blobURL || !tableName || !recordId) {
    let errMsg = "";
    if (!blobURL) errMsg += "Blob URL ";
    if (!tableName) errMsg += "table name ";
    if (!recordId) errMsg += "record id ";
    errMsg += "cannot be empty.";
    return res.status(400).json({
      error: errMsg,
    });
  }

  try {
    await prisma.$transaction(async (prisma) => {
      if (tableName === "stacks") {
        await prisma.stack.update({
          where: {
            id: Number(recordId),
          },
          data: {
            logo: "logo_placeholder.png",
          },
        });
      } else if (tableName === "projects") {
        await prisma.projects.update({
          where: {
            proj_id: Number(recordId),
          },
          data: {
            proj_img: "logo_placeholder.png",
          },
        });
      } else {
        return res.status(400).json({
          message: "Table name not found",
        });
      }
      await del(blobURL, {
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
    });
    return res.status(200).json({
      message: "Blob image successfully deleted",
    });
  } catch (error) {
    handleError(
      res,
      "An error occurred when trying to delete the image (blob)",
      error
    );
  }
};
