import React, {
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

export const Dialog: FC<PropsWithChildren<DialogProps>> = ({
  open,
  children,
  className = "",
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !open) {
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
      <div className="flex min-h-full items-center justify-center p-0 md:p-4">
        <div className={`relative text-left align-middle ${className}`}>
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
