"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import KryptonMark from "@/components/Bot/KryptonMark";

const loadBot = () => import("@/components/Bot");
const Bot = dynamic(loadBot, { ssr: false, loading: () => null });

export default function LazyBot() {
  const [isActivated, setIsActivated] = useState(false);

  if (isActivated) return <Bot initiallyOpen />;

  return (
    <button
      type="button"
      className="krypton-launcher"
      onClick={() => setIsActivated(true)}
      onPointerEnter={() => void loadBot()}
      onFocus={() => void loadBot()}
      aria-label="Ask about Sandeep's work"
    >
      <KryptonMark />
      <span>Ask about my work</span>
    </button>
  );
}
