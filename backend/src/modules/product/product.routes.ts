import { Router } from "express";
import { requireAdmin, requireAuth } from "../../middlewares/auth.middleware.js";
import { requireCsrf } from "../../middlewares/csrf.middleware.js";
import {
  createProductHandler,
  deleteProductHandler,
  getProductByIdHandler,
  getProductsHandler,
  updateProductHandler,
} from "./product.controller.js";

export const productRoutes = Router();

productRoutes.use(requireAuth, requireAdmin);

productRoutes.get("/", getProductsHandler);
productRoutes.get("/:id", getProductByIdHandler);
productRoutes.post("/", requireCsrf, createProductHandler);
productRoutes.patch("/:id", requireCsrf, updateProductHandler);
productRoutes.delete("/:id", requireCsrf, deleteProductHandler);
