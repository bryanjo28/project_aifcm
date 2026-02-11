import { timingSafeEqual } from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { getCookieValue } from "../modules/auth/auth.session.js";

type ServiceError = Error & { statusCode?: number };

function createServiceError(message: string, statusCode: number): ServiceError {
  const error = new Error(message) as ServiceError;
  error.statusCode = statusCode;
  return error;
}

export function requireCsrf(req: Request, _res: Response, next: NextFunction) {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
    return next();
  }

  const csrfCookie = getCookieValue(req, env.CSRF_COOKIE_NAME);
  const csrfHeaderRaw = req.headers["x-csrf-token"];
  const csrfHeader = typeof csrfHeaderRaw === "string" ? csrfHeaderRaw : "";

  if (!csrfCookie || !csrfHeader) {
    return next(createServiceError("Invalid CSRF token", 403));
  }

  const cookieBuffer = Buffer.from(csrfCookie, "utf8");
  const headerBuffer = Buffer.from(csrfHeader, "utf8");
  if (cookieBuffer.length !== headerBuffer.length) {
    return next(createServiceError("Invalid CSRF token", 403));
  }
  if (!timingSafeEqual(cookieBuffer, headerBuffer)) {
    return next(createServiceError("Invalid CSRF token", 403));
  }

  return next();
}
