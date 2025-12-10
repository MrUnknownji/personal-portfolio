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
  const glowRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !glowRef.current) return;

      // Initial Entrance Animation
      gsap.fromTo(
        containerRef.current,
        {
          y: 100,
          opacity: 0,
          rotateX: 10,
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom center",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 3D Tilt Effect
      const container = containerRef.current;
      const handleMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -2; // Max rotation deg
        const rotateY = ((x - centerX) / centerX) * 2;

        gsap.to(container, {
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 0.5,
          ease: "power2.out",
          transformPerspective: 1000,
        });

        // Move glow
        gsap.to(glowRef.current, {
          x: x,
          y: y,
          duration: 0.4, // Lag for smoothness
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        gsap.to(container, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.5,
          ease: "power2.out",
        });
      };

      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
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
      {/* Background Ambient Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 perspective-1000">
        <Title
          title="Get in Touch"
          subtitle={
            <>
              <span className="inline-block">
                &quot;Information flow is what the Internet is about.
              </span>
              <span className="inline-block">
                Information sharing is power.&quot;
              </span>
              <span className="block mt-2 text-sm text-neutral-500 font-medium">
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
                     border border-white/[0.08]
                     shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Mouse Follow Glow */}
          <div
            ref={glowRef}
            className="absolute w-[500px] h-[500px] bg-primary/10 rounded-full blur-[80px] pointer-events-none -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/container:opacity-100 transition-opacity duration-500"
            style={{ top: 0, left: 0 }}
          />

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03] pointer-events-none" />

          <div className="relative px-6 py-10 sm:px-10 sm:py-12 md:p-16 z-10">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 lg:gap-24">
              <ContactInfo />
              <Form onSubmitSuccess={handleFormSubmitSuccess} />
            </div>
          </div>

          {/* Premium Borders */}
          <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none" />
          <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none scale-[0.99]" />
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
