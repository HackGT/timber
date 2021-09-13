import express from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../common";

export const criteriaRoutes = express.Router();

// route to get all rubrics for a specific criteria
criteriaRoutes.route("/").get(
  asyncHandler(async (req, res) => {
    const { criteria } = req.query;
    const filter: any = {};

    if (criteria !== undefined) {
      const rubric: number = parseInt(criteria as string);
      filter.categoryId = rubric;
    }

    const rubrics = await prisma.criteria.findMany({ where: filter });
    res.status(200).json(rubrics);
  })
);

// route to add a rubric
criteriaRoutes.route("/:id").post(asyncHandler(async (req, res) => {}));

// route to edit a rubric
criteriaRoutes.route("/:id").patch(asyncHandler(async (req, res) => {}));

// route to delete a rubric
criteriaRoutes.route("/:id").delete(asyncHandler(async (req, res) => {}));
