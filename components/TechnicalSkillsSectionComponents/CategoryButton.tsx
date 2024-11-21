import React, { useEffect, useRef } from "react";
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

  useEffect(() => {
    gsap.fromTo(
      buttonRef.current,
      {
        opacity: 0,
        y: 20,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      },
    );
  }, []);

  useEffect(() => {
    if (isActive) {
      gsap.fromTo(
        borderRef.current,
        { width: "0%" },
        {
          width: "100%",
          duration: 0.4,
          ease: "power1.out",
        },
      );
    }
  }, [isActive]);

  return (
    <button
      ref={buttonRef}
      className={`
        relative px-6 py-3 rounded-lg font-medium
        transition-all duration-300 ease-out
        transform hover:scale-105 active:scale-95
        flex items-center gap-2 min-w-[140px] justify-center
        ${
          isActive
            ? "bg-secondary text-primary border border-primary/30"
            : "bg-secondary/50 text-gray-400 hover:text-gray-200 border border-gray-800"
        }
      `}
      onClick={onClick}
    >
      <span
        className={`text-lg transition-transform duration-300
        ${isActive ? "scale-110" : "scale-100"}`}
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

      {!isActive && (
        <div
          className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100
          transition-opacity duration-300
          bg-gradient-to-r from-primary/5 via-transparent to-primary/5"
        />
      )}
    </button>
  );
};

export default CategoryButton;
