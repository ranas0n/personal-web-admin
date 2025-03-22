import { Request, Response } from "express";
import prisma from "../database/prismaClient";

export const getRowCount = async (req: Request, res: Response) => {
  const { table } = req.params;
  let rowCount;
  try {
    switch (table) {
      case "stacks":
        try {
          rowCount = await prisma.stack.count();
        } catch (error) {
          console.error(error);
        }
        break;
      case "projects":
        try {
          rowCount = await prisma.projects.count();
        } catch (error) {
          console.error(error);
        }
        break;
      default:
        return res.status(400).json({
          error: `The table ${table} does not exist.`,
        });
    }

    res.status(200).json({
      data: rowCount,
      message: `Successfully fetched the ${table} row number`,
    });
  } catch (error) {
    console.error(`Error fetching row count for table ${table}`, error);
    throw error;
  }
};
