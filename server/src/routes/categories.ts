import express from "express";
import { PrismaClient } from "@prisma/client";

export const categoryRoutes = express.Router();
const prisma = new PrismaClient();

categoryRoutes.route("/").get(async (req, res) => {
  const {hackathon, categoryGroup} = req.query
  console.log(hackathon)
  console.log(categoryGroup)
  const filter: any = {}

  if (hackathon !== undefined) {
    const hackathonId = parseInt(hackathon as string);
    filter.hackathonId = hackathonId
  }
  
  if (categoryGroup !== undefined) {
    const categoryGroupId = parseInt(categoryGroup as string);
    filter.categoryGroups = {
      some: {id: categoryGroupId}
    }
  }

  const categories = await prisma.category.findMany({ where: filter });
  res.status(200).send(categories);
});

categoryRoutes.route("/").post(async (req, res) => {
  const { name, isDefault, description } = req.body;
  const result = await prisma.category.create({
    data: req.body,
  });
  res.status(200).send(result);
});

categoryRoutes.route("/:id").patch(async (req, res) => {
  const categoryID = parseInt(req.params.id);

  if (Number.isNaN(categoryID)) {
    res.status(400).send(`Category id must be an integer`);
    return;
  }

  const categoryExists = await prisma.category.findUnique({
    where: { id: categoryID },
  });

  if (categoryExists === null) {
    res.status(404).send(`Category with id: ${categoryID} not found`);
    return;
  }

  const updateCategory = await prisma.category.update({
    where: {
      id: categoryID,
    },
    data: req.body
  });

  res.status(200).send(updateCategory.id);
});

categoryRoutes.route("/:id").delete(async (req, res) => {
  const categoryID = parseInt(req.params.id);

  if (Number.isNaN(categoryID)) {
    res.status(400).send(`Category id must be an integer`);
    return;
  }

  const categoryExists = await prisma.category.findUnique({
    where: { id: categoryID },
  });

  if (categoryExists === null) {
    res.status(404).send(`Category with id: ${categoryID} not found`);
    return;
  }

  const deleteCategory = await prisma.category.delete({
    where: {
      id: categoryID,
    },
  });

  res.status(200).send(deleteCategory);
});
