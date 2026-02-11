import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { Request } from "express";
import { env } from "../../config/env.js";

export type SessionTokenPayload = {
  sub: string;
  role: "user" | "admin";
  iat: number;
  exp: number;
};

function toBase64Url(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(data: string): Buffer {
  return createHmac("sha256", env.AUTH_SECRET).update(data).digest();
}

function cookieDateFromNow(seconds: number): string {
  return new Date(Date.now() + seconds * 1000).toUTCString();
}

export function createSessionToken(user: {
  id: string;
  role: "user" | "admin";
}): string {
  const now = Math.floor(Date.now() / 1000);
  const payload: SessionTokenPayload = {
    sub: user.id,
    role: user.role,
    iat: now,
    exp: now + env.AUTH_TTL_SECONDS,
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = sign(encodedPayload).toString("base64url");
  return `v1.${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): SessionTokenPayload | null {
  const [version, encodedPayload, providedSignature] = token.split(".");
  if (version !== "v1" || !encodedPayload || !providedSignature) {
    return null;
  }

  const expectedSignature = sign(encodedPayload);
  const actualSignature = Buffer.from(providedSignature, "base64url");
  if (expectedSignature.length !== actualSignature.length) {
    return null;
  }
  if (!timingSafeEqual(expectedSignature, actualSignature)) {
    return null;
  }

  let payload: SessionTokenPayload;
  try {
    payload = JSON.parse(fromBase64Url(encodedPayload)) as SessionTokenPayload;
  } catch {
    return null;
  }

  if (!payload?.sub || !payload?.role || !payload.exp || !payload.iat) {
    return null;
  }
  if (payload.role !== "user" && payload.role !== "admin") {
    return null;
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp <= now) {
    return null;
  }

  return payload;
}

export function getCookieValue(req: Request, key: string): string | null {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) {
    return null;
  }

  const pairs = cookieHeader.split(";");
  for (const pair of pairs) {
    const [rawName, ...rawValue] = pair.trim().split("=");
    if (rawName !== key) {
      continue;
    }

    const value = rawValue.join("=");
    return value ? decodeURIComponent(value) : "";
  }

  return null;
}

export function createAuthCookie(token: string): string {
  const parts = [
    `${env.AUTH_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${env.AUTH_TTL_SECONDS}`,
    `Expires=${cookieDateFromNow(env.AUTH_TTL_SECONDS)}`,
  ];

  if (env.NODE_ENV === "production") {
    parts.push("Secure");
  }

  return parts.join("; ");
}

export function clearAuthCookie(): string {
  const parts = [
    `${env.AUTH_COOKIE_NAME}=`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    "Max-Age=0",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
  ];

  if (env.NODE_ENV === "production") {
    parts.push("Secure");
  }

  return parts.join("; ");
}

export function createCsrfToken(): string {
  return randomBytes(32).toString("base64url");
}

export function createCsrfCookie(token: string): string {
  const parts = [
    `${env.CSRF_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "SameSite=Lax",
    `Max-Age=${env.AUTH_TTL_SECONDS}`,
    `Expires=${cookieDateFromNow(env.AUTH_TTL_SECONDS)}`,
  ];

  if (env.NODE_ENV === "production") {
    parts.push("Secure");
  }

  return parts.join("; ");
}

export function clearCsrfCookie(): string {
  const parts = [
    `${env.CSRF_COOKIE_NAME}=`,
    "Path=/",
    "SameSite=Lax",
    "Max-Age=0",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
  ];

  if (env.NODE_ENV === "production") {
    parts.push("Secure");
  }

  return parts.join("; ");
}
