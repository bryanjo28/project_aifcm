import { z } from "zod";

const normalizeWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

const slugSchema = z
  .string()
  .transform((value) => normalizeWhitespace(value).toLowerCase())
  .pipe(z.string().min(3).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/));

export const createProductSchema = z.object({
  title: z
    .string()
    .transform((value) => normalizeWhitespace(value))
    .pipe(z.string().min(3).max(255)),
  slug: slugSchema.optional(),
  short_description: z.string().max(500).optional(),
  description: z.string().optional(),
  thumbnail_url: z.string().url().optional(),
  type: z.enum(["course", "ebook", "template"]).optional(),
  price: z.coerce.number().min(0).optional(),
  currency: z.string().min(1).max(10).optional(),
  status: z.enum(["draft", "active", "inactive"]).optional(),
});

export const updateProductSchema = z.object({
  title: z
    .string()
    .transform((value) => normalizeWhitespace(value))
    .pipe(z.string().min(3).max(255))
    .optional(),
  slug: slugSchema.optional(),
  short_description: z.string().max(500).optional(),
  description: z.string().optional(),
  thumbnail_url: z.string().url().optional(),
  type: z.enum(["course", "ebook", "template"]).optional(),
  price: z.coerce.number().min(0).optional(),
  currency: z.string().min(1).max(10).optional(),
  status: z.enum(["draft", "active", "inactive"]).optional(),
}).refine((payload) => Object.keys(payload).length > 0, {
  message: "Minimal satu field harus diisi untuk update.",
});

export const listProductsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  status: z.enum(["draft", "active", "inactive"]).optional(),
  type: z.enum(["course", "ebook", "template"]).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ListProductsQueryInput = z.infer<typeof listProductsQuerySchema>;
