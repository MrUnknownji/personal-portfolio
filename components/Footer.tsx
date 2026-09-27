import Link from "next/link";
import { SOCIAL_PROFILES } from "@/data/social";

export default function Footer() {
  return (
    <footer className="print-footer">
      <div className="print-wrap">
        <div className="print-footer-main"><span className="print-eyebrow">End note / 2026</span><p>Let&apos;s make something<br /><em>worth using.</em></p><Link href="/#contact">Start a conversation <span aria-hidden="true">↗</span></Link></div>
        <div className="print-footer-bottom"><span>© {new Date().getFullYear()} Sandeep Kumar</span><nav aria-label="Footer navigation"><Link href="/">Home</Link><Link href="/my-projects">Work</Link><a href={SOCIAL_PROFILES.github.href} target="_blank" rel="noopener noreferrer">GitHub ↗</a><a href={SOCIAL_PROFILES.linkedin.href} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a></nav><a href="#top">Back to top ↑</a></div>
      </div>
    </footer>
  );
}
