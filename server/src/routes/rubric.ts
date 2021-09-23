import express from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../common";

export const rubricRoutes = express.Router();

// route to get all rubrics for a specific criteria
rubricRoutes.route("/:id").get(
  asyncHandler(async (req, res) => {
    const criteriaId: number = parseInt(req.params.id);
    console.log(criteriaId);

    const rubrics = await prisma.rubric.findMany({
      where: {
        criteriaId,
      },
    });

    /*
    if (criteria !== undefined) {
      const criteriaId: number = parseInt(criteria as string);
      filter.criteriaId = criteriaId;
    }
    */

    // const rubrics = await prisma.criteria.findMany({ where: filter });
    res.status(200).json(rubrics);
  })
);

// route to add a rubric
rubricRoutes.route("/create").post(
  asyncHandler(async (req, res) => {
    const createdRubric = await prisma.rubric.createMany({
      data: req.body.data,
    });
    res.status(201).json(createdRubric);
  })
);

// route to edit a rubric
rubricRoutes.route("/:id").patch(
  asyncHandler(async (req, res) => {
    const rubricId: number = parseInt(req.params.id);

    const updatedRubric = await prisma.criteria.update({
      where: {
        id: rubricId,
      },
      data: req.body,
    });

    res.status(200).json(updatedRubric);
  })
);

// route to delete a rubric
rubricRoutes.route("/:id").delete(
  asyncHandler(async (req, res) => {
    const rubricId: number = parseInt(req.params.id);

    const deletedRubric = await prisma.criteria.delete({
      where: {
        id: rubricId,
      },
    });

    res.status(204).end();
  })
);
