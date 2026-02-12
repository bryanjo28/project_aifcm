import type { CorsOptions } from "cors";
import { env } from "./env.js";

const extraOrigins = (env.FRONTEND_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([env.FRONTEND_ORIGIN, ...extraOrigins]);
const ngrokDevelopmentPattern = /^https:\/\/[a-z0-9-]+\.ngrok-free\.app$/i;

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    const isAllowed = allowedOrigins.has(origin);
    const isDevNgrok = env.NODE_ENV === "development" && ngrokDevelopmentPattern.test(origin);

    if (isAllowed || isDevNgrok) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
};
