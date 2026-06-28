"use client";

import { useEffect, useRef } from "react";
import type React from "react";
import { useBotEyes } from "./useBotEyes";
import { useBotScene } from "./useBotScene";
import type { EyeState } from "./types";

interface ThreeBotVisualProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  active: boolean;
  eyeState: EyeState;
  isGlobalModalOpenRef: React.MutableRefObject<boolean>;
  onReady: () => void;
  onUnavailable: () => void;
}

export default function ThreeBotVisual({
  containerRef,
  active,
  eyeState,
  isGlobalModalOpenRef,
  onReady,
  onUnavailable,
}: ThreeBotVisualProps) {
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const { eyeContextRef, eyeCanvasRef, eyeTextureRef, clockRef } =
    useBotScene({
      containerRef,
      activeRef,
      activityToken: `${active}:${eyeState}`,
      isGlobalModalOpenRef,
      onReady,
      onUnavailable,
    });

  useBotEyes({
    eyeContextRef,
    eyeCanvasRef,
    eyeTextureRef,
    eyeState,
    clockRef,
  });

  return null;
}
