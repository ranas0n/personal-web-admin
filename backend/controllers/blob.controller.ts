import { del } from "@vercel/blob";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import prisma from "../database/prismaClient";

export const deleteBlobImage = async (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    console.log("Validation Result", result.array());
    return res.status(400).send(result.array());
  }

  const { blobURL, tableName, recordId } = req.params;

  if (!blobURL || !tableName || !recordId) {
    let errMsg = "";
    if (!blobURL) {
      errMsg += "Blob URL ";
    }
    if (!tableName) {
      errMsg += "table name ";
    }
    if (!recordId) {
      errMsg += "record id ";
    }
    errMsg += "cannot be empty.";
    return res.status(400).json({
      error: errMsg,
    });
  }

  try {
    console.log(blobURL);

    const deleteRecordImg = await prisma.$transaction(async (prisma) => {
      if (tableName == "stacks") {
        const deletedRecordImage = await prisma.stack.update({
          where: {
            id: Number(recordId),
          },
          data: {
            logo: "logo_placeholder.png",
          },
        });
        console.log(deletedRecordImage);
      } else if (tableName == "projects") {
        const deletedRecordImage = await prisma.projects.update({
          where: {
            proj_id: Number(recordId),
          },
          data: {
            proj_img: "logo_placeholder.png",
          },
        });
        console.log(deletedRecordImage);
      } else {
        return res.status(400).json({
          message: "Table name not found",
        });
      }
      await del(blobURL, {
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return;
    });
    return res.status(200).json({
      message: "Blob image successfully deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "An error occured when trying to delete the image (blob)",
      message: error,
    });
  }
};
