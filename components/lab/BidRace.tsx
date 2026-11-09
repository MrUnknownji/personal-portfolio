"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  RACE_START_PRICE,
  priceSeenBy,
  serverPriceAt,
  simulateRace,
  summarizeRace,
  type BidderId,
  type RaceMode,
  type RaceNetwork,
  type RacePacket,
} from "@/components/lab/bidRace";

const SLOW_MOTION = 3;
const nodes = { A: { x: 92, y: 62 }, B: { x: 92, y: 198 }, server: { x: 548, y: 130 } } as const;
const rupees = (value: number) => `₹${value.toLocaleString("en-IN")}`;

const modes: { id: RaceMode; label: string; note: string }[] = [
  { id: "overwrite", label: "Last write wins", note: "Store whatever arrives." },
  { id: "authority", label: "Server authority", note: "Accept only bids above the current price." },
  {
    id: "idempotent",
    label: "Authority + request IDs",
    note: "Also answer a retried request once.",
  },
];
const networks: { id: RaceNetwork; label: string }[] = [
  { id: "reliable", label: "Reliable" },
  { id: "lost-bid", label: "Drop A's first bid" },
  { id: "lost-reply", label: "Drop the reply to A" },
];

function packetPosition(packet: RacePacket, t: number) {
  const progress = Math.min(
    1,
    Math.max(0, (t - packet.sendAt) / Math.max(1, packet.arriveAt - packet.sendAt)),
  );
  const from = nodes[packet.from];
  const to = nodes[packet.to];
  return { x: from.x + (to.x - from.x) * progress, y: from.y + (to.y - from.y) * progress };
}

function ChoiceGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: T; label: string; note?: string }[];
  value: T;
  onChange: (next: T) => void;
}) {
  return (
    <div className="bid-race-choice">
      <span className="bid-race-choice-label">{label}</span>
      <div className="bid-race-modes" role="group" aria-label={label}>
        {options.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={value === item.id}
            onClick={() => onChange(item.id)}
          >
            <strong>{item.label}</strong>
            {item.note && <span>{item.note}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function BidRace() {
  const [latency, setLatency] = useState<Record<BidderId, number>>({ A: 120, B: 300 });
  const [mode, setMode] = useState<RaceMode>("overwrite");
  const [network, setNetwork] = useState<RaceNetwork>("reliable");
  const [elapsed, setElapsed] = useState<number | null>(null);
  const frame = useRef(0);
  const result = useMemo(() => simulateRace(latency, mode, network), [latency, mode, network]);
  const finished = elapsed !== null && elapsed >= result.duration;
  const t = elapsed ?? 0;

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const reset = () => {
    cancelAnimationFrame(frame.current);
    setElapsed(null);
  };

  const run = () => {
    cancelAnimationFrame(frame.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setElapsed(result.duration);
      return;
    }
    const startedAt = performance.now();
    const tick = (now: number) => {
      const next = Math.min(result.duration, (now - startedAt) / SLOW_MOTION);
      setElapsed(next);
      if (next < result.duration) frame.current = requestAnimationFrame(tick);
    };
    setElapsed(0);
    frame.current = requestAnimationFrame(tick);
  };

  const inFlight =
    elapsed === null
      ? []
      : result.packets.filter(
          (packet) => packet.sendAt <= t && (packet.droppedAt ?? packet.arriveAt) > t,
        );
  const visibleEvents = elapsed === null ? [] : result.events.filter((event) => event.at <= t);
  const serverPrice = elapsed === null ? RACE_START_PRICE : serverPriceAt(result, t);
  const summary = summarizeRace(result);
  const verdict = result.lostUpdates > 0 || result.selfOutbids > 0 ? "bad" : "good";

  return (
    <div className="bid-race">
      <div className="bid-race-controls">
        <ChoiceGroup
          label="Server rule"
          options={modes}
          value={mode}
          onChange={(next) => {
            reset();
            setMode(next);
          }}
        />
        <ChoiceGroup
          label="Network"
          options={networks}
          value={network}
          onChange={(next) => {
            reset();
            setNetwork(next);
          }}
        />
        {(["A", "B"] as const).map((bidder) => (
          <label key={bidder} className="bid-race-latency">
            <span>
              Bidder {bidder} latency <b>{latency[bidder]} ms</b>
            </span>
            <input
              type="range"
              min={40}
              max={600}
              step={20}
              value={latency[bidder]}
              onChange={(event) => {
                reset();
                setLatency((current) => ({ ...current, [bidder]: Number(event.target.value) }));
              }}
            />
          </label>
        ))}
      </div>

      <svg
        className="bid-race-diagram"
        viewBox="0 0 640 260"
        role="img"
        aria-label={`Bidders A and B each send a bid to the server. ${finished ? summary : "Press Send both bids to run the race."}`}
      >
        <path
          className="bid-race-wire"
          d={`M${nodes.A.x} ${nodes.A.y} L${nodes.server.x} ${nodes.server.y} M${nodes.B.x} ${nodes.B.y} L${nodes.server.x} ${nodes.server.y}`}
        />
        {(["A", "B"] as const).map((bidder) => (
          <g
            key={bidder}
            className="bid-race-node"
            transform={`translate(${nodes[bidder].x} ${nodes[bidder].y})`}
          >
            <rect x="-66" y="-30" width="132" height="60" />
            <text className="bid-race-node-label" y="-8">
              Bidder {bidder}
            </text>
            <text className="bid-race-node-price" y="17">
              sees {rupees(priceSeenBy(result, bidder, elapsed === null ? -1 : t))}
            </text>
          </g>
        ))}
        <g
          className="bid-race-node bid-race-server"
          transform={`translate(${nodes.server.x} ${nodes.server.y})`}
        >
          <rect x="-70" y="-40" width="140" height="80" />
          <text className="bid-race-node-label" y="-14">
            Server
          </text>
          <text className="bid-race-node-price" y="18">
            {rupees(serverPrice)}
          </text>
        </g>
        {inFlight.map((packet) => {
          const position = packetPosition(packet, t);
          const nearDrop = packet.droppedAt !== undefined && packet.droppedAt - t < 40;
          return (
            <g
              key={packet.id}
              className={`bid-race-packet bid-race-packet-${packet.kind}${nearDrop ? " bid-race-packet-dropping" : ""}`}
              transform={`translate(${position.x} ${position.y})`}
            >
              <circle r="9" />
              <text y="-15">
                {packet.requestId} · {packet.kind === "reject" ? "✕ " : ""}
                {rupees(packet.amount)}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="bid-race-actions">
        <button
          type="button"
          className="bid-race-run"
          onClick={run}
          disabled={elapsed !== null && !finished}
        >
          {finished ? "Run again ↺" : "Send both bids ↗"}
        </button>
        <span>
          Slow motion ×{SLOW_MOTION} · Timeouts resend the same request · Start{" "}
          {rupees(RACE_START_PRICE)}
        </span>
      </div>

      <ol className="bid-race-log" aria-label="Event log">
        {visibleEvents.map((event) => (
          <li key={`${event.at}-${event.text}`} data-tone={event.tone}>
            <span>{Math.round(event.at)} ms</span>
            {event.text}
          </li>
        ))}
      </ol>
      <p className="bid-race-summary" role="status" data-verdict={verdict}>
        {finished ? summary : " "}
      </p>
    </div>
  );
}
