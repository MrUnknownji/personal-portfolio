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
    <section className="portfolio-state offset-wrap" aria-labelledby="error-title">
      <div>
        <span className="offset-kicker">Build file / Error</span>
        <h1 id="error-title">This page<br />didn&apos;t load<span>.</span></h1>
        <p>Try loading it again. If the problem continues, the project index is still available.</p>
        <div className="portfolio-state-actions"><button type="button" onClick={reset}>Try again ↗</button><Link href="/my-projects">Explore projects ↗</Link></div>
      </div>
    </section>
  );
}
