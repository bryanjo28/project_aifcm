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
import { requireCsrf } from "../../middlewares/csrf.middleware.js";

export const userRoutes = Router();
const protectedUserRoutes = Router();

userRoutes.post("/register", authRateLimitMiddleware, createUserHandler);
userRoutes.post("/login", authRateLimitMiddleware, loginUserHandler);

protectedUserRoutes.use(requireAuth, requireCsrf);
protectedUserRoutes.post("/logout", logoutUserHandler);
protectedUserRoutes.get("/me", getMeHandler);
protectedUserRoutes.get("/", requireAdmin, getUsersHandler);

userRoutes.use("/", protectedUserRoutes);
