"use client";

import { useRef, useState } from "react";
import CopyEmail from "@/components/review/CopyEmail";

/**
 * A reply coupon with a pair of scissors on its dotted line. Drag the scissors along the line (they
 * stay exactly under the pointer) or press them to cut. The email is readable whether or not you cut.
 */
export default function ReplySlip({ email, openTo }: { email: string; openTo: string }) {
  const line = useRef<HTMLDivElement>(null);
  const scissors = useRef<HTMLButtonElement>(null);
  const cutRef = useRef<HTMLSpanElement>(null);
  const grab = useRef<{ id: number; offset: number; startX: number } | null>(null);
  const [cut, setCut] = useState(false);
  const at = useRef(0);

  const place = (p: number) => {
    const el = line.current;
    if (!el || !scissors.current || !cutRef.current) return;
    at.current = p * el.clientWidth;
    scissors.current.style.transform = `translate3d(${at.current}px, 0, 0)`;
    cutRef.current.style.transform = `scaleX(${p})`;
  };
  const finish = () => {
    const el = line.current;
    if (!el || !scissors.current || !cutRef.current) return;
    scissors.current.style.transition = "transform 0.35s ease-out";
    cutRef.current.style.transition = "transform 0.35s ease-out";
    place(1);
    window.setTimeout(() => setCut(true), 300);
  };

  return (
    <div className="ps-slip" data-cut={cut || undefined}>
      <div className="ps-slip-keep">
        <p className="ps-kicker">Keep this part</p>
        <p>{`Open to ${openTo.toLowerCase()}. Email is the fastest way to reach me.`}</p>
      </div>
      <div className="ps-slip-line" ref={line}>
        <span className="ps-slip-cut" ref={cutRef} aria-hidden="true" />
        <button
          ref={scissors}
          type="button"
          className="ps-scissors"
          aria-label="Cut out the reply slip"
          disabled={cut}
          onClick={(e) => {
            // Enter or Space cuts the whole line; pointer presses are handled on pointer up.
            if (e.detail === 0) finish();
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
            // A tap without a drag cuts the whole line, as does a drag most of the way across.
            if (p > 0.85 || Math.abs(event.clientX - g.startX) < 4) finish();
          }}
        >
          <span aria-hidden="true">✂</span>
        </button>
      </div>
      <div className="ps-slip-reply">
        <p className="ps-kicker">
          {cut ? "Cut out. Now post it." : "Reply slip · cut along the line"}
        </p>
        <p className="ps-slip-to">
          To: <a href={`mailto:${email}`}>{email}</a>
        </p>
        <div className="ps-slip-row">
          <a className="ps-button" href={`mailto:${email}`}>
            Write to me
          </a>
          <CopyEmail email={email} className="ps-button ps-button-quiet" />
        </div>
      </div>
    </div>
  );
}
