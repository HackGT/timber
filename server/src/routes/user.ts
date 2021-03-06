import express from "express";
import { User } from "@prisma/client";

import { prisma } from "../common";
import { asyncHandler } from "../utils/asyncHandler";

export const userRoutes = express.Router();

function sanitizeUser(user: User) {
  const { token, ...sanitizedUser } = user;
  return sanitizedUser;
}

// Filter using query string in url with parameters role and category
userRoutes.route("/").get(
  asyncHandler(async (req, res) => {
    const categoryFilter = (req.query.category as string) || null;
    let roleFilter = (req.query.role as string) || null;
    const filter: any = {};

    if (categoryFilter !== null) {
      const categoryId = parseInt(categoryFilter);
      filter.categoryGroupId = categoryId;
    }

    if (roleFilter !== null) {
      roleFilter = roleFilter.toUpperCase();
      filter.role = roleFilter;
    }

    const users = await prisma.user.findMany({
      where: filter,
    });

    res.status(200).json(users.map(user => sanitizeUser(user)));
  })
);

// Update user
userRoutes.route("/:id").patch(
  asyncHandler(async (req, res) => {
    const data: any = {};
    Object.keys(req.body).forEach(key => {
      if (["role", "categoryGroup"].includes(key)) {
        data[key] = req.body[key];
      }
    });

    const updatedUser = await prisma.user.update({
      where: {
        uuid: req.params.id,
      },
      data,
    });

    res.status(200).json(sanitizeUser(updatedUser));
  })
);
