"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useSyncExternalStore } from "react";

export type SocialInfoLink = {
  label: string;
  username: string;
  description: string;
  color: string;
  profileImage: string;
  stats: ReadonlyArray<{ label: string; value: string }>;
};

type SocialInfoBoxProps = {
  socialLink: SocialInfoLink;
  position: { x: number; top: number; bottom: number };
  visible: boolean;
};

const CARD_WIDTH = 320;
const CARD_HEIGHT = 244;
const VIEWPORT_MARGIN = 16;
const BUTTON_GAP = 18;

export default function SocialInfoBox({
  socialLink,
  position,
  visible,
}: SocialInfoBoxProps) {
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  if (!mounted) return null;

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const x = Math.min(
    Math.max(position.x, CARD_WIDTH / 2 + VIEWPORT_MARGIN),
    viewportWidth - CARD_WIDTH / 2 - VIEWPORT_MARGIN,
  );
  const hasSpaceAbove =
    position.top - BUTTON_GAP - VIEWPORT_MARGIN >= CARD_HEIGHT;
  const renderAbove = hasSpaceAbove;
  const naturalTop = renderAbove
    ? position.top - BUTTON_GAP
    : position.bottom + BUTTON_GAP;
  const top = renderAbove
    ? naturalTop
    : Math.min(
        Math.max(naturalTop, VIEWPORT_MARGIN),
        Math.max(VIEWPORT_MARGIN, viewportHeight - CARD_HEIGHT - VIEWPORT_MARGIN),
      );

  return createPortal(
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-[100] w-80 transform-gpu transition-[opacity,transform] duration-200 ease-out"
      style={{
        left: x,
        top,
        opacity: visible ? 1 : 0,
        transform: `translate(-50%, ${renderAbove ? "-100%" : "0"}) scale(${visible ? 1 : 0.96})`,
        transformOrigin: renderAbove ? "bottom center" : "top center",
      }}
    >
      <div className="relative border border-border border-l-primary bg-card p-5 shadow-[0_20px_55px_rgba(0,0,0,0.48)]">
        <div className="relative z-10 space-y-5">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <span
                className="absolute inset-0 translate-x-1 translate-y-1"
                style={{ boxShadow: `4px 4px 0 ${socialLink.color}` }}
              />
              <Image
                src={socialLink.profileImage}
                alt=""
                width={52}
                height={52}
                className="relative size-[52px] border border-white/10 bg-background object-cover object-top"
              />
            </div>
            <div>
              <p className="text-lg font-bold leading-tight tracking-tight text-white">
                {socialLink.username}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="size-1.5 rounded-full" style={{ backgroundColor: socialLink.color }} />
                <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                  {socialLink.label}
                </span>
              </div>
            </div>
          </div>

          <div className="relative py-1 pl-3">
            <span className="absolute inset-y-0 left-0 w-0.5 opacity-70" style={{ backgroundColor: socialLink.color }} />
            <p className="text-sm italic leading-relaxed text-neutral-300">
              {socialLink.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {socialLink.stats.map((stat) => (
              <div
                key={stat.label}
                className="flex min-h-16 flex-col items-center justify-center rounded-xl border border-white/5 bg-white/[0.03] p-2.5"
              >
                <span className="text-base font-bold tracking-tight text-white">{stat.value}</span>
                <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <span
          className={`absolute size-4 rotate-45 border bg-card ${
            renderAbove
              ? "-bottom-2 left-1/2 -translate-x-1/2 border-l-0 border-t-0 border-border"
              : "-top-2 left-1/2 -translate-x-1/2 border-b-0 border-r-0 border-border"
          }`}
        />
      </div>
    </div>,
    document.body,
  );
}
