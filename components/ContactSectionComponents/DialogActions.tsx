import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import Link from "next/link";

interface DialogActionsProps {
  onClose: () => void;
}

const DialogActions: React.FC<DialogActionsProps> = ({ onClose }) => {
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const actions = actionsRef.current;
    if (!actions) return;

    const actionElements = Array.from(actions.children);

    gsap.fromTo(
      actionElements,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.1,
        delay: 0.5,
      },
    );
  }, []);

  return (
    <div
      ref={actionsRef}
      className="bg-gray-800 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
    >
      <Link
        href="#projects"
        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-secondary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
        onClick={onClose}
      >
        View Projects
      </Link>
      <button
        type="button"
        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

export default DialogActions;
