import { Request, Response } from "express";
import prisma from "../database/prismaClient";
import { validationResult } from "express-validator";
import { handleValidationErrors, handleError } from "../utils/errorHandler";

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.projects.findMany();
    res.json(projects);
  } catch (error) {
    handleError(res, "An error occurred when fetching the projects.", error);
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { proj_id } = req.params;
    const project = await prisma.projects.findUnique({
      where: {
        proj_id: Number(proj_id),
      },
    });
    res.json(project);
  } catch (error) {
    handleError(
      res,
      "An error occurred when trying to fetch said project data.",
      error
    );
  }
};

export const createProject = async (req: Request, res: Response) => {
  const result = validationResult(req);
  const validationError = handleValidationErrors(result, res);
  if (validationError) return;

  const project = req.body.project;
  const stacks = req.body.stacks;

  try {
    const newProject = await prisma.$transaction(async (prisma) => {
      const projectData = await prisma.projects.create({ data: project });

      const projectStack = stacks.map((stack: { id: number }) => ({
        projectId: projectData.proj_id,
        stackId: Number(stack.id),
      }));

      const newProjectStack = await prisma.projectStack.createMany({
        data: projectStack,
      });

      return { projectData, newProjectStack };
    });
    res.status(201).json({
      projectData: newProject.projectData,
      projectStack: newProject.newProjectStack,
    });
  } catch (error) {
    handleError(
      res,
      "An error occurred when creating projects and its stacks",
      error
    );
  }
};

export const updateProject = async (req: Request, res: Response) => {
  const result = validationResult(req);
  const validationError = handleValidationErrors(result, res);
  if (validationError) return;

  const { proj_id } = req.params;
  const project = req.body.project;
  const stacks = req.body.stacks;

  try {
    const updatedProject = await prisma.$transaction(async (prisma) => {
      const projectData = await prisma.projects.update({
        where: { proj_id: Number(proj_id) },
        data: project,
      });

      await prisma.projectStack.deleteMany({
        where: { projectId: Number(proj_id) },
      });

      const projectStack = stacks.map((stack: { id: number }) => ({
        projectId: Number(proj_id),
        stackId: Number(stack.id),
      }));

      const newProjectStack = await prisma.projectStack.createMany({
        data: projectStack,
      });

      return { projectData, newProjectStack };
    });

    res.status(200).json({
      projectData: updatedProject.projectData,
      projectStack: updatedProject.newProjectStack,
    });
  } catch (error) {
    handleError(
      res,
      "An error occurred while updating the project and its stacks",
      error
    );
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  const result = validationResult(req);
  const validationError = handleValidationErrors(result, res);
  if (validationError) return;

  const { proj_id } = req.params;
  try {
    const deletedProject = await prisma.projects.delete({
      where: {
        proj_id: Number(proj_id),
      },
    });
    res.status(200).json(deletedProject);
  } catch (error) {
    handleError(res, "An error occurred when deleting said project", error);
  }
};
