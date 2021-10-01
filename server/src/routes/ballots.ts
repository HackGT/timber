import express from "express";
import { StatusCodeError } from "request-promise/errors";

import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../common";
import { criteriaRoutes } from "./criteria";

export const ballotsRoutes = express.Router();

ballotsRoutes.route("/").get(
  asyncHandler(async (req, res) => {
    const { ballot } = req.query;
    const filter: any = {};

    if (ballot !== undefined) {
      const ballotId: number = parseInt(ballot as string);
      filter.id = ballotId;
    }

    filter.deleted = false;

    const ballots = await prisma.ballot.findMany({
      where: filter,
    });

    res.status(200).json(ballots);
  })
);

ballotsRoutes.route("/").post(
  asyncHandler(async (req, res) => {
    const { criterium } = req.body;

    const data = criterium.map((criteria: number) => ({
      score: req.body.score || 0,
      criteriaId: criteria,
      round: req.body.round,
      projectId: req.body.projectId,
      userId: req.body.userId,
    }));

    const createdBallots = await prisma.ballot.createMany({
      data,
    });

    res.status(201).json(createdBallots);
  })
);

ballotsRoutes.route("/:id").patch(
  asyncHandler(async (req, res) => {
    const ballotId: number = parseInt(req.params.id);

    const { score } = req.body;

    const ballot = await prisma.ballot.findFirst({
      where: {
        id: ballotId,
      },
    });

    const criteria = await prisma.criteria.findFirst({
      where: {
        id: ballot?.criteriaId,
      },
    });

    if (score < criteria!.minScore || score > criteria!.maxScore) {
      throw new Error("Score is out of range for the criteria");
    }

    const updatedBallot = await prisma.ballot.update({
      where: {
        id: ballotId,
      },
      data: req.body,
    });

    res.status(200).json(updatedBallot);
  })
);

ballotsRoutes.route("/").delete(
  asyncHandler(async (req, res) => {
    const { criterium } = req.body;

    criterium.forEach(async (criteriaId: number) => {
      const deletedBallot = await prisma.ballot.updateMany({
        where: {
          criteriaId,
        },
        data: {
          deleted: true,
        },
      });
    });

    res.status(204).end();
  })
);
