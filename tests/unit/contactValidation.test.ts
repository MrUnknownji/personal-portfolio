import { describe, expect, it } from "vitest";
import {
  CONTACT_FIELD_LIMITS,
  validateContactRequest,
} from "@/lib/contactValidation";

const validRequest = {
  name: "Sandeep Visitor",
  email: "visitor@example.com",
  category: "Project inquiry",
  subject: "A useful project",
  message: "I would like to discuss a project with you.",
  company: "",
};

describe("validateContactRequest", () => {
  it("normalizes valid contact details", () => {
    const result = validateContactRequest({
      ...validRequest,
      name: "  Sandeep Visitor  ",
      email: "  VISITOR@EXAMPLE.COM ",
    });

    expect(result.errors).toEqual({});
    expect(result.values.name).toBe("Sandeep Visitor");
    expect(result.values.email).toBe("visitor@example.com");
  });

  it("returns field-specific errors for invalid input", () => {
    const result = validateContactRequest({
      name: "x",
      email: "invalid",
      category: "",
      subject: "x",
      message: "short",
    });

    expect(Object.keys(result.errors)).toEqual([
      "name",
      "email",
      "category",
      "subject",
      "message",
    ]);
  });

  it("enforces the same maximum lengths used by the client", () => {
    const result = validateContactRequest({
      ...validRequest,
      message: "x".repeat(CONTACT_FIELD_LIMITS.message + 1),
    });

    expect(result.errors.message).toContain(
      String(CONTACT_FIELD_LIMITS.message),
    );
  });
});
