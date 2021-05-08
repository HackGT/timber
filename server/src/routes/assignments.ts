import express from "express";

import { User, UserRole, AssignmentStatus } from "@prisma/client";

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
    const user: User = req.body.user as User;
    const projectId: number = parseInt(req.body.project.id);
    const duplicateFilter: any = {};
    const multipleProjectFilter: any = {};
    if (user.role !== UserRole.JUDGE && user.role !== UserRole.JUDGE_AND_SPONSOR) {
      res.status(500).json({ error: "User is not a judge" });
      return;
    }

    duplicateFilter.projectId = projectId;
    duplicateFilter.userId = user.id;

    multipleProjectFilter.userId = user.id
    multipleProjectFilter.status = AssignmentStatus.STARTED

    const checkAssignment = await prisma.assignment.findMany({
      where: {
        OR: [duplicateFilter, multipleProjectFilter]
      },
    });

    if (checkAssignment.length !== 0) {
      res.status(500).json({ error: "Judge already has a project started or project assignment is a duplicate" });
      return
    }

    const createdAssignment = await prisma.assignment.create({
      data: req.body,
    });
    res.status(201).json(createdAssignment);
  })
);

assignmentRoutes.route("/:id").patch(
  asyncHandler(async (req, res) => {
    const assignmentId: number = parseInt(req.params.id);
    const user: User = req.body.user as User;
    if (user.role !== UserRole.JUDGE && user.role !== UserRole.JUDGE_AND_SPONSOR) {
      res.status(500).json({ error: "User is not a judge" });
      return;
    }

    const updatedAssignment = await prisma.assignment.update({
      where: {
        id: assignmentId,
      },
      data: req.body,
    });

    res.status(200).json(updatedAssignment);
  })
);
