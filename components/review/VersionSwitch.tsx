import Link from "next/link";

// The review builds link to each other with this one switcher. Each version styles it itself.
export const REVIEW_VERSIONS = [
  { n: 1, href: "/review", name: "Lumen" },
  { n: 3, href: "/review-3", name: "Ticker" },
  { n: 4, href: "/review-4", name: "Post" },
] as const;

export default function VersionSwitch({
  current,
  className,
}: {
  current: (typeof REVIEW_VERSIONS)[number]["n"];
  className?: string;
}) {
  return (
    <nav className={className} aria-label="Review versions">
      {REVIEW_VERSIONS.map((version) => (
        <Link
          key={version.n}
          href={version.href}
          title={`Version ${version.n} · ${version.name}`}
          aria-current={version.n === current ? "page" : undefined}
        >
          {version.n}
        </Link>
      ))}
    </nav>
  );
}
