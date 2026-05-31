import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getPortfolioDb } from "@/lib/mongodb";

export const runtime = "nodejs";

type ContactRequestBody = {
  name?: unknown;
  email?: unknown;
  category?: unknown;
  subject?: unknown;
  message?: unknown;
  company?: unknown;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const MAX_USER_AGENT_LENGTH = 300;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const rateLimitStore = new Map<string, RateLimitEntry>();
let indexesReady: Promise<void> | null = null;

const normalizeText = (value: unknown) => {
  return typeof value === "string" ? value.trim() : "";
};

const hashValue = (value: string) => {
  return createHash("sha256").update(value).digest("hex");
};

const getClientIp = (request: NextRequest) => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0]?.trim() || "unknown";

  return request.headers.get("x-real-ip") || "unknown";
};

const checkRateLimit = (key: string) => {
  const now = Date.now();
  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) return false;

  current.count += 1;
  return true;
};

const getValidationErrors = (body: ContactRequestBody) => {
  const name = normalizeText(body.name);
  const email = normalizeText(body.email).toLowerCase();
  const category = normalizeText(body.category);
  const subject = normalizeText(body.subject);
  const message = normalizeText(body.message);

  const errors: Record<string, string> = {};

  if (name.length < 2) errors.name = "Name must be at least 2 characters.";
  if (name.length > 80) errors.name = "Name must be 80 characters or less.";

  if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address.";
  if (email.length > 120) errors.email = "Email must be 120 characters or less.";

  if (category.length < 2) {
    errors.category = "Category must be at least 2 characters.";
  }
  if (category.length > 80) {
    errors.category = "Category must be 80 characters or less.";
  }

  if (subject.length < 3) {
    errors.subject = "Subject must be at least 3 characters.";
  }
  if (subject.length > 120) {
    errors.subject = "Subject must be 120 characters or less.";
  }

  if (message.length < 10) {
    errors.message = "Message must be at least 10 characters.";
  }
  if (message.length > 3000) {
    errors.message = "Message must be 3000 characters or less.";
  }

  return { errors, name, email, category, subject, message };
};

const ensureIndexes = async () => {
  if (!indexesReady) {
    indexesReady = getPortfolioDb()
      .then((db) => {
        return Promise.all([
          db.collection("contact_messages").createIndex({ createdAt: -1 }),
          db.collection("contact_messages").createIndex({ email: 1 }),
        ]);
      })
      .then(() => undefined);
  }

  return indexesReady;
};

export async function POST(request: NextRequest) {
  let body: ContactRequestBody;

  try {
    body = (await request.json()) as ContactRequestBody;
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 },
    );
  }

  if (normalizeText(body.company)) {
    return NextResponse.json({ ok: true });
  }

  const { errors, name, email, category, subject, message } =
    getValidationErrors(body);

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { message: "Please fix the highlighted fields.", errors },
      { status: 400 },
    );
  }

  const clientIp = getClientIp(request);
  const rateLimitKey = hashValue(`${clientIp}:${email}`);

  if (!checkRateLimit(rateLimitKey)) {
    return NextResponse.json(
      { message: "Too many messages. Please try again later." },
      { status: 429 },
    );
  }

  try {
    await ensureIndexes();

    const db = await getPortfolioDb();
    const createdAt = new Date();

    await db.collection("contact_messages").insertOne({
      name,
      email,
      category,
      subject,
      message,
      status: "new",
      source: "portfolio-contact-form",
      ipHash: hashValue(clientIp),
      userAgent: normalizeText(request.headers.get("user-agent")).slice(
        0,
        MAX_USER_AGENT_LENGTH,
      ),
      createdAt,
      updatedAt: createdAt,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form submission failed", error);

    return NextResponse.json(
      { message: "Unable to send the message right now. Please try again." },
      { status: 500 },
    );
  }
}
