import { PrismaClient } from "@prisma/client";
import express from "express";

export const projectRoutes = express.Router();
const prisma = new PrismaClient();

projectRoutes.route("/find").get(async (req, res) => {
  try {
    const projects = await prisma.project.findMany({ where: req.body.query });
    res.status(200).send(projects);
  } catch (err) {
    console.log(`[ERROR] ${err.message}`);
    res.status(500).send({ error: true, message: err.message });
  }
});

projectRoutes.route("/create").post(async (req, res) => {
  try {
    // todo: find better way of retreiving required fields
    const valid = ["name", "description", "githubUrl"]
      .every(field => req.body.data.hasOwnProperty(field));
    if (valid) {
      const project = await prisma.project.create({ data: req.body.data });
      res.status(200).send(project);
    } else {
      res.status(400).send("Missing 'name', 'description', or 'githubUrl' fields.");
    }
  } catch (err) {
    console.log(`[ERROR] ${err.message}`);
    res.status(500).send({ error: true, message: err.message });
  }
});

projectRoutes.route("/update").post(async (req, res) => {
  try {
    const count = await prisma.project.updateMany({
      where: req.body.query,
      data: req.body.update
    });
    res.status(200).send(count);
  } catch (err) {
    console.log(`[ERROR] ${err.message}`);
    res.status(500).send({ error: true, message: err.message });
  }
});
