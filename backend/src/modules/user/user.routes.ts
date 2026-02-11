import { Router } from "express";
import {
  createUserHandler,
  getMeHandler,
  getUsersHandler,
  loginUserHandler,
  logoutUserHandler,
} from "./user.controller.js";
import { authRateLimitMiddleware } from "../../middlewares/rate-limit.middleware.js";
import { requireAdmin, requireAuth } from "../../middlewares/auth.middleware.js";

export const userRoutes = Router();

userRoutes.post("/register", authRateLimitMiddleware, createUserHandler);
userRoutes.post("/login", authRateLimitMiddleware, loginUserHandler);
userRoutes.post("/logout", logoutUserHandler);
userRoutes.get("/me", requireAuth, getMeHandler);
userRoutes.get("/", requireAuth, requireAdmin, getUsersHandler);
