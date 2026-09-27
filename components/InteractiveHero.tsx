import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

const buildingLetters = [..."Building"];

export default function InteractiveHero() {
  return (
    <section className="offset-hero" data-offset-hero aria-labelledby="home-title">
      <div className="offset-hero-band" data-offset-band aria-hidden="true" />
      <div className="offset-hero-heading" data-offset-heading>
        <span className="offset-kicker">Independent developer / Punjab, India</span>
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
          <Image src="/images/sandeep-cutout-gray.png" alt="Portrait of Sandeep Kumar" width={1125} height={1398} unoptimized loading="eager" fetchPriority="high" decoding="sync" />
        </picture>
        <span className="offset-portrait-meta" aria-hidden="true">SANDEEP.PNG<br />PORTRAIT / 01<br />PUNJAB, INDIA</span>
      </div>
      <div className="offset-hero-canvas" data-offset-note>
        <span className="offset-canvas-label">Currently / on the desk</span>
        <div><span>Building</span><strong>Web Video Editor</strong></div>
        <div><span>Learning</span><strong>System design</strong></div>
        <div><span>Exploring</span><strong>Creative development</strong></div>
        <Link href="#work">Explore selected work <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="offset-hero-foot" data-offset-foot><span>Design / Development / Delivery</span><span>Scroll to see it take shape ↓</span></div>
      <div className="offset-intro-stage" data-offset-intro>
        <span className="offset-kicker">The approach</span>
        <h2>From idea<br />to interface<span>.</span></h2>
        <p>I build products that look clear and work hard.</p>
        <span className="offset-intro-next">Next up / Selected work ↓</span>
      </div>
    </section>
  );
}
