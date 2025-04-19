import React, {
  useRef,
  useEffect,
  useState,
  ReactNode,
  ReactPortal,
  FC,
  PropsWithChildren,
} from "react";
import { createPortal } from "react-dom";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  className?: string;
}

const DIALOG_Z_INDEX: number = 50;
const OVERLAY_Z_INDEX: number = 40;

export const Dialog: FC<PropsWithChildren<DialogProps>> = ({
  open,
  onClose,
  children,
  className = "",
}) => {
  const portalNodeRef = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    portalNodeRef.current = document.body;
    setMounted(true);
    // Optional: Add body overflow hidden logic here if needed
    // return () => { /* Cleanup overflow */ };
  }, []);

  if (!mounted || !portalNodeRef.current || !open) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 overflow-y-auto"
      style={{ zIndex: DIALOG_Z_INDEX }}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
    >
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        style={{ zIndex: OVERLAY_Z_INDEX }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="flex min-h-screen items-center justify-center p-0 md:p-4">
        <div
          className={`relative text-left align-middle ${className}`}
          style={{ zIndex: DIALOG_Z_INDEX }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </div>,
    portalNodeRef.current,
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
