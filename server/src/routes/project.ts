import express from "express";
import axios from "axios";

import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../common";
import { getConfig, getCurrentHackathon } from "../utils/utils";
import {
  validateTeam,
  validateDevpost,
  validatePrizes,
  getEligiblePrizes,
} from "../utils/validationHelpers";
import { isAdmin, isAdminOrIsJudging } from "../auth/auth";
import { TableGroup } from "@prisma/client";
import { PrismaClientInitializationError } from "@prisma/client/runtime";

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
        categories: {
          include: {
            categoryGroups: true,
          },
        },
        ballots: {
          select: {
            id: true,
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
projectRoutes.route("/special/prize-validation").post(async (req, res) => {
  const resp = await validatePrizes(req.body.prizes);
  if (resp.error) {
    res.status(400).json(resp);
  } else {
    res.status(200).json(resp);
  }
});

// TODO: Fill in detail validation as needed
projectRoutes.route("/special/detail-validation").post(async (req, res) => {
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

projectRoutes.route("/special/get-eligible-prizes").get(async (req, res) => {
  const resp = await getEligiblePrizes([]);
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

  let dailyUrl;
  // try {
  //   const response = await axios.post(
  //     "https://api.daily.co/v1/rooms",
  //     {},
  //     {
  //       headers: {
  //         "Accept": "application/json",
  //         "Content-Type": "application/json",
  //         "Authorization": `Bearer ${String(process.env.DAILY_KEY)}`,
  //       },
  //     }
  //   );

  //   dailyUrl = response.data.url || "";
  // } catch (err) {
  //   console.error(err);
  //   res.status(400).send({
  //     error: true,
  //     message: "Submission could not be saved - There was an error creating a Daily call",
  //   });
  //   return;
  // }
  console.log(data);
  // try {
  //   const logInteractions = /* teamValidation.registrationUsers || */ [].map(
  //     (registrationMember: any) =>
  //       new Promise<null>((resolve, reject) => {
  //         if (registrationMember.id) {
  //           try {
  //             axios.post(
  //               String(process.env.CHECK_IN_URL),
  //               {
  //                 uuid: registrationMember.id,
  //                 eventID: "616f450fd020f00022987288",
  //                 eventType: "submission-expo",
  //                 interactionType: "inperson",
  //               },
  //               {
  //                 headers: {
  //                   "Authorization": `Bearer ${String(process.env.CHECK_IN_KEY)}`,
  //                   "Accept": "application/json",
  //                   "Content-Type": "application/json",
  //                 },
  //               }
  //             );

  //             resolve(null);
  //           } catch (err) {
  //             console.error(err);
  //             reject(err);
  //           }
  //         }
  //       })
  //   );

  //   await Promise.all(logInteractions);
  // } catch (error: any) {
  //   console.error(error);
  // }

  const bestOverall: any = await prisma.category.findFirst({
    where: {
      name: { in: ["HackGT - Best Overall"] },
    },
  });

  const openSource: any = await prisma.category.findFirst({
    where: {
      name: { in: ["HackGT - Best Open Source Hack"] },
    },
  });

  if (data.prizes.includes(openSource.id) && data.prizes.length > 1) {
    res.status(400).send({
      error: true,
      message: "If you submit to open source you can only submit to that category",
    });
  } else if (!data.prizes.includes(openSource.id)) {
    data.prizes.push(bestOverall.id);
  }

  // find all table groups
  const tableGroups = await prisma.tableGroup.findMany();
  // loop over length of table groups
  let openTableGroup;
  let projectsWithOpenTableGroup;
  for (const tableGroup of tableGroups) {
    // eslint-disable-next-line no-await-in-loop
    const projectsWithTableGroupId = await prisma.project.findMany({
      where: {
        tableGroupId: tableGroup.id,
      },
    });
    if (projectsWithTableGroupId.length !== tableGroup.tableCapacity) {
      openTableGroup = tableGroup;
      projectsWithOpenTableGroup = projectsWithTableGroupId;
      break;
    }
  }

  if (openTableGroup === undefined || projectsWithOpenTableGroup === undefined) {
    res.status(400).send({
      error: true,
      message:
        "Submission could not be saved due to issue with table groups - please contact help desk",
    });
    return;
  }

  let tableNumber;
  if (openTableGroup !== undefined && projectsWithOpenTableGroup !== undefined) {
    const tableNumberSet = new Set();
    for (const project of projectsWithOpenTableGroup) {
      tableNumberSet.add(project.table);
    }
    for (let i = 1; i <= openTableGroup.tableCapacity; i++) {
      if (!tableNumberSet.has(i)) {
        tableNumber = i;
        break;
      }
    }
  }

  console.log(openTableGroup);
  console.log(projectsWithOpenTableGroup);

  // TODO: MOVE THIS INTO A CONFIG
  const numberOfExpos = 1;

  // in loop call all projects with table group id
  // find first available table
  try {
    await prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        devpostUrl: data.devpostUrl,
        githubUrl: "",
        expo: Math.floor(Math.random() * numberOfExpos + 1),
        roomUrl: dailyUrl,
        table: tableNumber,
        hackathon: {
          connect: {
            id: currentHackathon.id,
          },
        },
        members: {
          connectOrCreate: data.members.map((user: any) => ({
            where: {
              email: user.email,
            },
            create: {
              name: "", // user.name,
              email: user.email,
            },
          })),
        },
        categories: {
          connect: data.prizes.map((prizeId: any) => ({ id: prizeId })),
        },
        tableGroup: {
          connect: openTableGroup !== undefined ? { id: openTableGroup.id } : {},
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
  isAdmin,
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
  isAdmin,
  asyncHandler(async (req, res) => {
    let members: any[] = [];
    let categories: any[] = [];
    let tableGroup;

    if (req.body.members) {
      members = req.body.members;
      delete req.body.members;
    }

    if (req.body.categories) {
      categories = req.body.categories;
      delete req.body.categories;
    }

    if (req.body.tableGroupId) {
      tableGroup = parseInt(req.body.tableGroupId);
      delete req.body.tableGroupId;
      const currentProject = await prisma.project.findUnique({
        where: { id: parseInt(req.params.id) },
      });

      if (tableGroup !== currentProject?.tableGroupId) {
        // reassign
      }
    }

    if (req.body.table) {
      const tableNumber = parseInt(req.body.table);
      const projectsInSameGroup = await prisma.project.findMany({
        where: { tableGroupId: tableGroup },
      });

      const tableGroups = await prisma.tableGroup.findMany();

      const maxTableCap = Math.max(...tableGroups.map((group: TableGroup) => group.tableCapacity));
      console.log("Max table cap", maxTableCap);
      if (tableNumber > maxTableCap) {
        res.status(200).send({
          error: true,
          message: "Error: Table Number Too Large.",
        });
        return;
      }

      const isDuplicate = projectsInSameGroup.some(
        project => project.id !== parseInt(req.params.id) && project.table === tableNumber
      );

      if (isDuplicate) {
        res.status(200).send({
          error: true,
          message: "Error: Duplicate Table Number.",
        });
        return;
      }
    }

    if (req.body.table) {
      const tableNumber = parseInt(req.body.table);
      const projectsInSameGroup = await prisma.project.findMany({
        where: { tableGroupId: tableGroup },
      });

      const isDuplicate = projectsInSameGroup.some(
        project => project.id !== parseInt(req.params.id) && project.table === tableNumber
      );
      if (isDuplicate) {
        res.status(200).send({
          error: true,
          message: "Error: Duplicate Table Number.",
        });
        return;
      }
    }

    const dbCategories = await prisma.category.findMany({
      where: { name: { in: categories } },
    });

    categories = dbCategories.map((category: any) => ({ id: category.id }));

    if (tableGroup !== undefined) {
      const dbTableGroup = await prisma.tableGroup.findUnique({
        where: { id: tableGroup },
      });
      if (dbTableGroup !== null) {
        tableGroup = { id: dbTableGroup.id };
      }
    }

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
        tableGroup: {
          connect: tableGroup !== undefined ? tableGroup : { id: 1 },
        },
      },
      include: {
        categories: true,
        members: true,
        tableGroup: true,
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
        ballots: {
          select: {
            score: true,
            user: true,
            criteria: true,
          },
        },
      },
    });

    res.status(200).json(projects);
  })
);
