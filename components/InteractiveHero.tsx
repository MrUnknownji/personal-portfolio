import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import WireframeToggle from "@/components/WireframeToggle";
import CopyEmailButton from "@/components/CopyEmailButton";
import { SOCIAL_PROFILES } from "@/data/social";
import { PROFILE } from "@/data/profile";
import { SITE_CONFIG } from "@/data/site";

const buildingLetters = [..."Building"];
// The entry marked `current` is the main job; the list itself is in date order.
const currentRole = PROFILE.experience.find((entry) => "current" in entry && entry.current);

export default function InteractiveHero() {
  return (
    <section
      className="offset-hero"
      data-offset-hero
      data-build-file="InteractiveHero.tsx"
      data-build-note="Name, role, and availability come first; the display line sets the tone."
      aria-labelledby="home-title"
    >
      <div className="offset-hero-band" data-offset-band aria-hidden="true" />
      <div className="offset-hero-heading" data-offset-heading>
        <h1 id="home-title" className="offset-hero-name">
          {SITE_CONFIG.name}
          <span>Full-stack developer · {PROFILE.location}</span>
        </h1>
        <p className="offset-hero-display">
          <span className="offset-word" data-offset-word="building">
            <span className="sr-only">Building</span>
            {buildingLetters.map((letter, index) => (
              <span
                className="offset-character"
                key={index}
                style={{ "--character-delay": `${index * 48}ms` } as CSSProperties}
                aria-hidden="true"
              >
                {letter}
              </span>
            ))}
          </span>{" "}
          <span className="offset-word" data-offset-word="beyond">
            Beyond
          </span>{" "}
          <span className="offset-word" data-offset-word="brief">
            The brief<span className="offset-dot">.</span>
          </span>
        </p>
      </div>
      <div className="offset-hero-portrait" data-offset-portrait>
        <picture>
          <source
            media="(max-width: 760px)"
            type="image/webp"
            srcSet="/images/sandeep-cutout-640.webp"
          />
          <source type="image/webp" srcSet="/images/sandeep-cutout-960.webp" />
          <Image
            src="/images/sandeep-cutout-960.webp"
            alt="Portrait of Sandeep Kumar"
            width={960}
            height={1193}
            unoptimized
            loading="eager"
            fetchPriority="low"
            decoding="async"
          />
        </picture>
        <span className="offset-portrait-hotspot" aria-hidden="true" />
        <div className="offset-portrait-annotations" aria-hidden="true">
          <span>01 / Developer</span>
          <span>02 / Motion</span>
          <span>03 / Systems</span>
        </div>
      </div>
      <div className="offset-hero-canvas" data-offset-note>
        <span className="offset-canvas-label">Profile</span>
        <p>{PROFILE.headline}</p>
        <div>
          <span>Currently</span>
          <strong>{currentRole?.current?.label}</strong>
        </div>
        <div>
          <span>Open to</span>
          <strong>{PROFILE.openTo}</strong>
        </div>
        <div className="offset-hero-actions">
          <a href={PROFILE.resumePath} download>
            Résumé PDF <span aria-hidden="true">↓</span>
          </a>
        </div>
        <div className="offset-hero-contact" role="group" aria-label="Contact shortcuts">
          <CopyEmailButton email={SITE_CONFIG.email} />
          <a href={SOCIAL_PROFILES.github.href} target="_blank" rel="noopener noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a href={SOCIAL_PROFILES.linkedin.href} target="_blank" rel="noopener noreferrer">
            LinkedIn <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
      <div className="offset-hero-foot" data-offset-foot>
        <span>Design / Development / Delivery</span>
        <WireframeToggle />
        <Link href="#work">
          Selected work <span aria-hidden="true">↓</span>
        </Link>
      </div>
    </section>
  );
}
