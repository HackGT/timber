/* eslint-disable import/first, import/order */
import express from "express";
import compression from "compression";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import "source-map-support/register";

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
import { categoryRoutes } from "./routes/categories";

app.get("/status", (req, res) => {
  res.status(200).send("Success");
});

app.use("/auth", authRoutes);
app.use("/categories", isAuthenticated, categoryRoutes);

app.use(isAuthenticated, express.static(path.join(__dirname, "../../client/build")));
app.get("*", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`Timber system started on port ${process.env.PORT}`);
});
