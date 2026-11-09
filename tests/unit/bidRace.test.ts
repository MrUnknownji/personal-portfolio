import { describe, expect, it } from "vitest";
import { priceSeenBy, serverPriceAt, simulateRace, summarizeRace } from "@/components/lab/bidRace";

const latency = { A: 120, B: 300 };

describe("bid race simulation", () => {
  it("loses an update when the server stores whatever arrives", () => {
    const result = simulateRace(latency, "overwrite");

    expect(result.storedBids).toBe(2);
    expect(result.lostUpdates).toBe(1);
    expect(result.finalPrice).toBe(4300);
    expect(result.history).toEqual([
      { at: 120, price: 4300 },
      { at: 300, price: 4300 },
    ]);
    expect(summarizeRace(result)).toContain("lost update");
  });

  it("rejects the stale bid and accepts its re-priced retry under server authority", () => {
    const result = simulateRace(latency, "authority");

    expect(result.lostUpdates).toBe(0);
    expect(result.finalPrice).toBe(4350);
    const rejects = result.packets.filter((packet) => packet.kind === "reject");
    expect(rejects).toHaveLength(1);
    expect(rejects[0].to).toBe("B");
    // B learns of the rejection at 600 ms and its new request lands at 900 ms.
    expect(serverPriceAt(result, 899)).toBe(4300);
    expect(serverPriceAt(result, 900)).toBe(4350);
  });

  it("delivers each update after the receiving bidder's own latency", () => {
    const result = simulateRace({ A: 100, B: 400 }, "authority");

    expect(priceSeenBy(result, "A", 199)).toBe(4250);
    expect(priceSeenBy(result, "A", 200)).toBe(4300);
    expect(priceSeenBy(result, "B", 499)).toBe(4250);
    expect(priceSeenBy(result, "B", 500)).toBe(4300);
    expect(priceSeenBy(result, "B", result.duration)).toBe(result.finalPrice);
  });

  it("resends a dropped bid after its timeout", () => {
    const result = simulateRace(latency, "authority", "lost-bid");
    const firstBids = result.packets.filter(
      (packet) => packet.requestId === "A1" && packet.kind === "bid",
    );

    expect(firstBids).toHaveLength(2);
    expect(firstBids[0].droppedAt).toBe(60);
    // Timeout is twice the latency plus 250 ms.
    expect(firstBids[1].sendAt).toBe(490);
    expect(result.finalPrice).toBe(4350);
  });

  it("lets a bidder outbid itself when a reply is lost and retries are not idempotent", () => {
    const result = simulateRace(latency, "authority", "lost-reply");

    expect(result.selfOutbids).toBe(1);
    expect(result.finalPrice).toBe(4400);
  });

  it("answers a retried request once when requests carry IDs", () => {
    const result = simulateRace(latency, "idempotent", "lost-reply");

    expect(result.duplicatesIgnored).toBe(1);
    expect(result.selfOutbids).toBe(0);
    expect(result.storedBids).toBe(2);
    expect(result.finalPrice).toBe(4350);
    expect(summarizeRace(result)).toContain("same request ID");
  });

  it("is deterministic and breaks arrival ties by send order", () => {
    const first = simulateRace({ A: 200, B: 200 }, "authority");
    const second = simulateRace({ A: 200, B: 200 }, "authority");

    expect(first).toEqual(second);
    expect(first.events.find((event) => event.text.startsWith("Server accepts"))?.text).toContain(
      "from A",
    );
  });

  it("always terminates, even on slow lossy networks", () => {
    for (const mode of ["overwrite", "authority", "idempotent"] as const) {
      for (const network of ["reliable", "lost-bid", "lost-reply"] as const) {
        for (const a of [40, 300, 600]) {
          for (const b of [40, 300, 600]) {
            const result = simulateRace({ A: a, B: b }, mode, network);
            expect(result.duration).toBeLessThan(10_000);
            expect(result.finalPrice).toBeGreaterThan(4250);
          }
        }
      }
    }
  });
});
