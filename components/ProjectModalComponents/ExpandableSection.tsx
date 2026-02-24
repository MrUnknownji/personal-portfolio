import React, { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FiChevronDown } from "react-icons/fi";

interface ExpandableSectionProps {
  title: string;
  content: string | string[];
  isList?: boolean;
}

const ANIMATION_CONFIG = {
  DURATION: 0.35,
  EASE: "power3.inOut",
} as const;

export const ExpandableSection = ({
  title,
  content,
  isList = false,
}: ExpandableSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLButtonElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  useGSAP(() => {
    gsap.set(contentWrapperRef.current, { height: 0, opacity: 0 });
    gsap.set(containerRef.current, { height: headerRef.current?.offsetHeight });
  }, []);

  const toggleExpand = contextSafe(() => {
    const targetHeight = isExpanded
      ? headerRef.current?.offsetHeight
      : (headerRef.current?.offsetHeight ?? 0) +
        (contentRef.current?.offsetHeight ?? 0);
    const targetOpacity = isExpanded ? 0 : 1;
    const targetRotation = isExpanded ? 0 : 180;

    gsap.to(containerRef.current, {
      height: targetHeight,
      boxShadow: "none",
      duration: ANIMATION_CONFIG.DURATION,
      ease: ANIMATION_CONFIG.EASE,
      overwrite: true,
    });

    gsap.to(contentWrapperRef.current, {
      height: isExpanded ? 0 : "auto",
      opacity: targetOpacity,
      duration: ANIMATION_CONFIG.DURATION,
      ease: ANIMATION_CONFIG.EASE,
      overwrite: true,
    });

    gsap.to(headerRef.current?.querySelector(".chevron-icon") || null, {
      rotation: targetRotation,
      duration: ANIMATION_CONFIG.DURATION,
      ease: ANIMATION_CONFIG.EASE,
      overwrite: true,
    });

    setIsExpanded(!isExpanded);
  });

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden rounded-xl shadow-md transition-colors duration-300 border ${isExpanded ? "bg-primary/5 border-primary/40" : "bg-card border-border"}`}
    >
      <button
        ref={headerRef}
        onClick={toggleExpand}
        className="w-full px-5 py-4 flex items-center justify-between group focus:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-[3px] rounded-full bg-primary transition-all duration-300 ${isExpanded ? "opacity-100 h-6" : "opacity-0 h-0"}`}
          />
          <div className="relative">
            {/* Invisible spacer to maintain width */}
            <h3
              className="text-lg font-medium opacity-0 select-none"
              aria-hidden="true"
            >
              {title}
            </h3>

            {/* Base Layer (Theme Default) */}
            <h3
              className={`absolute inset-0 text-lg font-medium text-foreground/80 group-hover:text-foreground transition-opacity duration-300 ${isExpanded ? "opacity-0" : "opacity-100"}`}
            >
              {title}
            </h3>

            {/* Expanded Layer (Primary Color) */}
            <h3
              className={`absolute inset-0 text-lg font-medium text-primary transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0"}`}
            >
              {title}
            </h3>
          </div>
        </div>
        <div
          className={`p-2 rounded-full transition-all duration-300 ${isExpanded ? "bg-primary/10 text-primary" : "bg-background text-foreground/50 group-hover:bg-background/80 group-hover:text-foreground"}`}
        >
          <FiChevronDown className="chevron-icon w-5 h-5 transform-gpu" />
        </div>
      </button>

      <div ref={contentWrapperRef} className="overflow-hidden">
        <div ref={contentRef} className="px-5 pb-6 pt-2">
          {isList && Array.isArray(content) ? (
            <ul className="space-y-3">
              {content.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-muted-foreground group/item"
                >
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary/50 group-hover/item:bg-primary transition-colors duration-300 flex-shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-muted-foreground text-base leading-relaxed whitespace-pre-wrap">
              {content as string}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
