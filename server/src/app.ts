/* eslint-disable import/first, import/order */
import express, { response } from "express";
import compression from "compression";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import "source-map-support/register";
import { createServer } from "http";
import admin from "firebase-admin";
import cookieParser from "cookie-parser";

import { prisma } from "./common";

dotenv.config();

process.on("unhandledRejection", err => {
  throw err;
});

// Initialize firebase admin with credentials
admin.initializeApp();

export const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
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
import { winnerRoutes } from "./routes/winner";
import { asyncHandler } from "./utils/asyncHandler";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
import { UserRole } from "@prisma/client";
import { queryRegistration } from "./registration";
import { apiCall } from "./utils/apiCall";

app.get("/status", (req, res) => {
  res.status(200).send("Success");
});

app.use(
  asyncHandler(async (req, res, next) => {
    let decodedIdToken: DecodedIdToken | null = null;
    let isUserDecoded = false;

    if (req.headers?.authorization?.startsWith("Bearer ")) {
      const idToken = req.headers.authorization.split("Bearer ")[1];

      try {
        decodedIdToken = await admin.auth().verifyIdToken(idToken);
        isUserDecoded = true;
      } catch (err) {
        req.userError = err;
      }
    }
    if (!isUserDecoded && req.cookies.session) {
      try {
        decodedIdToken = await admin.auth().verifySessionCookie(req.cookies.session || "");
        isUserDecoded = true;
      } catch (err) {
        req.userError = err;
      }
    }

    // If decodedIdToken is null, it means the user is not authenticated
    if (decodedIdToken === null) {
      req.user = undefined;
      next();
      return;
    }

    let user = await prisma.user.findUnique({
      where: {
        email: decodedIdToken.email,
      },
    });

    if (user) {
      req.user = user;
      next();
      return;
    }

    let userRole: UserRole = UserRole.GENERAL;
    let userIsJudging = false;
    let response;
    try {
      response = await apiCall(
        "users",
        {
          url: `/users/${decodedIdToken.uid}`,
          method: "GET",
        },
        req
      );

      console.log(response.name);

      if (
        response.data &&
        response.data.data.search_user.users.length > 0 &&
        response.data.data.search_user.users[0].confirmed &&
        response.data.data.search_user.users[0].confirmationBranch
      ) {
        const { confirmationBranch } = response.data.data.search_user.users[0];

        if (confirmationBranch === "Judge Confirmation") {
          userIsJudging = true;
        } else if (confirmationBranch === "Sponsor Confirmation") {
          userRole = UserRole.SPONSOR;
        }
      }
    } catch (err) {
      console.error(err);
    }

    user = await prisma.user.create({
      data: {
        name: `${response.name.first} ${response.name.last}`,
        userId: decodedIdToken.uid,
        email: req.user?.email ?? "",
        role: userRole,
        isJudging: userIsJudging,
      },
    });

    req.user = user;
    next();
  })
);

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
app.use("/winner", isAuthenticated, winnerRoutes);

app.use("/public", isAuthenticated, express.static(path.join(__dirname, "/public")));

app.use(express.static(path.join(__dirname, "../../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
});

const http = createServer(app);
// const io: socketio.Server = new socketio.Server();
// // TODO: Find a better way to handle cors
// io.attach(http, {
//   cors: {
//     origin: "*",
//   },
// });
// Error handler middleware
app.use(handleError);

async function runSetup() {
  // await scheduleJobs();
}

runSetup()
  .then(() => {
    //     io.on("connection", socket => {
    //       console.log("a user connected");
    //       console.log(socket.id);
    //     });

    http.listen(process.env.PORT, () => {
      console.log(`Timber system started on port ${process.env.PORT}`);
    });
  })
  .catch(error => {
    console.log("App setup failed");
    throw error;
  });
