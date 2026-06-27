import { useEffect, useRef } from "react";
import { EyeState } from "./useBotEyes";

interface UseBotInteractionsProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  setEyeState: (state: EyeState) => void;
  isProcessing: boolean;
  isCooldown: boolean;
  isHoveredRef: React.MutableRefObject<boolean>;
  setBubbleText: (text: string | null) => void;
  enabled: boolean;
}

export const useBotInteractions = ({
  containerRef,
  setEyeState,
  isProcessing,
  isCooldown,
  isHoveredRef,
  setBubbleText,
  enabled,
}: UseBotInteractionsProps) => {
  const isRightClickingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const isEventInsideBot = (target: EventTarget | null) => {
      return !!(
        containerRef.current &&
        target instanceof Node &&
        containerRef.current.contains(target)
      );
    };

    const handleContextMenu = (event: MouseEvent) => {
      if (isEventInsideBot(event.target)) {
        event.preventDefault();
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (!isEventInsideBot(event.target)) return;

      if (event.button === 2) {
        isRightClickingRef.current = true;
        setEyeState("closed");
      } else if (event.button === 0 && isRightClickingRef.current) {
        isRightClickingRef.current = false;
        setEyeState("open");
      }
    };

    const handleMouseUp = () => {
      if (!isRightClickingRef.current) return;
      isRightClickingRef.current = false;
      setEyeState("open");
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [containerRef, enabled, setEyeState]);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (!isProcessing && !isCooldown) {
      setEyeState("happy");
      setBubbleText("Click me to chat.");
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
  };

  return {
    handleMouseEnter,
    handleMouseLeave,
    isRightClickingRef,
  };
};
