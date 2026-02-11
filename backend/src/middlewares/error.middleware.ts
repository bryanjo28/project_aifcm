import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.js";

export function errorMiddleware(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      ok: false,
      message: "Validation error",
      errors: error.issues,
    });
  }

  const message =
    env.NODE_ENV === "production"
      ? "Internal server error"
      : error instanceof Error
        ? error.message
        : "Internal server error";

  const statusCode =
    error instanceof Error && "statusCode" in error
      ? Number((error as Error & { statusCode?: number }).statusCode) || 500
      : 500;

  return res.status(statusCode).json({
    ok: false,
    message,
  });
}
