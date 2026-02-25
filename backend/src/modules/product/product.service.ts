import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getMySqlPool } from "../../config/mysql.js";
import type {
  CreateProductInput,
  ListProductsQueryInput,
  UpdateProductInput,
} from "./product.validation.js";

type ServiceError = Error & { statusCode?: number };

type ProductRow = RowDataPacket & {
  id: number;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  thumbnail_url: string | null;
  type: "course" | "ebook" | "template";
  price: string;
  currency: string;
  status: "draft" | "active" | "inactive";
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
  total_views: number | null;
  total_sales: number | null;
  total_revenue: string | null;
};

type CountRow = RowDataPacket & { total: number };

function createServiceError(message: string, statusCode: number): ServiceError {
  const error = new Error(message) as ServiceError;
  error.statusCode = statusCode;
  return error;
}

function toSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function ensureUniqueSlug(slug: string, exceptId?: number): Promise<void> {
  const pool = getMySqlPool();
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id
     FROM products
     WHERE slug = ? ${typeof exceptId === "number" ? "AND id <> ?" : ""}
     LIMIT 1`,
    typeof exceptId === "number" ? [slug, exceptId] : [slug]
  );

  if (rows.length > 0) {
    throw createServiceError("Slug sudah digunakan.", 409);
  }
}

export async function getProducts(query: ListProductsQueryInput) {
  const pool = getMySqlPool();
  const whereClauses: string[] = [];
  const whereValues: Array<string | number> = [];

  if (query.search?.trim()) {
    whereClauses.push("(p.title LIKE ? OR p.slug LIKE ?)");
    whereValues.push(`%${query.search.trim()}%`, `%${query.search.trim()}%`);
  }

  if (query.status) {
    whereClauses.push("p.status = ?");
    whereValues.push(query.status);
  }

  if (query.type) {
    whereClauses.push("p.type = ?");
    whereValues.push(query.type);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";
  const offset = (query.page - 1) * query.limit;

  const [rows] = await pool.query<ProductRow[]>(
    `SELECT
       p.*,
       ps.total_views,
       ps.total_sales,
       ps.total_revenue
     FROM products p
     LEFT JOIN product_stats ps ON ps.product_id = p.id
     ${whereSql}
     ORDER BY p.created_at DESC
     LIMIT ? OFFSET ?`,
    [...whereValues, query.limit, offset]
  );

  const [countRows] = await pool.query<CountRow[]>(
    `SELECT COUNT(*) AS total
     FROM products p
     ${whereSql}`,
    whereValues
  );

  return {
    items: rows,
    pagination: {
      page: query.page,
      limit: query.limit,
      total: countRows[0]?.total ?? 0,
    },
  };
}

export async function createProduct(payload: CreateProductInput, userId: number) {
  const pool = getMySqlPool();
  const slug =
    payload.slug ?? `${toSlug(payload.title)}-${Math.floor(Date.now() / 1000).toString(36)}`;

  await ensureUniqueSlug(slug);

  const [insertResult] = await pool.query<ResultSetHeader>(
    `INSERT INTO products (
      title,
      slug,
      short_description,
      description,
      thumbnail_url,
      type,
      price,
      currency,
      status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      payload.title,
      slug,
      payload.short_description ?? null,
      payload.description ?? null,
      payload.thumbnail_url ?? null,
      payload.type ?? "course",
      payload.price ?? 0,
      payload.currency ?? "IDR",
      payload.status ?? "draft",
    ]
  );

  const productId = insertResult.insertId;

  await pool.query("INSERT INTO product_stats (product_id) VALUES (?)", [productId]);
  await pool.query(
    `INSERT INTO product_owners (product_id, user_id, role)
     VALUES (?, ?, 'owner')`,
    [productId, userId]
  );

  return { id: productId, slug };
}

export async function getProductById(id: number) {
  const pool = getMySqlPool();
  const [rows] = await pool.query<ProductRow[]>(
    `SELECT
       p.*,
       ps.total_views,
       ps.total_sales,
       ps.total_revenue
     FROM products p
     LEFT JOIN product_stats ps ON ps.product_id = p.id
     WHERE p.id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] ?? null;
}

export async function updateProduct(id: number, payload: UpdateProductInput) {
  const pool = getMySqlPool();
  const assignments: string[] = [];
  const values: Array<string | number | null> = [];

  const allowedFields: Array<keyof UpdateProductInput> = [
    "title",
    "short_description",
    "description",
    "thumbnail_url",
    "type",
    "price",
    "currency",
    "status",
  ];

  for (const field of allowedFields) {
    const value = payload[field];
    if (typeof value !== "undefined") {
      assignments.push(`${field} = ?`);
      values.push(value);
    }
  }

  if (payload.slug) {
    await ensureUniqueSlug(payload.slug, id);
    assignments.push("slug = ?");
    values.push(payload.slug);
  }

  if (assignments.length === 0) {
    return;
  }

  values.push(id);

  await pool.query(
    `UPDATE products
     SET ${assignments.join(", ")}
     WHERE id = ?`,
    values
  );
}

export async function deleteProduct(id: number) {
  const pool = getMySqlPool();
  await pool.query("DELETE FROM products WHERE id = ?", [id]);
}
