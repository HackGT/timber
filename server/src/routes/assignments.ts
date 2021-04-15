import express from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../common";

export const assignmentRoutes = express.Router();

assignmentRoutes.route("/").get(
  asyncHandler(async (req, res) => {
    const { hackathon, expo, round, categoryGroup } = req.query;
    const filter: any = {};
    if (hackathon || expo || round) {
      filter.project = {};
    }

    if (hackathon !== undefined) {
      const hackathonId: number = parseInt(hackathon as string);
      filter.project.categories = { every: { hackathonId } };
    }

    if (expo !== undefined) {
      const expoNumber: number = parseInt(expo as string);
      filter.project.expo = expoNumber;
    }

    if (round !== undefined) {
      const roundNumber: number = parseInt(round as string);
      filter.project.round = roundNumber;
    }

    if (categoryGroup !== undefined) {
      const categoryGroupId: number = parseInt(categoryGroup as string);
      filter.user = {
        categoryGroupId,
      };
    }

    const assignments = await prisma.assignment.findMany({
      where: filter,
    });
    res.status(200).json(assignments);
  })
);

assignmentRoutes.route("/").post(
  asyncHandler(async (req, res) => {
    const createdAssignment = await prisma.assignment.create({
      data: req.body,
    });
    res.status(201).json(createdAssignment);
  })
);

assignmentRoutes.route("/:id").patch(
  asyncHandler(async (req, res) => {
    const assignmentId: number = parseInt(req.params.id);

    const updatedAssignment = await prisma.assignment.update({
      where: {
        id: assignmentId,
      },
      data: req.body,
    });

    res.status(200).json(updatedAssignment);
  })
);
