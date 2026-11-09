// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import BidRace from "@/components/lab/BidRace";

beforeEach(() => {
  // Reduced motion makes a run finish immediately, so the outcome can be asserted.
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query.includes("reduce"),
    media: query,
  }));
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("BidRace", () => {
  it("runs the selected scenario and reports its outcome", () => {
    render(<BidRace />);
    expect(screen.getByRole("status").textContent?.trim()).toBe("");

    fireEvent.click(screen.getByRole("button", { name: /Send both bids/ }));
    expect(screen.getByRole("status").textContent).toContain("lost update");
    expect(screen.getByRole("list", { name: "Event log" }).children.length).toBeGreaterThan(3);

    fireEvent.click(screen.getByRole("button", { name: /Authority \+ request IDs/ }));
    // Changing a setting clears the previous run.
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
    fireEvent.click(screen.getByRole("button", { name: /Drop the reply to A/ }));
    fireEvent.click(screen.getByRole("button", { name: /Send both bids/ }));
    expect(screen.getByRole("status").textContent).toContain("same request ID");
    expect(screen.getByRole("status").dataset.verdict).toBe("good");
  });

  it("re-runs with new latencies from the sliders", () => {
    render(<BidRace />);
    fireEvent.change(screen.getByRole("slider", { name: /Bidder B latency/ }), {
      target: { value: "40" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Send both bids/ }));

    // With B now faster, B's bid reaches the server first.
    const log = screen.getByRole("list", { name: "Event log" }).textContent ?? "";
    expect(log.indexOf("from B")).toBeLessThan(log.indexOf("from A"));
  });
});
