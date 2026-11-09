import Link from "next/link";
import { SITE_CONFIG } from "@/data/site";
import { SOCIAL_PROFILES } from "@/data/social";

export default function ReviewFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="ld-footer">
      <div className="ld-wrap">
        <div className="ld-footer-main">
          <p className="ld-footer-line">
            Let&apos;s make something <span>worth using.</span>
          </p>
          <Link href="/review#contact" className="ld-link-strong">
            Start a conversation <span aria-hidden="true">→</span>
          </Link>
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
            <dt className="ld-anno">Sheet</dt>
            <dd>© {year}</dd>
          </div>
        </dl>
        <nav className="ld-footer-nav" aria-label="Footer navigation">
          <Link href="/review">Home</Link>
          <Link href="/review/my-projects">Work</Link>
          <Link href="/review/motion">Motion</Link>
          <Link href="/review/quick">1-page profile</Link>
          <a href={SOCIAL_PROFILES.github.href} target="_blank" rel="noopener noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a href={SOCIAL_PROFILES.linkedin.href} target="_blank" rel="noopener noreferrer">
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
          <a href="#top">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </nav>
      </div>
    </footer>
  );
}
