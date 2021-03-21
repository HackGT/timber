/* eslint-disable @typescript-eslint/no-namespace, @typescript-eslint/no-empty-interface */
import { PrismaClient, User as PrismaUser } from "@prisma/client";

export const prisma = new PrismaClient({
  errorFormat: "pretty",
});

declare global {
  namespace Express {
    interface User extends PrismaUser {}
  }
}

declare module "express-session" {
  interface Session {
    returnTo?: string;
  }
}
