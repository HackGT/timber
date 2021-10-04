import express from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../common";
import { getConfig, getCurrentHackathon } from "../utils/utils";
import { validateTeam, validateDevpost } from "../utils/validationHelpers";

export const projectRoutes = express.Router();

projectRoutes.route("/").get(
  asyncHandler(async (req: any, res) => {
    const { expo, round, table, category, hackathon } = req.query;

    const filter: any = {};
    if (expo) filter.expo = parseInt(expo as string);
    if (round) filter.round = parseInt(round as string);
    if (table) filter.table = parseInt(table as string);
    if (category) filter.category = parseInt(category as string);
    if (hackathon) filter.hackathonId = parseInt(hackathon as string);

    const matches = await prisma.project.findMany({
      where: filter,
      include: {
        categories: true,
        ballots: {
          select: {
            score: true,
            user: true,
            criteria: true,
          },
        },
      },
    });
    res.status(200).json(matches);
  })
);

projectRoutes.route("/special/team-validation").post(async (req, res) => {
  const resp = await validateTeam(req.user, req.body.members);
  if (resp.error) {
    res.status(400).json(resp);
  } else {
    res.status(200).json(resp);
  }
});

// TODO: Fill in prize validation as needed
projectRoutes.route("/special/prize-validation").post((req, res) => {
  res.status(200).send({ error: false });
});

projectRoutes.route("/special/devpost-validation").post(async (req, res) => {
  const resp = await validateDevpost(req.body.devpostUrl, req.body.name);
  if (resp.error) {
    res.status(400).json(resp);
  } else {
    res.status(200).json(resp);
  }
});

// Last step of the form, all the data is passed in here and a submission should be created
projectRoutes.route("/").post(async (req, res) => {
  const config = await getConfig();
  const currentHackathon = await getCurrentHackathon();

  if (!config.isProjectSubmissionOpen) {
    res.status(400).send({ error: true, message: "Sorry, submissions are currently closed" });
    return;
  }

  if (!req.body.submission) {
    res.status(400).send({ error: true, message: "Invalid submission" });
    return;
  }

  const data = req.body.submission;

  const teamValidation = await validateTeam(req.user, data.members);
  if (teamValidation.error) {
    res.status(400).send(teamValidation);
    return;
  }

  const devpostValidation = await validateDevpost(data.devpostUrl, data.name);
  if (devpostValidation.error) {
    res.status(400).send(devpostValidation);
    return;
  }

  try {
    await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        devpostUrl: data.devpostUrl,
        githubUrl: "",
        hackathon: {
          connect: {
            id: currentHackathon.id,
          },
        },
        members: {
          connect: data.members.map((member: any) => ({ email: member.email })),
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(400).send({
      error: true,
      message: "Submission could not be saved - please contact help desk",
    });
    return;
  }

  res.status(200).send({ error: false });
});

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

projectRoutes.route("/:id").get(
  asyncHandler(async (req, res) => {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        members: true,
        hackathon: true,
        categories: true,
      },
    });
    res.status(200).json(project);
  })
);

projectRoutes.route("/special/dashboard").get(
  asyncHandler(async (req, res) => {
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            id: req.user?.id,
          },
        },
      },
      include: {
        members: true,
        hackathon: true,
      },
    });

    res.status(200).json(projects);
  })
);
