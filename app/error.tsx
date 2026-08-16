"use client";

import { useEffect } from "react";

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
    <section className="flex min-h-screen items-center justify-center px-4 py-32" aria-labelledby="error-title">
      <div className="max-w-xl text-center">
        <p className="mb-4 text-sm font-bold uppercase tracking-widest text-primary">Something went wrong</p>
        <h1 id="error-title" className="text-4xl font-bold tracking-tight text-foreground">This page could not be loaded</h1>
        <p className="mt-5 text-muted-foreground">Your data is safe. Try loading the page again.</p>
        <button type="button" onClick={reset} className="mt-8 rounded-xl bg-primary px-6 py-3 font-bold text-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">Try again</button>
      </div>
    </section>
  );
}
