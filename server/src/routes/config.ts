import { prisma } from "../common";
import express from "express";
import { asyncHandler } from "../utils/asyncHandler";

export const configRoutes = express.Router();

configRoutes.route("/currentRoundExpo").post(asyncHandler(async (req, res) => {}));
configRoutes.route("/isJudgingOn").post(asyncHandler(async (req, res) => {}));
configRoutes.route("/isProjectsPublished:").post(asyncHandler(async (req, res) => {}));
configRoutes.route("/currentHackathonId").post(asyncHandler(async (req, res) => {}));
