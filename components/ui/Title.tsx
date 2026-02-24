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
  const subtitleRef = useRef<HTMLDivElement>(null);
  const glowBarRef = useRef<SVGSVGElement>(null);

  const subtitleWords = typeof subtitle === "string" ? subtitle.split(" ") : [];
  const isStringSubtitle = typeof subtitle === "string";

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        if (titleRef.current) {
          gsap.fromTo(
            titleRef.current,
            { opacity: 0, y: 30, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: titleRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }

        if (subtitleRef.current && isStringSubtitle) {
          const words = subtitleRef.current.querySelectorAll(".subtitle-word");
          gsap.fromTo(
            words,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.08,
              ease: "power2.out",
              scrollTrigger: {
                trigger: subtitleRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            },
          );
        } else if (subtitleRef.current) {
          gsap.fromTo(
            subtitleRef.current,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
              delay: 0.2,
              scrollTrigger: {
                trigger: subtitleRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }

        if (glowBarRef.current) {
          gsap.fromTo(
            glowBarRef.current,
            { opacity: 0, scaleX: 0, scaleY: 0.5 },
            {
              opacity: 1,
              scaleX: 1,
              scaleY: 1,
              duration: 0.8,
              delay: 0.3,
              ease: "back.out(1.5)",
              scrollTrigger: {
                trigger: glowBarRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }
      }, containerRef);

      return () => ctx.revert();
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className={`text-center space-y-4 ${className}`}>
      <h2
        ref={titleRef}
        className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4"
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
        <div
          ref={subtitleRef}
          className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed overflow-hidden"
          style={{ opacity: isStringSubtitle ? 1 : 0 }}
        >
          {isStringSubtitle
            ? subtitleWords.map((word, i) => (
                <span
                  key={i}
                  className="subtitle-word inline-block"
                  style={{ opacity: 0 }}
                >
                  {word}
                  {i < subtitleWords.length - 1 ? "\u00A0" : ""}
                </span>
              ))
            : subtitle}
        </div>
      )}

      {showGlowBar && (
        <div className="flex justify-center flex-col items-center mt-6 w-full overflow-hidden">
          <svg
            ref={glowBarRef}
            width="240"
            height="28"
            viewBox="0 0 240 28"
            className="text-primary filter drop-shadow-[0_0_8px_hsl(var(--primary)/0.5)] origin-center"
            style={{ opacity: 0, transform: "scale(0)" }}
          >
            {/* Center Motif */}
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M120 4 L128 14 L120 24 L112 14 Z M120 9 L124 14 L120 19 L116 14 Z"
              fill="currentColor"
            />
            <circle cx="120" cy="1" r="1.5" fill="currentColor" />
            <circle cx="120" cy="27" r="1.5" fill="currentColor" />

            {/* Inner Dots */}
            <circle cx="104" cy="14" r="2" fill="currentColor" />
            <circle cx="136" cy="14" r="2" fill="currentColor" />

            {/* Double Lines Left */}
            <path
              d="M96 12.5 Q 64 20.5 32 12.5"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M96 15.5 Q 64 23.5 32 15.5"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />

            {/* Double Lines Right */}
            <path
              d="M144 12.5 Q 176 20.5 208 12.5"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M144 15.5 Q 176 23.5 208 15.5"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />

            {/* Outer Diamonds */}
            <path d="M26 10 L32 14 L26 18 L20 14 Z" fill="currentColor" />
            <path d="M214 10 L220 14 L214 18 L208 14 Z" fill="currentColor" />

            {/* Outer Dots */}
            <circle cx="12" cy="14" r="1.5" fill="currentColor" />
            <circle cx="228" cy="14" r="1.5" fill="currentColor" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Title;
