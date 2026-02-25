import { Router } from "express";
import { requireAdmin, requireAuth } from "../../middlewares/auth.middleware.js";
import { requireCsrf } from "../../middlewares/csrf.middleware.js";
import {
  createCategoryHandler,
  createProductHandler,
  deleteProductHandler,
  getCategoriesHandler,
  getProductByIdHandler,
  getProductsHandler,
  updateProductHandler,
} from "./product.controller.js";

export const productRoutes = Router();

productRoutes.use(requireAuth, requireAdmin);

productRoutes.get("/", getProductsHandler);
productRoutes.get("/categories", getCategoriesHandler);
productRoutes.post("/categories", requireCsrf, createCategoryHandler);
productRoutes.get("/:id", getProductByIdHandler);
productRoutes.post("/", requireCsrf, createProductHandler);
productRoutes.patch("/:id", requireCsrf, updateProductHandler);
productRoutes.delete("/:id", requireCsrf, deleteProductHandler);
