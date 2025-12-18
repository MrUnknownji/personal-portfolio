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

const ContactForm: React.FC = () => {
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Simple entrance animation
      gsap.fromTo(
        containerRef.current,
        {
          y: 60,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  const handleFormSubmitSuccess = () => {
    setIsThankYouOpen(true);
  };

  const handleCloseDialog = () => {
    setIsThankYouOpen(false);
  };

  return (
    <section ref={sectionRef} id="contact" className="relative py-24 md:py-32 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Title
          title="Get in Touch"
          subtitle='"Information flow is what the Internet is about. Information sharing is power." - Vint Cerf'
          showGlowBar={true}
          className="mb-16 md:mb-20 text-center"
        />

        <div
          ref={containerRef}
          className="relative rounded-2xl overflow-hidden
                     bg-card/95
                     border border-border
                     shadow-xl"
        >
          {/* Subtle top gradient accent */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div className="relative px-6 py-10 sm:px-10 sm:py-12 md:p-16">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-24">
              <ContactInfo />
              <Form onSubmitSuccess={handleFormSubmitSuccess} />
            </div>
          </div>
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
