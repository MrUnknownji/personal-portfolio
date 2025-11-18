"use client";
import React, { useRef, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FiSend } from "react-icons/fi";

interface FormProps {
  onSubmitSuccess: () => void;
}

const ANIMATION_CONFIG = {
  FORM_ITEMS: {
    DURATION: 0.8,
    STAGGER: 0.15,
    Y_OFFSET: 30,
    OPACITY: 0,
    EASE: "power3.out",
    ROTATION: 2,
    SCALE: 0.95,
  },
  SCROLL_TRIGGER: {
    START: "top 85%",
    END: "bottom 20%",
    TOGGLE_ACTIONS: "play none none reverse",
  },
  INPUT_FLOAT: {
    DURATION: 2.5,
    Y_OFFSET: 4,
    EASE: "sine.inOut",
  },
} as const;

const Form: React.FC<FormProps> = ({ onSubmitSuccess }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
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

  useGSAP(
    () => {
      if (!formRef.current || !formContainerRef.current) return;

      const formElements = gsap.utils.toArray<HTMLElement>(
        formRef.current.querySelectorAll(".form-item-wrapper"),
      );

      gsap.set(formElements, {
        y: ANIMATION_CONFIG.FORM_ITEMS.Y_OFFSET,
        opacity: ANIMATION_CONFIG.FORM_ITEMS.OPACITY,
        rotationZ: ANIMATION_CONFIG.FORM_ITEMS.ROTATION,
        scale: ANIMATION_CONFIG.FORM_ITEMS.SCALE,
        willChange: "transform, opacity",
        force3D: true,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: formContainerRef.current,
          start: ANIMATION_CONFIG.SCROLL_TRIGGER.START,
          end: ANIMATION_CONFIG.SCROLL_TRIGGER.END,
          toggleActions: ANIMATION_CONFIG.SCROLL_TRIGGER.TOGGLE_ACTIONS,
          markers: false,
        },
      });

      tl.to(formElements, {
        y: 0,
        opacity: 1,
        rotationZ: 0,
        scale: 1,
        duration: ANIMATION_CONFIG.FORM_ITEMS.DURATION,
        stagger: ANIMATION_CONFIG.FORM_ITEMS.STAGGER,
        ease: ANIMATION_CONFIG.FORM_ITEMS.EASE,
        clearProps: "transform, opacity, willChange",
        force3D: true,
      });

    },
    { scope: formContainerRef },
  );

  const getInputClasses = (hasError: boolean): string => {
    return `
      w-full bg-neutral/30 rounded-lg border text-light px-4 py-3
      outline-none placeholder:text-muted transition-all duration-300 ease-out
      focus:border-primary focus:bg-neutral/50 focus:ring-2 focus:ring-primary/30
      ${
        hasError
          ? "border-destructive bg-destructive/10"
          : "border-neutral/70 hover:border-primary/50"
      }
    `;
  };

  return (
    <div ref={formContainerRef} className="w-full">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-6"
        noValidate
      >
        <div className="form-item-wrapper relative pb-5">
          <input
            ref={categoryInputRef}
            type="text"
            name="category"
            placeholder="Category (e.g., Project Inquiry, Collaboration)"
            className={getInputClasses(!!errors.category)}
            aria-invalid={!!errors.category}
            aria-describedby={errors.category ? "category-error" : undefined}
            disabled={isSubmitting}
          />
          {errors.category && (
            <span
              id="category-error"
              className="absolute bottom-0 left-0 text-sm text-destructive"
              role="alert"
            >
              {errors.category}
            </span>
          )}
        </div>

        <div className="form-item-wrapper relative pb-5">
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
              className="absolute bottom-0 left-0 text-sm text-destructive"
              role="alert"
            >
              {errors.subject}
            </span>
          )}
        </div>

        <div className="form-item-wrapper relative pb-5">
          <textarea
            ref={messageTextareaRef}
            name="message"
            placeholder="Your Message"
            rows={6}
            className={`${getInputClasses(!!errors.message)} resize-none`}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
            disabled={isSubmitting}
          />
          {errors.message && (
            <span
              id="message-error"
              className="absolute bottom-0 left-0 text-sm text-destructive"
              role="alert"
            >
              {errors.message}
            </span>
          )}
        </div>

        <div className="form-item-wrapper">
          <button
            ref={submitButtonRef}
            type="submit"
            disabled={isSubmitting}
            className="group/submitbtn w-full bg-gradient-to-r from-primary to-accent text-dark font-semibold py-3.5 px-6 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-secondary
                        flex items-center justify-center gap-x-2 transform transition-all duration-300 ease-out
                        hover:from-accent hover:to-primary hover:shadow-lg hover:shadow-primary/30 hover:gap-x-3
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
            <FiSend
              className={`w-5 h-5 transition-transform duration-300 ease-out ${
                isSubmitting
                  ? "animate-spin"
                  : "group-hover/submitbtn:rotate-[40deg]"
              }`}
            />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
