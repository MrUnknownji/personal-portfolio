// Pure simulation for the "Two bids, one price" lab study.
//
// Two bidders see the same price and bid at the same moment. Every request waits for
// a reply; if none arrives before its timeout, the bidder resends the same request.
// The server applies one of three rules, and the network can drop one message, which
// is how real systems end up with lost updates and duplicate bids.

export type BidderId = "A" | "B";
export type RaceMode = "overwrite" | "authority" | "idempotent";
export type RaceNetwork = "reliable" | "lost-bid" | "lost-reply";

export type RacePacket = {
  id: string;
  from: BidderId | "server";
  to: BidderId | "server";
  sendAt: number;
  arriveAt: number;
  /** Set when the network drops this message part-way. */
  droppedAt?: number;
  amount: number;
  kind: "bid" | "ack" | "reject" | "broadcast";
  requestId: string;
};

export type RaceEvent = { at: number; text: string; tone?: "warn" | "good" };

export type RaceResult = {
  packets: RacePacket[];
  events: RaceEvent[];
  finalPrice: number;
  history: { at: number; price: number }[];
  /** Bids the server stored, including duplicates. */
  storedBids: number;
  /** Stored bids that did not move the price. */
  lostUpdates: number;
  /** Times a bidder outbid its own winning bid after a retry. */
  selfOutbids: number;
  /** Retries the server recognised by request ID and answered without a new write. */
  duplicatesIgnored: number;
  duration: number;
};

export const RACE_START_PRICE = 4250;
export const RACE_INCREMENT = 50;
const MAX_ATTEMPTS = 3;

const rupees = (value: number) => `₹${value.toLocaleString("en-IN")}`;
const timeoutFor = (latency: number) => latency * 2 + 250;

type Pending = { requestId: string; amount: number; attempt: number };
type QueueItem =
  | { at: number; seq: number; type: "server"; packet: RacePacket }
  | { at: number; seq: number; type: "client"; packet: RacePacket }
  | { at: number; seq: number; type: "timeout"; bidder: BidderId; requestId: string };
type NewQueueItem =
  | { at: number; type: "server" | "client"; packet: RacePacket }
  | { at: number; type: "timeout"; bidder: BidderId; requestId: string };

export function simulateRace(
  latency: Record<BidderId, number>,
  mode: RaceMode,
  network: RaceNetwork = "reliable",
  startPrice = RACE_START_PRICE,
): RaceResult {
  const packets: RacePacket[] = [];
  const events: RaceEvent[] = [];
  const history: { at: number; price: number }[] = [];
  const queue: QueueItem[] = [];
  const pending: Record<BidderId, Pending | null> = { A: null, B: null };
  const answered = new Map<string, { kind: "ack" | "reject"; amount: number }>();
  const requestCount: Record<BidderId, number> = { A: 0, B: 0 };
  const stats = { storedBids: 0, lostUpdates: 0, selfOutbids: 0, duplicatesIgnored: 0 };
  let price = startPrice;
  let leader: BidderId | null = null;
  let seq = 0;
  let dropBidPending = network === "lost-bid";
  let dropReplyPending = network === "lost-reply";

  const push = (item: NewQueueItem) => queue.push({ ...item, seq: seq++ } as QueueItem);
  const other = (bidder: BidderId): BidderId => (bidder === "A" ? "B" : "A");

  const send = (packet: Omit<RacePacket, "id" | "arriveAt">, drop = false) => {
    const lat = packet.to === "server" ? latency[packet.from as BidderId] : latency[packet.to];
    const full: RacePacket = { ...packet, id: `p${packets.length}`, arriveAt: packet.sendAt + lat };
    if (drop) full.droppedAt = packet.sendAt + lat / 2;
    packets.push(full);
    if (!drop)
      push({ at: full.arriveAt, type: packet.to === "server" ? "server" : "client", packet: full });
    return full;
  };

  const sendBid = (bidder: BidderId, at: number, request: Pending) => {
    const drop = dropBidPending && bidder === "A";
    if (drop) dropBidPending = false;
    const packet = send(
      {
        from: bidder,
        to: "server",
        sendAt: at,
        amount: request.amount,
        kind: "bid",
        requestId: request.requestId,
      },
      drop,
    );
    if (drop)
      events.push({
        at: packet.droppedAt!,
        text: `The network drops ${bidder}'s bid ${request.requestId}`,
        tone: "warn",
      });
    push({
      at: at + timeoutFor(latency[bidder]),
      type: "timeout",
      bidder,
      requestId: request.requestId,
    });
  };

  const newRequest = (bidder: BidderId, amount: number, at: number) => {
    requestCount[bidder] += 1;
    const request = { requestId: `${bidder}${requestCount[bidder]}`, amount, attempt: 1 };
    pending[bidder] = request;
    sendBid(bidder, at, request);
  };

  const reply = (
    to: BidderId,
    at: number,
    kind: "ack" | "reject",
    amount: number,
    requestId: string,
  ) => {
    const drop = dropReplyPending && to === "A" && kind === "ack";
    if (drop) dropReplyPending = false;
    const packet = send({ from: "server", to, sendAt: at, amount, kind, requestId }, drop);
    if (drop)
      events.push({
        at: packet.droppedAt!,
        text: `The network drops the server's reply to ${to}`,
        tone: "warn",
      });
    answered.set(requestId, { kind, amount });
  };

  const accept = (bidder: BidderId, at: number, amount: number, requestId: string) => {
    price = amount;
    leader = bidder;
    history.push({ at, price });
    reply(bidder, at, "ack", price, requestId);
    send({
      from: "server",
      to: other(bidder),
      sendAt: at,
      amount: price,
      kind: "broadcast",
      requestId,
    });
  };

  for (const bidder of ["A", "B"] as const) {
    events.push({
      at: 0,
      text: `${bidder} sees ${rupees(startPrice)} and bids ${rupees(startPrice + RACE_INCREMENT)}`,
    });
    newRequest(bidder, startPrice + RACE_INCREMENT, 0);
  }

  while (queue.length > 0) {
    queue.sort((first, second) => first.at - second.at || first.seq - second.seq);
    const item = queue.shift()!;

    if (item.type === "timeout") {
      const request = pending[item.bidder];
      if (!request || request.requestId !== item.requestId) continue;
      if (request.attempt >= MAX_ATTEMPTS) {
        events.push({
          at: item.at,
          text: `${item.bidder} gives up on ${request.requestId}`,
          tone: "warn",
        });
        pending[item.bidder] = null;
        continue;
      }
      request.attempt += 1;
      events.push({
        at: item.at,
        text: `${item.bidder} hears nothing and resends ${request.requestId}`,
      });
      sendBid(item.bidder, item.at, request);
      continue;
    }

    const { packet } = item;
    if (item.type === "client") {
      const bidder = packet.to as BidderId;
      const request = pending[bidder];
      if (packet.kind === "broadcast" || !request || request.requestId !== packet.requestId)
        continue;
      pending[bidder] = null;
      if (packet.kind === "reject") {
        events.push({ at: item.at, text: `${bidder} retries at ${rupees(packet.amount)}` });
        newRequest(bidder, packet.amount, item.at);
      }
      continue;
    }

    // The server receives a bid.
    const bidder = packet.from as BidderId;
    const minimum = price + RACE_INCREMENT;
    const earlier = answered.get(packet.requestId);

    if (mode === "idempotent" && earlier) {
      stats.duplicatesIgnored += 1;
      events.push({
        at: item.at,
        text: `Server recognises ${packet.requestId} as a retry and repeats its answer`,
        tone: "good",
      });
      reply(bidder, item.at, earlier.kind, earlier.amount, packet.requestId);
      continue;
    }

    if (mode === "overwrite") {
      stats.storedBids += 1;
      const lost = packet.amount <= price;
      if (lost) stats.lostUpdates += 1;
      events.push({
        at: item.at,
        text: `Server writes ${rupees(packet.amount)} from ${bidder}${lost ? ", overwriting a bid it already counted" : ""}`,
        tone: lost ? "warn" : undefined,
      });
      accept(bidder, item.at, packet.amount, packet.requestId);
      continue;
    }

    if (packet.amount >= minimum) {
      stats.storedBids += 1;
      const selfOutbid = leader === bidder;
      if (selfOutbid) stats.selfOutbids += 1;
      events.push({
        at: item.at,
        text: selfOutbid
          ? `Server accepts ${rupees(packet.amount)} from ${bidder}, who was already winning: ${bidder} outbid itself`
          : `Server accepts ${rupees(packet.amount)} from ${bidder}`,
        tone: selfOutbid ? "warn" : undefined,
      });
      accept(bidder, item.at, packet.amount, packet.requestId);
    } else {
      events.push({
        at: item.at,
        text: `Server rejects ${bidder}'s ${rupees(packet.amount)}: the minimum is now ${rupees(minimum)}`,
      });
      reply(bidder, item.at, "reject", minimum, packet.requestId);
    }
  }

  events.sort((first, second) => first.at - second.at);
  const duration = Math.max(
    ...packets.map((packet) => packet.droppedAt ?? packet.arriveAt),
    ...events.map((event) => event.at),
  );
  return { packets, events, finalPrice: price, history, ...stats, duration };
}

/** The highest price each bidder has been told about by time `t`. */
export function priceSeenBy(
  result: RaceResult,
  bidder: BidderId,
  t: number,
  startPrice = RACE_START_PRICE,
) {
  return result.packets
    .filter(
      (packet) =>
        packet.to === bidder &&
        packet.droppedAt === undefined &&
        packet.kind !== "reject" &&
        packet.arriveAt <= t,
    )
    .reduce((highest, packet) => Math.max(highest, packet.amount), startPrice);
}

/** The price stored on the server at time `t`. */
export function serverPriceAt(result: RaceResult, t: number, startPrice = RACE_START_PRICE) {
  return result.history.filter((change) => change.at <= t).at(-1)?.price ?? startPrice;
}

/** A plain-language verdict for a finished run. */
export function summarizeRace(result: RaceResult) {
  const parts = [`Final price ${rupees(result.finalPrice)}.`];
  if (result.lostUpdates > 0) {
    parts.push(
      `${result.lostUpdates} stored bid${result.lostUpdates > 1 ? "s" : ""} never moved the price: a lost update, and both bidders think they are winning.`,
    );
  }
  if (result.selfOutbids > 0) {
    parts.push("A lost reply made a bidder retry and outbid its own winning bid.");
  }
  if (result.duplicatesIgnored > 0) {
    parts.push(
      "The retry carried the same request ID, so the server answered it without a second write.",
    );
  }
  if (result.lostUpdates === 0 && result.selfOutbids === 0) {
    parts.push("Every bid is accounted for exactly once and every screen agrees.");
  }
  return parts.join(" ");
}
