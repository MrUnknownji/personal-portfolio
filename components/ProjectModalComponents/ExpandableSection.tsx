import React, { useState, useRef, useCallback } from "react";
import { Dialog } from "@/components/ui/Dialog";
import gsap from "gsap";
import { FiChevronRight, FiX, FiChevronDown } from "react-icons/fi";

interface ExpandableSectionProps {
  title: string;
  content: string | string[];
  isList?: boolean;
}

export const ExpandableSection = ({ title, content, isList = false }: ExpandableSectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLDivElement>(null);

  const toggleExpand = useCallback(() => {
    if (!contentRef.current || !containerRef.current || !chevronRef.current) return;

    const timeline = gsap.timeline();
    const contentHeight = contentRef.current.scrollHeight;
    const containerHeight = containerRef.current.clientHeight;

    if (!isExpanded) {
      timeline
        .to(containerRef.current, {
          height: containerHeight + contentHeight + "px",
          duration: 0.4,
          ease: "power2.out"
        })
        .to(chevronRef.current, {
          rotation: 180,
          duration: 0.3,
          ease: "power2.out"
        }, "<")
        .fromTo(
          contentRef.current.children,
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.3,
            stagger: 0.05,
            ease: "power2.out"
          },
          "-=0.2"
        );
    } else {
      timeline
        .to(containerRef.current, {
          height: "80px",
          duration: 0.3,
          ease: "power2.inOut"
        })
        .to(chevronRef.current, {
          rotation: 0,
          duration: 0.3,
          ease: "power2.inOut"
        }, "<")
        .to(contentRef.current.children, {
          opacity: 0,
          y: 10,
          duration: 0.2,
          stagger: 0.02,
          ease: "power2.in"
        }, "<");
    }

    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const handleOpenDialog = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    if (dialogRef.current) {
      gsap.to(dialogRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => setIsDialogOpen(false),
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
      >
        <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {title}
        </h3>
        <div
          ref={chevronRef}
          className="transform transition-transform duration-300"
        >
          <FiChevronDown className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
        </div>
      </button>

      <div
        ref={contentRef}
        className="px-4 pb-4 space-y-2"
      >
        {isList ? (
          <ul className="space-y-2 list-none">
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
          <p className="text-gray-300 whitespace-pre-wrap">
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
