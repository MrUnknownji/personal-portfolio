"use client";
import React, { useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ContactInfo from "./ContactSectionComponents/ContactInfo";
import Form from "./ContactSectionComponents/Form";
import ThankYouDialog from "./ThankYouDialog";

gsap.registerPlugin(ScrollTrigger);

const ANIMATION_CONFIG = {
  SECTION: {
    DURATION: 0.8,
    EASE: "power3.out",
    TRIGGER_START: "top 80%",
    TRIGGER_END: "bottom 20%"
  },
  CONTENT: {
    DURATION: 0.8,
    STAGGER: 0.15,
    Y_OFFSET: 50,
    EASE: "power2.out"
  },
  GLOW: {
    DURATION: 0.5,
    EASE: "power2.out",
    OPACITY: {
      START: 0.2,
      END: 0.4
    }
  },
  HOVER: {
    DURATION: 0.3,
    EASE: "power2.out",
    SCALE: 1.02,
    GLOW_OPACITY: 0.3
  }
} as const;

const ContactForm: React.FC = () => {
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (!containerRef.current || !glowRef.current) return;

    gsap.to(containerRef.current, {
      scale: ANIMATION_CONFIG.HOVER.SCALE,
      duration: ANIMATION_CONFIG.HOVER.DURATION,
      ease: ANIMATION_CONFIG.HOVER.EASE,
      force3D: true
    });

    gsap.to(glowRef.current, {
      opacity: ANIMATION_CONFIG.HOVER.GLOW_OPACITY,
      duration: ANIMATION_CONFIG.HOVER.DURATION,
      ease: ANIMATION_CONFIG.HOVER.EASE
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!containerRef.current || !glowRef.current) return;

    gsap.to(containerRef.current, {
      scale: 1,
      duration: ANIMATION_CONFIG.HOVER.DURATION,
      ease: ANIMATION_CONFIG.HOVER.EASE,
      force3D: true
    });

    gsap.to(glowRef.current, {
      opacity: ANIMATION_CONFIG.GLOW.OPACITY.START,
      duration: ANIMATION_CONFIG.HOVER.DURATION,
      ease: ANIMATION_CONFIG.HOVER.EASE
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !glowRef.current) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    gsap.to(glowRef.current, {
      xPercent: -50 + (x / width) * 100,
      yPercent: -50 + (y / height) * 100,
      duration: ANIMATION_CONFIG.GLOW.DURATION,
      ease: ANIMATION_CONFIG.GLOW.EASE,
      overwrite: true
    });
  }, []);

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current || !containerRef.current) return;

    const titleElements = titleRef.current.children;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: ANIMATION_CONFIG.SECTION.TRIGGER_START,
          end: ANIMATION_CONFIG.SECTION.TRIGGER_END,
          once: true
        }
      });

      gsap.set([titleElements, containerRef.current], { 
        opacity: 0,
        y: ANIMATION_CONFIG.CONTENT.Y_OFFSET,
        force3D: true
      });

      tl.to(titleElements, {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.CONTENT.DURATION,
        stagger: ANIMATION_CONFIG.CONTENT.STAGGER,
        ease: ANIMATION_CONFIG.CONTENT.EASE,
        force3D: true
      })
      .to(containerRef.current, {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.CONTENT.DURATION,
        ease: ANIMATION_CONFIG.CONTENT.EASE,
        force3D: true
      }, "-=0.4");
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-24"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-20" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl opacity-20" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="text-center space-y-4 mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
            style={{ willChange: "transform" }}
          >
            Get in Touch
          </h2>
          <p 
            className="text-gray-400 text-lg max-w-2xl mx-auto"
            style={{ willChange: "transform" }}
          >
            {`Let's collaborate and bring your ideas to life. Feel free to reach
            out for any inquiries or opportunities.`}
          </p>
          <div 
            className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent"
            style={{ willChange: "transform" }}
          />
        </div>

        <div
          ref={containerRef}
          className="relative bg-secondary/95 rounded-xl overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div
            ref={glowRef}
            className="absolute w-[40rem] h-[40rem] bg-primary/10 rounded-full filter blur-3xl pointer-events-none"
            style={{ 
              opacity: ANIMATION_CONFIG.GLOW.OPACITY.START,
              transform: 'translate(-50%, -50%)'
            }}
          />

          <div className="relative p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12">
              <ContactInfo />
              <Form onSubmitSuccess={() => setIsThankYouOpen(true)} />
            </div>
          </div>

          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/30 rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/30 rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/30 rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/30 rounded-br-xl" />
        </div>
      </div>

      <ThankYouDialog
        isOpen={isThankYouOpen}
        onClose={() => setIsThankYouOpen(false)}
      />
    </section>
  );
};

export default ContactForm;
