import express, { Request, Response } from "express";
import { Category } from ".prisma/client";

import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../common";

export const categoryRoutes = express.Router();

categoryRoutes.route("/").get(
  asyncHandler(async (req: Request, res: Response) => {
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

    const categories: Category[] = await prisma.category.findMany({ where: filter });
    res.status(200).send(categories);
  })
);

categoryRoutes.route("/").post(
  asyncHandler(async (req: Request, res: Response) => {
    const createdCategory: Category = await prisma.category.create({
      data: req.body,
    });
    res.status(201).send(createdCategory);
  })
);

categoryRoutes.route("/:id").patch(
  asyncHandler(async (req: Request, res: Response) => {
    const categoryId: number = parseInt(req.params.id);

    const updatedCategory: Category = await prisma.category.update({
      where: {
        id: categoryId,
      },
      data: req.body,
    });

    res.status(200).send(updatedCategory);
  })
);
