"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface FormProps {
  onSubmitSuccess: () => void;
}

const ANIMATION_CONFIG = {
  FORM_ITEMS: {
    DURATION: 0.6,
    STAGGER: 0.1,
    Y_OFFSET: 20,
    OPACITY: 0,
    EASE: "linear"
  },
  INPUT: {
    FOCUS: {
      DURATION: 0.3,
      EASE: "linear",
      BORDER: {
        NORMAL: "rgb(31, 41, 55)",
        FOCUSED: "rgb(79, 209, 197)"
      },
      BG: {
        NORMAL: "rgba(17, 24, 39, 0.5)",
        FOCUSED: "rgba(17, 24, 39, 0.7)"
      },
      SHADOW: {
        NORMAL: "none",
        FOCUSED: "0 0 20px rgba(79, 209, 197, 0.1)"
      }
    }
  },
  BUTTON: {
    HOVER: {
      DURATION: 0.3,
      Y_OFFSET: -4,
      EASE: "linear",
      SHADOW: {
        NORMAL: "none",
        HOVER: "0 10px 15px -3px rgba(79, 209, 197, 0.2)"
      },
      BORDER_GLOW: {
        NORMAL: "0 0 0 0 rgba(79, 209, 197, 0)",
        HOVER: "0 0 10px 2px rgba(79, 209, 197, 0.3)"
      }
    }
  }
} as const;

const INPUT_CLASSES = {
  base: "w-full bg-gray-900/50 rounded-lg border border-gray-800 text-gray-200 px-4 py-3 outline-none placeholder:text-gray-500",
  error: "border-red-500 bg-red-500/5",
  wrapper: "relative"
} as const;

const Form: React.FC<FormProps> = ({ onSubmitSuccess }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const inputRefs = useRef<(HTMLInputElement | HTMLTextAreaElement)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!inputRefs.current[0]?.value) {
      newErrors.category = "Category is required";
    }

    if (!inputRefs.current[1]?.value) {
      newErrors.subject = "Subject is required";
    }

    if (!inputRefs.current[2]?.value) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const category = inputRefs.current[0]?.value || '';
      const subject = inputRefs.current[1]?.value || '';
      const message = inputRefs.current[2]?.value || '';

      const mailtoLink = `mailto:sandeepkhati788@gmail.com?subject=${encodeURIComponent(`[${category}] ${subject}`)}&body=${encodeURIComponent(message)}`;
      window.open(mailtoLink, '_blank');

      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmitSuccess();
      if (formRef.current) formRef.current.reset();
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleFocus = useCallback((index: number) => {
    if (!inputRefs.current[index]) return;
    
    const input = inputRefs.current[index];
    
    gsap.to(input, {
      borderColor: ANIMATION_CONFIG.INPUT.FOCUS.BORDER.FOCUSED,
      backgroundColor: ANIMATION_CONFIG.INPUT.FOCUS.BG.FOCUSED,
      boxShadow: ANIMATION_CONFIG.INPUT.FOCUS.SHADOW.FOCUSED,
      duration: ANIMATION_CONFIG.INPUT.FOCUS.DURATION,
      ease: ANIMATION_CONFIG.INPUT.FOCUS.EASE
    });
  }, []);

  const handleBlur = useCallback((index: number) => {
    if (!inputRefs.current[index]) return;
    
    const input = inputRefs.current[index];
    
    gsap.to(input, {
      borderColor: ANIMATION_CONFIG.INPUT.FOCUS.BORDER.NORMAL,
      backgroundColor: ANIMATION_CONFIG.INPUT.FOCUS.BG.NORMAL,
      boxShadow: ANIMATION_CONFIG.INPUT.FOCUS.SHADOW.NORMAL,
      duration: ANIMATION_CONFIG.INPUT.FOCUS.DURATION,
      ease: ANIMATION_CONFIG.INPUT.FOCUS.EASE
    });
  }, []);

  useEffect(() => {
    if (!buttonRef.current) return;
    
    const button = buttonRef.current;
    
    const handleMouseEnter = () => {
      gsap.to(button, {
        y: ANIMATION_CONFIG.BUTTON.HOVER.Y_OFFSET,
        boxShadow: ANIMATION_CONFIG.BUTTON.HOVER.SHADOW.HOVER,
        filter: `drop-shadow(${ANIMATION_CONFIG.BUTTON.HOVER.BORDER_GLOW.HOVER})`,
        duration: ANIMATION_CONFIG.BUTTON.HOVER.DURATION,
        ease: ANIMATION_CONFIG.BUTTON.HOVER.EASE
      });
    };
    
    const handleMouseLeave = () => {
      gsap.to(button, {
        y: 0,
        boxShadow: ANIMATION_CONFIG.BUTTON.HOVER.SHADOW.NORMAL,
        filter: `drop-shadow(${ANIMATION_CONFIG.BUTTON.HOVER.BORDER_GLOW.NORMAL})`,
        duration: ANIMATION_CONFIG.BUTTON.HOVER.DURATION,
        ease: ANIMATION_CONFIG.BUTTON.HOVER.EASE
      });
    };
    
    button.addEventListener("mouseenter", handleMouseEnter);
    button.addEventListener("mouseleave", handleMouseLeave);
    
    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  useGSAP(() => {
    if (!formRef.current) return;

    const formElements = formRef.current.querySelectorAll("input, textarea, button");
    
    const tl = gsap.timeline();
    
    tl.fromTo(
      formElements,
      {
        y: ANIMATION_CONFIG.FORM_ITEMS.Y_OFFSET,
        opacity: ANIMATION_CONFIG.FORM_ITEMS.OPACITY
      },
      {
        y: 0,
        opacity: 1,
        duration: ANIMATION_CONFIG.FORM_ITEMS.DURATION,
        stagger: ANIMATION_CONFIG.FORM_ITEMS.STAGGER,
        ease: ANIMATION_CONFIG.FORM_ITEMS.EASE
      }
    );
  }, []);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div className={INPUT_CLASSES.wrapper}>
        <input
          ref={el => {
            if (el) inputRefs.current[0] = el;
          }}
          type="text"
          placeholder="Category"
          className={`${INPUT_CLASSES.base} ${errors.category ? INPUT_CLASSES.error : ""}`}
          onFocus={() => handleFocus(0)}
          onBlur={() => handleBlur(0)}
        />
        {errors.category && (
          <span className="absolute -bottom-5 left-0 text-sm text-red-500">
            {errors.category}
          </span>
        )}
      </div>

      <div className={INPUT_CLASSES.wrapper}>
        <input
          ref={el => {
            if (el) inputRefs.current[1] = el;
          }}
          type="text"
          placeholder="Subject"
          className={`${INPUT_CLASSES.base} ${errors.subject ? INPUT_CLASSES.error : ""}`}
          onFocus={() => handleFocus(1)}
          onBlur={() => handleBlur(1)}
        />
        {errors.subject && (
          <span className="absolute -bottom-5 left-0 text-sm text-red-500">
            {errors.subject}
          </span>
        )}
      </div>

      <div className={INPUT_CLASSES.wrapper}>
        <textarea
          ref={el => {
            if (el) inputRefs.current[2] = el;
          }}
          placeholder="Your Message"
          rows={6}
          className={`${INPUT_CLASSES.base} resize-none ${
            errors.message ? INPUT_CLASSES.error : ""
          }`}
          onFocus={() => handleFocus(2)}
          onBlur={() => handleBlur(2)}
        />
        {errors.message && (
          <span className="absolute -bottom-5 left-0 text-sm text-red-500">
            {errors.message}
          </span>
        )}
      </div>

      <button
        ref={buttonRef}
        type="submit"
        className="w-full bg-gradient-to-r from-primary to-accent text-gray-900 font-semibold py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        Send Message
      </button>
    </form>
  );
};

export default Form;
