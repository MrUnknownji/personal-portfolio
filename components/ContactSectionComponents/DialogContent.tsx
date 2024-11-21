import React, { useRef, useEffect } from "react";
import gsap from "gsap";

const DialogContent: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const icon = iconRef.current;
    const contentElements =
      contentRef.current?.querySelectorAll(".animate-content");

    if (icon && contentElements) {
      const tl = gsap.timeline();

      tl.fromTo(
        icon,
        {
          scale: 0,
          rotate: -180,
        },
        {
          scale: 1,
          rotate: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
      ).fromTo(
        Array.from(contentElements),
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.2",
      );
    }
  }, []);

  return (
    <div ref={contentRef} className="p-6 sm:p-8">
      <div className="flex items-center mb-6">
        <div
          className="w-12 h-12 rounded-full bg-primary/10
          flex items-center justify-center mr-4"
        >
          <svg
            ref={iconRef}
            className="w-6 h-6 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3
          className="animate-content text-3xl font-bold
          bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
        >
          Thank You!
        </h3>
      </div>

      <div className="space-y-4">
        <p className="animate-content text-xl text-accent">
          Your message has been successfully sent.
        </p>
        <p className="animate-content text-gray-300 leading-relaxed">
          {`I appreciate you taking the time to reach out. I'll get back to you as
            soon as possible.`}
        </p>
      </div>
    </div>
  );
};

export default DialogContent;
