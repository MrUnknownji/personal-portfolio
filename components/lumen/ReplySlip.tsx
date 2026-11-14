"use client";

import { useRef, useState } from "react";
import CopyEmail from "./CopyEmail";
import { haptic } from "./feedback";
import { PaperLayers } from "./Paper";
import { SoftLayers, softStyle } from "./Soft";

const Scissors = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="6" cy="6.5" r="3" />
    <circle cx="6" cy="17.5" r="3" />
    <path d="M8.6 8.1 20.5 16.2M8.6 15.9 20.5 7.8" />
  </svg>
);

/**
 * A reply coupon with scissors on its dashed line. Drag the scissors along the line: they stay
 * exactly where you grabbed them, written straight to the transform on every pointer event with
 * no easing, so they never trail the cursor. A press without a drag, or Enter, cuts the whole line.
 * The address is readable and usable whether or not the slip is cut.
 */
export default function ReplySlip({
  email,
  openTo,
  location,
  role,
}: {
  email: string;
  openTo: string;
  location: string;
  role?: string;
}) {
  const line = useRef<HTMLDivElement>(null);
  const scissors = useRef<HTMLButtonElement>(null);
  const cutRef = useRef<HTMLSpanElement>(null);
  const grab = useRef<{ id: number; offset: number; startX: number } | null>(null);
  const at = useRef(0);
  const [cut, setCut] = useState(false);

  const place = (p: number) => {
    const el = line.current;
    if (!el || !scissors.current || !cutRef.current) return;
    at.current = p * el.clientWidth;
    scissors.current.style.transform = `translate3d(${at.current}px, 0, 0)`;
    cutRef.current.style.transform = `scaleX(${p})`;
  };
  const finish = () => {
    if (!scissors.current || !cutRef.current) return;
    scissors.current.style.transition = "transform 0.35s ease-out";
    cutRef.current.style.transition = "transform 0.35s ease-out";
    place(1);
    haptic(12);
    window.setTimeout(() => setCut(true), 300);
  };

  return (
    <div className="ld-slip" data-cut={cut || undefined}>
      <div className="ld-slip-keep ld-paper">
        <PaperLayers seed={41} edges={{ top: 6, right: 2, left: 2 }} />
        <span className="ld-anno">Open to</span>
        <p className="ld-slip-role">{openTo}</p>
        <p className="ld-slip-note">
          {role ? `${role}. ` : ""}Based in {location}. Email is the fastest way to reach me.
        </p>
        <span className="ld-status">
          <i aria-hidden="true" />
          Available for new roles
        </span>
      </div>
      <div className="ld-slip-line" ref={line}>
        <span className="ld-slip-cut" ref={cutRef} aria-hidden="true" />
        <button
          ref={scissors}
          type="button"
          className="ld-scissors"
          aria-label="Cut out the reply slip"
          disabled={cut}
          onClick={(event) => {
            // Keyboard activation cuts the whole line; pointer presses finish on pointer up.
            if (event.detail === 0) finish();
          }}
          onPointerDown={(event) => {
            const el = line.current;
            if (!el) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            event.currentTarget.style.transition = "none";
            if (cutRef.current) cutRef.current.style.transition = "none";
            const box = el.getBoundingClientRect();
            // Keep the grab point under the cursor instead of snapping the scissors to it.
            grab.current = {
              id: event.pointerId,
              offset: event.clientX - box.left - at.current,
              startX: event.clientX,
            };
          }}
          onPointerMove={(event) => {
            const g = grab.current;
            const el = line.current;
            if (!g || !el || g.id !== event.pointerId) return;
            const box = el.getBoundingClientRect();
            const x = Math.min(box.width, Math.max(0, event.clientX - box.left - g.offset));
            place(x / box.width);
          }}
          onPointerUp={(event) => {
            const g = grab.current;
            const el = line.current;
            if (!g || !el) return;
            const box = el.getBoundingClientRect();
            const p = (event.clientX - box.left - g.offset) / box.width;
            grab.current = null;
            if (p > 0.85 || Math.abs(event.clientX - g.startX) < 4) finish();
          }}
          onPointerCancel={() => {
            grab.current = null;
          }}
        >
          <Scissors />
        </button>
      </div>
      <div className="ld-slip-reply ld-paper">
        <PaperLayers seed={53} edges={{ right: 2, bottom: 7, left: 2 }} />
        <span className="ld-anno">
          {cut ? "Cut out. Now send it." : "Reply slip · cut along the line"}
        </span>
        <p className="ld-slip-to">
          <span>To</span>
          <a href={`mailto:${email}`}>{email}</a>
        </p>
        <div className="ld-actions">
          <a
            className="ld-key ld-soft ld-key-signal"
            style={softStyle("signal")}
            href={`mailto:${email}`}
          >
            <SoftLayers />
            <span>
              Write to me <span aria-hidden="true">→</span>
            </span>
          </a>
          <CopyEmail email={email} />
        </div>
      </div>
    </div>
  );
}
