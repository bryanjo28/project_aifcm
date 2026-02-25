import type { PoolConnection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { getMySqlPool } from "../../config/mysql.js";
import type {
  CreateCategoryInput,
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
  category_ids_csv: string | null;
  category_names_csv: string | null;
  owner_id: number | null;
  owner_name: string | null;
};

type CountRow = RowDataPacket & { total: number };
type CategoryRow = RowDataPacket & { id: number; name: string; slug: string };

type ProductOutput = Omit<ProductRow, "category_ids_csv" | "category_names_csv"> & {
  category_ids: number[];
  category_names: string[];
};

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

function mapProductRow(row: ProductRow): ProductOutput {
  const categoryIds = row.category_ids_csv
    ? row.category_ids_csv
        .split(",")
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value) && value > 0)
    : [];
  const categoryNames = row.category_names_csv
    ? row.category_names_csv
        .split(",")
        .map((value) => value.trim())
        .filter((value) => value.length > 0)
    : [];

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    short_description: row.short_description,
    description: row.description,
    thumbnail_url: row.thumbnail_url,
    type: row.type,
    price: row.price,
    currency: row.currency,
    status: row.status,
    published_at: row.published_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    total_views: row.total_views,
    total_sales: row.total_sales,
    total_revenue: row.total_revenue,
    owner_id: row.owner_id,
    owner_name: row.owner_name,
    category_ids: categoryIds,
    category_names: categoryNames,
  };
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

async function ensureCategoriesExist(categoryIds: number[]): Promise<void> {
  if (categoryIds.length === 0) {
    return;
  }

  const pool = getMySqlPool();
  const placeholders = categoryIds.map(() => "?").join(",");
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT id
     FROM categories
     WHERE id IN (${placeholders})`,
    categoryIds
  );

  if (rows.length !== categoryIds.length) {
    throw createServiceError("Ada category yang tidak valid.", 400);
  }
}

async function replaceProductCategories(
  conn: PoolConnection,
  productId: number,
  categoryIds: number[]
): Promise<void> {
  await conn.query("DELETE FROM product_categories WHERE product_id = ?", [productId]);

  if (categoryIds.length === 0) {
    return;
  }

  const valuesSql = categoryIds.map(() => "(?, ?)").join(", ");
  const values: number[] = [];
  for (const categoryId of categoryIds) {
    values.push(productId, categoryId);
  }

  await conn.query(
    `INSERT INTO product_categories (product_id, category_id)
     VALUES ${valuesSql}`,
    values
  );
}

function normalizeCategoryIds(ids: number[] | undefined): number[] {
  if (!ids) {
    return [];
  }

  return Array.from(new Set(ids.filter((value) => Number.isFinite(value) && value > 0)));
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
       ps.total_revenue,
       (
         SELECT GROUP_CONCAT(pc.category_id ORDER BY pc.category_id SEPARATOR ',')
         FROM product_categories pc
         WHERE pc.product_id = p.id
       ) AS category_ids_csv,
       (
         SELECT GROUP_CONCAT(c.name ORDER BY c.name SEPARATOR ',')
         FROM product_categories pc
         JOIN categories c ON c.id = pc.category_id
         WHERE pc.product_id = p.id
       ) AS category_names_csv,
       (
         SELECT po.user_id
         FROM product_owners po
         WHERE po.product_id = p.id AND po.role = 'owner'
         ORDER BY po.user_id ASC
         LIMIT 1
       ) AS owner_id,
       (
         SELECT u.name
         FROM product_owners po
         JOIN users u ON u.id = po.user_id
         WHERE po.product_id = p.id AND po.role = 'owner'
         ORDER BY po.user_id ASC
         LIMIT 1
       ) AS owner_name
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
    items: rows.map((row) => mapProductRow(row)),
    pagination: {
      page: query.page,
      limit: query.limit,
      total: countRows[0]?.total ?? 0,
    },
  };
}

export async function getCategories() {
  const pool = getMySqlPool();
  const [rows] = await pool.query<CategoryRow[]>(
    `SELECT id, name, slug
     FROM categories
     ORDER BY name ASC`
  );

  return rows;
}

export async function createCategory(payload: CreateCategoryInput) {
  const pool = getMySqlPool();
  const slug = payload.slug ?? toSlug(payload.name);

  const [existing] = await pool.query<RowDataPacket[]>(
    `SELECT id
     FROM categories
     WHERE slug = ?
     LIMIT 1`,
    [slug]
  );

  if (existing.length > 0) {
    throw createServiceError("Slug category sudah digunakan.", 409);
  }

  const [insertResult] = await pool.query<ResultSetHeader>(
    `INSERT INTO categories (name, slug)
     VALUES (?, ?)`,
    [payload.name, slug]
  );

  return {
    id: insertResult.insertId,
    name: payload.name,
    slug,
  };
}

export async function createProduct(payload: CreateProductInput, userId: number) {
  const pool = getMySqlPool();
  const slug =
    payload.slug ?? `${toSlug(payload.title)}-${Math.floor(Date.now() / 1000).toString(36)}`;

  await ensureUniqueSlug(slug);

  const categoryIds = normalizeCategoryIds(payload.categoryIds);
  await ensureCategoriesExist(categoryIds);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [insertResult] = await conn.query<ResultSetHeader>(
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

    await conn.query("INSERT INTO product_stats (product_id) VALUES (?)", [productId]);
    await conn.query(
      `INSERT INTO product_owners (product_id, user_id, role)
       VALUES (?, ?, 'owner')`,
      [productId, userId]
    );

    await replaceProductCategories(conn, productId, categoryIds);

    await conn.commit();

    return { id: productId, slug };
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

export async function getProductById(id: number) {
  const pool = getMySqlPool();
  const [rows] = await pool.query<ProductRow[]>(
    `SELECT
       p.*,
       ps.total_views,
       ps.total_sales,
       ps.total_revenue,
       (
         SELECT GROUP_CONCAT(pc.category_id ORDER BY pc.category_id SEPARATOR ',')
         FROM product_categories pc
         WHERE pc.product_id = p.id
       ) AS category_ids_csv,
       (
         SELECT GROUP_CONCAT(c.name ORDER BY c.name SEPARATOR ',')
         FROM product_categories pc
         JOIN categories c ON c.id = pc.category_id
         WHERE pc.product_id = p.id
       ) AS category_names_csv,
       (
         SELECT po.user_id
         FROM product_owners po
         WHERE po.product_id = p.id AND po.role = 'owner'
         ORDER BY po.user_id ASC
         LIMIT 1
       ) AS owner_id,
       (
         SELECT u.name
         FROM product_owners po
         JOIN users u ON u.id = po.user_id
         WHERE po.product_id = p.id AND po.role = 'owner'
         ORDER BY po.user_id ASC
         LIMIT 1
       ) AS owner_name
     FROM products p
     LEFT JOIN product_stats ps ON ps.product_id = p.id
     WHERE p.id = ?
     LIMIT 1`,
    [id]
  );

  const row = rows[0];
  return row ? mapProductRow(row) : null;
}

export async function updateProduct(id: number, payload: UpdateProductInput) {
  const pool = getMySqlPool();
  const assignments: string[] = [];
  const values: Array<string | number | null> = [];

  const allowedFields: Array<Exclude<keyof UpdateProductInput, "slug" | "categoryIds">> = [
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

  const categoryIds =
    typeof payload.categoryIds !== "undefined"
      ? normalizeCategoryIds(payload.categoryIds)
      : undefined;

  if (categoryIds) {
    await ensureCategoriesExist(categoryIds);
  }

  if (assignments.length === 0 && typeof categoryIds === "undefined") {
    return;
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    if (assignments.length > 0) {
      values.push(id);
      await conn.query(
        `UPDATE products
         SET ${assignments.join(", ")}
         WHERE id = ?`,
        values
      );
    }

    if (typeof categoryIds !== "undefined") {
      await replaceProductCategories(conn, id, categoryIds);
    }

    await conn.commit();
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}

export async function deleteProduct(id: number) {
  const pool = getMySqlPool();
  await pool.query("DELETE FROM products WHERE id = ?", [id]);
}
