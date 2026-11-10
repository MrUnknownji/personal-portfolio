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

/** The last sheet of the set: a closing call, the index, the title block, and the signature. */
export default function ReviewFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="ld-footer">
      <div className="ld-wrap">
        <div className="ld-footer-cta">
          <span className="ld-anno">End of the drawing set</span>
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
              Sheets
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
          <dl className="ld-tblock ld-footer-block">
            <div className="ld-tblock-wide">
              <dt className="ld-anno">Drawing</dt>
              <dd>Portfolio of {SITE_CONFIG.name}</dd>
            </div>
            <div>
              <dt className="ld-anno">Revision</dt>
              <dd>A · under review</dd>
            </div>
            <div>
              <dt className="ld-anno">Language</dt>
              <dd>Lumen Draft</dd>
            </div>
            <div>
              <dt className="ld-anno">Based in</dt>
              <dd>{PROFILE.location}</dd>
            </div>
          </dl>
        </div>

        <p className="ld-footer-mark" aria-hidden="true">
          <span>{SITE_CONFIG.name}</span>
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
