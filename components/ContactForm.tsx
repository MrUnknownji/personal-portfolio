"use client";
import React, { useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import ContactInfo from "./ContactSectionComponents/ContactInfo";
import Form from "./ContactSectionComponents/Form";
import ThankYouDialog from "./ThankYouDialog";

gsap.registerPlugin(ScrollTrigger);

const CONTACT_SECTION_PADDING_Y: number = 24;
const TITLE_ANIMATION_DURATION: number = 0.8;
const CONTAINER_ANIMATION_DURATION: number = 1;
const INITIAL_OPACITY_HIDDEN: number = 0;
const INITIAL_TITLE_Y: number = 30;
const INITIAL_CONTAINER_Y: number = 40;
const INITIAL_SCALE: number = 0.95;
const OPACITY_VISIBLE: number = 1;
const SCALE_VISIBLE: number = 1;
const ANIMATION_EASE: string = "power3.out";
const TITLE_ANIMATION_DELAY: number = 0.4;

const ContactForm: React.FC = () => {
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!isMounted) return;

    const title = sectionRef.current?.querySelector(".title-container");
    const container = containerRef.current;

    if (title && container) {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "center center",
          toggleActions: "play none none reverse",
        },
      });

      timeline
        .fromTo(
          title,
          {
            opacity: INITIAL_OPACITY_HIDDEN,
            y: INITIAL_TITLE_Y,
          },
          {
            opacity: OPACITY_VISIBLE,
            y: 0,
            duration: TITLE_ANIMATION_DURATION,
            ease: ANIMATION_EASE,
          },
        )
        .fromTo(
          container,
          {
            opacity: INITIAL_OPACITY_HIDDEN,
            y: INITIAL_CONTAINER_Y,
            scale: INITIAL_SCALE,
          },
          {
            opacity: OPACITY_VISIBLE,
            y: 0,
            scale: SCALE_VISIBLE,
            duration: CONTAINER_ANIMATION_DURATION,
            ease: ANIMATION_EASE,
          },
          `-=${TITLE_ANIMATION_DELAY}`,
        );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isMounted]);

  const handleFormSubmit = () => {
    setIsThankYouOpen(true);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className={`relative py-${CONTACT_SECTION_PADDING_Y} overflow-hidden`}
      suppressHydrationWarning
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
          suppressHydrationWarning
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
