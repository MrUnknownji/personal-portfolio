import React from "react";
import Link from "next/link";

interface DialogActionsProps {
  onClose: () => void;
}

const DialogActions: React.FC<DialogActionsProps> = ({ onClose }) => {
  return (
    <div
      className="px-6 py-4 sm:px-8 bg-secondary/50 border-t border-primary/10
      flex flex-col sm:flex-row-reverse gap-3 sm:gap-4"
    >
      <Link
        href="#projects"
        className="inline-flex justify-center items-center px-6 py-2.5
          rounded-lg bg-primary text-secondary font-medium
          hover:bg-opacity-90 [transition:background-color_0.3s]
          focus:outline-none focus:ring-2 focus:ring-primary/50"
        onClick={onClose}
      >
        View Projects
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </Link>

      <button
        type="button"
        className="inline-flex justify-center items-center px-6 py-2.5
          rounded-lg border border-primary/20 text-gray-300 font-medium
          hover:bg-primary/10 [transition:background-color_0.3s]
          focus:outline-none focus:ring-2 focus:ring-primary/50"
        onClick={onClose}
      >
        Close
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default DialogActions;
