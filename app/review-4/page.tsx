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

function Head({ n, id, title, note }: { n: string; id: string; title: string; note: string }) {
  return (
    <header className="ps-head">
      <p className="ps-kicker">
        No. {n} · {note}
      </p>
      <h2 id={id}>{title}</h2>
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

// Career as a parcel's journey, oldest scan at the bottom like a real tracking sheet.
const SCANS = ["Posted", "Sorted", "In transit", "Out for delivery"];
const tracking = CAREER.map((entry, i) => ({ ...entry, scan: SCANS[i] ?? "In transit" })).reverse();
const HUES = ["red", "blue", "green", "ochre"];

export default function PostHome() {
  return (
    <>
      <a className="ps-skip" href="#postcards">
        Skip to the postcards
      </a>
      <header className="ps-top">
        <a className="ps-mark" href="#top">
          Sandeep Kumar <span>Correspondence</span>
        </a>
        <nav className="ps-nav" aria-label="Sections">
          <a href="#letter">Letter</a>
          <a href="#postcards">Postcards</a>
          <a href="#tracking">Tracking</a>
          <a href="#stamps">Stamps</a>
          <a href="#reply">Reply</a>
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
                  From
                  <br />
                  S. Kumar
                  <br />
                  {PROFILE.location}
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
                <p className="ps-priority">Priority · Handle with care</p>
                <span className="ps-barcode" />
              </div>
            </div>
          </div>
        </section>

        <section className="ps-section" id="postcards" aria-labelledby="ps-postcards">
          <Head
            n="01"
            id="ps-postcards"
            title="Postcards from the work"
            note={`${ALL.length} products, one card each`}
          />
          <Deck cards={cards} />
        </section>

        <section className="ps-section ps-tracking" id="tracking" aria-labelledby="ps-track">
          <Head n="02" id="ps-track" title="Tracking" note="Where this parcel has been" />
          <div className="ps-track-card">
            <p className="ps-track-no">
              <span>Tracking no.</span> SK·2023·IN·{built.getFullYear()}
            </p>
            <ol className="ps-track">
              <li className="ps-track-next">
                <span className="ps-track-scan">Next scan</span>
                <div>
                  <h3>Delivered to your team</h3>
                  <p>Awaiting a reply. See the slip at the end.</p>
                </div>
              </li>
              {tracking.map((entry) => (
                <li key={entry.title + entry.place} data-open={entry.open}>
                  <span className="ps-track-scan">{entry.scan}</span>
                  <div>
                    <p className="ps-track-when">{entry.period}</p>
                    <h3>
                      {entry.title} <span>· {entry.place}</span>
                    </h3>
                    <p>{entry.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="ps-section" id="stamps" aria-labelledby="ps-stamps">
          <Head n="03" id="ps-stamps" title="A sheet of stamps" note="Each one a skill set" />
          <ul className="ps-sheet">
            {PROFILE.skills.map((group, i) => (
              <li key={group.group} className="ps-skill" data-hue={HUES[i % HUES.length]}>
                <div className="ps-skill-face">
                  <span className="ps-skill-value" aria-hidden="true">
                    {group.items.length}
                  </span>
                  <h3>{group.group}</h3>
                  <p>{group.items.join(" · ")}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="ps-section" id="films" aria-labelledby="ps-films">
          <Head n="04" id="ps-films" title="Enclosed: films" note="Made for CruxLog" />
          <p className="ps-films-note">
            Technology stories I made for CruxLog, told through research, pacing, and visuals.
          </p>
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
          <Head n="05" id="ps-reply" title="Reply by return" note="Postage paid" />
          <ReplySlip email={SITE_CONFIG.email} openTo={PROFILE.openTo} />
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
        <span>Posted from {PROFILE.location}</span>
        <span>Review build 4 · Post</span>
      </footer>
    </>
  );
}
