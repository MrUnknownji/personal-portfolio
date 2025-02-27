import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { FiChevronRight, FiX, FiCheck } from "react-icons/fi";
import gsap from "gsap";

interface DialogActionsProps {
  onClose: () => void;
  isEmailCopied?: boolean;
}

const DialogActions = ({ onClose, isEmailCopied }: DialogActionsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const projectsButtonRef = useRef<HTMLAnchorElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!containerRef.current || !projectsButtonRef.current || !closeButtonRef.current) return;

    gsap.fromTo(
      [projectsButtonRef.current, closeButtonRef.current],
      { 
        opacity: 0, 
        y: 20,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2
      }
    );
  }, []);

  const handleButtonHover = (element: HTMLElement, isEntering: boolean) => {
    gsap.to(element, {
      scale: isEntering ? 1.02 : 1,
      duration: 0.2,
      ease: "power2.out"
    });
  };

  return (
    <div
      ref={containerRef}
      className="px-6 py-4 sm:px-8 bg-gray-900/30 backdrop-blur-sm border-t border-primary/20
        flex flex-col sm:flex-row-reverse gap-3 sm:gap-4"
    >
      <Link
        ref={projectsButtonRef}
        href="#projects"
        className="inline-flex justify-center items-center px-6 py-3 rounded-xl
          bg-primary text-secondary font-medium shadow-lg
          hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50
          transition-all duration-300 group relative overflow-hidden"
        onClick={onClose}
        onMouseEnter={(e) => handleButtonHover(e.currentTarget, true)}
        onMouseLeave={(e) => handleButtonHover(e.currentTarget, false)}
      >
        <span className="relative z-10">View Projects</span>
        <FiChevronRight className="w-5 h-5 ml-2 transform transition-transform duration-300 
          group-hover:translate-x-1" />
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
          translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      </Link>

      <button
        ref={closeButtonRef}
        type="button"
        className="inline-flex justify-center items-center px-6 py-3 rounded-xl
          border border-primary/20 text-gray-300 font-medium shadow-lg
          hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50
          transition-all duration-300 group relative overflow-hidden backdrop-blur-sm"
        onClick={onClose}
        onMouseEnter={(e) => handleButtonHover(e.currentTarget, true)}
        onMouseLeave={(e) => handleButtonHover(e.currentTarget, false)}
      >
        {isEmailCopied ? (
          <>
            <FiCheck className="w-5 h-5 mr-2 text-primary" />
            <span className="relative z-10">Copied!</span>
          </>
        ) : (
          <>
            <span className="relative z-10">Close</span>
            <FiX className="w-5 h-5 ml-2 transform transition-transform duration-300 
              group-hover:rotate-90" />
          </>
        )}
        
        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 
          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </button>
    </div>
  );
};

export default DialogActions;
