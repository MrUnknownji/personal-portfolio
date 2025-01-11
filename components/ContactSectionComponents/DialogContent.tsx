import { useEffect, useRef } from "react";
import { FiMail } from "react-icons/fi";
import gsap from "gsap";

interface DialogContentProps {
  email: string;
  onCopy: () => void;
}

const DialogContent = ({ email, onCopy }: DialogContentProps) => {
  const iconWrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!iconWrapperRef.current || !contentRef.current) return;

    const tl = gsap.timeline();

    tl.fromTo(
      iconWrapperRef.current,
      {
        scale: 0,
        rotate: -180,
      },
      {
        scale: 1,
        rotate: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
      },
    ).fromTo(
      contentRef.current.querySelectorAll(".animate-content"),
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.4,
        ease: "power2.out",
      },
      "-=0.2",
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div ref={contentRef} className="p-6 sm:p-8">
      <div className="flex items-center justify-center mb-4">
        <div ref={iconWrapperRef} className="p-3 bg-primary/10 rounded-full">
          <FiMail className="w-12 h-12 text-primary" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white text-center mb-2 animate-content">
        Email Address
      </h3>
      <p className="text-gray-400 text-center mb-6 animate-content">{email}</p>
      <button
        onClick={onCopy}
        className="w-full py-2 px-4 bg-primary text-secondary rounded-lg hover:bg-primary/90 transition-colors animate-content"
      >
        Copy to Clipboard
      </button>
    </div>
  );
};

export default DialogContent;
