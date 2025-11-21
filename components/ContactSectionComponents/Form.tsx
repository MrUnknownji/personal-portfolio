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
          scale: 0.97,
          duration: 0.15,
          ease: "power2.inOut",
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

  const getInputClasses = (hasError: boolean): string => {
    return `
      w-full bg-neutral/10 rounded-xl border text-light px-5 py-4
      outline-none placeholder:text-muted/50 transition-all duration-300 ease-out transform-none
      focus:border-primary/50 focus:bg-neutral/20 focus:ring-4 focus:ring-primary/10
      backdrop-blur-sm
      ${hasError
        ? "border-destructive/50 bg-destructive/5 focus:ring-destructive/10"
        : "border-neutral/20 hover:border-primary/30 hover:bg-neutral/15"
      }
    `;
  };

  return (
    <div className="w-full">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-6"
        noValidate
      >
        <div className="form-item-wrapper relative group">
          <input
            ref={categoryInputRef}
            type="text"
            name="category"
            placeholder="Category (e.g., Project Inquiry)"
            className={getInputClasses(!!errors.category)}
            aria-invalid={!!errors.category}
            aria-describedby={errors.category ? "category-error" : undefined}
            disabled={isSubmitting}
          />
          {errors.category && (
            <span
              id="category-error"
              className="absolute -bottom-5 left-1 text-xs text-destructive font-medium"
              role="alert"
            >
              {errors.category}
            </span>
          )}
        </div>

        <div className="form-item-wrapper relative group">
          <input
            ref={subjectInputRef}
            type="text"
            name="subject"
            placeholder="Subject"
            className={getInputClasses(!!errors.subject)}
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? "subject-error" : undefined}
            disabled={isSubmitting}
          />
          {errors.subject && (
            <span
              id="subject-error"
              className="absolute -bottom-5 left-1 text-xs text-destructive font-medium"
              role="alert"
            >
              {errors.subject}
            </span>
          )}
        </div>

        <div className="form-item-wrapper relative group">
          <textarea
            ref={messageTextareaRef}
            name="message"
            placeholder="Your Message..."
            rows={6}
            className={`${getInputClasses(!!errors.message)} resize-none`}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            disabled={isSubmitting}
          />
          {errors.message && (
            <span
              id="message-error"
              className="absolute -bottom-5 left-1 text-xs text-destructive font-medium"
              role="alert"
            >
              {errors.message}
            </span>
          )}
        </div>

        <div className="form-item-wrapper pt-2">
          <button
            ref={submitButtonRef}
            type="submit"
            disabled={isSubmitting}
            className="group/submitbtn w-full bg-gradient-to-r from-primary to-accent text-dark font-bold py-4 px-6 rounded-xl
                        focus:outline-none focus:ring-4 focus:ring-primary/20 focus:ring-offset-0
                        flex items-center justify-center gap-x-2 transform transition-all duration-300 ease-out
                        hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]
                        disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <span className="tracking-wide">{isSubmitting ? "Sending..." : "Send Message"}</span>
            <FiSend
              className={`w-5 h-5 transition-transform duration-300 ease-out ${isSubmitting
                ? "animate-spin"
                : "group-hover/submitbtn:translate-x-1 group-hover/submitbtn:-translate-y-1"
                }`}
            />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
