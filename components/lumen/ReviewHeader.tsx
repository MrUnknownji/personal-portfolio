import Link from "next/link";
import { PROFILE } from "@/data/profile";
import DisplaySwitches from "./DisplaySwitches";

const links = [
  { label: "Work", href: "/review#work" },
  { label: "Lab", href: "/review#lab" },
  { label: "About", href: "/review#about" },
  { label: "Build", href: "/review#build" },
  { label: "Contact", href: "/review#contact" },
  { label: "All projects", href: "/review/my-projects" },
];

export default function ReviewHeader() {
  return (
    <header className="ld-top">
      <div className="ld-wrap ld-top-inner">
        <Link href="/review" className="ld-brand">
          Sandeep Kumar
          <span className="ld-anno">Full-stack developer</span>
        </Link>
        <nav className="ld-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} data-nav={link.label.toLowerCase()}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ld-top-actions">
          <Link className="ld-top-quick" href="/review/quick">
            1-page profile
          </Link>
          <a href={PROFILE.resumePath} download>
            Résumé <span aria-hidden="true">↓</span>
          </a>
          <DisplaySwitches />
          {/* A full page load on purpose, so the live site's styles start clean. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            className="ld-review-badge"
            href="/"
            title="This design is under review. Open the live site."
          >
            Review build
          </a>
        </div>
      </div>
    </header>
  );
}
