import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import WireframeToggle from "@/components/WireframeToggle";

const buildingLetters = [..."Building"];

export default function InteractiveHero() {
  return (
    <section className="offset-hero" data-offset-hero data-build-file="InteractiveHero.tsx" data-build-note="The opening connects my work in interfaces, systems, and motion to three projects you can inspect." aria-labelledby="home-title">
      <div className="offset-hero-band" data-offset-band aria-hidden="true" />
      <div className="offset-hero-heading" data-offset-heading>
        <div className="offset-hero-file-head"><span className="offset-kicker">Full-stack developer · Creative coder · Punjab, India</span><span>File / 2026</span></div>
        <h1 id="home-title" aria-label="Sandeep Kumar — building beyond the brief">
          <span className="offset-word" data-offset-word="building">{buildingLetters.map((letter, index) => <span className="offset-character" key={index} style={{ "--character-delay": `${index * 48}ms` } as CSSProperties} aria-hidden="true">{letter}</span>)}</span>
          <span className="offset-word" data-offset-word="beyond">Beyond</span>
          <span className="offset-word" data-offset-word="brief">The brief<span className="offset-dot">.</span></span>
        </h1>
      </div>
      <div className="offset-hero-portrait" data-offset-portrait>
        <picture>
          <source media="(max-width: 760px)" type="image/webp" srcSet="/images/sandeep-cutout-640.webp" />
          <source type="image/webp" srcSet="/images/sandeep-cutout-960.webp" />
          <Image src="/images/sandeep-cutout-960.webp" alt="Portrait of Sandeep Kumar" width={960} height={1193} unoptimized loading="eager" fetchPriority="high" decoding="async" />
        </picture>
        <span className="offset-portrait-hotspot" aria-hidden="true" />
        <div className="offset-portrait-annotations" aria-hidden="true"><span>01 / Developer</span><span>02 / Motion</span><span>03 / Systems</span></div>
      </div>
      <div className="offset-hero-canvas" data-offset-note>
        <span className="offset-canvas-label">What I make / 2026</span>
        <p>Web and mobile products shaped around clear interfaces, responsive systems, and useful motion.</p>
        <div><span>Real-time product</span><strong>BidStrike</strong></div>
        <div><span>Mobile + AI</span><strong>Mirror Wallpapers</strong></div>
        <Link href="#work">See the work <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="offset-hero-foot" data-offset-foot><span>Design / Development / Delivery</span><WireframeToggle /><span>Selected work ↓</span></div>
    </section>
  );
}
