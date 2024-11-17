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

  useEffect(() => {
    gsap.fromTo(
      buttonRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.5 },
    );
  }, []);

  return (
    <button
      ref={buttonRef}
      className={`px-6 py-3 rounded-full text-lg font-semibold ${
        isActive
          ? "bg-primary text-secondary"
          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
      }`}
      onClick={onClick}
    >
      {skillSet.icon} {skillSet.category}
    </button>
  );
};

export default CategoryButton;
