import React, { useState, useRef, useCallback, useEffect } from "react";
import { Dialog } from "@/components/ui/Dialog";
import gsap from "gsap";
import { FiX, FiChevronDown } from "react-icons/fi";

interface ExpandableSectionProps {
  title: string;
  content: string | string[];
  isList?: boolean;
}

const ANIMATION_CONFIG = {
  EXPAND: {
    DURATION: 0.4,
    EASE: "power2.out"
  },
  COLLAPSE: {
    DURATION: 0.3,
    EASE: "power2.inOut"
  },
  CONTENT: {
    STAGGER: 0.05,
    DURATION: 0.3,
    EASE: "power2.out"
  },
  CHEVRON: {
    DURATION: 0.3,
    EASE: "power2.out"
  }
} as const;

export const ExpandableSection = ({ title, content, isList = false }: ExpandableSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const dialogRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    // Capture ref values inside the effect to avoid React Hook warnings
    const contentElement = contentRef.current;
    const containerElement = containerRef.current;
    const chevronElement = chevronRef.current;
    const timeline = timelineRef.current;
    
    // Set initial state
    if (contentElement && contentElement.children.length > 0) {
      gsap.set(Array.from(contentElement.children), { opacity: 0 });
    }
    
    return () => {
      // Kill any existing timeline
      if (timeline) {
        timeline.kill();
      }
      
      // Reset all animated elements
      if (containerElement) {
        gsap.set(containerElement, { clearProps: "all" });
      }
      if (chevronElement) {
        gsap.set(chevronElement, { clearProps: "all" });
      }
      if (contentElement && contentElement.children.length > 0) {
        gsap.set(Array.from(contentElement.children), { clearProps: "all" });
      }
    };
  }, []);

  const toggleExpand = useCallback(() => {
    if (!contentRef.current || !containerRef.current || !chevronRef.current || isAnimating) return;

    setIsAnimating(true);
    
    // Kill any existing timeline to prevent conflicts
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    timelineRef.current = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        
        // If we're collapsing, clear transforms
        if (isExpanded && contentRef.current && contentRef.current.children.length > 0) {
          gsap.set(Array.from(contentRef.current.children), { clearProps: "all", opacity: 0 });
        }
        
        // Clear the timeline reference after completion
        timelineRef.current = null;
      },
      defaults: {
        overwrite: "auto"
      }
    });

    const contentHeight = contentRef.current.scrollHeight;
    const containerHeight = containerRef.current.clientHeight;

    if (!isExpanded) {
      // Expanding
      timelineRef.current
        .to(containerRef.current, {
          height: containerHeight + contentHeight + "px",
          duration: ANIMATION_CONFIG.EXPAND.DURATION,
          ease: ANIMATION_CONFIG.EXPAND.EASE
        })
        .to(chevronRef.current, {
          rotation: 180,
          duration: ANIMATION_CONFIG.CHEVRON.DURATION,
          ease: ANIMATION_CONFIG.CHEVRON.EASE
        }, "<");
      
      // Only animate children if they exist
      if (contentRef.current.children.length > 0) {
        timelineRef.current.fromTo(
          Array.from(contentRef.current.children),
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: ANIMATION_CONFIG.CONTENT.DURATION,
            stagger: ANIMATION_CONFIG.CONTENT.STAGGER,
            ease: ANIMATION_CONFIG.CONTENT.EASE,
            clearProps: "transform"
          },
          "-=0.2"
        );
      }
    } else {
      // Collapsing
      if (contentRef.current.children.length > 0) {
        timelineRef.current.to(
          Array.from(contentRef.current.children),
          {
            opacity: 0,
            y: 10,
            duration: ANIMATION_CONFIG.CONTENT.DURATION / 1.5,
            stagger: ANIMATION_CONFIG.CONTENT.STAGGER / 2,
            ease: "power2.in"
          }
        );
      }
      
      timelineRef.current
        .to(containerRef.current, {
          height: "80px",
          duration: ANIMATION_CONFIG.COLLAPSE.DURATION,
          ease: ANIMATION_CONFIG.COLLAPSE.EASE
        }, "-=0.1")
        .to(chevronRef.current, {
          rotation: 0,
          duration: ANIMATION_CONFIG.CHEVRON.DURATION,
          ease: ANIMATION_CONFIG.CHEVRON.EASE
        }, "<");
    }

    setIsExpanded(!isExpanded);
  }, [isExpanded, isAnimating]);

  const handleCloseDialog = useCallback(() => {
    if (dialogRef.current) {
      gsap.to(dialogRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setIsDialogOpen(false);
          // Clear transforms after animation
          gsap.set(dialogRef.current, { clearProps: "all" });
        },
        overwrite: "auto"
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-20 overflow-hidden bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm"
      style={{ willChange: "height" }}
    >
      <button
        onClick={toggleExpand}
        className="w-full px-4 py-5 flex items-center justify-between group"
        disabled={isAnimating}
      >
        <h3
          className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent cursor-pointer"
        >
          {title}
        </h3>
        <div
          ref={chevronRef}
          style={{ willChange: "transform" }}
        >
          <FiChevronDown className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
        </div>
      </button>

      <div
        ref={contentRef}
        className="px-4 pb-4 space-y-2"
      >
        {isList ? (
          <ul className="space-y-2 list-none opacity-0">
            {(content as string[]).map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-gray-300"
              >
                <span className="text-primary mt-1.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-300 whitespace-pre-wrap opacity-0">
            {content as string}
          </p>
        )}
      </div>

      {isDialogOpen && (
        <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleCloseDialog}
            />
            <div
              ref={dialogRef}
              className="bg-gray-800 rounded-2xl p-6 w-full max-w-xl relative z-50"
              onClick={(e) => e.stopPropagation()}
              style={{ willChange: "transform, opacity" }}
            >
              <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
              <div className="max-h-[60vh] overflow-y-auto">
                {!isList ? (
                  <p className="text-gray-400">{content}</p>
                ) : (
                  <ul className="space-y-3">
                    {(content as string[]).map((item, index) => (
                      <li key={index} className="flex items-start">
                        <FiX className="w-5 h-5 text-primary mr-2 flex-shrink-0" />
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                onClick={handleCloseDialog}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};
