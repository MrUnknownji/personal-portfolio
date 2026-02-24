"use client";
import React, { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { FiSend } from "react-icons/fi";

interface FormProps {
  onSubmitSuccess: () => void;
}

const Form: React.FC<FormProps> = ({ onSubmitSuccess }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);
  const subjectInputRef = useRef<HTMLInputElement>(null);
  const messageTextareaRef = useRef<HTMLTextAreaElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (!categoryInputRef.current?.value) {
      newErrors.category = "Category is required";
    }
    if (!subjectInputRef.current?.value) {
      newErrors.subject = "Subject is required";
    }
    if (!messageTextareaRef.current?.value) {
      newErrors.message = "Message is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

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

      const category = categoryInputRef.current?.value || "";
      const subject = subjectInputRef.current?.value || "";
      const message = messageTextareaRef.current?.value || "";

      const mailtoLink = `mailto:sandeepkhati788@gmail.com?subject=${encodeURIComponent(
        `[${category}] ${subject}`,
      )}&body=${encodeURIComponent(message)}`;

      const mailWindow = window.open(mailtoLink, "_blank");

      await new Promise((resolve) => setTimeout(resolve, 500));

      if (
        !mailWindow ||
        mailWindow.closed ||
        typeof mailWindow.closed == "undefined"
      ) {
        console.warn(
          "Mailto link might be blocked. Consider providing manual instructions.",
        );
      }

      onSubmitSuccess();
      formRef.current?.reset();
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
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

  const renderFloatingLabel = (fieldName: string, label: string) => {
    const isFocused = focusedField === fieldName;
    const hasValue =
      fieldName === "category"
        ? categoryInputRef.current?.value
        : fieldName === "subject"
          ? subjectInputRef.current?.value
          : messageTextareaRef.current?.value;

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
        <div className="relative">
          <input
            ref={categoryInputRef}
            type="text"
            name="category"
            className={getInputClasses("category", !!errors.category)}
            onFocus={() => setFocusedField("category")}
            onBlur={() => setFocusedField(null)}
            onChange={() => {
              if (errors.category) setErrors({ ...errors, category: "" });
            }}
            disabled={isSubmitting}
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
            ref={subjectInputRef}
            type="text"
            name="subject"
            className={getInputClasses("subject", !!errors.subject)}
            onFocus={() => setFocusedField("subject")}
            onBlur={() => setFocusedField(null)}
            onChange={() => {
              if (errors.subject) setErrors({ ...errors, subject: "" });
            }}
            disabled={isSubmitting}
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
            ref={messageTextareaRef}
            name="message"
            rows={4}
            className={`${getInputClasses("message", !!errors.message)} resize-none`}
            onFocus={() => setFocusedField("message")}
            onBlur={() => setFocusedField(null)}
            onChange={() => {
              if (errors.message) setErrors({ ...errors, message: "" });
            }}
            disabled={isSubmitting}
          />
          {renderFloatingLabel("message", "Your Message...")}
          {errors.message && (
            <span className="absolute -bottom-5 left-0 text-xs text-red-400">
              {errors.message}
            </span>
          )}
        </div>

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
