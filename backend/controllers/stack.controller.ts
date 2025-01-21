import { Request, Response } from "express";
import prisma from "../database/prismaClient";
import { put } from "@vercel/blob";
import { validationResult } from "express-validator";

///////////////////////        GET METHODS           /////////////////////////////////////////////
export const getStacks = async (req: Request, res: Response) => {
  try {
    const stacks = await prisma.stack.findMany();
    console.log(stacks);
    res.json(stacks);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "An error occured when fetching stack data.",
      message: error,
    });
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
    res.status(500).json({
      error: "An error occured when trying to fetch said stack data.",
      message: error,
    });
  }
};

///////////////////////        POST METHODS           /////////////////////////////////////////////
export const createStack = async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    console.log("Validation Errors:", result.array());
    return res.status(400).json({ errors: result.array() });
  }
  const { name, logo, href, category } = req.body;
  console.log(name, logo, href, category);
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
    res.status(500).send({
      error: "An error occured when creating a new stack",
      message: error,
    });
  }
};

///////////////////////        PATCH METHODS           /////////////////////////////////////////////
export const updateStack = async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    console.log("Validation Errors:", result.array());
    return res.status(400).json({ errors: result.array() });
  }
  const { id } = req.params;
  const stack = req.body;
  try {
    const newStack = await prisma.stack.update({
      where: {
        id: Number(id),
      },
      data: stack,
    });
    res.status(200).send(newStack);
  } catch (error) {
    res.status(500).send({
      error: "An error occured when updating the stack",
      message: error,
    });
  }
};

///////////////////////        DELETE METHODS           /////////////////////////////////////////////
export const deleteStack = async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.send(500).send(result.array);
  const { id } = req.params;
  try {
    const deleteStack = await prisma.stack.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).send(deleteStack);
  } catch (error) {
    res.status(500).send({
      error: "An error occured when deleting said stack",
      message: error,
    });
  }
};
