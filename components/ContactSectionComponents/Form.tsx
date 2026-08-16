"use client";
import React, { useRef, useState, useCallback } from "react";
import { FiSend } from "react-icons/fi";
import {
  CONTACT_FIELD_LIMITS,
  validateContactRequest,
  type ContactFormValues,
} from "@/lib/contactValidation";

interface FormProps {
  onSubmitSuccess: () => void;
}

const initialFormValues: ContactFormValues = {
  name: "",
  email: "",
  category: "",
  subject: "",
  message: "",
  company: "",
};

const Form: React.FC<FormProps> = ({ onSubmitSuccess }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formValues, setFormValues] =
    useState<ContactFormValues>(initialFormValues);

  const formRef = useRef<HTMLFormElement>(null);
  const validateForm = useCallback(() => {
    const { errors: newErrors } = validateContactRequest(formValues);
    setErrors(newErrors);
    return newErrors;
  }, [formValues]);

  const handleFieldChange = (
    fieldName: keyof ContactFormValues,
    value: string,
  ) => {
    setFormValues((currentValues) => ({
      ...currentValues,
      [fieldName]: value,
    }));

    if (errors[fieldName] || errors.form) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [fieldName]: "",
        form: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const validationErrors = validateForm();
    const firstInvalidField = Object.keys(validationErrors)[0];
    if (firstInvalidField) {
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstInvalidField}"]`)
        ?.focus();
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrors(
          data.errors || {
            form: data.message || "Unable to send your message right now.",
          },
        );
        return;
      }

      onSubmitSuccess();
      setFormValues(initialFormValues);
      setErrors({});
    } catch {
      setErrors({
        form: "Unable to send your message right now. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClasses = (fieldName: string, hasError: boolean): string => {
    const isFocused = focusedField === fieldName;

    return `
      w-full bg-transparent rounded-none border-b text-foreground px-0 py-3
      outline-none transition-colors duration-200
      ${
        hasError
          ? "border-red-500/70"
          : isFocused
            ? "border-primary"
            : "border-white/10 hover:border-white/30"
      }
    `;
  };

  const renderFloatingLabel = (
    fieldName: keyof ContactFormValues,
    label: string,
  ) => {
    const isFocused = focusedField === fieldName;
    const hasValue = formValues[fieldName];

    return (
      <label
        htmlFor={`contact-${fieldName}`}
        className={`absolute left-0 transition-all duration-200 pointer-events-none
          ${
            isFocused || hasValue
              ? "-top-2 text-xs text-primary"
              : "top-3 text-muted-foreground"
          }
        `}
      >
        {label}
      </label>
    );
  };

  return (
    <div className="w-full">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-8"
        noValidate
      >
        <input
          type="text"
          name="company"
          value={formValues.company}
          onChange={(event) => handleFieldChange("company", event.target.value)}
          tabIndex={-1}
          autoComplete="off"
          className="sr-only"
          aria-hidden="true"
        />

        <div className="grid gap-8 sm:grid-cols-2">
          <div className="relative">
            <input
              id="contact-name"
              type="text"
              name="name"
              value={formValues.name}
              className={getInputClasses("name", !!errors.name)}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              onChange={(event) =>
                handleFieldChange("name", event.target.value)
              }
              disabled={isSubmitting}
              autoComplete="name"
              maxLength={CONTACT_FIELD_LIMITS.name}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
            />
            {renderFloatingLabel("name", "Name")}
            {errors.name && (
              <span id="contact-name-error" className="absolute -bottom-5 left-0 text-xs text-red-400">
                {errors.name}
              </span>
            )}
          </div>

          <div className="relative">
            <input
              id="contact-email"
              type="email"
              name="email"
              value={formValues.email}
              className={getInputClasses("email", !!errors.email)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              onChange={(event) =>
                handleFieldChange("email", event.target.value)
              }
              disabled={isSubmitting}
              autoComplete="email"
              maxLength={CONTACT_FIELD_LIMITS.email}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
            />
            {renderFloatingLabel("email", "Email")}
            {errors.email && (
              <span id="contact-email-error" className="absolute -bottom-5 left-0 text-xs text-red-400">
                {errors.email}
              </span>
            )}
          </div>
        </div>

        <div className="relative">
          <input
            id="contact-category"
            type="text"
            name="category"
            value={formValues.category}
            className={getInputClasses("category", !!errors.category)}
            onFocus={() => setFocusedField("category")}
            onBlur={() => setFocusedField(null)}
            onChange={(event) =>
              handleFieldChange("category", event.target.value)
            }
            disabled={isSubmitting}
            autoComplete="off"
            maxLength={CONTACT_FIELD_LIMITS.category}
            aria-invalid={Boolean(errors.category)}
            aria-describedby={errors.category ? "contact-category-error" : undefined}
          />
          {renderFloatingLabel("category", "Category (e.g., Project Inquiry)")}
          {errors.category && (
            <span id="contact-category-error" className="absolute -bottom-5 left-0 text-xs text-red-400">
              {errors.category}
            </span>
          )}
        </div>

        <div className="relative">
          <input
            id="contact-subject"
            type="text"
            name="subject"
            value={formValues.subject}
            className={getInputClasses("subject", !!errors.subject)}
            onFocus={() => setFocusedField("subject")}
            onBlur={() => setFocusedField(null)}
            onChange={(event) =>
              handleFieldChange("subject", event.target.value)
            }
            disabled={isSubmitting}
            autoComplete="off"
            maxLength={CONTACT_FIELD_LIMITS.subject}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? "contact-subject-error" : undefined}
          />
          {renderFloatingLabel("subject", "Subject")}
          {errors.subject && (
            <span id="contact-subject-error" className="absolute -bottom-5 left-0 text-xs text-red-400">
              {errors.subject}
            </span>
          )}
        </div>

        <div className="relative">
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            value={formValues.message}
            className={`${getInputClasses("message", !!errors.message)} resize-none`}
            onFocus={() => setFocusedField("message")}
            onBlur={() => setFocusedField(null)}
            onChange={(event) =>
              handleFieldChange("message", event.target.value)
            }
            disabled={isSubmitting}
            maxLength={CONTACT_FIELD_LIMITS.message}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "contact-message-error" : undefined}
          />
          {renderFloatingLabel("message", "Your Message...")}
          {errors.message && (
            <span id="contact-message-error" className="absolute -bottom-5 left-0 text-xs text-red-400">
              {errors.message}
            </span>
          )}
        </div>

        {errors.form && (
          <p className="text-sm text-red-400" role="alert">
            {errors.form}
          </p>
        )}

        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full bg-primary text-[#0a0a0a] font-bold tracking-widest uppercase py-4 px-6 rounded-xl
                       flex items-center justify-center gap-3 transition-[transform,background-color,opacity] duration-150 overflow-hidden
                       hover:bg-primary/90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {/* Shimmer Sweep Effect */}
            <div
              className="absolute inset-0 -translate-x-[150%] skew-x-12 group-hover:animate-[shimmer_650ms_ease-out_1]
                         bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
              style={{ width: "200%" }}
            />

            <span className="relative z-10">
              {isSubmitting ? "Sending..." : "Send Message"}
            </span>
            <FiSend
              className={`relative z-10 w-4 h-4 transition-transform duration-150 ${
                isSubmitting
                  ? ""
                  : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              }`}
            />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
