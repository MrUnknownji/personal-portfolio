"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import KryptonMark from "@/components/Bot/KryptonMark";
import type { ProjectSummary } from "@/types/Project";
import { useCompactLauncher } from "@/components/Bot/useCompactLauncher";

const loadBot = () => import("@/components/Bot");
const Bot = dynamic(loadBot, { ssr: false, loading: () => null });

export default function LazyBot({ projects }: { projects: ProjectSummary[] }) {
  const [isActivated, setIsActivated] = useState(false);
  const compact = useCompactLauncher();

  if (isActivated) return <Bot projects={projects} initiallyOpen />;

  return (
    <button
      type="button"
      className="krypton-launcher"
      data-compact={compact}
      onClick={() => setIsActivated(true)}
      onPointerEnter={() => void loadBot()}
      onFocus={() => void loadBot()}
      aria-label="Ask about my work"
    >
      <KryptonMark />
      <span>Ask about my work</span>
    </button>
  );
}
