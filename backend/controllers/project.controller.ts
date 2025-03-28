import { Request, Response } from "express";
import prisma from "../database/prismaClient";
import { validationResult } from "express-validator";

///////////////////////        GET METHODS           /////////////////////////////////////////////
export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.projects.findMany();
    // console.log(projects);
    res.json(projects);
  } catch (error) {
    res.status(500).json({
      error: "An error occured when fetching the projects.",
      message: error,
    });
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
    res.status(500).json({
      error: "An error occured when trying to fetch said project data.",
      message: error,
    });
  }
};

///////////////////////        POST METHODS           /////////////////////////////////////////////
export const createProject = async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    console.log("Validation Errors:", result.array());
    return res.status(400).json({ errors: result.array() });
  }
  const project = req.body.project;
  const stacks = req.body.stacks;
  console.log(project, stacks);

  try {
    let newProjectStack;
    const newProject = await prisma.$transaction(async (prisma) => {
      const projectData = await prisma.projects.create({ data: project });

      const projectStack = stacks.map((stack: { id: number }) => ({
        projectId: projectData.proj_id,
        stackId: Number(stack.id),
      }));

      newProjectStack = await prisma.projectStack.createMany({
        data: projectStack,
      });

      return { projectData, newProjectStack };
    });
    res.status(200).send({
      projectData: newProject.projectData,
      projectStack: newProject.newProjectStack,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "An error occured when creating projects and its stacks",
      message: error,
    });
  }
};

///////////////////////        PATCH METHODS           /////////////////////////////////////////////
export const updateProject = async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    console.log("Validation Errors:", result.array());
    return res.status(400).json({ errors: result.array() });
  }
  const { proj_id } = req.params;
  const project = req.body;
  try {
    const newProject = await prisma.projects.update({
      where: {
        proj_id: Number(proj_id),
      },
      data: project,
    });
    res.status(200).send(newProject);
  } catch (error) {
    res.status(500).send({
      error: "An error occurred while updating the project and its stacks",
      message: error,
    });
  }
};

///////////////////////        DELETE METHODS           /////////////////////////////////////////////
export const deleteProject = async (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    console.error("Validation error: ", result.array());
    return res.status(500).send(result.array);
  }
  const { proj_id } = req.params;
  try {
    const deletedProject = await prisma.projects.delete({
      where: {
        proj_id: Number(proj_id),
      },
    });
    res.status(200).send(deletedProject);
  } catch (error) {
    res.status(500).send({
      error: "An error occured when deleting said project",
      message: error,
    });
  }
};

// const addProjectStacks = async (stackId: number, proj_id: number) => {
//   try {
//     const addedProjecStacks = prisma.projectStack.create({
//       data: {

//       }
//     })
//   } catch (error) {

//   }
// }
