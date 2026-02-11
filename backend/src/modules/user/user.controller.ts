import { Request, Response, NextFunction } from "express";
import * as userService from "./user.service.js";
import { loginUserSchema, registerUserSchema } from "./user.validation.js";
import {
  clearAuthCookie,
  createAuthCookie,
  createSessionToken,
} from "../auth/auth.session.js";
import { getAuthenticatedUser } from "../../middlewares/auth.middleware.js";

export const createUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = registerUserSchema.parse(req.body);
    const user = await userService.createUser(payload);
    res.status(201).json({
      ok: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = loginUserSchema.parse(req.body);
    const user = await userService.loginUser(payload);
    const sessionToken = createSessionToken({ id: user.id, role: user.role });
    res.setHeader("Set-Cookie", createAuthCookie(sessionToken));

    res.json({
      ok: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUserHandler = (_req: Request, res: Response) => {
  res.setHeader("Set-Cookie", clearAuthCookie());
  res.json({
    ok: true,
    data: {
      message: "Logged out",
    },
  });
};

export const getMeHandler = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const authUser = getAuthenticatedUser(res);
    if (!authUser) {
      const error = new Error("Unauthorized") as Error & { statusCode?: number };
      error.statusCode = 401;
      throw error;
    }

    const user = await userService.getUserProfile(authUser.id);
    if (!user) {
      const error = new Error("Unauthorized") as Error & { statusCode?: number };
      error.statusCode = 401;
      throw error;
    }

    res.json({
      ok: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await userService.getAllUsers();
    res.json({
      ok: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
