import { describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock("@/lib/server/rateLimit", () => ({
  consumeRateLimit: vi.fn(),
  getTrustedClientIp: vi.fn(() => "203.0.113.8"),
}));

import { chatWithBot } from "@/app/actions/chat";

describe("portfolio chat", () => {
  it("rejects empty and oversized prompts before external work", async () => {
    await expect(chatWithBot("   ")).resolves.toMatch(/enter a question/i);
    await expect(chatWithBot("x".repeat(501))).resolves.toMatch(
      /under 500 characters/i,
    );
  });

  it("answers common portfolio intents locally", async () => {
    await expect(chatWithBot("How can I contact Sandeep?")).resolves.toMatch(
      /contact form|email/i,
    );
    await expect(chatWithBot("What is his tech stack?")).resolves.toMatch(
      /React.*Next\.js.*TypeScript/i,
    );
    await expect(chatWithBot("Tell me about Mirror Wallpapers")).resolves.toMatch(
      /Mirror Wallpapers/i,
    );
  });
});
