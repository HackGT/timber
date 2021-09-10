import { User } from "@prisma/client";
import express from "express";
import fetch from "node-fetch";
import passport from "passport";

export const authRoutes = express.Router();

authRoutes.get("/login", passport.authenticate("groundtruth"));

authRoutes.route("/login/callback").get((req, res, next) => {
  if (req.query.error === "access_denied") {
    res.redirect("/auth/login");
    return;
  }

  passport.authenticate("groundtruth", {
    failureRedirect: "/",
    successReturnToOrRedirect: "/",
  })(req, res, next);
});

authRoutes.route("/check").get((req, res) => {
  if (req.user) {
    return res.status(200).json(req.user);
  }
  return res.status(400).json({ success: false });
});

authRoutes.route("/logout").all(async (req, res) => {
  const user = req.user as User | undefined;

  if (user) {
    try {
      await fetch(`${process.env.GROUND_TRUTH_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      req.logout();
      return res.redirect("/auth/login");
    } catch (err) {
      return console.log(err);
    }
  } else {
    return res.redirect("/auth/login");
  }
});
