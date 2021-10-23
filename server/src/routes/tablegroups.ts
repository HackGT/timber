import express from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../common";
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

tableGroupRoutes.route("/").post(
  isAdmin,
  asyncHandler(async (req, res) => {
    const createdTableGroup = await prisma.tableGroup.create({
      data: req.body,
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
