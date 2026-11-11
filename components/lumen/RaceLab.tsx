"use client";

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  RACE_START_PRICE,
  RACE_INCREMENT,
  priceSeenBy,
  serverPriceAt,
  simulateRace,
  summarizeRace,
  type BidderId,
  type RaceMode,
  type RaceNetwork,
  type RacePacket,
  type RaceResult,
} from "@/components/lab/bidRace";
import { haptic, tone } from "./feedback";
import { SoftLayers, softStyle } from "./Soft";

/*
 * "Two bids, one price", drawn as a bench: two phones on the left, the server on the right,
 * and the network between them. Each phone's network is picked from its signal bars, so a
 * latency is a thing people recognise (fibre, 4G, 3G) rather than a number on a slider. The
 * run is the shared, tested simulation from the live site's lab, replayed in slow motion.
 */

const SLOW_MOTION = 3;
const rupees = (value: number) => `₹${value.toLocaleString("en-IN")}`;

const SIGNALS = [
  { label: "Weak signal", short: "Weak", ms: 600 },
  { label: "3G", short: "3G", ms: 300 },
  { label: "4G", short: "4G", ms: 120 },
  { label: "Fibre", short: "Fibre", ms: 40 },
] as const;

const RULES: { id: RaceMode; label: string; note: string }[] = [
  {
    id: "overwrite",
    label: "Last write wins",
    note: "The server stores whatever arrives, in the order it arrives.",
  },
  {
    id: "authority",
    label: "Server authority",
    note: "The server only accepts a bid above its current price.",
  },
  {
    id: "idempotent",
    label: "Authority + IDs",
    note: "Authority, and a resent request is answered once, by its ID.",
  },
];
const NETWORKS: { id: RaceNetwork; label: string; note: string }[] = [
  { id: "reliable", label: "Reliable", note: "Every message arrives." },
  { id: "lost-bid", label: "Lose A's bid", note: "A's first bid never reaches the server." },
  {
    id: "lost-reply",
    label: "Lose A's reply",
    note: "The server's answer to A is lost on the way back.",
  },
];

type Point = { x: number; y: number };
type Wire = [Point, Point, Point, Point];

/** Wires in percent of the network area: a gentle S from each phone into the server. */
function wiresFor(vertical: boolean): Record<BidderId, Wire> {
  if (vertical) {
    return {
      A: [
        { x: 25, y: 0 },
        { x: 25, y: 55 },
        { x: 50, y: 45 },
        { x: 50, y: 100 },
      ],
      B: [
        { x: 75, y: 0 },
        { x: 75, y: 55 },
        { x: 50, y: 45 },
        { x: 50, y: 100 },
      ],
    };
  }
  return {
    A: [
      { x: 0, y: 25 },
      { x: 48, y: 25 },
      { x: 52, y: 50 },
      { x: 100, y: 50 },
    ],
    B: [
      { x: 0, y: 75 },
      { x: 48, y: 75 },
      { x: 52, y: 50 },
      { x: 100, y: 50 },
    ],
  };
}

function pointOn([p0, p1, p2, p3]: Wire, t: number): Point {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  };
}

const wirePath = ([p0, p1, p2, p3]: Wire) =>
  `M${p0.x} ${p0.y} C${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`;

/** Where a packet sits on its bidder's wire: 0 at the phone, 1 at the server. */
function packetAt(packet: RacePacket, t: number, wires: Record<BidderId, Wire>) {
  const bidder = (packet.from === "server" ? packet.to : packet.from) as BidderId;
  const travel = Math.max(1, packet.arriveAt - packet.sendAt);
  const progress = Math.min(1, Math.max(0, (t - packet.sendAt) / travel));
  return pointOn(wires[bidder], packet.from === "server" ? 1 - progress : progress);
}

/** What a phone shows: the last answer it heard, or that it is still waiting for one. */
function phoneStatus(result: RaceResult, bidder: BidderId, t: number, started: boolean) {
  if (!started) return { text: "Ready", tone: "idle" };
  const { packets } = result;
  if (result.events.some((e) => e.at <= t && e.text.startsWith(`${bidder} gives up`)))
    return { text: "Gave up", tone: "bad" };
  const heard = packets
    .filter(
      (p) =>
        p.to === bidder &&
        p.droppedAt === undefined &&
        p.arriveAt <= t &&
        (p.kind === "ack" || p.kind === "reject"),
    )
    .at(-1);
  const waiting = packets.some(
    (p) => p.from === bidder && p.sendAt <= t && (heard ? p.sendAt > heard.arriveAt : true),
  );
  if (waiting) return { text: "Waiting for the server", tone: "wait" };
  if (!heard) return { text: "Gave up", tone: "bad" };
  return heard.kind === "ack"
    ? { text: `Told: you lead at ${rupees(heard.amount)}`, tone: "good" }
    : { text: "Told: bid too low", tone: "wait" };
}

/** A row of choices with one sliding marker, chosen by click or arrow keys. */
function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: T; label: string; note: string }[];
  value: T;
  onChange: (next: T) => void;
}) {
  const index = options.findIndex((option) => option.id === value);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const move = (event: KeyboardEvent, step: number) => {
    event.preventDefault();
    const next = (index + step + options.length) % options.length;
    onChange(options[next].id);
    refs.current[next]?.focus();
  };
  return (
    <div className="ld-seg-field">
      <span className="ld-anno" id={`ld-seg-${label}`}>
        {label}
      </span>
      <div
        className="ld-seg"
        role="radiogroup"
        aria-labelledby={`ld-seg-${label}`}
        style={{ "--i": index, "--n": options.length } as React.CSSProperties}
      >
        <span className="ld-seg-marker" aria-hidden="true" />
        {options.map((option, i) => (
          <button
            key={option.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={i === index}
            tabIndex={i === index ? 0 : -1}
            onClick={() => onChange(option.id)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowDown") move(event, 1);
              if (event.key === "ArrowLeft" || event.key === "ArrowUp") move(event, -1);
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="ld-seg-note">{options[index].note}</p>
    </div>
  );
}

/** Signal bars that are also the control: tap a bar to set how good the phone's network is. */
function SignalBars({
  bidder,
  level,
  onChange,
}: {
  bidder: BidderId;
  level: number;
  onChange: (next: number) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const move = (event: KeyboardEvent, step: number) => {
    event.preventDefault();
    const next = Math.min(SIGNALS.length - 1, Math.max(0, level + step));
    onChange(next);
    refs.current[next]?.focus();
  };
  return (
    <div className="ld-signal">
      <div className="ld-signal-bars" role="radiogroup" aria-label={`Bidder ${bidder}'s network`}>
        {SIGNALS.map((signal, i) => (
          <button
            key={signal.label}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={i === level}
            aria-label={`${signal.label}, ${signal.ms} ms each way`}
            tabIndex={i === level ? 0 : -1}
            data-lit={i <= level}
            style={{ "--h": (i + 1) / SIGNALS.length } as React.CSSProperties}
            onClick={() => onChange(i)}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight" || event.key === "ArrowUp") move(event, 1);
              if (event.key === "ArrowLeft" || event.key === "ArrowDown") move(event, -1);
            }}
          >
            <span />
          </button>
        ))}
      </div>
      <span className="ld-signal-read" aria-hidden="true">
        <b>{SIGNALS[level].short}</b> {SIGNALS[level].ms} ms
      </span>
    </div>
  );
}

export default function RaceLab() {
  const [levels, setLevels] = useState<Record<BidderId, number>>({ A: 2, B: 1 });
  const [mode, setMode] = useState<RaceMode>("overwrite");
  const [network, setNetwork] = useState<RaceNetwork>("reliable");
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [vertical, setVertical] = useState(false);
  const frame = useRef(0);

  const latency = useMemo(() => ({ A: SIGNALS[levels.A].ms, B: SIGNALS[levels.B].ms }), [levels]);
  const result = useMemo(() => simulateRace(latency, mode, network), [latency, mode, network]);
  const wires = useMemo(() => wiresFor(vertical), [vertical]);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)");
    const sync = () => setVertical(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => {
      query.removeEventListener("change", sync);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  const started = elapsed !== null;
  const t = elapsed ?? -1;
  const finished = started && t >= result.duration;
  const running = started && !finished;

  const reset = () => {
    cancelAnimationFrame(frame.current);
    setElapsed(null);
  };

  const run = () => {
    cancelAnimationFrame(frame.current);
    tone("morph", 0.6);
    haptic(10);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setElapsed(result.duration);
      return;
    }
    const startedAt = performance.now();
    const tick = (now: number) => {
      const next = Math.min(result.duration, (now - startedAt) / SLOW_MOTION);
      setElapsed(next);
      if (next < result.duration) frame.current = requestAnimationFrame(tick);
      else tone("settle", 0.5);
    };
    setElapsed(0);
    frame.current = requestAnimationFrame(tick);
  };

  const choose = (apply: () => void) => {
    reset();
    apply();
    tone("snap", 0.4);
  };

  const inFlight = started
    ? result.packets.filter((p) => p.sendAt <= t && (p.droppedAt ?? p.arriveAt) > t)
    : [];
  const losses = started
    ? result.packets.filter((p) => p.droppedAt !== undefined && p.droppedAt <= t)
    : [];
  const writes = started ? result.history.filter((change) => change.at <= t) : [];
  const serverPrice = started ? serverPriceAt(result, t) : RACE_START_PRICE;
  const events = started ? result.events.filter((event) => event.at <= t) : [];
  const verdict = result.lostUpdates > 0 || result.selfOutbids > 0 ? "bad" : "good";
  const bid = rupees(RACE_START_PRICE + RACE_INCREMENT);

  return (
    <div className="ld-rl">
      <div className="ld-rl-controls">
        <Segmented
          label="Server rule"
          options={RULES}
          value={mode}
          onChange={(next) => choose(() => setMode(next))}
        />
        <Segmented
          label="Network trouble"
          options={NETWORKS}
          value={network}
          onChange={(next) => choose(() => setNetwork(next))}
        />
      </div>

      <div className="ld-bench" data-orient={vertical ? "v" : "h"} data-running={running}>
        {(["A", "B"] as const).map((bidder) => {
          const status = phoneStatus(result, bidder, t, started);
          return (
            <section
              key={bidder}
              className="ld-phone"
              data-node={bidder}
              aria-label={`Bidder ${bidder}`}
            >
              <header>
                <span className="ld-phone-id" aria-hidden="true">
                  {bidder}
                </span>
                <span className="ld-phone-status" data-tone={status.tone}>
                  {status.text}
                </span>
              </header>
              <p className="ld-phone-price">
                <span className="ld-anno">Sees</span>
                <b>{rupees(priceSeenBy(result, bidder, t))}</b>
              </p>
              <SignalBars
                bidder={bidder}
                level={levels[bidder]}
                onChange={(next) => choose(() => setLevels((now) => ({ ...now, [bidder]: next })))}
              />
            </section>
          );
        })}

        <div className="ld-net" aria-hidden="true">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <path className="ld-net-wire" d={wirePath(wires.A)} />
            <path className="ld-net-wire" d={wirePath(wires.B)} />
          </svg>
          {losses.map((packet) => {
            const at = packetAt(packet, packet.droppedAt!, wires);
            return (
              <span
                key={`x${packet.id}`}
                className="ld-net-loss"
                style={{ "--x": at.x, "--y": at.y } as React.CSSProperties}
              >
                ✕
              </span>
            );
          })}
          {inFlight.map((packet) => {
            const at = packetAt(packet, t, wires);
            const dropping = packet.droppedAt !== undefined && packet.droppedAt - t < 60;
            return (
              <span
                key={packet.id}
                className="ld-pkt"
                data-kind={packet.kind}
                data-dropping={dropping}
                style={{ "--x": at.x, "--y": at.y } as React.CSSProperties}
              >
                {packet.kind === "bid"
                  ? `${packet.requestId} ${rupees(packet.amount)}`
                  : packet.kind === "ack"
                    ? `✓ ${packet.requestId}`
                    : packet.kind === "reject"
                      ? `✕ ${packet.requestId}`
                      : rupees(packet.amount)}
              </span>
            );
          })}
        </div>

        <section className="ld-server" aria-label="Server">
          <span className="ld-anno">Server · price</span>
          <b className="ld-server-price" key={serverPrice}>
            {rupees(serverPrice)}
          </b>
          <div className="ld-tally" aria-hidden="true">
            {writes.map((change, i) => {
              const before = i === 0 ? RACE_START_PRICE : writes[i - 1].price;
              return <i key={change.at} data-lost={change.price <= before} />;
            })}
          </div>
          <span className="ld-anno">
            {writes.length} {writes.length === 1 ? "write" : "writes"} stored
          </span>
        </section>
      </div>

      <div className="ld-rl-run">
        <button
          type="button"
          className="ld-key ld-soft ld-key-signal ld-rl-go"
          style={softStyle("signal")}
          onClick={run}
          disabled={running}
        >
          <SoftLayers />
          <span>{running ? "Bidding…" : finished ? "Run again ↺" : `Both bid ${bid} at once`}</span>
        </button>
        <div className="ld-rl-clock" aria-hidden="true">
          <div className="ld-rl-track">
            {result.events.map((event) => (
              <i
                key={`${event.at}-${event.text}`}
                data-tone={event.tone}
                data-seen={started && event.at <= t}
                style={{ "--at": event.at / result.duration } as React.CSSProperties}
              />
            ))}
            <span
              className="ld-rl-head"
              style={
                { "--at": started ? Math.min(1, t / result.duration) : 0 } as React.CSSProperties
              }
            />
          </div>
          <span className="ld-anno">
            {started ? Math.round(Math.min(t, result.duration)) : 0} ms · ×{SLOW_MOTION} slower
          </span>
        </div>
      </div>

      <div className="ld-rl-out">
        <p className="ld-rl-verdict" role="status" data-verdict={finished ? verdict : undefined}>
          {finished
            ? summarizeRace(result)
            : running
              ? "Watch the server's writes: a grey mark moved the price, a red one did not."
              : "Both bidders see the same price and bid at the same moment. Who does the server believe?"}
        </p>
        <ol className="ld-rl-log" aria-label="What happened">
          {events.map((event) => (
            <li key={`${event.at}-${event.text}`} data-tone={event.tone}>
              <span className="ld-anno">{Math.round(event.at)} ms</span>
              {event.text}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
