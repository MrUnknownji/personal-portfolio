"use client";
import React, { useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import ContactInfo from "./ContactSectionComponents/ContactInfo";
import Form from "./ContactSectionComponents/Form";
import ThankYouDialog from "./ThankYouDialog";

gsap.registerPlugin(ScrollTrigger);

const ContactForm: React.FC = () => {
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const title = sectionRef.current.querySelector(".title-container");
      const container = containerRef.current;
      const contactInfo = container?.querySelector(".contact-info");
      const form = container?.querySelector("form");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom bottom",
          toggleActions: "play none none reverse",
        },
      });

      if (title) {
        tl.fromTo(
          title,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        );
      }

      if (container) {
        tl.fromTo(
          container,
          {
            opacity: 0,
            y: 40,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4",
        );
      }

      if (contactInfo) {
        tl.fromTo(
          contactInfo,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.7, ease: "power3.out" },
          "-=0.2",
        );
      }

      if (form) {
        const formElements = form.querySelectorAll("input, textarea, button");
        tl.fromTo(
          formElements,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power3.out",
          },
          "-=0.5",
        );
      }

      return () => tl.kill();
    },
    { scope: sectionRef },
  );

  const handleFormSubmit = () => {
    setIsThankYouOpen(true);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`relative py-24 overflow-hidden`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="title-container text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary">
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
          className="relative bg-secondary/95 rounded-xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

          <div className="relative p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12">
              <ContactInfo />
              <Form onSubmitSuccess={handleFormSubmit} />
            </div>
          </div>

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
