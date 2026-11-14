import Image from "next/image";
import { PROFILE } from "@/data/profile";
import { selectedProjects } from "@/data/projects";
import { SITE_CONFIG } from "@/data/site";
import { PaperLayers } from "./Paper";

const current = PROFILE.experience.find((entry) => "current" in entry && entry.current);
const studio = PROFILE.experience.find((entry) => entry.organization === "FrameRelay Studio");
const built = new Date();
const dated = built.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

/** A franking mark drawn on the envelope: a ring of place names, the year and wavy cancel lines. */
function Postmark({ year }: { year: number }) {
  return (
    <svg className="ld-postmark" viewBox="0 0 260 120" aria-hidden="true">
      <defs>
        <path id="ld-pm-ring" d="M60,60 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0" />
      </defs>
      <circle cx="60" cy="60" r="52" />
      <circle cx="60" cy="60" r="32" />
      <text>
        <textPath href="#ld-pm-ring" startOffset="2%">
          PUNJAB · INDIA · FULL-STACK · PUNJAB · INDIA ·
        </textPath>
      </text>
      <text x="60" y="58" textAnchor="middle" className="ld-pm-big">
        {year}
      </text>
      <text x="60" y="73" textAnchor="middle">
        FIRST CLASS
      </text>
      {[30, 46, 62, 78, 94].map((y) => (
        <path key={y} d={`M118,${y} q14,-8 28,0 t28,0 t28,0 t28,0 t28,0`} />
      ))}
    </svg>
  );
}

/**
 * A cover letter that arrives in a real envelope. On tall screens the envelope is pinned and the
 * scroll opens it, one step at a time: it lies face up and sealed, turns over, the flap lifts, the
 * letter is drawn out, and the envelope drops away so the letter can be read. Everything is
 * scroll-driven CSS (transforms only); the letter stays clipped to the envelope until it leaves.
 * On phones, short screens, reduced motion or the "resting" tweak, the letter lies on top of its
 * envelope instead.
 *
 * It renders in two places (before the work and in Contact). The tweak panel picks which one
 * shows; the other is display:none, so it is skipped by assistive tech and costs no layout.
 */
export default function Letter({ slot }: { slot: "intro" | "contact" }) {
  const Heading = slot === "intro" ? "h2" : "h3";
  const id = `ld-letter-${slot}`;
  return (
    <section className="ld-post" data-slot={slot} aria-labelledby={id}>
      <div className="ld-post-stage">
        <p className="ld-post-hint ld-anno" aria-hidden="true">
          A letter for you · scroll to open it <span>↓</span>
        </p>
        <div className="ld-env">
          <div className="ld-env-inside" aria-hidden="true" />
          <div className="ld-env-slot">
            <article className="ld-letter ld-paper">
              <PaperLayers
                seed={slot === "intro" ? 17 : 29}
                edges={{ top: 7, right: 2.2, bottom: 9, left: 2.2 }}
              />
              <div className="ld-letter-body">
                <p className="ld-letter-meta">
                  <span>
                    {SITE_CONFIG.name}
                    <br />
                    {PROFILE.location}
                  </span>
                  <span>{dated}</span>
                </p>
                <Heading id={id} className="ld-letter-dear">
                  Dear hiring team,
                </Heading>
                <p>
                  I&apos;m a full-stack developer building web, mobile, and real-time products with
                  TypeScript, React, Next.js, React Native, and Node.js.
                </p>
                <p>
                  Right now I&apos;m a {current?.role.toLowerCase()} at {current?.organization}, and
                  I founded {studio?.organization}, a motion studio for software teams. The work{" "}
                  {slot === "intro" ? "below" : "above"} comes from {selectedProjects.length}{" "}
                  products I built end to end, with every number counted from its repository or live
                  site.
                </p>
                <p>
                  I&apos;m looking for {PROFILE.openTo.toLowerCase()}, and I&apos;d like to hear
                  what your team is building.
                </p>
                <p className="ld-letter-sign">
                  Yours,
                  <span>Sandeep</span>
                </p>
              </div>
            </article>
          </div>
          <div className="ld-env-pocket" aria-hidden="true">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none">
              <path className="ld-env-side" d="M0 0 L47 56 L0 100 Z" />
              <path className="ld-env-side" d="M100 0 L53 56 L100 100 Z" />
              <path className="ld-env-bottom" d="M0 100 L50 50 L100 100 Z" />
            </svg>
          </div>
          <div className="ld-env-flap" aria-hidden="true">
            <span className="ld-env-seal">SK</span>
          </div>
          <div className="ld-env-front" aria-hidden="true">
            <p className="ld-env-from">
              <span className="ld-anno">From</span>
              {SITE_CONFIG.name}, full-stack developer
              <br />
              TypeScript · React · Next.js · Node.js
            </p>
            <div className="ld-stamp-wrap">
              <figure className="ld-stamp">
                <Image
                  src="/images/sandeep-cutout-640.webp"
                  alt=""
                  width={640}
                  height={795}
                  sizes="132px"
                />
                <figcaption>India · Full-stack</figcaption>
              </figure>
              <Postmark year={built.getFullYear()} />
            </div>
            <p className="ld-env-to">
              <span className="ld-anno">To</span>
              The team hiring for
              <br />
              full-stack &amp; frontend roles
            </p>
            <p className="ld-env-enclosed">Enclosed · {selectedProjects.length} case studies</p>
            <span className="ld-env-code" />
          </div>
        </div>
      </div>
    </section>
  );
}
