import { prisma } from "../common";
import express from "express";
import { asyncHandler } from "../utils/asyncHandler";

export const userRoutes = express.Router();

// Filter using query string in url with parameters role and category
userRoutes.route("/").get(
  asyncHandler(async (req, res) => {
    let categoryFilter = (req.query.category as string) || null;
    let roleFilter = (req.query.role as string) || null;
    let filter: any = {};

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

    let usersResponse: any = [];
    users.forEach(user => {
      const { token, ...userWithoutToken } = user;
      usersResponse.push(userWithoutToken);
    });
    res.status(200).json(usersResponse);
  })
);

// Update user
userRoutes.route("/:id").patch(
  asyncHandler(async (req, res) => {
    let data: any = {};
    ["role", "categoryGroup"].forEach(field => {
      if (req.body.hasOwnProperty(field)) {
        data[field] = req.body[field];
      }
    });

    const updatedUser = await prisma.user.update({
      where: {
        uuid: req.params.id,
      },
      data: data,
    });

    const { token, ...userWithoutToken } = updatedUser;
    res.status(200).json(userWithoutToken);
  })
);
