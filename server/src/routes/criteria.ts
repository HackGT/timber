import express from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../common";

export const criteriaRoutes = express.Router();

criteriaRoutes.route("/:id").patch(
  asyncHandler(async (req, res) => {
    const criteriaId: number = parseInt(req.params.id);

    const updatedCriteria = await prisma.criteria.update({
      where: {
        id: criteriaId,
      },
      data: req.body,
    });

    res.status(200).json(updatedCriteria);
  })
);

criteriaRoutes.route("/:id").delete(
  asyncHandler(async (req, res) => {
    const criteriaId: number = parseInt(req.params.id);

    const deletedCriteria = await prisma.criteria.delete({
      where: {
        id: criteriaId,
      },
    });

    res.status(200).json(deletedCriteria);
  })
);