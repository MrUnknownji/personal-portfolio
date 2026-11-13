import Image from "next/image";
import Deck, { type Card } from "@/components/post/Deck";
import ReplySlip from "@/components/post/ReplySlip";
import {
  ALL,
  CAREER,
  CURRENT,
  projectLinks,
  STUDIO,
  stillFor,
  SYMBOLS,
} from "@/components/review/portfolio";
import VersionSwitch from "@/components/review/VersionSwitch";
import { motionChannel, motionVideos } from "@/data/motion";
import { PROFILE } from "@/data/profile";
import { SITE_CONFIG } from "@/data/site";
import { SOCIAL_PROFILES } from "@/data/social";

const built = new Date();
const today = built.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

/** A round cancellation mark: place and year around the ring, wavy lines trailing off. */
function Postmark({ className, year }: { className?: string; year: number }) {
  return (
    <svg className={className} viewBox="0 0 260 120" aria-hidden="true">
      <defs>
        <path id="ps-ring" d="M60,60 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0" />
      </defs>
      <circle cx="60" cy="60" r="52" />
      <circle cx="60" cy="60" r="32" />
      <text>
        <textPath href="#ps-ring" startOffset="2%">
          PUNJAB · INDIA · AIR MAIL · PUNJAB · INDIA ·
        </textPath>
      </text>
      <text x="60" y="56" textAnchor="middle" className="ps-pm-big">
        {year}
      </text>
      <text x="60" y="72" textAnchor="middle">
        FIRST CLASS
      </text>
      {[30, 46, 62, 78, 94].map((y) => (
        <path key={y} d={`M118,${y} q14,-8 28,0 t28,0 t28,0 t28,0 t28,0`} />
      ))}
    </svg>
  );
}

function Head({
  n,
  id,
  title,
  kicker,
  lede,
}: {
  n: string;
  id: string;
  title: string;
  kicker: string;
  lede?: string;
}) {
  return (
    <header className="ps-head">
      <p className="ps-kicker">
        No. {n} · {kicker}
      </p>
      <h2 id={id}>{title}</h2>
      {lede && <p className="ps-lede">{lede}</p>}
    </header>
  );
}

const cards: Card[] = ALL.map((project) => ({
  id: project.id,
  code: SYMBOLS[project.id],
  title: project.title,
  category: project.category,
  year: project.year,
  short: project.shortDescription,
  problem: project.caseStudy?.problem,
  facts: project.facts ?? [],
  stack: project.technologies,
  image: stillFor(project),
  links: projectLinks(project),
}));

// Newest first, like a tracking sheet.
const tracking = [...CAREER].reverse();
// The route a reader can take in at a glance: where the degree was, then each organisation.
const route = [...new Set(CAREER.map((entry) => entry.place))].filter(
  (place) => place !== "Self-directed",
);
// The concrete proof behind the roles, with links, straight from the profile.
const proof = PROFILE.experience.flatMap((entry) =>
  entry.highlights.map((highlight) => ({ ...highlight, org: entry.organization })),
);
const HUES = ["red", "blue", "green", "ochre"];

export default function PostHome() {
  return (
    <>
      <a className="ps-skip" href="#postcards">
        Skip to the postcards
      </a>
      <header className="ps-top">
        <a className="ps-mark" href="#top">
          Sandeep Kumar <span>Full-stack developer</span>
        </a>
        <nav className="ps-nav" aria-label="Sections">
          <a href="#postcards">Work</a>
          <a href="#tracking">Experience</a>
          <a href="#stamps">Skills</a>
          <a href="#films">Films</a>
          <a href="#reply">Contact</a>
        </nav>
        <VersionSwitch current={4} className="ps-versions" />
      </header>

      <main>
        <section className="ps-hero" id="letter" aria-labelledby="ps-dear">
          <div className="ps-stage">
            <p className="ps-hint" aria-hidden="true">
              A letter for you · scroll to open it ↓
            </p>
            <div className="ps-envelope-back" aria-hidden="true" />
            <article className="ps-letter">
              <p className="ps-letter-meta">
                <span>
                  {SITE_CONFIG.name}
                  <br />
                  {PROFILE.location}
                </span>
                <span>{today}</span>
              </p>
              <h1 id="ps-dear">Dear hiring team,</h1>
              <p>
                I&apos;m Sandeep Kumar, a full-stack developer building web, mobile, and real-time
                products with TypeScript, React, Next.js, React Native, and Node.js.
              </p>
              <p>
                Right now I&apos;m a {CURRENT?.role.toLowerCase()} at {CURRENT?.organization}, and I
                founded {STUDIO?.organization}, a motion studio for software teams. The postcards
                below come from {ALL.length} products I built end to end, each with its problem, its
                fix, and the numbers counted from its repository.
              </p>
              <p>I&apos;m looking for {PROFILE.openTo.toLowerCase()}.</p>
              <p className="ps-sign">
                Yours,
                <span>Sandeep</span>
              </p>
              <p className="ps-links">
                <a href={PROFILE.resumePath} target="_blank" rel="noopener noreferrer">
                  Résumé (PDF) <span aria-hidden="true">↗</span>
                </a>
                <a href={`mailto:${SITE_CONFIG.email}`}>
                  {SITE_CONFIG.email} <span aria-hidden="true">→</span>
                </a>
              </p>
            </article>
            <div className="ps-envelope" aria-hidden="true">
              <div className="ps-envelope-front">
                <p className="ps-from">
                  <span>From</span>
                  Sandeep Kumar, full-stack developer
                  <br />
                  TypeScript · React · Next.js · Node.js
                </p>
                <div className="ps-stamp-wrap">
                  <figure className="ps-stamp">
                    <Image
                      src="/images/sandeep-cutout-640.webp"
                      alt=""
                      width={640}
                      height={800}
                      sizes="140px"
                      priority
                    />
                    <figcaption>India · Full-stack</figcaption>
                  </figure>
                  <Postmark className="ps-postmark" year={built.getFullYear()} />
                </div>
                <p className="ps-to">
                  <span>To</span>
                  The team hiring for
                  <br />
                  full-stack &amp; frontend roles
                </p>
                <p className="ps-priority">Enclosed · {ALL.length} case studies</p>
                <span className="ps-barcode" />
              </div>
            </div>
          </div>
        </section>

        <section className="ps-section" id="postcards" aria-labelledby="ps-postcards">
          <Head
            n="01"
            id="ps-postcards"
            kicker="Selected work"
            title="Postcards from the work"
            lede={`${ALL.length} products I built end to end. Turn a card over for the problem it solved and the numbers counted from its repository.`}
          />
          <Deck cards={cards} />
        </section>

        <section className="ps-section ps-tracking" id="tracking" aria-labelledby="ps-track">
          <Head n="02" id="ps-track" kicker="Tracking, newest first" title="Experience" />
          <div className="ps-track-grid">
            <div className="ps-track-card">
              <p className="ps-track-route">
                <span>Route</span>
                {route.join(" → ")}
              </p>
              <ol className="ps-track">
                <li className="ps-track-next">
                  <span className="ps-track-when">Next</span>
                  <div>
                    <h3>Your team</h3>
                    <p>
                      Open to {PROFILE.openTo.toLowerCase()}.{" "}
                      <a href={`mailto:${SITE_CONFIG.email}`}>Email me</a>
                    </p>
                  </div>
                </li>
                {tracking.map((entry) => (
                  <li key={entry.title + entry.place} data-open={entry.open}>
                    <span className="ps-track-when">
                      {entry.period}
                      {entry.open && <b>Current</b>}
                    </span>
                    <div>
                      <h3>{entry.title}</h3>
                      <p className="ps-track-place">{entry.place}</p>
                      <p>{entry.note}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <aside className="ps-proof" aria-labelledby="ps-proof">
              <p className="ps-kicker">Proof of delivery</p>
              <h3 id="ps-proof">What the work shows</h3>
              <ol>
                {proof.map((item) => (
                  <li key={item.text}>
                    <span className="ps-proof-org">{item.org}</span>
                    {item.href ? (
                      <a
                        href={item.href}
                        {...(item.href.startsWith("http")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {item.text}
                      </a>
                    ) : (
                      item.text
                    )}
                  </li>
                ))}
              </ol>
              <dl className="ps-proof-facts">
                <div>
                  <dt>Education</dt>
                  <dd>
                    {PROFILE.education[0].title}, {PROFILE.education[0].institution} ·{" "}
                    {PROFILE.education[0].period}
                  </dd>
                </div>
                <div>
                  <dt>Based in</dt>
                  <dd>{PROFILE.location}</dd>
                </div>
                <div>
                  <dt>Open to</dt>
                  <dd>{PROFILE.openTo}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        <section className="ps-section" id="stamps" aria-labelledby="ps-stamps">
          <Head
            n="03"
            id="ps-stamps"
            kicker="A sheet of stamps"
            title="Skills"
            lede="What I reach for, grouped the way a project uses them."
          />
          <ul className="ps-sheet">
            {PROFILE.skills.map((group, i) => (
              <li key={group.group} className="ps-skill" data-hue={HUES[i % HUES.length]}>
                <div className="ps-skill-face">
                  <h3>{group.group}</h3>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="ps-section" id="films" aria-labelledby="ps-films">
          <Head
            n="04"
            id="ps-films"
            kicker="Also enclosed"
            title="Films for CruxLog"
            lede="Technology stories I made for CruxLog, told through research, pacing, and visuals."
          />
          <ul className="ps-prints">
            {motionVideos.map((video, i) => (
              <li
                key={video.id}
                style={{ "--tilt": `${[-2, 1.5, -1, 2][i]}deg` } as React.CSSProperties}
              >
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="ps-print-shot">
                    <Image
                      src={`https://i.ytimg.com/vi/${video.id}/hq720.jpg`}
                      alt=""
                      fill
                      sizes="(max-width: 760px) 80vw, 300px"
                    />
                  </span>
                  <span className="ps-print-title">{video.title}</span>
                  <span className="ps-print-meta">
                    {video.duration} · Watch on YouTube <span aria-hidden="true">↗</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="ps-links ps-center">
            <a href={motionChannel} target="_blank" rel="noopener noreferrer">
              The CruxLog channel <span aria-hidden="true">↗</span>
            </a>
          </p>
        </section>

        <section className="ps-section" id="reply" aria-labelledby="ps-reply">
          <Head n="05" id="ps-reply" kicker="Reply by return" title="Get in touch" />
          <ReplySlip
            email={SITE_CONFIG.email}
            openTo={PROFILE.openTo}
            location={PROFILE.location}
          />
          <p className="ps-links ps-center">
            <a href={SOCIAL_PROFILES.linkedin.href} target="_blank" rel="noopener noreferrer">
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
            <a href={SOCIAL_PROFILES.github.href} target="_blank" rel="noopener noreferrer">
              GitHub <span aria-hidden="true">↗</span>
            </a>
            <a href={PROFILE.resumePath} target="_blank" rel="noopener noreferrer">
              Résumé (PDF) <span aria-hidden="true">↗</span>
            </a>
          </p>
        </section>
      </main>
      <footer className="ps-foot">
        <span>
          {SITE_CONFIG.name} · Full-stack developer · {PROFILE.location}
        </span>
        <span>Review build 4 · Post</span>
      </footer>
    </>
  );
}
