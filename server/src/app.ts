/* eslint-disable import/first, import/order */
import express from "express";
import compression from "compression";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import "source-map-support/register";
import { createServer } from "http";
import * as socketio from "socket.io";

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
import { ballotsRoutes } from "./routes/ballots";
import { assignmentRoutes } from "./routes/assignments";
import { rubricRoutes } from "./routes/rubric";
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
app.use("/ballots", isAuthenticated, ballotsRoutes);
app.use("/assignments", isAuthenticated, assignmentRoutes);
app.use("/rubric", isAuthenticated, rubricRoutes);

app.use("/public", isAuthenticated, express.static(path.join(__dirname, "/public")));

app.use(isAuthenticated, express.static(path.join(__dirname, "../../client/build")));
app.get("*", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
});

const http = createServer(app);
const io: socketio.Server = new socketio.Server();
// TODO: Find a better way to handle cors
io.attach(http, {
  cors: {
    origin: "*",
  },
});
// Error handler middleware
app.use(handleError);

async function runSetup() {
  await scheduleJobs();
}

runSetup()
  .then(() => {
    io.on("connection", socket => {
      console.log("a user connected");
      console.log(socket.id);
    });

    http.listen(process.env.PORT, () => {
      console.log(`Timber system started on port ${process.env.PORT}`);
    });
  })
  .catch(error => {
    console.log("App setup failed");
    throw error;
  });
