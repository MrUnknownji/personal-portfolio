"use client";
import React, { useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ContactInfo from "./ContactSectionComponents/ContactInfo";
import Form from "./ContactSectionComponents/Form";
import ThankYouDialog from "./ThankYouDialog";
import Title from "./ui/Title";

gsap.registerPlugin(ScrollTrigger);

const ANIMATION_CONFIG = {
  SECTION_ENTRANCE: {
    DURATION: 0.8,
    EASE: "power3.out",
    Y_OFFSET: 50,
    OPACITY: 0,
    DELAY: 0.2,
  },
  SCROLL_TRIGGER: {
    START: "top 80%",
    END: "bottom center",
    TOGGLE_ACTIONS: "play none none reverse",
  },
} as const;

const ContactForm: React.FC = () => {
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      gsap.set(containerRef.current, {
        opacity: ANIMATION_CONFIG.SECTION_ENTRANCE.OPACITY,
        y: ANIMATION_CONFIG.SECTION_ENTRANCE.Y_OFFSET,
        force3D: true,
        willChange: "transform, opacity",
      });

      gsap.to(containerRef.current, {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.SECTION_ENTRANCE.DURATION,
        ease: ANIMATION_CONFIG.SECTION_ENTRANCE.EASE,
        delay: ANIMATION_CONFIG.SECTION_ENTRANCE.DELAY,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: ANIMATION_CONFIG.SCROLL_TRIGGER.START,
          end: ANIMATION_CONFIG.SCROLL_TRIGGER.END,
          toggleActions: ANIMATION_CONFIG.SCROLL_TRIGGER.TOGGLE_ACTIONS,
          markers: false,
        },
        clearProps: "all",
        force3D: true,
      });
    },
    { scope: sectionRef },
  );

  const handleFormSubmitSuccess = () => {
    setIsThankYouOpen(true);
  };

  const handleCloseDialog = () => {
    setIsThankYouOpen(false);
  };

  return (
    <section ref={sectionRef} id="contact" className="relative py-20 md:py-28">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Title
          title="Get in Touch"
          subtitle="Let's collaborate and bring your ideas to life. Feel free to reach out!"
          showGlowBar={true}
          className="mb-12 md:mb-16 text-center"
        />

        <div
          ref={containerRef}
          className="group/container relative bg-secondary/80 backdrop-blur-sm rounded-xl overflow-hidden transform-gpu border border-neutral/30"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-70 pointer-events-none" />

          {/* Adjusted padding here: less horizontal padding on small screens */}
          <div className="relative px-4 py-6 sm:px-6 sm:py-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-16">
              <ContactInfo />
              <Form onSubmitSuccess={handleFormSubmitSuccess} />
            </div>
          </div>

          <div
            className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent rounded-tl-xl
                                   transition-colors duration-300 ease-out group-hover/container:border-primary"
          />
          <div
            className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent rounded-tr-xl
                                   transition-colors duration-300 ease-out group-hover/container:border-primary"
          />
          <div
            className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent rounded-bl-xl
                                   transition-colors duration-300 ease-out group-hover/container:border-primary"
          />
          <div
            className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent rounded-br-xl
                                   transition-colors duration-300 ease-out group-hover/container:border-primary"
          />
        </div>
      </div>

      <ThankYouDialog
        isOpen={isThankYouOpen}
        onClose={handleCloseDialog}
        email="sandeepkhati788@gmail.com"
      />
    </section>
  );
};

export default ContactForm;
