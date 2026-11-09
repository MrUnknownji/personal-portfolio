"use client";

import dynamic from "next/dynamic";

// The two-bids simulation from the live site, loaded only when its plate is rendered.
const BidRace = dynamic(() => import("@/components/lab/BidRace"), {
  ssr: false,
  loading: () => <p className="ld-anno">Loading the simulation…</p>,
});

export default function LabRace() {
  return (
    <div className="ld-race">
      <BidRace />
    </div>
  );
}
