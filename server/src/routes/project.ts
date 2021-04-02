import express from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../common";

export const projectRoutes = express.Router();

projectRoutes.route("/").get(
  asyncHandler(async (req: any, res) => {
    // note: query params default to strings (e.g. 1 → '1'),
    // thus numeric fields must be converted to numbers in
    // order for prisma's queries to function as expected
    Object.keys(req.query).forEach(key => {
      if (["expo", "round", "table"].includes(key)) {
        req.query[key] = parseInt(req.query[key]);
      }
    });
    const matches = await prisma.project.findMany({
      where: req.query,
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
