import { PrismaClient, UserRole } from "@prisma/client";
import express from "express";
import { v4 as uuidv4 } from "uuid";

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

// Create user
userRoutes.route("/").post(async (req, res) => {
  const valid = ["name", "email", "role"].every(field => req.body.hasOwnProperty(field));
  if (!valid) {
    res.status(400).send("Missing 'name', 'email', or 'role' fields");
    return;
  }
  const uuid = uuidv4();
  const token = "";

  const newUser = {
    ...req.body,
    uuid,
    token,
  };

  // const user = await prisma.user.create({ data: req.body });
  // console.log("USER ", user);
  // let name = req.body.name;
  // let email = req.body.email;
  // const user = await prisma.user.create({

  // })
  // console.log(req.body);
  res.status(200).send("successful");
});

// Update user
userRoutes.route("/:uuid").patch(async (req, res) => {
  console.log("UUID ", req.params.uuid);
  const updateableFields = [
    "name",
    "role",
    "categoryGroup",
    "ballots",
    "assignments",
    "notifications",
  ];
  // req.body.filter(o => updateableFields.includes(o));
  const updateUser = await prisma.user.update({
    where: {
      uuid: req.params.uuid,
    },
    data: req.body,
  });
  console.log("UPDATED", updateUser);
  res.status(200).send({ success: "dank" });
});
