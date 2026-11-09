import Link from "next/link";

// A last-resort 404 with no stylesheet imports. The root not-found is part of every route's
// tree, so importing either design's styles here would load them on the other design's pages.
// Unknown addresses normally reach app/(site)/not-found.tsx or app/review/not-found.tsx instead.
export default function RootNotFound() {
  return (
    <main
      style={{
        fontFamily: "system-ui, sans-serif",
        padding: "64px 24px",
        maxWidth: 640,
        margin: "0 auto",
      }}
    >
      <h1>This page is missing.</h1>
      <p>
        The address may have changed. <Link href="/">Return home</Link>.
      </p>
    </main>
  );
}
