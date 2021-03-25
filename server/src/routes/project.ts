import { PrismaClient } from "@prisma/client";
import express from "express";

export const projectRoutes = express.Router();
const prisma = new PrismaClient();

projectRoutes.route("/").get(async (req, res) => {
  try {
    // todo: find better way of retrieving numeric fields
    ["id", "expo", "round", "table"].forEach(key => {
      if (req.query.hasOwnProperty(key))
        // @ts-ignore
        req.query[key] = parseInt(req.query[key]);
    });
    const projects = await prisma.project.findMany({ where: req.query });
    res.status(200).send(projects);
  } catch (err) {
    console.log(`[ERROR] ${err.message}`);
    res.status(500).send({ error: true, message: err.message });
  }
});

projectRoutes.route("/").post(async (req, res) => {
  try {
    // todo: find better way of retreiving required fields
    const valid = ["name", "description", "githubUrl"]
      .every(field => req.body.hasOwnProperty(field));
    if (valid) {
      const created = await prisma.project.create({ data: req.body });
      res.status(201).send(created);
    } else {
      res.status(400).send("Missing 'name', 'description', or 'githubUrl' fields.");
    }
  } catch (err) {
    console.log(`[ERROR] ${err.message}`);
    res.status(500).send({ error: true, message: err.message });
  }
});

projectRoutes.route("/:id").patch(async (req, res) => {
  try {
    const updated = await prisma.project.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.status(200).send(updated);
  } catch (err) {
    console.log(`[ERROR] ${err.message}`);
    res.status(500).send({ error: true, message: err.message });
  }
});
