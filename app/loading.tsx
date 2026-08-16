export default function Loading() {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background"
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,146,51,0.10),transparent_34%)]" aria-hidden="true" />
      <div className="relative flex flex-col items-center gap-7">
        <div className="relative flex size-24 items-center justify-center" aria-hidden="true">
          <div className="loading-orbit absolute inset-0 rounded-full border border-dashed border-primary/45" />
          <div className="loading-orbit-reverse absolute inset-3 rounded-full border border-primary/25" />
          <div className="loading-core relative flex size-12 rotate-45 items-center justify-center rounded-xl border border-primary/60 bg-card shadow-[0_0_30px_rgba(255,146,51,0.16)]">
            <span className="block size-3 rounded-sm bg-primary shadow-[0_0_16px_rgba(255,146,51,0.8)]" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-primary">Loading</p>
          <p className="mt-2 text-sm text-muted-foreground">Preparing the next view</p>
        </div>
      </div>
    </div>
  );
}
