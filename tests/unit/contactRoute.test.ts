import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const mocks = vi.hoisted(() => ({
  consumeRateLimit: vi.fn(),
  getPortfolioDb: vi.fn(),
  insertOne: vi.fn(),
}));

vi.mock("@/lib/mongodb", () => ({
  getPortfolioDb: mocks.getPortfolioDb,
}));

vi.mock("@/lib/server/rateLimit", () => ({
  consumeRateLimit: mocks.consumeRateLimit,
  getTrustedClientIp: () => "203.0.113.4",
  pseudonymize: () => "pseudonymous-ip",
}));

import { POST } from "@/app/api/contact/route";

const validSubmission = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  category: "Project Inquiry",
  subject: "Portfolio project",
  message: "I would like to discuss a new product build with you.",
  company: "",
};

const createRequest = (body: string, headers: HeadersInit = {}) =>
  new NextRequest("http://localhost/api/contact", {
    method: "POST",
    body,
    headers: { "content-type": "application/json", ...headers },
  });

describe("contact route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.consumeRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 2,
      retryAfterSeconds: 60,
    });
    mocks.getPortfolioDb.mockResolvedValue({
      collection: () => ({ insertOne: mocks.insertOne }),
    });
    mocks.insertOne.mockResolvedValue({ acknowledged: true });
  });

  it("rejects malformed and oversized bodies before storage", async () => {
    const malformed = await POST(createRequest("{"));
    expect(malformed.status).toBe(400);

    const oversized = await POST(
      createRequest("{}", { "content-length": String(33 * 1024) }),
    );
    expect(oversized.status).toBe(413);
    expect(mocks.getPortfolioDb).not.toHaveBeenCalled();
  });

  it("returns exact validation errors for invalid fields", async () => {
    const response = await POST(createRequest(JSON.stringify({ email: "bad" })));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.errors).toMatchObject({
      name: expect.any(String),
      email: expect.any(String),
      message: expect.any(String),
    });
  });

  it("returns Retry-After when either durable quota is exhausted", async () => {
    mocks.consumeRateLimit
      .mockResolvedValueOnce({
        allowed: false,
        remaining: 0,
        retryAfterSeconds: 75,
      })
      .mockResolvedValueOnce({
        allowed: true,
        remaining: 1,
        retryAfterSeconds: 30,
      });

    const response = await POST(
      createRequest(JSON.stringify(validSubmission)),
    );

    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("75");
    expect(mocks.insertOne).not.toHaveBeenCalled();
  });

  it("stores normalized messages with retention metadata", async () => {
    const response = await POST(
      createRequest(JSON.stringify(validSubmission), {
        "user-agent": "test-browser",
      }),
    );

    expect(response.status).toBe(200);
    expect(mocks.consumeRateLimit).toHaveBeenCalledTimes(2);
    expect(mocks.insertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "ada@example.com",
        ipHash: "pseudonymous-ip",
        userAgent: "test-browser",
        deleteAt: expect.any(Date),
      }),
    );
  });
});
