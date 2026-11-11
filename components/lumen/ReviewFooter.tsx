import Link from "next/link";
import { PROFILE } from "@/data/profile";
import { SITE_CONFIG } from "@/data/site";
import { SOCIAL_PROFILES } from "@/data/social";
import CopyEmail from "./CopyEmail";
import { SoftLayers, softStyle } from "./Soft";

const pages = [
  { href: "/review", label: "Home" },
  { href: "/review/my-projects", label: "All projects" },
  { href: "/review/motion", label: "Motion" },
  { href: "/review/quick", label: "1-page profile" },
];

/**
 * The close of the page: a call to talk, the index, and the name again as a signature. The
 * signature's letters press and stretch like the name in the hero, so the page ends where it began.
 */
export default function ReviewFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="ld-footer ld-band">
      <div className="ld-wrap">
        <div className="ld-footer-cta">
          <p className="ld-footer-line">
            Let&apos;s make something <span>worth using.</span>
          </p>
          <div className="ld-actions">
            <Link
              href="/review#contact"
              className="ld-key ld-soft ld-key-signal"
              style={softStyle("signal")}
            >
              <SoftLayers />
              <span>
                Start a conversation <span aria-hidden="true">→</span>
              </span>
            </Link>
            <CopyEmail email={SITE_CONFIG.email} />
          </div>
        </div>

        <div className="ld-footer-grid">
          <nav className="ld-footer-col" aria-labelledby="ld-footer-pages">
            <h2 id="ld-footer-pages" className="ld-anno">
              Pages
            </h2>
            <ul>
              {pages.map((page) => (
                <li key={page.href}>
                  <Link href={page.href}>{page.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ld-footer-col">
            <h2 className="ld-anno">Elsewhere</h2>
            <ul>
              <li>
                <a href={SOCIAL_PROFILES.github.href} target="_blank" rel="noopener noreferrer">
                  GitHub <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a href={SOCIAL_PROFILES.linkedin.href} target="_blank" rel="noopener noreferrer">
                  LinkedIn <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li>
                <a href={PROFILE.resumePath} download>
                  Résumé PDF <span aria-hidden="true">↓</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="ld-footer-mark" aria-hidden="true">
          {SITE_CONFIG.name.split(" ").map((word) => (
            <span className="ld-word" key={word}>
              {[...word].map((letter, index) => (
                <span className="ld-ch" key={index}>
                  {letter}
                </span>
              ))}
            </span>
          ))}
        </p>

        <div className="ld-footer-base">
          <span className="ld-anno">
            © {year} {SITE_CONFIG.name}
          </span>
          <a className="ld-footer-top" href="#top">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
