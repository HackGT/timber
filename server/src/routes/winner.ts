import express from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../common";
import { isAdmin } from "../auth/auth";

export const winnerRoutes = express.Router();

winnerRoutes.route("/").post(
    isAdmin,
    asyncHandler(async (req, res) => {
      const createdWinner = await prisma.winner.create({
        data: req.body.data,
      });
      res.status(201).json(createdWinner);
    })
  );


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
  