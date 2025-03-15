"use client";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
    SCALE: 0.95
  },
  INPUT: {
    FOCUS: {
      DURATION: 0.4,
      EASE: "power2.out",
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
        FOCUSED: "0 0 20px rgba(79, 209, 197, 0.15)"
      }
    }
  },
  BUTTON: {
    HOVER: {
      DURATION: 0.3,
      EASE: "power2.out",
      GAP: {
        NORMAL: "0.5rem",
        HOVER: "1rem"
      },
      ICON_ROTATION: 20,
      BG: {
        NORMAL: "linear-gradient(to right, rgb(79, 209, 197), rgb(64, 175, 255))",
        HOVER: "linear-gradient(to right, rgb(64, 175, 255), rgb(79, 209, 197))"
      }
    }
  },
  SCROLL_TRIGGER: {
    START: "top 80%",
    END: "bottom 20%",
    TOGGLE_ACTIONS: "play none none reverse"
  }
} as const;

const INPUT_CLASSES = {
  base: "w-full bg-gray-900/50 rounded-lg border border-gray-800 text-gray-200 px-4 py-3 outline-none placeholder:text-gray-500",
  error: "border-red-500 bg-red-500/5",
  wrapper: "relative overflow-hidden"
} as const;

const Form: React.FC<FormProps> = ({ onSubmitSuccess }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<(HTMLInputElement | HTMLTextAreaElement)[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const buttonTextRef = useRef<HTMLSpanElement>(null);
  const buttonIconRef = useRef<HTMLSpanElement>(null);

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
      // Animate button on submit
      if (buttonRef.current) {
        gsap.to(buttonRef.current, {
          scale: 0.95,
          duration: 0.2,
          ease: "power2.in",
          yoyo: true,
          repeat: 1
        });
      }

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
    const wrapper = input.parentElement;
    
    gsap.to(input, {
      borderColor: ANIMATION_CONFIG.INPUT.FOCUS.BORDER.FOCUSED,
      backgroundColor: ANIMATION_CONFIG.INPUT.FOCUS.BG.FOCUSED,
      boxShadow: ANIMATION_CONFIG.INPUT.FOCUS.SHADOW.FOCUSED,
      duration: ANIMATION_CONFIG.INPUT.FOCUS.DURATION,
      ease: ANIMATION_CONFIG.INPUT.FOCUS.EASE
    });
    
    // Add a subtle flash effect on the wrapper
    if (wrapper) {
      gsap.fromTo(wrapper, 
        { boxShadow: "0 0 0 0 rgba(79, 209, 197, 0)" },
        { 
          boxShadow: "0 0 10px 2px rgba(79, 209, 197, 0.2)", 
          duration: 0.4,
          ease: "power2.out",
          yoyo: true,
          repeat: 1
        }
      );
    }
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
    if (!buttonRef.current || !buttonTextRef.current || !buttonIconRef.current) return;
    
    const button = buttonRef.current;
    // const buttonText = buttonTextRef.current;
    const buttonIcon = buttonIconRef.current;
    
    // Set initial gap
    gsap.set(button, { 
      background: ANIMATION_CONFIG.BUTTON.HOVER.BG.NORMAL,
      gap: ANIMATION_CONFIG.BUTTON.HOVER.GAP.NORMAL 
    });
    
    const handleMouseEnter = () => {
      gsap.to(button, {
        background: ANIMATION_CONFIG.BUTTON.HOVER.BG.HOVER,
        gap: ANIMATION_CONFIG.BUTTON.HOVER.GAP.HOVER,
        duration: ANIMATION_CONFIG.BUTTON.HOVER.DURATION,
        ease: ANIMATION_CONFIG.BUTTON.HOVER.EASE
      });
      
      gsap.to(buttonIcon, {
        rotate: ANIMATION_CONFIG.BUTTON.HOVER.ICON_ROTATION,
        duration: ANIMATION_CONFIG.BUTTON.HOVER.DURATION,
        ease: "back.out(1.7)"
      });
    };
    
    const handleMouseLeave = () => {
      gsap.to(button, {
        background: ANIMATION_CONFIG.BUTTON.HOVER.BG.NORMAL,
        gap: ANIMATION_CONFIG.BUTTON.HOVER.GAP.NORMAL,
        duration: ANIMATION_CONFIG.BUTTON.HOVER.DURATION,
        ease: ANIMATION_CONFIG.BUTTON.HOVER.EASE
      });
      
      gsap.to(buttonIcon, {
        rotate: 0,
        duration: ANIMATION_CONFIG.BUTTON.HOVER.DURATION,
        ease: "back.out(1.7)"
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
    if (!formRef.current || !formContainerRef.current) return;

    // Set initial state for all form elements
    const formElements = formRef.current.querySelectorAll(".form-item-wrapper");
    gsap.set(formElements, {
      y: ANIMATION_CONFIG.FORM_ITEMS.Y_OFFSET,
      opacity: ANIMATION_CONFIG.FORM_ITEMS.OPACITY,
      rotationZ: ANIMATION_CONFIG.FORM_ITEMS.ROTATION,
      scale: ANIMATION_CONFIG.FORM_ITEMS.SCALE
    });
    
    // Create the main timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: formContainerRef.current,
        start: ANIMATION_CONFIG.SCROLL_TRIGGER.START,
        end: ANIMATION_CONFIG.SCROLL_TRIGGER.END,
        toggleActions: ANIMATION_CONFIG.SCROLL_TRIGGER.TOGGLE_ACTIONS,
        markers: false
      }
    });
    
    // Staggered entrance animation for form elements
    tl.to(formElements, {
      y: 0,
      opacity: 1,
      rotationZ: 0,
      scale: 1,
      duration: ANIMATION_CONFIG.FORM_ITEMS.DURATION,
      stagger: ANIMATION_CONFIG.FORM_ITEMS.STAGGER,
      ease: ANIMATION_CONFIG.FORM_ITEMS.EASE,
      clearProps: "transform"
    });
    
    // Add a subtle pulse animation to the button
    if (buttonRef.current) {
      tl.to(buttonRef.current, {
        boxShadow: "0 0 20px 5px rgba(79, 209, 197, 0.2)",
        duration: 1,
        repeat: 1,
        yoyo: true,
        ease: "sine.inOut"
      }, "-=0.5");
    }

    // Add a subtle floating animation to inputs
    const inputWrappers = formRef.current.querySelectorAll(".form-item-wrapper:not(:last-child)");
    tl.to(inputWrappers, {
      y: (i) => Math.sin(i * Math.PI) * 5,
      duration: 1.5,
      ease: "sine.inOut",
      stagger: 0.1,
      repeat: -1,
      yoyo: true
    }, "-=1");

    return () => {
      // Clean up ScrollTrigger instances when component unmounts
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={formContainerRef} className="w-full">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div className={`${INPUT_CLASSES.wrapper} form-item-wrapper`}>
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

        <div className={`${INPUT_CLASSES.wrapper} form-item-wrapper`}>
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

        <div className={`${INPUT_CLASSES.wrapper} form-item-wrapper`}>
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

        <div className="form-item-wrapper">
          <button
            ref={buttonRef}
            type="submit"
            className="w-full text-gray-900 font-semibold py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 flex items-center justify-center"
            style={{ willChange: "transform, background, gap" }}
          >
            <span ref={buttonTextRef}>Send Message</span>
            <span ref={buttonIconRef} className="inline-block">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
