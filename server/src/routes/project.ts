import express from "express";

import { validateTeam, validateDevpost } from "../utils/validationHelpers";
import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../common";

export const projectRoutes = express.Router();

projectRoutes.route("/").get(
  asyncHandler(async (req: any, res) => {
    const { expo, round, table, category } = req.query;

    const filter: any = {};
    if (expo) filter.expo = parseInt(expo as string);
    if (round) filter.round = parseInt(round as string);
    if (table) filter.table = parseInt(table as string);
    if (category) filter.category = parseInt(category as string);

    const matches = await prisma.project.findMany({
      where: filter,
    });
    res.status(200).json(matches);
  })
);

projectRoutes.route("/").post(
  asyncHandler(async (req, res) => {
    const { members, name, devpostUrl } = req.body;
    const config = await prisma.config.findFirst();

    if (config?.isProjectSubmissionOpen) {
      const teamVal = await validateTeam(members, req.user!.email);
      const devpostVal = await validateDevpost(name, devpostUrl);

      if (teamVal.error) return res.status(400).json(teamVal);
      if (devpostVal.error) return res.status(400).json(devpostVal);

      const created = await prisma.project.create({ data: req.body });
      return res.status(201).json(created);
    }
    return res.status(400).json({ error: true, message: "Submissions are currently closed." });
  })
);

projectRoutes.route("/batch/update").post(
  asyncHandler(async (req, res) => {
    const { ids, ...updates } = req.body;
    const batchPayload = await prisma.project.updateMany({
      where: { id: { in: ids } },
      data: updates,
    });
    res.status(200).json(batchPayload);
  })
);

projectRoutes.route("/:id").patch(
  asyncHandler(async (req, res) => {
    const updated = await prisma.project.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.status(200).json(updated);
  })
);

projectRoutes.route("/team-validation").post(async (req, res) => {
  const response = await validateTeam(req.body.members, req.user!.email);
  res.status(200).json(response);
});

projectRoutes.route("/devpost-validation").post(async (req, res) => {
  const { name, devpostUrl } = req.body;
  const response = await validateDevpost(name, devpostUrl);
  res.status(200).json(response);
});
