import React, {
  useRef,
  ReactNode,
  ReactPortal,
  FC,
  PropsWithChildren,
  useEffect
} from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  className?: string;
}

const DIALOG_ANIMATION_DURATION: number = 0.3;
const DIALOG_INITIAL_Y: number = 20;
const DIALOG_OPACITY_VISIBLE: number = 1;
const DIALOG_OPACITY_HIDDEN: number = 0;
const DIALOG_EASE_IN: string = "power2.in";
const DIALOG_EASE_OUT: string = "power2.out";
const DIALOG_Z_INDEX: number = 50;

export const Dialog: FC<PropsWithChildren<DialogProps>> = ({
  open,
  onClose,
  children,
  className = "",
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  
  // Handle body scroll locking
  useEffect(() => {
    // Capture ref values inside the effect to avoid React Hook warnings
    const dialog = dialogRef.current;
    const timeline = timelineRef.current;
    
    if (open) {
      // Prevent body scrolling when dialog is open
      document.body.style.overflow = "hidden";
    } else {
      // Restore body scrolling when dialog is closed
      document.body.style.overflow = "";
    }
    
    return () => {
      // Ensure body scrolling is restored when component unmounts
      document.body.style.overflow = "";
      
      // Kill any existing timeline
      if (timeline) {
        timeline.kill();
      }
      
      // Reset dialog element
      if (dialog) {
        gsap.set(dialog, { clearProps: "all" });
      }
    };
  }, [open]);

  useGSAP(() => {
    if (!dialogRef.current) return;

    // Kill any existing timeline to prevent conflicts
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    const dialog = dialogRef.current;
    
    // Create a new timeline with proper defaults
    timelineRef.current = gsap.timeline({
      defaults: {
        duration: DIALOG_ANIMATION_DURATION,
        ease: open ? DIALOG_EASE_OUT : DIALOG_EASE_IN,
        overwrite: "auto"
      },
      paused: true,
      onComplete: () => {
        // Clear transforms after animation completes
        if (open && dialogRef.current) {
          gsap.set(dialogRef.current, { clearProps: "transform" });
        }
        
        // Clear the timeline reference after completion
        if (!open) {
          timelineRef.current = null;
        }
      }
    });

    if (open) {
      // Set initial state
      gsap.set(dialog, { 
        opacity: DIALOG_OPACITY_HIDDEN, 
        y: DIALOG_INITIAL_Y 
      });
      
      // Create animation
      timelineRef.current.to(dialog, {
        opacity: DIALOG_OPACITY_VISIBLE,
        y: 0,
      });
      
      // Play immediately
      timelineRef.current.play();
    } else if (dialog.style.opacity !== "") {
      // Only animate out if the dialog is visible
      timelineRef.current.to(dialog, {
        opacity: DIALOG_OPACITY_HIDDEN,
        y: DIALOG_INITIAL_Y,
        onComplete: () => {
          // Clear all properties after animation completes
          if (dialogRef.current) {
            gsap.set(dialogRef.current, { clearProps: "all" });
          }
        }
      });
      
      // Play immediately
      timelineRef.current.play();
    }

    return () => {
      // Clean up timeline when component updates or unmounts
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [open]);

  // Don't render anything if dialog is not open
  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{ zIndex: DIALOG_Z_INDEX }}
    >
      <div className="min-h-screen flex items-center justify-center px-4">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <div
          ref={dialogRef}
          className={`relative w-full text-left align-middle transition-all transform ${className}`}
          style={{ willChange: "transform, opacity" }}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  ) as ReactPortal;
};

interface DialogTitleProps {
  children: ReactNode;
  className?: string;
}

export const DialogTitle: FC<DialogTitleProps> = ({
  children,
  className = "",
}) => (
  <h2 className={`text-lg font-medium leading-6 ${className}`}>{children}</h2>
);
