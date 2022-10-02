import express from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../common";
import { isAdmin } from "../auth/auth";

export const winnerRoutes = express.Router();

// Get all winners
winnerRoutes.route("/").get(
  isAdmin,
  asyncHandler(async (req, res) => {
    const winners = await prisma.winner.findMany({
      include: {
        project: true,
        category: true,
        members: true,
        hackathon: true,
      },
    });
    res.status(200).json(winners);
  })
);

// Get winner by id
winnerRoutes.route("/:id").get(
  isAdmin,
  asyncHandler(async (req, res) => {
    const winnerId: number = parseInt(req.params.id);
    const winner = await prisma.winner.findUnique({
      where: {
        id: winnerId,
      },
    });
    res.status(200).json(winner);
  })
);

// Get winners by Category id
winnerRoutes.route("/category/:id").get(
  isAdmin,
  asyncHandler(async (req, res) => {
    const categoryId: number = parseInt(req.params.id);
    const categoryWinners = await prisma.winner.findMany({
      where: {
        categoryId,
      },
    });
    res.status(200).json(categoryWinners);
  })
);

// add new winner
winnerRoutes.route("/").post(
  isAdmin,
  asyncHandler(async (req, res) => {
    const createdWinner = await prisma.winner.create({
      data: req.body.data,
    });
    res.status(201).json(createdWinner);
  })
);

// edit existing winner
winnerRoutes.route("/:id").patch(
  isAdmin,
  asyncHandler(async (req, res) => {
    const winnerId: number = parseInt(req.params.id);

    const updatedWinner = await prisma.winner.update({
      where: {
        id: winnerId,
      },
      data: req.body,
    });

    res.status(200).json(updatedWinner);
  })
);

// delete existing winner
winnerRoutes.route("/:id").delete(
  isAdmin,
  asyncHandler(async (req, res) => {
    const winnerId: number = parseInt(req.params.id);

    const deletedWinner = await prisma.winner.delete({
      where: {
        id: winnerId,
      },
    });

    res.status(204).end();
  })
);
