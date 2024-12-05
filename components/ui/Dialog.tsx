import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { createPortal } from 'react-dom';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export const Dialog = ({ open, onClose, children, className = '' }: DialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!dialogRef.current) return;

    const dialog = dialogRef.current;
    const tl = gsap.timeline();

    if (open) {
      tl.fromTo(
        dialog,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }

    return () => {
      tl.kill();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <div
          ref={dialogRef}
          className={`inline-block w-full text-left align-middle transition-all transform ${className}`}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const DialogTitle = ({ children, className = '' }: DialogTitleProps) => (
  <h2 className={`text-lg font-medium leading-6 ${className}`}>{children}</h2>
);

Dialog.Title = DialogTitle;
