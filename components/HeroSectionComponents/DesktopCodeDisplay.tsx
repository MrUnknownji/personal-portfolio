"use client";

import { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";

const CodeDisplay = dynamic(() => import("./CodeDisplay"), {
  ssr: false,
  loading: () => (
    <div className="h-[34rem] w-full animate-pulse rounded-3xl bg-white/[0.02]" />
  ),
});

const DESKTOP_QUERY = "(min-width: 1024px)";

const subscribe = (callback: () => void) => {
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};

const getSnapshot = () => window.matchMedia(DESKTOP_QUERY).matches;

export default function DesktopCodeDisplay() {
  const isDesktop = useSyncExternalStore(subscribe, getSnapshot, () => false);
  return isDesktop ? <CodeDisplay /> : null;
}
