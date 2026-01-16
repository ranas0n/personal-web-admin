import { Request, Response } from "express";
import prisma from "../database/prismaClient";

export const getRowCount = async (req: Request, res: Response) => {
  const { table } = req.params;
  try {
    let rowCount: number;
    switch (table) {
      case "stacks":
        rowCount = await prisma.stack.count();
        break;
      case "projects":
        rowCount = await prisma.projects.count();
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
    res.status(500).json({
      error: `Error fetching row count for table ${table}`,
      message: error instanceof Error ? error.message : error,
    });
  }
};
