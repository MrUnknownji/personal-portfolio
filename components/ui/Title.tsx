"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { HyperText } from "@/components/ui/HyperText";

gsap.registerPlugin(ScrollTrigger);

interface TitleProps {
  title: string;
  subtitle?: string | React.ReactNode;
  showGlowBar?: boolean;
  className?: string;
}

const Title: React.FC<TitleProps> = ({
  title,
  subtitle,
  showGlowBar = false,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const glowBarRef = useRef<HTMLDivElement>(null);

  const subtitleWords = typeof subtitle === "string" ? subtitle.split(" ") : [];
  const isStringSubtitle = typeof subtitle === "string";

  useGSAP(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out",
            scrollTrigger: { trigger: titleRef.current, start: "top 80%", toggleActions: "play none none reverse" }
          }
        );
      }

      if (subtitleRef.current && isStringSubtitle) {
        const words = subtitleRef.current.querySelectorAll(".subtitle-word");
        gsap.fromTo(words,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out",
            scrollTrigger: { trigger: subtitleRef.current, start: "top 80%", toggleActions: "play none none reverse" }
          }
        );
      } else if (subtitleRef.current) {
        gsap.fromTo(subtitleRef.current,
          { opacity: 0 },
          {
            opacity: 1, duration: 0.3,
            scrollTrigger: { trigger: subtitleRef.current, start: "top 80%", toggleActions: "play none none reverse" }
          }
        );
      }

      if (glowBarRef.current) {
        gsap.fromTo(glowBarRef.current,
          { opacity: 0, scaleX: 0 },
          {
            opacity: 1, scaleX: 1, duration: 0.6, delay: 0.3, ease: "power2.out",
            scrollTrigger: { trigger: glowBarRef.current, start: "top 80%", toggleActions: "play none none reverse" }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={`text-center space-y-4 ${className}`}>
      <h2
        ref={titleRef}
        className="text-3xl sm:text-4xl lg:text-5xl font-bold"
        style={{ opacity: 0 }}
      >
        <HyperText
          duration={1000}
          delay={200}
          animateOnHover={true}
          startOnView={true}
          className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent pb-2"
        >
          {title}
        </HyperText>
      </h2>

      {subtitle && (
        <p
          ref={subtitleRef}
          className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg overflow-hidden"
          style={{ opacity: isStringSubtitle ? 1 : 0 }}
        >
          {isStringSubtitle ? (
            subtitleWords.map((word, i) => (
              <span
                key={i}
                className="subtitle-word inline-block"
                style={{ opacity: 0 }}
              >
                {word}{i < subtitleWords.length - 1 ? "\u00A0" : ""}
              </span>
            ))
          ) : (
            subtitle
          )}
        </p>
      )}

      {showGlowBar && (
        <div
          ref={glowBarRef}
          className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent origin-center"
          style={{ opacity: 0, transform: "scaleX(0)" }}
        />
      )}
    </div>
  );
};

export default Title;
