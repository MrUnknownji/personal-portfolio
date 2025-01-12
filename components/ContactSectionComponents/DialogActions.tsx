import React from "react";
import Link from "next/link";
import { FiChevronRight, FiX, FiCheck } from "react-icons/fi";

interface DialogActionsProps {
  onClose: () => void;
  isEmailCopied?: boolean;
}

const DialogActions: React.FC<DialogActionsProps> = ({
  onClose,
  isEmailCopied,
}) => {
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
        <FiChevronRight className="w-4 h-4 ml-2" />
      </Link>

      <button
        type="button"
        className="inline-flex justify-center items-center px-6 py-2.5
          rounded-lg border border-primary/20 text-gray-300 font-medium
          hover:bg-primary/10 [transition:background-color_0.3s]
          focus:outline-none focus:ring-2 focus:ring-primary/50"
        onClick={onClose}
      >
        {isEmailCopied ? (
          <>
            <FiCheck className="w-4 h-4 mr-2 text-primary" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            Close
            <FiX className="w-4 h-4 ml-2" />
          </>
        )}
      </button>
    </div>
  );
};

export default DialogActions;
