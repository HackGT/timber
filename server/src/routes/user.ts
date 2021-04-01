import { PrismaClient, UserRole } from "@prisma/client";
import express from "express";

export const userRoutes = express.Router();
const prisma = new PrismaClient();

// Filter using query string in url with parameters role and category
userRoutes.route("/").get(async (req, res) => {
  let categoryFilter = (req.query.category as string) || null;
  let roleFilter = (req.query.role as string) || null;
  let filter: any = {};

  if (categoryFilter !== null) {
    const categoryId = parseInt(categoryFilter);
    if (isNaN(categoryId)) {
      res.status(400).send("Invalid category query parameter, must be an integer");
      return;
    } else {
      filter.categoryGroupId = categoryId;
    }
  }

  if (roleFilter !== null) {
    roleFilter = roleFilter.toUpperCase();
    if (!(roleFilter in UserRole)) {
      res.status(400).send("Invalid user role");
      return;
    } else {
      filter.role = roleFilter;
    }
  }
  let users = await prisma.user.findMany({
    where: filter,
  });

  let userUuids: string[] = [];
  users.forEach(user => userUuids.push(user.uuid));
  res.status(200).send(userUuids);
});

// Update user
userRoutes.route("/:uuid").patch(async (req, res) => {
  const updateableFields = ["role", "categoryGroup", "ballots", "assignments", "notifications"];

  // Only allow updates to certain fields
  let updateBody: any = {};
  updateableFields.forEach(field => {
    if (req.body.hasOwnProperty(field)) {
      updateBody[field] = req.body[field];
    }
  });

  try {
    const updateUser = await prisma.user.update({
      where: {
        uuid: req.params.uuid,
      },
      data: updateBody,
    });
    res.status(200).send(updateUser.uuid);
  } catch (error) {
    if (error.code === "P2025") {
      res.status(404).send("User with uuid does not exist");
    } else {
      res.status(500).send(`Error: ${error.meta.cause}`);
    }
  }
});
