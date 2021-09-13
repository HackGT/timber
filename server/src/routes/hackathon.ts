import express from "express";

import { prisma } from "../common";
import { asyncHandler } from "../utils/asyncHandler";

export const hackathonRoutes = express.Router();

hackathonRoutes.route("/").get(
  asyncHandler(async (req, res) => {
    const hackathons = await prisma.hackathon.findMany({});
    res.status(200).json(hackathons);
  })
);

hackathonRoutes.route("/").post(
  asyncHandler(async (req, res) => {
    const created = await prisma.hackathon.create({
      data: req.body,
    });
    res.status(201).json(created);
  })
);

hackathonRoutes.route("/:id").patch(
  asyncHandler(async (req, res) => {
    const updated = await prisma.hackathon.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.status(200).json(updated);
  })
);
