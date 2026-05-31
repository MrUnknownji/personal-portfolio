"use client";
import React, { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { FiSend } from "react-icons/fi";

interface FormProps {
  onSubmitSuccess: () => void;
}

type ContactFormValues = {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  company: string;
};

const initialFormValues: ContactFormValues = {
  name: "",
  email: "",
  category: "",
  subject: "",
  message: "",
  company: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Form: React.FC<FormProps> = ({ onSubmitSuccess }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [formValues, setFormValues] =
    useState<ContactFormValues>(initialFormValues);

  const formRef = useRef<HTMLFormElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (formValues.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    if (!EMAIL_PATTERN.test(formValues.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }
    if (formValues.category.trim().length < 2) {
      newErrors.category = "Category is required";
    }
    if (formValues.subject.trim().length < 3) {
      newErrors.subject = "Subject is required";
    }
    if (formValues.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      if (submitButtonRef.current) {
        gsap.to(submitButtonRef.current, {
          scale: 0.98,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
        });
      }

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
          ? "border-red-500/70 shadow-[0_1px_10px_rgba(239,68,68,0.2)]"
          : isFocused
            ? "border-primary shadow-[0_1px_15px_hsl(var(--primary)/0.2)]"
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
            />
            {renderFloatingLabel("name", "Name")}
            {errors.name && (
              <span className="absolute -bottom-5 left-0 text-xs text-red-400">
                {errors.name}
              </span>
            )}
          </div>

          <div className="relative">
            <input
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
            />
            {renderFloatingLabel("email", "Email")}
            {errors.email && (
              <span className="absolute -bottom-5 left-0 text-xs text-red-400">
                {errors.email}
              </span>
            )}
          </div>
        </div>

        <div className="relative">
          <input
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
          />
          {renderFloatingLabel("category", "Category (e.g., Project Inquiry)")}
          {errors.category && (
            <span className="absolute -bottom-5 left-0 text-xs text-red-400">
              {errors.category}
            </span>
          )}
        </div>

        <div className="relative">
          <input
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
          />
          {renderFloatingLabel("subject", "Subject")}
          {errors.subject && (
            <span className="absolute -bottom-5 left-0 text-xs text-red-400">
              {errors.subject}
            </span>
          )}
        </div>

        <div className="relative">
          <textarea
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
          />
          {renderFloatingLabel("message", "Your Message...")}
          {errors.message && (
            <span className="absolute -bottom-5 left-0 text-xs text-red-400">
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
            ref={submitButtonRef}
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full bg-primary text-[#0a0a0a] font-bold tracking-widest uppercase py-4 px-6 rounded-xl
                       flex items-center justify-center gap-3 transition-all duration-500 overflow-hidden
                       hover:shadow-[0_0_30px_hsl(var(--primary)/0.4)] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {/* Shimmer Sweep Effect */}
            <div
              className="absolute inset-0 -translate-x-[150%] skew-x-12 group-hover:animate-[shimmer_2s_infinite]
                         bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
              style={{ width: "200%" }}
            />

            <span className="relative z-10">
              {isSubmitting ? "Sending..." : "Send Message"}
            </span>
            <FiSend
              className={`relative z-10 w-4 h-4 transition-transform duration-300 ${
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
