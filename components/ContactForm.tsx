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
    DURATION: 1,
    EASE: "power3.out",
    Y_OFFSET: 50,
    OPACITY: 0
  },
  TITLE: {
    DURATION: 0.8,
    EASE: "power2.out",
    Y_OFFSET: 30,
    OPACITY: 0,
    SCALE: 0.95,
    DELAY: 0.2
  },
  CONTENT: {
    DURATION: 0.8,
    EASE: "power2.out",
    Y_OFFSET: 30,
    OPACITY: 0,
    SCALE: 0.98,
    DELAY: 0.4
  },
  GRID: {
    DURATION: 0.6,
    STAGGER: 0.2,
    EASE: "power2.out"
  },
  GLOW: {
    DURATION: 1.5,
    EASE: "power2.inOut",
    OPACITY_RANGE: [0.4, 0.6]
  }
} as const;

const ContactForm: React.FC = () => {
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !glowRef.current) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    gsap.to(glowRef.current, {
      x: x - width / 2,
      y: y - height / 2,
      duration: 0.5,
      ease: "power2.out"
    });
  }, []);

  useGSAP(() => {
    if (!sectionRef.current || !titleRef.current || !containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo(
      sectionRef.current,
      {
        y: ANIMATION_CONFIG.SECTION.Y_OFFSET,
        opacity: ANIMATION_CONFIG.SECTION.OPACITY
      },
      {
        y: 0,
        opacity: 1,
        duration: ANIMATION_CONFIG.SECTION.DURATION,
        ease: ANIMATION_CONFIG.SECTION.EASE
      }
    )
    .fromTo(
      titleRef.current,
      {
        y: ANIMATION_CONFIG.TITLE.Y_OFFSET,
        opacity: ANIMATION_CONFIG.TITLE.OPACITY,
        scale: ANIMATION_CONFIG.TITLE.SCALE
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: ANIMATION_CONFIG.TITLE.DURATION,
        ease: ANIMATION_CONFIG.TITLE.EASE
      },
      ANIMATION_CONFIG.TITLE.DELAY
    )
    .fromTo(
      containerRef.current,
      {
        y: ANIMATION_CONFIG.CONTENT.Y_OFFSET,
        opacity: ANIMATION_CONFIG.CONTENT.OPACITY,
        scale: ANIMATION_CONFIG.CONTENT.SCALE
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: ANIMATION_CONFIG.CONTENT.DURATION,
        ease: ANIMATION_CONFIG.CONTENT.EASE
      },
      ANIMATION_CONFIG.CONTENT.DELAY
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-24 overflow-hidden"
    >
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Background glow effects */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={titleRef} className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Get in Touch
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {`Let's collaborate and bring your ideas to life. Feel free to reach
            out for any inquiries or opportunities.`}
          </p>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>

        <div
          ref={containerRef}
          className="relative bg-secondary/95 rounded-xl overflow-hidden transform-gpu"
          onMouseMove={handleMouseMove}
        >
          {/* Container background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div
            ref={glowRef}
            className="absolute w-[40rem] h-[40rem] bg-primary/10 rounded-full filter blur-3xl pointer-events-none opacity-40 transform -translate-x-1/2 -translate-y-1/2"
          />

          <div className="relative p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12">
              <ContactInfo />
              <Form onSubmitSuccess={() => setIsThankYouOpen(true)} />
            </div>
          </div>

          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary rounded-br-xl" />
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
