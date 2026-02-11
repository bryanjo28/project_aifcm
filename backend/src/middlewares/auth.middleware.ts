import type { NextFunction, Request, Response } from "express";
import { UserModel } from "../modules/user/user.schema.js";
import {
  clearAuthCookie,
  getCookieValue,
  verifySessionToken,
} from "../modules/auth/auth.session.js";
import { env } from "../config/env.js";

type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isActive: boolean;
};

type ServiceError = Error & { statusCode?: number };

function createServiceError(message: string, statusCode: number): ServiceError {
  const error = new Error(message) as ServiceError;
  error.statusCode = statusCode;
  return error;
}

export function getAuthenticatedUser(res: Response): AuthenticatedUser | null {
  return (res.locals.authUser as AuthenticatedUser | undefined) ?? null;
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = getCookieValue(req, env.AUTH_COOKIE_NAME);
    if (!token) {
      throw createServiceError("Unauthorized", 401);
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      res.setHeader("Set-Cookie", clearAuthCookie());
      throw createServiceError("Unauthorized", 401);
    }

    const user = await UserModel.findById(payload.sub)
      .select("name email role isActive")
      .lean();

    if (!user || !user.isActive) {
      res.setHeader("Set-Cookie", clearAuthCookie());
      throw createServiceError("Unauthorized", 401);
    }

    res.locals.authUser = {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    } satisfies AuthenticatedUser;

    return next();
  } catch (error) {
    return next(error);
  }
}

export function requireAdmin(_req: Request, res: Response, next: NextFunction) {
  const authUser = getAuthenticatedUser(res);
  if (!authUser || authUser.role !== "admin") {
    return next(createServiceError("Forbidden", 403));
  }
  return next();
}
