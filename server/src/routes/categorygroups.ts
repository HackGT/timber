import express from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../common";
import { getCurrentHackathon } from "../utils/utils";

export const categoryGroupRoutes = express.Router();

categoryGroupRoutes.route("/").get(
  asyncHandler(async (req, res) => {
    const { hackathon, name } = req.query;
    const filter: any = {};

    if (hackathon !== undefined) {
      const hackathonId: number = parseInt(hackathon as string);
      filter.hackathonId = hackathonId;
    }

    if (name !== undefined) {
      filter.name = name;
    }

    const categoryGroups = await prisma.categoryGroup.findMany({
      where: filter,
      include: {
        categories: true,
        users: true,
      },
    });

    res.status(200).json(categoryGroups);
  })
);

categoryGroupRoutes.route("/").post(
  asyncHandler(async (req, res) => {
    const currentHackathon = await getCurrentHackathon();
    const createdCategoryGroup = await prisma.categoryGroup.create({
      data: {
        ...req.body,
        hackathonId: currentHackathon.id,
      },
    });
    res.status(201).json(createdCategoryGroup);
  })
);

categoryGroupRoutes.route("/:id").patch(
  asyncHandler(async (req, res) => {
    const categoryGroupId: number = parseInt(req.params.id);

    const updatedCategoryGroup = await prisma.categoryGroup.update({
      where: {
        id: categoryGroupId,
      },
      data: req.body,
    });

    res.status(200).json(updatedCategoryGroup);
  })
);

categoryGroupRoutes.route("/:id").delete(
  asyncHandler(async (req, res) => {
    const categoryGroupId: number = parseInt(req.params.id);

    const deletedCategoryGroup = await prisma.categoryGroup.deleteMany({
      where: {
        id: categoryGroupId,
      },
    });

    res.status(204).end();
  })
);
