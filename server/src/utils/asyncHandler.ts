import { NextFunction, Request, Response } from "express";

/**
 * Middleware to handle and catch errors in async methods
 */
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => any) => (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise.resolve(fn(req, res, next)).catch(next);
