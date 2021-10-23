import express from "express";

import { isAdmin } from "../auth/auth";
import { prisma } from "../common";
import { asyncHandler } from "../utils/asyncHandler";

export const configRoutes = express.Router();

function updateConfigFields(data: any, fields: string[]) {
  const filtered: any = {};

  Object.keys(data).forEach(key => {
    if (fields.includes(key)) {
      filtered[key] = data[key];
    }
  });

  return prisma.config.update({
    where: { id: 1 },
    data: filtered,
  });
}

configRoutes.route("/").get(
  asyncHandler(async (req, res) => {
    res.status(200).json(await prisma.config.findFirst());
  })
);

configRoutes.route("/").post(
  isAdmin,
  asyncHandler(async (req, res) => {
    const updated = await prisma.config.update({
      where: {
        id: 1,
      },
      data: req.body,
    });

    res.status(200).json(updated);
  })
);

configRoutes.route("/currentRoundExpo").post(
  isAdmin,
  asyncHandler(async (req, res) => {
    const update = await updateConfigFields(req.body, ["currentRound", "currentExpo"]);
    res.status(200).json(update);
  })
);

configRoutes.route("/isJudgingOn").post(
  isAdmin,
  asyncHandler(async (req, res) => {
    const update = await updateConfigFields(req.body, ["isJudgingOn"]);
    res.status(200).json(update);
  })
);

configRoutes.route("/isProjectsPublished").post(
  isAdmin,
  asyncHandler(async (req, res) => {
    const update = await updateConfigFields(req.body, ["isProjectsPublished"]);
    res.status(200).json(update);
  })
);

configRoutes.route("/isProjectSubmissionOpen").post(
  isAdmin,
  asyncHandler(async (req, res) => {
    const update = await updateConfigFields(req.body, ["isProjectSubmissionOpen"]);
    res.status(200).json(update);
  })
);

configRoutes.route("/currentHackathonId").post(
  isAdmin,
  asyncHandler(async (req, res) => {
    const update = await updateConfigFields(req.body, ["currentHackathonId"]);
    res.status(200).json(update);
  })
);
