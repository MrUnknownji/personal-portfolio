import React, {
  useRef,
  ReactNode,
  ReactPortal,
  FC,
  PropsWithChildren,
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

  useGSAP(() => {
    if (!dialogRef.current) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    const dialog = dialogRef.current;

    timelineRef.current = gsap.timeline({
      defaults: {
        duration: DIALOG_ANIMATION_DURATION,
        ease: open ? DIALOG_EASE_OUT : DIALOG_EASE_IN,
        overwrite: "auto",
      },
      paused: true,
      onComplete: () => {
        if (open && dialogRef.current) {
          gsap.set(dialogRef.current, { clearProps: "transform" });
        }

        if (!open) {
          timelineRef.current = null;
        }
      },
    });

    if (open) {
      gsap.set(dialog, {
        opacity: DIALOG_OPACITY_HIDDEN,
        y: DIALOG_INITIAL_Y,
      });

      timelineRef.current.to(dialog, {
        opacity: DIALOG_OPACITY_VISIBLE,
        y: 0,
      });

      timelineRef.current.play();
    } else if (dialog.style.opacity !== "") {
      timelineRef.current.to(dialog, {
        opacity: DIALOG_OPACITY_HIDDEN,
        y: DIALOG_INITIAL_Y,
        onComplete: () => {
          if (dialogRef.current) {
            gsap.set(dialogRef.current, { clearProps: "all" });
          }
        },
      });

      timelineRef.current.play();
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [open]);

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
  <h2 className={`text-lg font-medium leading-6 pb-2 ${className}`}>
    {children}
  </h2>
);
