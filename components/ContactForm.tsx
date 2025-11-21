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
    DURATION: 1,
    EASE: "power3.out",
    Y_OFFSET: 40,
    OPACITY: 0,
    DELAY: 0.1,
  },
  SCROLL_TRIGGER: {
    START: "top 80%",
    END: "bottom center",
    TOGGLE_ACTIONS: "play none none none",
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
    <section ref={sectionRef} id="contact" className="relative py-24 md:py-32">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Title
          title="Get in Touch"
          subtitle={
            <>
              <span className="inline-block">
                &quot;Information flow is what the Internet is about.
              </span>
              <span className="inline-block">
                Information sharing is power.
              </span>
              <span className="inline-block">
                If you don&apos;t share your ideas,
              </span>
              <span className="inline-block">
                smart people can&apos;t do anything about them,
              </span>
              <span className="inline-block">
                and you&apos;ll remain anonymous and powerless.&quot;
              </span>
              <span className="inline-block">
                - Vint Cerf
              </span>
            </>
          }
          showGlowBar={true}
          className="mb-16 md:mb-20 text-center"
        />

        <div
          ref={containerRef}
          className="group/container relative rounded-3xl overflow-hidden
                     bg-white/[0.02] backdrop-blur-2xl
                     shadow-[0_0_100px_-30px_rgba(0,0,0,0.5)] border border-white/[0.05]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-30 pointer-events-none" />

          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full filter blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full filter blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

          <div className="relative px-6 py-10 sm:px-10 sm:py-12 md:p-16">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-24">
              <ContactInfo />
              <Form onSubmitSuccess={handleFormSubmitSuccess} />
            </div>
          </div>

          {/* Corner accents */}
          <div
            className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-white/10 rounded-tl-3xl
                                   transition-all duration-500 ease-out group-hover/container:border-primary/30 group-hover/container:w-24 group-hover/container:h-24"
          />
          <div
            className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-white/10 rounded-tr-3xl
                                   transition-all duration-500 ease-out group-hover/container:border-primary/30 group-hover/container:w-24 group-hover/container:h-24"
          />
          <div
            className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-white/10 rounded-bl-3xl
                                   transition-all duration-500 ease-out group-hover/container:border-primary/30 group-hover/container:w-24 group-hover/container:h-24"
          />
          <div
            className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-white/10 rounded-br-3xl
                                   transition-all duration-500 ease-out group-hover/container:border-primary/30 group-hover/container:w-24 group-hover/container:h-24"
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
