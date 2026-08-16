import { NextRequest, NextResponse } from "next/server";
import { getPortfolioDb } from "@/lib/mongodb";
import {
  consumeRateLimit,
  getTrustedClientIp,
  pseudonymize,
} from "@/lib/server/rateLimit";
import {
  normalizeText,
  validateContactRequest,
  type ContactRequestBody,
} from "@/lib/contactValidation";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const IP_RATE_LIMIT = 5;
const EMAIL_RATE_LIMIT = 3;
const MAX_BODY_BYTES = 32 * 1024;
const MAX_USER_AGENT_LENGTH = 300;
const CONTACT_RETENTION_DAYS = Number(
  process.env.CONTACT_RETENTION_DAYS || "365",
);

export async function POST(request: NextRequest) {
  let body: ContactRequestBody;

  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json(
        { message: "Request body is too large." },
        { status: 413 },
      );
    }

    const rawBody = await request.text();
    if (Buffer.byteLength(rawBody, "utf8") > MAX_BODY_BYTES) {
      return NextResponse.json(
        { message: "Request body is too large." },
        { status: 413 },
      );
    }

    body = JSON.parse(rawBody) as ContactRequestBody;
  } catch {
    return NextResponse.json(
      { message: "Invalid request body." },
      { status: 400 },
    );
  }

  if (normalizeText(body.company)) {
    return NextResponse.json({ ok: true });
  }

  const { errors, values } = validateContactRequest(body);
  const { name, email, category, subject, message } = values;

  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { message: "Please fix the highlighted fields.", errors },
      { status: 400 },
    );
  }

  try {
    const clientIp = getTrustedClientIp(request.headers);
    const [ipLimit, emailLimit] = await Promise.all([
      consumeRateLimit({
        namespace: "contact-ip",
        identifier: clientIp,
        limit: IP_RATE_LIMIT,
        windowMs: RATE_LIMIT_WINDOW_MS,
      }),
      consumeRateLimit({
        namespace: "contact-email",
        identifier: email,
        limit: EMAIL_RATE_LIMIT,
        windowMs: RATE_LIMIT_WINDOW_MS,
      }),
    ]);

    if (!ipLimit.allowed || !emailLimit.allowed) {
      const retryAfterSeconds = Math.max(
        ipLimit.retryAfterSeconds,
        emailLimit.retryAfterSeconds,
      );

      return NextResponse.json(
        { message: "Too many messages. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": retryAfterSeconds.toString() },
        },
      );
    }

    const db = await getPortfolioDb();
    const createdAt = new Date();
    const retentionDays = Number.isFinite(CONTACT_RETENTION_DAYS)
      ? Math.max(1, CONTACT_RETENTION_DAYS)
      : 365;
    const deleteAt = new Date(
      createdAt.getTime() + retentionDays * 24 * 60 * 60 * 1000,
    );

    await db.collection("contact_messages").insertOne({
      name,
      email,
      category,
      subject,
      message,
      status: "new",
      source: "portfolio-contact-form",
      ipHash: pseudonymize(clientIp),
      userAgent: normalizeText(request.headers.get("user-agent")).slice(
        0,
        MAX_USER_AGENT_LENGTH,
      ),
      createdAt,
      updatedAt: createdAt,
      deleteAt,
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
