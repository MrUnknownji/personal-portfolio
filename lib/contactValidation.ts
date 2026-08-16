export type ContactRequestBody = {
  name?: unknown;
  email?: unknown;
  category?: unknown;
  subject?: unknown;
  message?: unknown;
  company?: unknown;
};

export type ContactFormValues = {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  company: string;
};

export const CONTACT_FIELD_LIMITS = {
  name: 80,
  email: 120,
  category: 80,
  subject: 120,
  message: 3_000,
} as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeText = (value: unknown) => {
  return typeof value === "string" ? value.trim() : "";
};

export function validateContactRequest(body: ContactRequestBody) {
  const values: ContactFormValues = {
    name: normalizeText(body.name),
    email: normalizeText(body.email).toLowerCase(),
    category: normalizeText(body.category),
    subject: normalizeText(body.subject),
    message: normalizeText(body.message),
    company: normalizeText(body.company),
  };
  const errors: Partial<Record<keyof ContactFormValues, string>> = {};

  if (values.name.length < 2) errors.name = "Name must be at least 2 characters.";
  if (values.name.length > CONTACT_FIELD_LIMITS.name) errors.name = `Name must be ${CONTACT_FIELD_LIMITS.name} characters or less.`;
  if (!EMAIL_PATTERN.test(values.email)) errors.email = "Enter a valid email address.";
  if (values.email.length > CONTACT_FIELD_LIMITS.email) errors.email = `Email must be ${CONTACT_FIELD_LIMITS.email} characters or less.`;
  if (values.category.length < 2) errors.category = "Category is required.";
  if (values.category.length > CONTACT_FIELD_LIMITS.category) errors.category = `Category must be ${CONTACT_FIELD_LIMITS.category} characters or less.`;
  if (values.subject.length < 3) errors.subject = "Subject is required.";
  if (values.subject.length > CONTACT_FIELD_LIMITS.subject) errors.subject = `Subject must be ${CONTACT_FIELD_LIMITS.subject} characters or less.`;
  if (values.message.length < 10) errors.message = "Message must be at least 10 characters.";
  if (values.message.length > CONTACT_FIELD_LIMITS.message) errors.message = `Message must be ${CONTACT_FIELD_LIMITS.message} characters or less.`;

  return { values, errors };
}
