import Link from "next/link";
import { PROFILE } from "@/data/profile";
import DisplaySwitches from "./DisplaySwitches";

const links = [
  { label: "Work", href: "/#work" },
  { label: "Lab", href: "/#lab" },
  { label: "About", href: "/#about" },
  { label: "Build", href: "/#build" },
  { label: "Contact", href: "/#contact" },
  { label: "All projects", href: "/my-projects" },
];

export default function SiteHeader() {
  return (
    <header className="ld-top">
      <div className="ld-wrap ld-top-inner">
        <Link href="/" className="ld-brand" prefetch={false}>
          Sandeep Kumar
          <span className="ld-anno">Full-stack developer</span>
        </Link>
        <nav className="ld-nav" aria-label="Primary navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-nav={link.label.toLowerCase()}
              // Section links point back at the home page; prefetching it again would be waste.
              prefetch={link.href.startsWith("/#") ? false : null}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="ld-top-actions">
          <Link className="ld-top-quick" href="/quick">
            1-page profile
          </Link>
          <a href={PROFILE.resumePath} download>
            Résumé <span aria-hidden="true">↓</span>
          </a>
          <DisplaySwitches />
        </div>
      </div>
    </header>
  );
}
