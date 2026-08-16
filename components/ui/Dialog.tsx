"use client";

import React, {
  useEffect,
  useRef,
  useSyncExternalStore,
  type FC,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { registerModal, unregisterModal } from "@/components/modalState";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  className?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
}

let scrollLockCount = 0;
let previousBodyOverflow = "";

const lockBodyScroll = () => {
  if (scrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  scrollLockCount += 1;
};

const unlockBodyScroll = () => {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
  }
};

const getFocusableElements = (container: HTMLElement) => {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.closest("[inert]") && element.offsetParent);
};

export const Dialog: FC<PropsWithChildren<DialogProps>> = ({
  open,
  onClose,
  children,
  className = "",
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const isMounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!open || !isMounted || !dialogRef.current) return;

    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const inertedSiblings = Array.from(document.body.children)
      .filter((element) => element !== dialogRef.current && element.tagName !== "SCRIPT")
      .map((element) => ({
        element: element as HTMLElement,
        wasInert: (element as HTMLElement).inert,
      }));

    inertedSiblings.forEach(({ element }) => {
      element.inert = true;
    });
    registerModal();
    lockBodyScroll();

    const focusFrame = requestAnimationFrame(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;
      const preferred = dialog.querySelector<HTMLElement>("[data-autofocus]");
      (preferred || getFocusableElements(dialog)[0] || dialog).focus();
    });

    return () => {
      cancelAnimationFrame(focusFrame);
      inertedSiblings.forEach(({ element, wasInert }) => {
        element.inert = wasInert;
      });
      unlockBodyScroll();
      unregisterModal();
      previouslyFocusedRef.current?.focus({ preventScroll: true });
    };
  }, [isMounted, open]);

  if (!isMounted || !open) return null;

  return createPortal(
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      tabIndex={-1}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          onClose();
          return;
        }

        if (event.key !== "Tab") return;
        const focusable = getFocusableElements(event.currentTarget);
        if (focusable.length === 0) {
          event.preventDefault();
          event.currentTarget.focus();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
    >
      <div className="flex min-h-full items-center justify-center p-0 md:p-4">
        <div className={`relative text-left align-middle ${className}`}>
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};

interface DialogTitleProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export const DialogTitle: FC<DialogTitleProps> = ({
  children,
  className = "",
  id,
}) => (
  <h2 id={id} className={`pb-2 text-lg font-medium leading-6 ${className}`}>
    {children}
  </h2>
);
