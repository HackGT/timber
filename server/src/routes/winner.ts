import express from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../common";
import { isAdmin } from "../auth/auth";

export const winnerRoutes = express.Router();

// route to get all rubrics for a specific criteria
winnerRoutes.route("/all").get(
  asyncHandler(async (req, res) => {
    const winners = await prisma.winner.findMany({});
    res.status(200).json(winners);
  })
);
