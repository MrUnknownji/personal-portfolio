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
          scale: 0.95,
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
      w-full bg-transparent rounded-none border-b-2 text-white px-0 py-4
      outline-none placeholder:text-transparent transition-all duration-300
      [&:-webkit-autofill]:bg-transparent
      [&:-webkit-autofill]:[-webkit-text-fill-color:white]
      [&:-webkit-autofill]:transition-[background-color]
      [&:-webkit-autofill]:duration-[5000s]
      [&:-webkit-autofill]:ease-in-out
      ${hasError
        ? "border-red-500/80"
        : isFocused
          ? "border-primary"
          : "border-white/20 hover:border-white/40"
      }
    `;
  };

  const renderFloatingLabel = (fieldName: string, label: string) => {
    const isFocused = focusedField === fieldName;
    const hasValue = fieldName === 'category' ? categoryInputRef.current?.value :
      fieldName === 'subject' ? subjectInputRef.current?.value :
        messageTextareaRef.current?.value;

    return (
      <label
        className={`absolute left-0 transition-all duration-300 pointer-events-none
          ${(isFocused || hasValue)
            ? "-top-2 text-xs text-primary font-medium"
            : "top-4 text-neutral-400"
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
        <div className="relative group">
          <input
            ref={categoryInputRef}
            type="text"
            name="category"
            className={getInputClasses('category', !!errors.category)}
            onFocus={() => setFocusedField('category')}
            onBlur={() => setFocusedField(null)}
            onChange={() => {
              if (errors.category) setErrors({ ...errors, category: '' });
            }}
            disabled={isSubmitting}
            style={{ backgroundColor: 'transparent' }}
          />
          {renderFloatingLabel('category', 'Category (e.g., Project Inquiry)')}
          {errors.category && (
            <span className="absolute -bottom-6 left-0 text-xs text-red-400 font-medium animate-pulse">
              {errors.category}
            </span>
          )}
        </div>

        <div className="relative group">
          <input
            ref={subjectInputRef}
            type="text"
            name="subject"
            className={getInputClasses('subject', !!errors.subject)}
            onFocus={() => setFocusedField('subject')}
            onBlur={() => setFocusedField(null)}
            onChange={() => {
              if (errors.subject) setErrors({ ...errors, subject: '' });
            }}
            disabled={isSubmitting}
            style={{ backgroundColor: 'transparent' }}
          />
          {renderFloatingLabel('subject', 'Subject')}
          {errors.subject && (
            <span className="absolute -bottom-6 left-0 text-xs text-red-400 font-medium animate-pulse">
              {errors.subject}
            </span>
          )}
        </div>

        <div className="relative group">
          <textarea
            ref={messageTextareaRef}
            name="message"
            rows={4}
            className={`${getInputClasses('message', !!errors.message)} resize-none`}
            onFocus={() => setFocusedField('message')}
            onBlur={() => setFocusedField(null)}
            onChange={() => {
              if (errors.message) setErrors({ ...errors, message: '' });
            }}
            disabled={isSubmitting}
            style={{ backgroundColor: 'transparent' }}
          />
          {renderFloatingLabel('message', 'Your Message...')}
          {errors.message && (
            <span className="absolute -bottom-6 left-0 text-xs text-red-400 font-medium animate-pulse">
              {errors.message}
            </span>
          )}
        </div>

        <div className="pt-4">
          <button
            ref={submitButtonRef}
            type="submit"
            disabled={isSubmitting}
            className="group/submitbtn relative w-full overflow-hidden bg-white text-black font-bold py-4 px-6 rounded-xl
                        flex items-center justify-center gap-x-2 transition-all duration-300
                        hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover/submitbtn:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary opacity-0 group-hover/submitbtn:opacity-20 blur-xl transition-opacity duration-300" />

            <span className="relative z-10 tracking-wide group-hover/submitbtn:text-black transition-colors duration-300">
              {isSubmitting ? "Sending..." : "Send Message"}
            </span>
            <FiSend
              className={`relative z-10 w-5 h-5 transition-all duration-300 group-hover/submitbtn:text-black ${isSubmitting
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
