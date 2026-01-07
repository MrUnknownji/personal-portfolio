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
      backgroundColor: isExpanded ? "rgba(255, 255, 255, 0.03)" : "rgba(255, 255, 255, 0.06)",
      borderColor: isExpanded ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 255, 159, 0.3)",
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
      className="overflow-hidden bg-white/[0.03] rounded-xl border border-white/10 transition-colors duration-300"
    >
      <button
        ref={headerRef}
        onClick={toggleExpand}
        className="w-full px-5 py-4 flex items-center justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <div className={`w-1 h-5 rounded-full bg-primary transition-all duration-300 ${isExpanded ? 'opacity-100 h-5' : 'opacity-40 h-3 group-hover:opacity-80'}`} />
          <div className="relative">
            {/* Invisible spacer to maintain width */}
            <h3 className="text-lg font-medium opacity-0 select-none" aria-hidden="true">
              {title}
            </h3>

            {/* Base Layer (White) */}
            <h3 className={`absolute inset-0 text-lg font-medium text-white/80 group-hover:text-white transition-opacity duration-300 ${isExpanded ? 'opacity-0' : 'opacity-100'}`}>
              {title}
            </h3>

            {/* Gradient Layer (Overlay) */}
            <h3 className={`absolute inset-0 text-lg font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
              {title}
            </h3>
          </div>
        </div>
        <div className={`p-2 rounded-full transition-all duration-300 ${isExpanded ? 'bg-primary/20 text-primary' : 'bg-white/5 text-white/50 group-hover:bg-white/10 group-hover:text-white'}`}>
          <FiChevronDown className="chevron-icon w-5 h-5 transform-gpu" />
        </div>
      </button>

      <div ref={contentWrapperRef} className="overflow-hidden">
        <div ref={contentRef} className="px-5 pb-6 pt-2">
          {isList ? (
            <ul className="space-y-3">
              {(content as string[]).map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-light/80 group/item">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 group-hover/item:bg-primary/80 transition-colors duration-300 flex-shrink-0" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-light/80 text-base leading-relaxed whitespace-pre-wrap">
              {content as string}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
