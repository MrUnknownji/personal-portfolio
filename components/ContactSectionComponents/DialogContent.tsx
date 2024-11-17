import React, { useRef, useEffect } from "react";
import gsap from "gsap";

const DialogContent: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    const icon = iconRef.current;
    if (!content || !icon) return;

    const contentElements = Array.from(content.children);

    gsap.fromTo(
      contentElements,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        stagger: 0.1,
        delay: 0.2,
      },
    );

    gsap.fromTo(
      icon,
      { scale: 0 },
      {
        scale: 1,
        duration: 0.3,
        delay: 0.2,
        ease: "back.out",
      },
    );
  }, []);

  return (
    <div ref={contentRef} className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-primary sm:mx-0 sm:h-10 sm:w-10">
          <svg
            ref={iconRef}
            className="h-6 w-6 text-secondary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 className="text-3xl leading-6 font-bold text-primary mb-2">
            Thank You!
          </h3>
          <div className="mt-2">
            <p className="text-xl text-accent mb-4">
              Your message has been successfully sent.
            </p>
            <p className="text-gray-300">
              {`I appreciate you taking the time to reach out. I'll get back to
                you as soon as possible.`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogContent;
