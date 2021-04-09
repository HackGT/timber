import express from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../common";

export const projectRoutes = express.Router();

projectRoutes.route("/").get(
  asyncHandler(async (req: any, res) => {
    const { expo, round, table, category } = req.query;
    const filter: any = {};
    if (expo !== undefined) {
      const expoNumber: number = parseInt(expo as string);
      filter.expo = expoNumber;
    }

    if (round !== undefined) {
      const roundNumber: number = parseInt(round as string);
      filter.round = roundNumber;
    }

    if (table !== undefined) {
      const tableNumber: number = parseInt(table as string);
      filter.table = tableNumber;
    }

    if (category !== undefined) {
      const categoryId: number = parseInt(category as string);
      filter.categories = {
        some: { id: categoryId },
      };
    }

    const matches = await prisma.project.findMany({
      where: filter,
    });
    res.status(200).json(matches);
  })
);

projectRoutes.route("/").post(
  asyncHandler(async (req, res) => {
    const created = await prisma.project.create({
      data: req.body,
    });
    res.status(201).json(created);
  })
);

projectRoutes.route("/batch/update").post(
  asyncHandler(async (req, res) => {
    const { ids, ...updates } = req.body;
    const batchPayload = await prisma.project.updateMany({
      where: { id: { in: ids } },
      data: updates,
    });
    res.status(200).json(batchPayload);
  })
);

projectRoutes.route("/:id").patch(
  asyncHandler(async (req, res) => {
    const updated = await prisma.project.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.status(200).json(updated);
  })
);
