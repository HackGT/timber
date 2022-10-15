import { User, UserRole } from "@prisma/client";
import express from "express";
import fetch from "node-fetch";
import { isAuthenticated } from "../auth/auth";
import { prisma } from "../common";
import { queryRegistration } from "../registration";
import { asyncHandler } from "../utils/asyncHandler";

export const authRoutes = express.Router();

authRoutes.route("/login/callback").get((req, res, next) => {
  if (req.query.error === "access_denied") {
    res.redirect("/auth/login");
  }
});

authRoutes.route("/check").get(
  isAuthenticated,
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({
      where: {
        email: req.user?.email,
      },
    });

    if (user) {
      res.send(user);
    } else {
      res.send({});
    }
  })
);
