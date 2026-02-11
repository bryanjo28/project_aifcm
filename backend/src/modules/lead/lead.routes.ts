import { Router } from "express";
import { leadRateLimitMiddleware } from "../../middlewares/rate-limit.middleware.js";
import { createLeadController } from "./lead.controller.js";

export const leadRoutes = Router();

leadRoutes.post("/", leadRateLimitMiddleware, createLeadController);
