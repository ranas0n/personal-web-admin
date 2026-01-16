import { Request, Response } from "express";
import prisma from "../database/prismaClient";
import { validationResult } from "express-validator";
import { handleValidationErrors, handleError } from "../utils/errorHandler";

export const getStacks = async (req: Request, res: Response) => {
  try {
    const stacks = await prisma.stack.findMany();
    res.json(stacks);
  } catch (error) {
    handleError(res, "An error occurred when fetching stack data.", error);
  }
};

export const getStackById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stack = await prisma.stack.findUnique({
      where: {
        id: Number(id),
      },
    });
    res.json(stack);
  } catch (error) {
    handleError(
      res,
      "An error occurred when trying to fetch said stack data.",
      error
    );
  }
};

export const createStack = async (req: Request, res: Response) => {
  const result = validationResult(req);
  const validationError = handleValidationErrors(result, res);
  if (validationError) return;

  const { name, logo, href, category } = req.body;
  try {
    const newStack = await prisma.stack.create({
      data: {
        name,
        logo,
        href,
        category,
      },
    });
    res.status(201).json(newStack);
  } catch (error) {
    handleError(res, "An error occurred when creating a new stack", error);
  }
};

export const updateStack = async (req: Request, res: Response) => {
  const result = validationResult(req);
  const validationError = handleValidationErrors(result, res);
  if (validationError) return;

  const { id } = req.params;
  const stack = req.body;
  try {
    const newStack = await prisma.stack.update({
      where: {
        id: Number(id),
      },
      data: stack,
    });
    res.status(200).json(newStack);
  } catch (error) {
    handleError(res, "An error occurred when updating the stack", error);
  }
};

export const deleteStack = async (req: Request, res: Response) => {
  const result = validationResult(req);
  const validationError = handleValidationErrors(result, res);
  if (validationError) return;

  const { id } = req.params;
  try {
    const deleteStack = await prisma.stack.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json(deleteStack);
  } catch (error) {
    handleError(res, "An error occurred when deleting said stack", error);
  }
};
