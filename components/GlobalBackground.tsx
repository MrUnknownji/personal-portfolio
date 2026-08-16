export default function GlobalBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 bg-background"
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 0%, rgba(255, 146, 51, 0.08), transparent 42%), linear-gradient(to bottom, #12100e, #0d0c0b 70%)",
      }}
    />
  );
}
