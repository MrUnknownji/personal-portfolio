import React, { useState, useRef, useCallback } from "react";
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
    gsap.to(".chevron-icon", {
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
      className="overflow-hidden bg-neutral/20 rounded-xl border border-neutral/30 backdrop-blur-sm transition-colors duration-300 hover:border-neutral/50"
    >
      <button
        ref={headerRef}
        onClick={toggleExpand}
        className="w-full px-4 py-4 flex items-center justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-t-xl"
        aria-expanded={isExpanded}
      >
        <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent cursor-pointer text-left">
          {title}
        </h3>
        <FiChevronDown className="chevron-icon w-5 h-5 text-primary flex-shrink-0 ml-2 transform-gpu" />
      </button>

      <div ref={contentWrapperRef} className="overflow-hidden">
        <div ref={contentRef} className="px-4 pb-4 pt-1 space-y-2">
          {isList ? (
            <ul className="space-y-1.5 list-none">
              {(content as string[]).map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-muted">
                  <span className="text-primary/80 mt-1 text-xs">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted whitespace-pre-wrap text-sm leading-relaxed">
              {content as string}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
