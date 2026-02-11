import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),
  FRONTEND_ORIGIN: z.string().default("http://localhost:3000"),
  AUTH_SECRET: z.string().min(32).default("dev-only-change-this-secret-key-32chars"),
  AUTH_COOKIE_NAME: z.string().min(1).default("auth_token"),
  AUTH_TTL_SECONDS: z.coerce.number().int().positive().default(60 * 60 * 24 * 7),
  EMAILJS_SERVICE_ID: z.string().min(1),
  EMAILJS_TEMPLATE_ID: z.string().min(1),
  EMAILJS_PUBLIC_KEY: z.string().min(1),
  DOWNLOAD_LINK: z.string().url(),
  SENDER_NAME: z.string().min(1).default("Tim HeyJasz"),
});

export const env = envSchema.parse(process.env);
