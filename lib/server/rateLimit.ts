import "server-only";

import { createHmac } from "node:crypto";
import { getPortfolioDb } from "@/lib/mongodb";

type RateLimitDocument = {
  _id: string;
  count: number;
  expiresAt: Date;
};

type RateLimitOptions = {
  namespace: string;
  identifier: string;
  limit: number;
  windowMs: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

// IPs and emails are stored only as HMACs. The key must be its own secret: reusing the
// database URI would put connection credentials to a second use, so production refuses
// to run without RATE_LIMIT_HASH_SECRET and development uses a fixed local key.
const DEVELOPMENT_HASH_SECRET = "development-only-rate-limit-secret";

const getHashSecret = () => {
  const secret = process.env.RATE_LIMIT_HASH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") return DEVELOPMENT_HASH_SECRET;
  throw new Error("RATE_LIMIT_HASH_SECRET must be set in production.");
};

export const pseudonymize = (value: string) => {
  return createHmac("sha256", getHashSecret()).update(value).digest("hex");
};

export const getTrustedClientIp = (headers: Headers) => {
  const vercelForwardedFor = headers.get("x-vercel-forwarded-for");
  if (vercelForwardedFor) {
    return vercelForwardedFor.split(",")[0]?.trim() || "unknown";
  }

  if (process.env.VERCEL) {
    const forwardedFor = headers.get("x-forwarded-for");
    if (forwardedFor) {
      return forwardedFor.split(",")[0]?.trim() || "unknown";
    }
  }

  return headers.get("x-real-ip") || "unknown";
};

export async function consumeRateLimit({
  namespace,
  identifier,
  limit,
  windowMs,
}: RateLimitOptions): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  const expiresAt = new Date(windowStart + windowMs * 2);
  const id = `${namespace}:${pseudonymize(identifier)}:${windowStart}`;
  const db = await getPortfolioDb();

  const document = await db.collection<RateLimitDocument>("request_rate_limits").findOneAndUpdate(
    { _id: id },
    {
      $inc: { count: 1 },
      $setOnInsert: { expiresAt },
    },
    {
      upsert: true,
      returnDocument: "after",
      includeResultMetadata: false,
    },
  );

  const count = document?.count ?? limit + 1;

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    retryAfterSeconds: Math.max(1, Math.ceil((windowStart + windowMs - now) / 1000)),
  };
}
