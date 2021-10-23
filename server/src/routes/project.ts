import express from "express";
import axios from "axios";

import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../common";
import { getConfig, getCurrentHackathon } from "../utils/utils";
import { validateTeam, validateDevpost } from "../utils/validationHelpers";
import fetch from "node-fetch";

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
        members: true,
      },
      orderBy: {
        id: "asc",
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
    console.log("hi")
    const fetchUrl = 'https://api.daily.co/v1/rooms';
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${String(process.env.DAILY_KEY)}`
      },
    };

    const beast = await fetch(fetchUrl, options).then(response => response.json())
    console.log(beast)

    await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        devpostUrl: data.devpostUrl,
        githubUrl: "",
        roomUrl: beast.url,
        hackathon: {
          connect: {
            id: currentHackathon.id,
          },
        },
        members: {
          connectOrCreate: teamValidation.registrationUsers?.map((user: any) => ({
            where: {
              email: user.email,
            },
            create: {
              name: user.name,
              email: user.email,
            },
          })),
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
    let members: any[] = [];
    let categories: any[] = [];
    if (req.body.members) {
      members = req.body.members;
      delete req.body.members;
    }

    if (req.body.categories) {
      categories = req.body.categories;
      delete req.body.categories;
    }

    const dbCategories = await prisma.category.findMany({
      where: { name: { in: categories } },
    });

    categories = dbCategories.map((category: any) => ({ id: category.id }));

    const updated = await prisma.project.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...req.body,
        members: {
          connectOrCreate: members.map((member: any) => ({
            where: {
              email: member.email,
            },
            create: {
              name: "",
              email: member.email,
            },
          })),
        },
        categories: {
          connect: categories,
        },
      },
      include: {
        categories: true,
        members: true,
      },
    });

    const membersToDisconnect: any[] = [];
    const categoriesToDisconnect: any[] = [];
    const memberEmailArr = members.map((member: any) => member.email);
    updated.members.forEach((member: any) => {
      if (!memberEmailArr.includes(member.email)) {
        membersToDisconnect.push({ email: member.email });
      }
    });
    const categoryIdArr = categories.map((category: any) => category.id);
    updated.categories.forEach((category: any) => {
      if (!categoryIdArr.includes(category.id)) {
        categoriesToDisconnect.push({ id: category.id });
      }
    });

    const disconnect = await prisma.project.update({
      where: { id: parseInt(req.params.id) },
      data: {
        members: {
          disconnect: membersToDisconnect,
        },
        categories: {
          disconnect: categoriesToDisconnect,
        },
      },
    });
    res.status(200).json(disconnect);
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
        assignment: true,
      },
    });

    res.status(200).json(projects);
  })
);

projectRoutes.route("/special/category-group/:id").get(
  asyncHandler(async (req, res) => {
    const categories = await prisma.category.findMany({
      where: {
        categoryGroups: {
          some: {
            id: parseInt(req.params.id),
          },
        },
      },
    });

    const categoriesIds = categories.map(category => category.id);

    if (categoriesIds.length === 0) {
      res.status(200).json([]);
      return;
    }

    const projects = await prisma.project.findMany({
      where: {
        categories: {
          some: {
            id: {
              in: categoriesIds,
            },
          },
        },
      },
      include: {
        members: true,
        categories: true,
      },
    });

    res.status(200).json(projects);
  })
);
