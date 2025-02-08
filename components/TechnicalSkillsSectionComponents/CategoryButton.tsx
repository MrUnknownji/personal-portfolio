import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface CategoryButtonProps {
  skillSet: {
    category: string;
    icon: React.ReactNode;
  };
  isActive: boolean;
  onClick: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  skillSet,
  isActive,
  onClick,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!buttonRef.current) return;
    gsap.fromTo(
      buttonRef.current,
      { opacity: 0, y: 20, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power2.out" },
    );
  }, []);

  useGSAP(() => {
    if (isActive && borderRef.current) {
      gsap.fromTo(
        borderRef.current,
        { width: "0%" },
        { width: "100%", duration: 0.4, ease: "power1.out" },
      );
    }
  }, [isActive]);

  const handleMouseEnter = () => {
    if (!buttonRef.current) return;
    gsap.to(buttonRef.current, {
      scale: isActive ? 1.07 : 1.03,
      boxShadow: isActive
        ? "0px 6px 12px rgba(0, 0, 0, 0.2)"
        : "0px 4px 10px rgba(0, 0, 0, 0.15)",
      duration: 0.3,
      ease: "power3.out",
    });
  };

  const handleMouseLeave = () => {
    if (!buttonRef.current) return;
    gsap.to(buttonRef.current, {
      scale: 1,
      boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)",
      duration: 0.3,
      ease: "power3.out",
    });
  };

  return (
    <button
      ref={buttonRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative px-6 py-3 rounded-lg font-medium
        flex items-center gap-2 min-w-[140px] justify-center
        ${
          isActive
            ? "bg-secondary text-primary border border-primary/30 shadow-lg"
            : "bg-secondary/50 text-gray-400 border border-gray-800"
        }
      `}
    >
      <span
        className={`text-lg ${isActive ? "scale-110" : "scale-100"}`}
        style={{ transition: "transform 0.3s ease" }}
      >
        {skillSet.icon}
      </span>

      <span className="relative">
        {skillSet.category}
        {isActive && (
          <div
            ref={borderRef}
            className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        )}
      </span>

      {isActive && (
        <>
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary rounded-tl-md" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary rounded-tr-md" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary rounded-bl-md" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary rounded-br-md" />
        </>
      )}
    </button>
  );
};

export default CategoryButton;
