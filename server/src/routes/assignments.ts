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

assignmentRoutes.route("/current-project").get(
  asyncHandler(async (req, res) => {
    const user: User = req.user as User;
    const filter: any = {};
    if (!user.isJudging) {
      res.status(500).json({ error: "User is not a judge" });
      return;
    }
    filter.userId = user.id;
    filter.status = "STARTED";

    const assignment = await prisma.assignment.findFirst({
      where: filter,
      orderBy: {
        createdAt: "asc",
      },
    });

    if (assignment === null) {
      res.status(200).json([]);
      return;
    }

    const projectFilter: any = {};
    if (assignment) {
      projectFilter.id = assignment.projectId;
    } else {
      res.status(500).json({ error: "Project not found" });
      return;
    }
    const project = await prisma.project.findUnique({
      where: projectFilter,
      include: {
        categories: { include: { criterias: true } },
      },
    });
    const categoryGroupFilter: any = {};
    categoryGroupFilter.id = user.categoryGroupId;
    const categoryGroup = await prisma.categoryGroup.findUnique({
      where: categoryGroupFilter,
      include: {
        categories: { include: { criterias: true } },
      },
    });

    const categoryGroupCategoryIdSet = new Set(
      categoryGroup?.categories.map(category => category.id)
    );
    const filteredCategories = project?.categories.filter(category =>
      categoryGroupCategoryIdSet.has(category.id)
    );

    res.status(200).json(filteredCategories);
  })
);

assignmentRoutes.route("/").post(
  asyncHandler(async (req, res) => {
    const user: User = req.body.user as User;
    const projectId: number = parseInt(req.body.project.id);
    const duplicateFilter: any = {};
    const multipleProjectFilter: any = {};
    if (!user.isJudging) {
      res.status(500).json({ error: "User is not a judge" });
      return;
    }

    duplicateFilter.projectId = projectId;
    duplicateFilter.userId = user.id;

    multipleProjectFilter.userId = user.id;
    multipleProjectFilter.status = AssignmentStatus.STARTED;

    const checkAssignment = await prisma.assignment.findMany({
      where: {
        OR: [duplicateFilter, multipleProjectFilter],
      },
    });

    if (checkAssignment.length !== 0) {
      res.status(500).json({
        error: "Judge already has a project started or project assignment is a duplicate",
      });
      return;
    }

    const createdAssignment = await prisma.assignment.create({
      data: req.body.data,
    });
    res.status(201).json(createdAssignment);
  })
);

assignmentRoutes.route("/:id").patch(
  asyncHandler(async (req, res) => {
    const assignmentId: number = parseInt(req.params.id);
    const user: User = req.body.user as User;
    if (!user.isJudging) {
      res.status(500).json({ error: "User is not a judge" });
      return;
    }

    const updatedAssignment = await prisma.assignment.update({
      where: {
        id: assignmentId,
      },
      data: req.body.data,
    });

    res.status(200).json(updatedAssignment);
  })
);
