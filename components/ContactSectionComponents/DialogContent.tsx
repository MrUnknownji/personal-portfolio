import React, { useRef } from "react";
import { FiMail, FiCopy } from "react-icons/fi";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface DialogContentProps {
  email: string;
  onCopy: () => void;
}

const DialogContent = ({ email, onCopy }: DialogContentProps) => {
  const iconWrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    if (!iconWrapperRef.current || !contentRef.current || !buttonRef.current) return;

    const timeline = gsap.timeline();

    timeline
      .fromTo(
        iconWrapperRef.current,
        { 
          scale: 0, 
          rotate: -180,
          opacity: 0 
        },
        { 
          scale: 1, 
          rotate: 0,
          opacity: 1,
          duration: 0.6, 
          ease: "back.out(1.7)" 
        }
      )
      .fromTo(
        contentRef.current.querySelectorAll(".animate-content"),
        { 
          opacity: 0, 
          y: 20,
          scale: 0.95
        },
        { 
          opacity: 1, 
          y: 0,
          scale: 1,
          stagger: 0.1, 
          duration: 0.4, 
          ease: "power2.out" 
        },
        "-=0.2"
      )
      .fromTo(
        buttonRef.current,
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
          ease: "power2.out"
        },
        "-=0.2"
      );

    return () => timeline.kill();
  }, { scope: contentRef });

  const handleButtonHover = (isEntering: boolean) => {
    if (!buttonRef.current) return;

    gsap.to(buttonRef.current, {
      scale: isEntering ? 1.02 : 1,
      duration: 0.2,
      ease: "power2.out"
    });
  };

  return (
    <div ref={contentRef} className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-center">
        <div 
          ref={iconWrapperRef}
          className="p-4 bg-primary/10 rounded-2xl group transition-transform duration-300 hover:scale-110"
        >
          <FiMail className="w-12 h-12 text-primary transform transition-transform duration-300 group-hover:rotate-12" />
        </div>
      </div>

      <div className="space-y-3 text-center">
        <h3 className="text-2xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-content">
          Thank You for Reaching Out!
        </h3>
        <p className="text-gray-400 animate-content">
          I'll get back to you as soon as possible. In the meantime, you can copy my email address below:
        </p>
      </div>

      <div className="bg-gray-700/30 rounded-xl p-4 backdrop-blur-sm animate-content">
        <p className="text-center text-primary font-medium break-all">
          {email}
        </p>
      </div>

      <button
        ref={buttonRef}
        onClick={onCopy}
        onMouseEnter={() => handleButtonHover(true)}
        onMouseLeave={() => handleButtonHover(false)}
        className="w-full py-3 px-4 bg-primary text-secondary rounded-xl hover:bg-primary/90 
          transition-colors flex items-center justify-center gap-2 group relative overflow-hidden"
      >
        <span className="font-medium relative z-10">Copy to Clipboard</span>
        <FiCopy className="w-4 h-4 transform transition-transform duration-300 group-hover:rotate-12" />
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 
          translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      </button>
    </div>
  );
};

export default DialogContent;
