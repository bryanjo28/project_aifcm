import type { NextFunction, Request, Response } from "express";
import { getAuthenticatedUser } from "../../middlewares/auth.middleware.js";
import {
  createCategorySchema,
  createProductSchema,
  listProductsQuerySchema,
  updateProductSchema,
} from "./product.validation.js";
import * as productService from "./product.service.js";

type ServiceError = Error & { statusCode?: number };

function createServiceError(message: string, statusCode: number): ServiceError {
  const error = new Error(message) as ServiceError;
  error.statusCode = statusCode;
  return error;
}

function parseId(value: string | string[]): number {
  const rawValue = Array.isArray(value) ? value[0] : value;
  if (!rawValue) {
    throw createServiceError("ID produk tidak valid.", 400);
  }

  const id = Number(rawValue);
  if (!Number.isFinite(id) || id <= 0) {
    throw createServiceError("ID produk tidak valid.", 400);
  }
  return id;
}

export const getProductsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = listProductsQuerySchema.parse(req.query);
    const data = await productService.getProducts(query);

    res.json({
      ok: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategoriesHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await productService.getCategories();
    res.json({
      ok: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createCategoryHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = createCategorySchema.parse(req.body);
    const data = await productService.createCategory(payload);
    res.status(201).json({
      ok: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createProductHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authUser = getAuthenticatedUser(res);
    if (!authUser) {
      throw createServiceError("Unauthorized", 401);
    }

    const payload = createProductSchema.parse(req.body);
    const data = await productService.createProduct(payload, Number(authUser.id));

    res.status(201).json({
      ok: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseId(req.params.id);
    const product = await productService.getProductById(id);

    if (!product) {
      throw createServiceError("Produk tidak ditemukan.", 404);
    }

    res.json({
      ok: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProductHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseId(req.params.id);
    const payload = updateProductSchema.parse(req.body);

    const product = await productService.getProductById(id);
    if (!product) {
      throw createServiceError("Produk tidak ditemukan.", 404);
    }

    await productService.updateProduct(id, payload);

    res.json({
      ok: true,
      data: {
        id,
      },
      message: "Produk berhasil diperbarui.",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProductHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseId(req.params.id);

    const product = await productService.getProductById(id);
    if (!product) {
      throw createServiceError("Produk tidak ditemukan.", 404);
    }

    await productService.deleteProduct(id);

    res.json({
      ok: true,
      data: {
        id,
      },
      message: "Produk berhasil dihapus.",
    });
  } catch (error) {
    next(error);
  }
};
