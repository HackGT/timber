import express from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../common";

import { Ballot } from ".prisma/client";

export const ballotsRoutes = express.Router();

ballotsRoutes.route("/").get(
  asyncHandler(async (req, res) => {
    const { criterium } = req.query;
    const filter: any = {};

    if (criterium !== undefined) {
      if (Array.isArray(criterium)) {
        const ballots: Ballot[] = [];
        for (let i = 0; i < criterium.length; i++) {
          // eslint-disable-next-line no-await-in-loop
          const newBallots = await prisma.ballot.findMany({
            where: {
              criteriaId: parseInt(criterium[i] as string),
              deleted: false,
            },
            include: {
              criteria: true,
              project: {
                select: {
                  name: true,
                },
              },
            },
          });
          ballots.push(...newBallots);
        }

        res.status(200).json(ballots);
        return;
      }
      const criteriaId: number = parseInt(criterium as string);
      filter.criteriaId = criteriaId;
    }

    filter.deleted = false;

    // const ballots = await prisma.ballot.findMany({
    //   where: filter,
    // });

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
    const { score, userId } = req.body;

    const ballots = await prisma.ballot.findMany({
      where: {
        userId,
      },
      include: {
        criteria: true,
      },
    });

    const ballot = await prisma.ballot.findFirst({
      where: {
        id: ballotId,
      },
      include: {
        criteria: true,
      },
    });

    const filteredBallots = ballots.filter(
      b => b.criteria.categoryId === ballot?.criteria.categoryId
    );

    if (filteredBallots.length > 1) {
      throw new Error("You can only judge one project for each category");
    }

    if (ballot?.userId !== userId) {
      throw new Error("You're not authorized to change the score on this ballot.");
    }

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
