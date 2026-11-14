"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Portfolio route failed", { digest: error.digest });
  }, [error.digest]);

  return (
    <section className="ld-wrap ld-page ld-state" aria-labelledby="ld-error-title">
      <span className="ld-anno">Sheet failed to print · Error</span>
      <h1 id="ld-error-title">This page didn&apos;t load.</h1>
      <p>Try it again. If it keeps failing, the project index still works.</p>
      <div className="ld-actions">
        <button type="button" className="ld-link-strong" onClick={reset}>
          Try again <span aria-hidden="true">↺</span>
        </button>
        <Link className="ld-link-strong" href="/my-projects">
          Explore projects <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
