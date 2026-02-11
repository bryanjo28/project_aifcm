import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes.js";
import { leadRoutes } from "../modules/lead/lead.routes.js";
import { userRoutes } from "../modules/user/user.routes.js";

export const v1Routes = Router();

v1Routes.get("/health", (_req, res) => {
  res.json({
    ok: true,
    data: {
      message: "Backend healthy",
    },
  });
});

v1Routes.use("/auth", authRoutes);
v1Routes.use("/leads", leadRoutes);
v1Routes.use("/user", userRoutes);
