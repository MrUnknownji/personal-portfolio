"use client";

export default function PrintProfile() {
  return <button type="button" className="quick-view-more" onClick={() => window.print()}>Save quick profile as PDF <span aria-hidden="true">↗</span></button>;
}
