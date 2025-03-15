"use client";
import React, { useState, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ContactInfo from "./ContactSectionComponents/ContactInfo";
import Form from "./ContactSectionComponents/Form";
import ThankYouDialog from "./ThankYouDialog";
import Title from "./ui/Title";

gsap.registerPlugin(ScrollTrigger);

const ANIMATION_CONFIG = {
  SECTION: {
    DURATION: 0.8,
    EASE: "linear",
    TRIGGER_START: "top 80%",
    TRIGGER_END: "bottom 20%"
  },
  CONTENT: {
    DURATION: 0.8,
    STAGGER: 0.15,
    Y_OFFSET: 50,
    EASE: "linear"
  },
  BORDER: {
    DURATION: 0.4,
    EASE: "linear"
  }
} as const;

const ContactForm: React.FC = () => {
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const borderRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);

  const handleMouseEnter = useCallback(() => {
    if (!containerRef.current) return;

    borderRefs.current.forEach(border => {
      if (border) {
        gsap.to(border, {
          borderColor: "rgba(79, 209, 197, 0.5)",
          duration: ANIMATION_CONFIG.BORDER.DURATION,
          ease: ANIMATION_CONFIG.BORDER.EASE
        });
      }
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!containerRef.current) return;

    borderRefs.current.forEach(border => {
      if (border) {
        gsap.to(border, {
          borderColor: "rgba(79, 209, 197, 0.3)",
          duration: ANIMATION_CONFIG.BORDER.DURATION,
          ease: ANIMATION_CONFIG.BORDER.EASE
        });
      }
    });
  }, []);

  useGSAP(() => {
    if (!sectionRef.current || !containerRef.current) return;

    gsap.set(containerRef.current, { 
      opacity: 0,
      y: ANIMATION_CONFIG.CONTENT.Y_OFFSET,
      force3D: true
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: ANIMATION_CONFIG.SECTION.TRIGGER_START,
        end: ANIMATION_CONFIG.SECTION.TRIGGER_END,
        toggleActions: "play none none reverse",
        markers: false
      }
    }).to(containerRef.current, {
      opacity: 1,
      y: 0,
      duration: ANIMATION_CONFIG.CONTENT.DURATION,
      ease: ANIMATION_CONFIG.CONTENT.EASE,
      force3D: true
    }, "+=0.4");
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-20"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Title 
          title="Get in Touch"
          subtitle={`Let's collaborate and bring your ideas to life. Feel free to reach out for any inquiries or opportunities.`}
          showGlowBar={true}
          className="mb-16"
        />

        <div
          ref={containerRef}
          className="relative bg-secondary/95 rounded-xl overflow-hidden transform-gpu"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

          <div className="relative p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12">
              <ContactInfo />
              <Form onSubmitSuccess={() => setIsThankYouOpen(true)} />
            </div>
          </div>

          <div 
            ref={(el: HTMLDivElement | null) => { borderRefs.current[0] = el }}
            className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary/30 rounded-tl-xl" 
          />
          <div 
            ref={(el: HTMLDivElement | null): void => { borderRefs.current[1] = el }}
            className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary/30 rounded-tr-xl" 
          />
          <div 
            ref={(el: HTMLDivElement | null): void => { borderRefs.current[2] = el }}
            className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary/30 rounded-bl-xl" 
          />
          <div 
            ref={(el: HTMLDivElement | null): void => { borderRefs.current[3] = el }}
            className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary/30 rounded-br-xl" 
          />
        </div>
      </div>

      <ThankYouDialog
        isOpen={isThankYouOpen}
        onClose={() => setIsThankYouOpen(false)}
        email="sandeepkhati788@gmail.com"
      />
    </section>
  );
};

export default ContactForm;
