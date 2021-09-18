/* eslint-disable import/first, import/order */
import express from "express";
import compression from "compression";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import "source-map-support/register";

import { scheduleJobs } from "./jobs";

dotenv.config();

process.on("unhandledRejection", err => {
  throw err;
});

export const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(compression());

import { isAuthenticated } from "./auth/auth";
import { authRoutes } from "./routes/auth";
import { userRoutes } from "./routes/user";
import { categoryGroupRoutes } from "./routes/categorygroups";
import { projectRoutes } from "./routes/project";
import { categoryRoutes } from "./routes/categories";
import { tableGroupRoutes } from "./routes/tablegroups";
import { hackathonRoutes } from "./routes/hackathon";
import { configRoutes } from "./routes/config";
import { criteriaRoutes } from "./routes/criteria";
import { assignmentRoutes } from "./routes/assignments";
import { handleError } from "./utils/handleError";

app.get("/status", (req, res) => {
  res.status(200).send("Success");
});

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/projects", isAuthenticated, projectRoutes);
app.use("/categories", isAuthenticated, categoryRoutes);
app.use("/categorygroups", isAuthenticated, categoryGroupRoutes);
app.use("/tablegroups", isAuthenticated, tableGroupRoutes);
app.use("/hackathon", isAuthenticated, hackathonRoutes);
app.use("/config", isAuthenticated, configRoutes);
app.use("/criteria", isAuthenticated, criteriaRoutes);
app.use("/assignments", isAuthenticated, assignmentRoutes);

app.use(isAuthenticated, express.static(path.join(__dirname, "../../client/build")));
app.get("*", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
});

// Error handler middleware
app.use(handleError);

async function runSetup() {
  await scheduleJobs();
}

runSetup()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Timber system started on port ${process.env.PORT}`);
    });
  })
  .catch(error => {
    console.log("App setup failed");
    throw error;
  });
