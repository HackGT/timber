import express from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../common";

export const categoryRoutes = express.Router();

categoryRoutes.route("/").get(
  asyncHandler(async (req, res) => {
    const { hackathon, categoryGroup } = req.query;
    const filter: any = {};

    if (hackathon !== undefined) {
      const hackathonId: number = parseInt(hackathon as string);
      filter.hackathonId = hackathonId;
    }

    if (categoryGroup !== undefined) {
      const categoryGroupId: number = parseInt(categoryGroup as string);
      filter.categoryGroups = {
        some: { id: categoryGroupId },
      };
    }

    const categories = await prisma.category.findMany({ where: filter });
    res.status(200).json(categories);
  })
);

categoryRoutes.route("/").post(
  asyncHandler(async (req, res) => {
    const createdCategory = await prisma.category.create({
      data: req.body,
    });
    res.status(201).json(createdCategory);
  })
);

categoryRoutes.route("/:id").patch(
  asyncHandler(async (req, res) => {
    const categoryId: number = parseInt(req.params.id);

    const updatedCategory = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: req.body,
    });

    res.status(200).json(updatedCategory);
  })
);
