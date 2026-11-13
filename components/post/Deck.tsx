"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { ReviewLink } from "@/components/review/portfolio";

export type Card = {
  id: number;
  code: string;
  title: string;
  category: string;
  year?: number;
  short: string;
  problem?: string;
  facts: { value: string; label: string }[];
  stack: string[];
  image: string;
  links: ReviewLink[];
};

// A fixed, hand-placed tilt per card, so the pile looks dropped rather than stacked by a machine.
const TILT = [-2.2, 1.6, -0.8, 2.4, -1.8, 0.9, -2.6, 1.2];
const FLING = 110;

/**
 * A pile of postcards. The top card follows the pointer one to one while you drag it; let go far
 * enough and it slides to the bottom of the pile. Buttons and arrow keys do the same, and the
 * index beside the pile brings any card to the top.
 */
export default function Deck({ cards }: { cards: Card[] }) {
  const [order, setOrder] = useState(() => cards.map((_, i) => i));
  const [side, setSide] = useState<"front" | "back">("front");
  const [turning, setTurning] = useState(false);
  const els = useRef<(HTMLElement | null)[]>([]);
  const drag = useRef<{
    id: number;
    x: number;
    y: number;
    dx: number;
    t: number;
    v: number;
  } | null>(null);
  const busy = useRef(false);
  const top = order[0];

  const bringToTop = (k: number) => {
    const at = order.indexOf(k);
    setOrder([...order.slice(at), ...order.slice(0, at)]);
    setSide("front");
  };
  const back = () => {
    setOrder([order[order.length - 1], ...order.slice(0, -1)]);
    setSide("front");
  };

  /** Throw the top card off one side, then tuck it under the pile. */
  const fling = (dir: 1 | -1, from?: { dx: number; dy: number }) => {
    const el = els.current[top];
    if (!el || busy.current) return;
    busy.current = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.style.transition = reduce ? "none" : "transform 0.28s cubic-bezier(0.4, 0, 1, 1)";
    el.style.transform = `translate(${dir * 115}%, ${(from?.dy ?? 0) - 30}px) rotate(${dir * 14}deg)`;
    window.setTimeout(
      () => {
        el.style.transition = "";
        el.style.transform = "";
        setOrder((current) => [...current.slice(1), current[0]]);
        setSide("front");
        busy.current = false;
      },
      reduce ? 0 : 280,
    );
  };

  const turn = () => {
    if (turning) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSide((s) => (s === "front" ? "back" : "front"));
      return;
    }
    // A flat turn: the card narrows to an edge, changes face, and widens again. No 3D transform.
    setTurning(true);
    window.setTimeout(() => {
      setSide((s) => (s === "front" ? "back" : "front"));
      setTurning(false);
    }, 160);
  };

  const onDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || busy.current) return;
    if ((event.target as Element).closest("a, button")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.style.transition = "none";
    drag.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      dx: 0,
      t: event.timeStamp,
      v: 0,
    };
  };
  const onMove = (event: React.PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d || d.id !== event.pointerId) return;
    const dx = event.clientX - d.x;
    const dy = event.clientY - d.y;
    const dt = Math.max(1, event.timeStamp - d.t);
    d.v = (dx - d.dx) / dt;
    d.dx = dx;
    d.t = event.timeStamp;
    // Straight from the pointer: the card's grab point stays exactly under the cursor.
    event.currentTarget.style.transform = `translate(${dx}px, ${dy}px) rotate(${TILT[top] + dx * 0.035}deg)`;
  };
  const onUp = (event: React.PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d || d.id !== event.pointerId) return;
    drag.current = null;
    const dy = event.clientY - d.y;
    if (Math.abs(d.dx) > FLING || Math.abs(d.v) > 0.8) {
      fling(d.dx + d.v * 100 > 0 ? 1 : -1, { dx: d.dx, dy });
      return;
    }
    const el = event.currentTarget;
    el.style.transition = "transform 0.42s cubic-bezier(0.2, 1.5, 0.4, 1)";
    el.style.transform = "";
    if (Math.abs(d.dx) < 4 && Math.abs(dy) < 4) turn();
  };

  const onKey = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") fling(1);
    else if (event.key === "ArrowLeft") back();
    else return;
    event.preventDefault();
  };

  return (
    <div className="ps-deck" onKeyDown={onKey}>
      <div className="ps-pile" aria-live="polite">
        {cards.map((card, k) => {
          const pos = order.indexOf(k);
          const isTop = pos === 0;
          const face = isTop ? side : "front";
          return (
            <article
              key={card.id}
              ref={(el) => {
                els.current[k] = el;
              }}
              className="ps-card"
              data-pos={Math.min(pos, 4)}
              data-face={face}
              data-turning={(isTop && turning) || undefined}
              aria-hidden={!isTop || undefined}
              inert={!isTop}
              aria-label={`${card.title}, ${face === "front" ? "picture side" : "message side"}`}
              style={
                {
                  "--x": `${Math.min(pos, 3) * 7}px`,
                  "--y": `${Math.min(pos, 3) * 9}px`,
                  "--r": `${TILT[k % TILT.length]}deg`,
                  zIndex: cards.length - pos,
                } as React.CSSProperties
              }
              onPointerDown={isTop ? onDown : undefined}
              onPointerMove={isTop ? onMove : undefined}
              onPointerUp={isTop ? onUp : undefined}
              onPointerCancel={isTop ? onUp : undefined}
            >
              <div className="ps-card-face">
                {face === "front" ? (
                  <div className="ps-front">
                    <Image
                      src={card.image}
                      alt={`${card.title} screenshot`}
                      fill
                      sizes="(max-width: 760px) 92vw, 720px"
                      priority={k === 0}
                      draggable={false}
                    />
                    <span className="ps-front-code">
                      {card.code} · {card.category}
                      {card.year ? ` · ${card.year}` : ""}
                    </span>
                    <p className="ps-front-band">
                      <span>Greetings from</span>
                      <strong>{card.title}</strong>
                    </p>
                  </div>
                ) : (
                  <div className="ps-back">
                    <div className="ps-back-note">
                      <p className="ps-back-short">{card.short}</p>
                      {card.problem && (
                        <p>
                          <b>The problem.</b> {card.problem}
                        </p>
                      )}
                      <p className="ps-back-stack">{card.stack.join(" · ")}</p>
                    </div>
                    <div className="ps-back-address">
                      <span className="ps-mini-stamp" aria-hidden="true">
                        <span>{card.code}</span>
                        <span>{card.year ?? "—"}</span>
                      </span>
                      <ul>
                        {card.facts.length ? (
                          card.facts.slice(0, 4).map((fact) => (
                            <li key={fact.label}>
                              <b>{fact.value}</b> {fact.label}
                            </li>
                          ))
                        ) : (
                          <li>No counted facts on this one yet.</li>
                        )}
                      </ul>
                      <p className="ps-links">
                        {card.links.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            {...(link.external
                              ? { target: "_blank", rel: "noopener noreferrer" }
                              : {})}
                          >
                            {link.label}
                            <span aria-hidden="true">{link.external ? " ↗" : " →"}</span>
                          </a>
                        ))}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="ps-deck-side">
        <p className="ps-deck-count">
          <span>{String(order[0] + 1).padStart(2, "0")}</span> /{" "}
          {String(cards.length).padStart(2, "0")}
        </p>
        <div className="ps-deck-buttons">
          <button type="button" onClick={back} aria-label="Previous card">
            ←
          </button>
          <button type="button" className="ps-turn" onClick={turn} aria-pressed={side === "back"}>
            {side === "front" ? "Turn it over" : "Picture side"}
          </button>
          <button type="button" onClick={() => fling(1)} aria-label="Next card">
            →
          </button>
        </div>
        <p className="ps-deck-hint">Drag the top card away, or tap it to read the back.</p>
        <ol className="ps-index" aria-label="All postcards">
          {cards.map((card, k) => (
            <li key={card.id}>
              <button
                type="button"
                aria-current={k === top || undefined}
                onClick={() => bringToTop(k)}
              >
                <span>{card.code}</span> {card.title}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
