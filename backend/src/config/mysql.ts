import mysql, { type Pool, type RowDataPacket } from "mysql2/promise";
import { randomBytes, scryptSync } from "node:crypto";
import { env } from "./env.js";

let pool: Pool | null = null;

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hashed = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hashed}`;
}

export const getMySqlPool = () => {
  if (pool) {
    return pool;
  }

  pool = mysql.createPool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    namedPlaceholders: true,
  });

  return pool;
};

export const connectMySql = async () => {
  const mysqlPool = getMySqlPool();
  const connection = await mysqlPool.getConnection();

  try {
    await connection.query(
      `CREATE TABLE IF NOT EXISTS users (
        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(254) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`
    );

    const seedEmail = env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
    const seedPassword = env.SEED_ADMIN_PASSWORD;
    const seedName = env.SEED_ADMIN_NAME;

    if ((seedEmail && !seedPassword) || (!seedEmail && seedPassword)) {
      console.warn(
        "Admin seed skipped: set both SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD."
      );
    }

    if (seedEmail && seedPassword) {
      const [existingRows] = await connection.query<RowDataPacket[]>(
        "SELECT id FROM users WHERE email = ? LIMIT 1",
        [seedEmail]
      );

      if (existingRows.length === 0) {
        const passwordHash = hashPassword(seedPassword);
        await connection.query(
          `INSERT INTO users (name, email, password, role, is_active)
           VALUES (?, ?, ?, 'admin', true)`,
          [seedName, seedEmail, passwordHash]
        );
        console.log(`Admin seed created for ${seedEmail}`);
      }
    }
  } finally {
    connection.release();
  }
};

export type MySqlUserRow = RowDataPacket & {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  is_active: number;
};

export type MySqlProductRow = RowDataPacket & {
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
};
