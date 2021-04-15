import { prisma } from "../common";
import express from "express";
import { asyncHandler } from "../utils/asyncHandler";

export const configRoutes = express.Router();

configRoutes.route("/currentRoundExpo").post(
  asyncHandler(async (req, res) => {
    const update = await updateConfigFields(req.body, ["currentRound", "currentExpo"]);
    res.status(200).json(update);
  })
);
configRoutes.route("/isJudgingOn").post(
  asyncHandler(async (req, res) => {
    const update = await updateConfigFields(req.body, ["isJudgingOn"]);
    res.status(200).json(update);
  })
);
configRoutes.route("/isProjectsPublished").post(
  asyncHandler(async (req, res) => {
    const update = await updateConfigFields(req.body, ["isProjectsPublished"]);
    res.status(200).json(update);
  })
);
configRoutes.route("/currentHackathonId").post(
  asyncHandler(async (req, res) => {
    const update = await updateConfigFields(req.body, ["currentHackathonId"]);
    res.status(200).json(update);
  })
);

function updateConfigFields(data: any, fields: string[]) {
  let filtered: any = {};

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
