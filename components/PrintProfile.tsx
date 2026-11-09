"use client";

export default function PrintProfile() {
  return (
    <button type="button" className="quick-view-more" onClick={() => window.print()}>
      Print this page <span aria-hidden="true">↗</span>
    </button>
  );
}
