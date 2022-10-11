import express from "express";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { Strategy as GroundTruthStrategy } from "passport-ground-truth";
import { UserRole } from "@prisma/client";
import { StatusCodes } from "http-status-codes";

import { app } from "../app";
import { prisma } from "../common";
import { queryRegistration } from "../registration";

dotenv.config();

if (process.env.PRODUCTION === "true") {
  app.enable("trust proxy");
} else {
  console.warn("OAuth callback(s) running in development mode");
}

if (!process.env.SESSION_SECRET) {
  throw new Error("Session secret not specified");
}

// app.use(
//   session({
//     cookie: {
//       maxAge: 7 * 24 * 60 * 60 * 1000, // ms
//     },
//     secret: process.env.SESSION_SECRET,
//     saveUninitialized: false,
//     resave: true,
//     store: new PrismaSessionStore(prisma, {
//       checkPeriod: 2 * 60 * 1000, // ms
//       dbRecordIdIsSessionId: true,
//     }),
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());

export function isAuthenticated(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
): void {
  response.setHeader("Cache-Control", "private");
  if (!request.user) {
    throw new Error("user is not authenticated");
  } else {
    next();
  }
}

export function isAdmin(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) {
  response.setHeader("Cache-Control", "private");

  if (!request.isAuthenticated() || !request.user) {
    response.redirect("/auth/login");
  } else if (!(request.user.role === UserRole.ADMIN)) {
    response.status(StatusCodes.FORBIDDEN).json({
      message: "Sorry, you don't have access to this endpoint.",
    });
  } else {
    next();
  }
}

export function isAdminOrIsJudging(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) {
  response.setHeader("Cache-Control", "private");

  if (!request.isAuthenticated() || !request.user) {
    response.redirect("/auth/login");
  } else if (!(request.user.role === UserRole.ADMIN || request.user.isJudging)) {
    response.status(StatusCodes.FORBIDDEN).json({
      message: "Sorry, you don't have access to this endpoint.",
    });
  } else {
    next();
  }
}

passport.use(
  new GroundTruthStrategy(
    {
      clientID: process.env.GROUND_TRUTH_CLIENT_ID,
      clientSecret: process.env.GROUND_TRUTH_CLIENT_SECRET,
      baseURL: process.env.GROUND_TRUTH_URL,
      callbackURL: "/auth/login/callback",
    },
    async (req, accessToken, refreshToken, profile, done) => {
      let userRole: UserRole = UserRole.GENERAL;
      let userIsJudging = false;
      try {
        const response = await queryRegistration(profile.email);

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

      let user = await prisma.user.findUnique({
        where: {
          email: profile.email,
        },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: profile.name,
            uuid: profile.uuid,
            email: profile.email,
            token: profile.token,
            role: userRole,
            isJudging: userIsJudging,
          },
        });
      } else {
        user = await prisma.user.update({
          where: {
            email: profile.email,
          },
          data: {
            name: profile.name,
            uuid: profile.uuid,
            token: accessToken,
          },
        });
      }

      done(null, user);
    }
  )
);

passport.serializeUser<string>((user, done) => {
  done(null, user.uuid || "");
});
passport.deserializeUser<string>(async (id, done) => {
  const user = await prisma.user.findUnique({
    where: {
      uuid: id,
    },
  });

  if (user) {
    done(null, user);
  } else {
    done("No user found", undefined);
  }
});
