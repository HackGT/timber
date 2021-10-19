import express from "express";
import { User, AssignmentStatus, Config, Assignment } from "@prisma/client";

import { asyncHandler } from "../utils/asyncHandler";
import { prisma } from "../common";

export const assignmentRoutes = express.Router();

assignmentRoutes.route("/").get(
  asyncHandler(async (req, res) => {
    const { hackathon, expo, round, categoryGroup } = req.query;
    const filter: any = {};
    if (hackathon || expo || round) {
      filter.project = {};
    }

    if (hackathon !== undefined) {
      const hackathonId: number = parseInt(hackathon as string);
      filter.project.categories = { every: { hackathonId } };
    }

    if (expo !== undefined) {
      const expoNumber: number = parseInt(expo as string);
      filter.project.expo = expoNumber;
    }

    if (round !== undefined) {
      const roundNumber: number = parseInt(round as string);
      filter.project.round = roundNumber;
    }

    if (categoryGroup !== undefined) {
      const categoryGroupId: number = parseInt(categoryGroup as string);
      filter.user = {
        categoryGroupId,
      };
    }

    const assignments = await prisma.assignment.findMany({
      where: filter,
    });
    res.status(200).json(assignments);
  })
);

assignmentRoutes.route("/current-project").get(
  asyncHandler(async (req, res) => {
    const user: User = req.user as User;
    const filter: any = {};
    if (!user.isJudging) {
      res.status(500).json({ error: "User is not a judge" });
      return;
    }
    filter.userId = user.id;
    filter.status = {in: ["STARTED", "QUEUED"]};

    const assignments = await prisma.assignment.findMany({
      where: filter,
      orderBy: {
        createdAt: "asc",
      },
    });

    const assignment: Assignment | null = await new Promise(async (resolve, reject) => {
      // call auto assign if there are no assignments
      if (assignments.length === 0) {
        await autoAssign(user.id, true).then(newAssignment => {
          resolve(newAssignment);
        }).catch(err => {
          reject(err);
        });

      } else {
        // return the started assignment if it exists
        // otherwise, return the first queued assignment (after changing its status to started)
        const started_assignments = assignments.filter(assignment => assignment.status === AssignmentStatus.STARTED);
        
        if (started_assignments.length > 0) {
          resolve(started_assignments[0]);
        } else {
          const startedAssignment = await prisma.assignment.update({
            where: {
              id: assignments[0].id,
            },
            data: {
              status: AssignmentStatus.STARTED
            },
          });
          resolve(startedAssignment)
        }
      }
    });

    // auto assign returns null if there are no projects to assign to the judge
    if (assignment === null) {
      return res.status(200).json([]);
    }

    const projectFilter: any = {};
    if (assignment) {
      projectFilter.id = assignment.projectId;
    } else {
      res.status(500).json({ error: "Project not found" });
      return;
    }
    const project = await prisma.project.findUnique({
      where: projectFilter,
      include: {
        categories: { include: { criterias: true } },
      },
    });
    const categoryGroupFilter: any = {};
    categoryGroupFilter.id = user.categoryGroupId;
    const categoryGroup = await prisma.categoryGroup.findUnique({
      where: categoryGroupFilter,
      include: {
        categories: { include: { criterias: true } },
      },
    });

    const categoryGroupCategoryIdSet = new Set(
      categoryGroup?.categories.map(category => category.id)
    );
    const filteredCategories = project?.categories.filter(category =>
      categoryGroupCategoryIdSet.has(category.id)
    );
    const updatedProject = {
      ...project,
      categories: filteredCategories,
      assignmentId: assignment.id,
    }
    res.status(200).json(updatedProject);
  })
);

assignmentRoutes.route("/").post(
  asyncHandler(async (req, res) => {
    const user: User = req.body.user as User;
    const projectId: number = parseInt(req.body.project.id);
    const duplicateFilter: any = {};
    const multipleProjectFilter: any = {};
    if (!user.isJudging) {
      res.status(500).json({ error: "User is not a judge" });
      return;
    }

    duplicateFilter.projectId = projectId;
    duplicateFilter.userId = user.id;

    multipleProjectFilter.userId = user.id;
    multipleProjectFilter.status = AssignmentStatus.STARTED;

    const checkAssignment = await prisma.assignment.findMany({
      where: {
        OR: [duplicateFilter, multipleProjectFilter],
      },
    });

    if (checkAssignment.length !== 0) {
      res.status(500).json({
        error: "Judge already has a project started or project assignment is a duplicate",
      });
      return;
    }

    const createdAssignment = await prisma.assignment.create({
      data: req.body.data,
    });
    res.status(201).json(createdAssignment);
  })
);

assignmentRoutes.route("/:id").patch(
  asyncHandler(async (req, res) => {
    const assignmentId: number = parseInt(req.params.id);
    const user: User = req.user as User;
    if (!user.isJudging) {
      res.status(500).json({ error: "User is not a judge" });
      return;
    }

    const updatedAssignment = await prisma.assignment.update({
      where: {
        id: assignmentId,
      },
      data: req.body.data,
    });

    res.status(200).json(updatedAssignment);
  })
);

const autoAssign = async (judge: number, isStarted: boolean): Promise<Assignment | null> => {

  // We are not selecting a random judge for auto-assign
  // Instead, auto-assign is called when a judge has no projects currently assigned
  /*
  // get judges
  const judges = await prisma.user.findMany({
    select: {
      id: true,
      categoryGroup: {
        select: {
          id: true,
          categories: true
        }
      }
    },
    where: {
      isJudging: true,
    }
  });

  // see which judges already have queued (but not started) projects
  const assignments = await prisma.assignment.findMany({
    select: {
      userId: true,
    },
    where: {
      OR: [
        // {
        //   status: AssignmentStatus.STARTED,
        // },
        {
          status: AssignmentStatus.QUEUED
        }
      ]
    }
  });

  // we define a judge as available if they do not have any queued projects
  const availableJudges = judges.filter(judge => !assignments.includes({ userId: judge.id }));

  if (availableJudges.length == 0) {
    return res.status(200).json({
      error: "No available judges",
    });
  }

  // pick a random judge
  const judgeToAssign = availableJudges[Math.floor(Math.random() * availableJudges.length)];
  */

  // get config info
  const config = await prisma.config.findFirst({
    select: {
      currentExpo: true,
      currentRound: true,
      isJudgingOn: true
    }
  });

  if (!config?.isJudgingOn) {
    return null;
  }

  // get judge info
  const judgeToAssign = await prisma.user.findFirst({
    select: {
      id: true,
      categoryGroup: {
        select: {
          id: true,
          categories: true
        }
      }
    },
    where: {
      id: judge,
      isJudging: true,
    }
  });

  // ensure judge exists
  if (judgeToAssign == null) {
    throw new Error("Judge does not exist");
  }

  // ensure judge is aligned to a category group
  if (judgeToAssign.categoryGroup == null) {
    throw new Error("Judge is not aligned to a category group");
  }

  // get categoryIds from the judge's category group
  const judgeCategoryIds = judgeToAssign.categoryGroup.categories.map(category => category.id);


  // where clause for finding projects
  let project_filter: any = {
    expo: config?.currentExpo,
    round: config?.currentRound,
    categories: {
      some: {
        id: { in: judgeCategoryIds }
      }
    },
    assignment: {
      none: {
        userId: judgeToAssign.id
      }
    }
  }

  // if the judge is aligned to a default category, then the judge can judge any project
  // so we do not need to filter projects by category anymore
  const defaultCategories = judgeToAssign.categoryGroup.categories.filter(category => category.isDefault);
  if (defaultCategories.length > 0) {
    delete project_filter.categories;
  }

  // get projects from the appropriate expo/round, where at least some of the project's categories match the judge's categories
  // and where the project has not been assigned to the judge before
  const projectsWithMatchingCategories = await prisma.project.findMany({
    select: {
      id: true,

      // get assignments where at least some of the project's categories match the judge's categories
      assignment: {
        select: {
          categoryIds: true
        },
        where: {
          categoryIds: {
            hasSome: judgeCategoryIds
          }
        }
      },
      categories: true
    },
    where: project_filter
  });

  if (projectsWithMatchingCategories.length == 0) {
    return null;
  }

  // sort projects by number of assignments that match the judge's categories
  projectsWithMatchingCategories.sort((p1, p2) => {
    return p1.assignment.length - p2.assignment.length;
  });

  // pick the highest priority project based on sorting above
  let categoriesToJudge = projectsWithMatchingCategories[0].categories.filter(category => judgeCategoryIds.includes(category.id));

  // add default categories (if any)
  if (defaultCategories.length > 0) {
    categoriesToJudge = categoriesToJudge.concat(defaultCategories);
  }
  const createdAssignment = await prisma.assignment.create({
    data: {
      userId: judgeToAssign.id,
      projectId: projectsWithMatchingCategories[0].id,
      status: isStarted ? AssignmentStatus.STARTED : AssignmentStatus.QUEUED,
      categoryIds: categoriesToJudge.map(category => category.id)
    },
  });
  return createdAssignment;
}

assignmentRoutes.route("/autoAssign").post(
  asyncHandler(async (req, res) => {
    autoAssign(req.body.judge, false).then(createdAssignment => {
      if (createdAssignment === null) {
        return res.status(200).json(createdAssignment);
      }
      return res.status(201).json(createdAssignment);
    }).catch(err => {
      return res.status(500).json({
        error: err.message
      });
    });
  })
);