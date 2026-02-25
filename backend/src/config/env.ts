import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().default(3306),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().optional(),
  DB_NAME: z.string().min(1),
  SEED_ADMIN_NAME: z.string().min(2).max(100).default("Admin"),
  SEED_ADMIN_EMAIL: z.string().email().max(254).optional(),
  SEED_ADMIN_PASSWORD: z.string().min(8).max(128).optional(),
  FRONTEND_ORIGIN: z.string().default("http://localhost:3000"),
  FRONTEND_ORIGINS: z.string().optional(),
  AUTH_SECRET: z.string().min(32).default("dev-only-change-this-secret-key-32chars"),
  AUTH_COOKIE_NAME: z.string().min(1).default("auth_token"),
  AUTH_TTL_SECONDS: z.coerce.number().int().positive().default(60 * 60 * 24 * 7),
  CSRF_COOKIE_NAME: z.string().min(1).default("csrf_token"),
  EMAILJS_SERVICE_ID: z.string().min(1),
  EMAILJS_TEMPLATE_ID: z.string().min(1),
  EMAILJS_PUBLIC_KEY: z.string().min(1),
  DOWNLOAD_LINK: z.string().url(),
  SENDER_NAME: z.string().min(1).default("Tim HeyJasz"),
});

export const env = envSchema.parse(process.env);
