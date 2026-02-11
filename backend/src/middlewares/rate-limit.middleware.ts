import type { NextFunction, Request, Response } from "express";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  windowMs: number;
  maxRequests: number;
  message?: string;
};

function getClientKey(req: Request): string {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0]?.trim() || req.ip || "unknown";
  }
  return req.ip || "unknown";
}

function createRateLimitMiddleware(options: RateLimitOptions) {
  const buckets = new Map<string, RateLimitBucket>();

  return function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
    const now = Date.now();
    const key = getClientKey(req);
    const bucket = buckets.get(key);

    if (!bucket || now > bucket.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + options.windowMs });
      return next();
    }

    if (bucket.count >= options.maxRequests) {
      const retryAfterSeconds = Math.ceil((bucket.resetAt - now) / 1000);

      res.setHeader("Retry-After", retryAfterSeconds.toString());
      return res.status(429).json({
        ok: false,
        message: options.message ?? "Too many requests. Please try again later.",
      });
    }

    bucket.count += 1;
    return next();
  };
}

export const leadRateLimitMiddleware = createRateLimitMiddleware({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
});

export const authRateLimitMiddleware = createRateLimitMiddleware({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
  message: "Too many login/register attempts. Please try again later.",
});
