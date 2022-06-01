import express from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../common";
import { getConfig } from "../utils/utils";
import { isAdmin } from "../auth/auth";

export const tableGroupRoutes = express.Router();

tableGroupRoutes.route("/").get(
  asyncHandler(async (req, res) => {
    const { hackathon } = req.query;
    const filter: any = {};

    if (hackathon !== undefined) {
      const hackathonId: number = parseInt(hackathon as string);
      filter.hackathonId = hackathonId;
    }

    const tableGroups = await prisma.tableGroup.findMany({ where: filter });
    res.status(200).json(tableGroups);
  })
);

tableGroupRoutes.route("/:id").get(
  asyncHandler(async (req, res) => {
    const tableGroupId: number = parseInt(req.params.id);
    const tableGroup = await prisma.tableGroup.findUnique({
      where: {
        id: tableGroupId,
      },
    });

    res.status(200).json(tableGroup);
  })
);

// Get by projectId
tableGroupRoutes.route("/project/:id").get(
  asyncHandler(async (req, res) => {
    const projectId: number = parseInt(req.params.id);
    console.log(projectId);
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });
    const tableGroup = await prisma.tableGroup.findUnique({
      where: {
        id: project?.tableGroupId || 1,
      },
    });
    res.status(200).json(tableGroup);
  })
);

tableGroupRoutes.route("/").post(
  isAdmin,
  asyncHandler(async (req, res) => {
    const config = await getConfig();

    const createdTableGroup = await prisma.tableGroup.create({
      data: {
        ...req.body,
        hackathonId: config.currentHackathonId,
      },
    });

    res.status(201).json(createdTableGroup);
  })
);

tableGroupRoutes.route("/:id").patch(
  isAdmin,
  asyncHandler(async (req, res) => {
    const tableGroupId: number = parseInt(req.params.id);

    const updatedTableGroup = await prisma.tableGroup.update({
      where: {
        id: tableGroupId,
      },
      data: req.body,
    });

    res.status(200).json(updatedTableGroup);
  })
);


tableGroupRoutes.route("/:id").delete(
  isAdmin,
  asyncHandler(async (req, res) => {
    const tableGroupId: number = parseInt(req.params.id);

    const deletedCategoryGroup = await prisma.tableGroup.deleteMany({
      where: {
        id: tableGroupId,
      },
    });

    res.status(204).end();
  })
);


