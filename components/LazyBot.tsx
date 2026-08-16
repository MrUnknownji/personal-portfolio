"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

const loadBot = () => import("@/components/Bot");
const Bot = dynamic(loadBot, { ssr: false, loading: () => null });

export default function LazyBot() {
  const [isActivated, setIsActivated] = useState(false);

  if (isActivated) return <Bot initiallyOpen />;

  return (
    <button
      type="button"
      className="fixed bottom-5 right-5 z-50 flex size-16 items-center justify-center rounded-full border border-primary/40 bg-card text-primary shadow-[0_8px_30px_rgba(0,0,0,0.35)] transition-[transform,border-color] hover:scale-105 hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      onClick={() => setIsActivated(true)}
      onPointerEnter={() => void loadBot()}
      onFocus={() => void loadBot()}
      aria-label="Open Krypton portfolio assistant"
    >
      <Image src="/bot-mark.svg" alt="" width={42} height={42} />
    </button>
  );
}
