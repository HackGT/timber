import express from "express";
import { StatusCodeError } from "request-promise/errors";

import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../common";

export const ballotsRoutes = express.Router();

ballotsRoutes.route("/").get(
  asyncHandler(async (req, res) => {
    const { ballot } = req.query;
    const filter: any = {};

    if (ballot !== undefined) {
      const ballotId: number = parseInt(ballot as string);
      filter.ballots = {
        some: { id: ballotId },
      };
    }

    const ballots = await prisma.category.findMany({
      where: filter,
    });

    res.status(200).json(ballots);
  })
);

ballotsRoutes.route("/").post(
  asyncHandler(async (req, res) => {
    const createdBallot = await prisma.ballot.create({
      data: req.body,
    });

    res.status(201).json(createdBallot);
  })
);

ballotsRoutes.route("/batch/create").post(
  asyncHandler(async (req, res) => {
    const createdBallots = await prisma.ballot.createMany({
      data: req.body.data,
    });

    res.status(201).json(createdBallots);
  })
);

ballotsRoutes.route("/").patch(
  asyncHandler(async (req, res) => {
    const ballotId: number = parseInt(req.params.id);

    const updatedBallot = await prisma.ballot.update({
      where: {
        id: ballotId,
      },
      data: req.body,
    });

    res.status(200).json(updatedBallot);
  })
);

ballotsRoutes.route("/:id").delete(
  asyncHandler(async (req, res) => {
    const ballotId: number = parseInt(req.params.id);

    const deletedBallot = await prisma.ballot.delete({
      where: {
        id: ballotId,
      },
    });

    res.status(204).end();
  })
);
