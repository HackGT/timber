import express from "express";
import dotenv from "dotenv";
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

export function isAuthenticated(
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
): void {
  response.setHeader("Cache-Control", "private");
  if (request.user) {
    next();
    return;
  }

  if (request.userError) {
    throw request.userError;
  }

  throw new Error("user is not authenticated");
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
