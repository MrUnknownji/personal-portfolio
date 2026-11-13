import Image from "next/image";
import CopyEmail from "@/components/review/CopyEmail";
import {
  ALL,
  CAREER,
  CURRENT,
  FEATURED,
  projectLinks,
  STUDIO,
  stillFor,
  SYMBOLS,
  TECH_INDEX,
  TEST_COUNT,
} from "@/components/review/portfolio";
import VersionSwitch from "@/components/review/VersionSwitch";
import CareerChart from "@/components/ticker/CareerChart";
import Heatmap from "@/components/ticker/Heatmap";
import { Clock, Tape } from "@/components/ticker/Live";
import Positions, { type Position } from "@/components/ticker/Positions";
import { motionChannel, motionVideos } from "@/data/motion";
import { PROFILE } from "@/data/profile";
import { SITE_CONFIG } from "@/data/site";
import { SOCIAL_PROFILES } from "@/data/social";

/** Digits that roll into place, like a quote board settling. Pure CSS: each digit is a strip. */
function Odo({ value, delay = 0 }: { value: string; delay?: number }) {
  return (
    <span className="tk-odo" aria-label={value}>
      {[...value].map((ch, i) =>
        /\d/.test(ch) ? (
          <span
            key={i}
            className="tk-odo-col"
            aria-hidden="true"
            style={
              {
                "--d": Number(ch),
                animationDelay: `${delay + i * 90}ms`,
              } as React.CSSProperties
            }
          >
            {"0123456789".split("").map((n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        ) : (
          <span key={i} aria-hidden="true">
            {ch}
          </span>
        ),
      )}
    </span>
  );
}

function Section({
  n,
  id,
  title,
  note,
  children,
}: {
  n: string;
  id: string;
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <section className="tk-section" id={id} aria-labelledby={`${id}-title`}>
      <header className="tk-section-head">
        <span className="tk-section-n">§{n}</span>
        <h2 id={`${id}-title`}>{title}</h2>
        <p>{note}</p>
      </header>
      {children}
    </section>
  );
}

const live = ALL.filter((project) => project.demoLink).length;
const open = ALL.filter((project) => project.githubLink).length;
const tape = ALL.flatMap((project) =>
  (project.facts ?? []).map((fact) => ({
    sym: SYMBOLS[project.id],
    value: fact.value,
    label: fact.label,
  })),
);
const positions: Position[] = ALL.map((project) => ({
  id: project.id,
  sym: SYMBOLS[project.id],
  title: project.title,
  category: project.category,
  year: project.year,
  short: project.shortDescription,
  problem: project.caseStudy?.problem,
  fix: project.caseStudy?.solution,
  stack: project.technologies,
  facts: project.facts ?? [],
  image: stillFor(project),
  links: projectLinks(project),
  featured: FEATURED.includes(project),
}));
const techRows = TECH_INDEX.slice(0, 16).map(([tech, count]) => ({ tech, count }));
const heatCols = ALL.map((project) => ({
  id: project.id,
  sym: SYMBOLS[project.id],
  title: project.title,
}));
const used = techRows.map((row) => ALL.map((project) => project.technologies.includes(row.tech)));
// "Now" on the career axis is fixed when the page is built.
const built = new Date();
const now = built.getFullYear() + (built.getMonth() + built.getDate() / 31) / 12;

export default function TickerHome() {
  return (
    <>
      <a className="tk-skip" href="#positions">
        Skip to projects
      </a>
      <header className="tk-top">
        <a className="tk-mark" href="#top">
          <span className="tk-mark-sym">SKMR</span>
          <span>Sandeep Kumar</span>
        </a>
        <p className="tk-status">
          <span className="tk-dot" aria-hidden="true" /> Open to roles
        </p>
        <nav className="tk-nav" aria-label="Sections">
          <a href="#positions">Positions</a>
          <a href="#exposure">Exposure</a>
          <a href="#ledger">Ledger</a>
          <a href="#wire">Wire</a>
          <a href="#order">Contact</a>
        </nav>
        <Clock />
        <VersionSwitch current={3} className="tk-versions" />
      </header>

      <Tape items={tape} />

      <main id="main" className="tk-main">
        <section className="tk-hero" aria-labelledby="tk-name">
          <div className="tk-hero-name">
            <p className="tk-kicker">SKMR · Full-stack developer · {PROFILE.location}</p>
            <h1 id="tk-name">
              <span>Sandeep</span>
              <span>Kumar</span>
            </h1>
            <p className="tk-lede">{PROFILE.headline}</p>
            <p className="tk-links">
              <a href={PROFILE.resumePath} target="_blank" rel="noopener noreferrer">
                Résumé (PDF) <span aria-hidden="true">↗</span>
              </a>
              <a href={`mailto:${SITE_CONFIG.email}`}>
                Email <span aria-hidden="true">→</span>
              </a>
            </p>
          </div>

          <div className="tk-quote">
            <figure className="tk-quote-face">
              <Image
                src="/images/sandeep-cutout-640.webp"
                alt="Portrait of Sandeep Kumar"
                width={640}
                height={800}
                sizes="(max-width: 900px) 40vw, 260px"
                priority
              />
            </figure>
            <dl className="tk-quote-meta">
              <div>
                <dt>Now</dt>
                <dd>{CURRENT?.organization}</dd>
              </div>
              <div>
                <dt>Also</dt>
                <dd>
                  Founder, {STUDIO?.organization} · {STUDIO?.period}
                </dd>
              </div>
              <div>
                <dt>Seeking</dt>
                <dd>{PROFILE.openTo}</dd>
              </div>
            </dl>
            <dl className="tk-board">
              <div>
                <dd>
                  <Odo value={String(ALL.length)} />
                </dd>
                <dt>products shipped end to end</dt>
              </div>
              <div>
                <dd>
                  <Odo value={String(TEST_COUNT)} delay={120} />
                </dd>
                <dt>automated tests, counted in repos</dt>
              </div>
              <div>
                <dd>
                  <Odo value={String(live)} delay={240} />
                </dd>
                <dt>live demos you can open</dt>
              </div>
              <div>
                <dd>
                  <Odo value={String(open)} delay={360} />
                </dd>
                <dt>public repositories</dt>
              </div>
            </dl>
          </div>
        </section>

        <Section
          n="01"
          id="positions"
          title="Positions"
          note="Eight products. Point at a row for its quote: the problem, the fix, and the numbers."
        >
          <Positions rows={positions} />
        </Section>

        <Section
          n="02"
          id="exposure"
          title="Exposure"
          note="Every technology against every project. Move across the grid to read a cell."
        >
          <Heatmap rows={techRows} cols={heatCols} used={used} />
          <ul className="tk-skills">
            {PROFILE.skills.map((group) => (
              <li key={group.group}>
                <h3>{group.group}</h3>
                <p>{group.items.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section
          n="03"
          id="ledger"
          title="Ledger"
          note="Roles on one time axis. Drag the crosshair along it to see what was open when."
        >
          <CareerChart
            entries={CAREER.map(({ title, place, start, end, period }) => ({
              title,
              place,
              start,
              end: end === null ? null : end,
              period,
            }))}
            now={now}
          />
          <table className="tk-ledger">
            <caption className="tk-sr">Career entries, oldest first</caption>
            <thead>
              <tr>
                <th scope="col">Period</th>
                <th scope="col">Entry</th>
                <th scope="col">Status</th>
                <th scope="col">Memo</th>
              </tr>
            </thead>
            <tbody>
              {CAREER.map((entry) => (
                <tr key={entry.title + entry.place}>
                  <td>{entry.period}</td>
                  <th scope="row">
                    {entry.title}
                    <span>{entry.place}</span>
                  </th>
                  <td>
                    <span className="tk-pill" data-open={entry.open}>
                      {entry.open ? "Open" : "Closed"}
                    </span>
                  </td>
                  <td>{entry.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section
          n="04"
          id="wire"
          title="Wire"
          note="Technology stories I made for CruxLog, told through research, pacing, and visuals."
        >
          <ul className="tk-wire">
            {motionVideos.map((video, i) => (
              <li key={video.id}>
                <a
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="tk-wire-shot">
                    <Image
                      src={`https://i.ytimg.com/vi/${video.id}/hq720.jpg`}
                      alt=""
                      fill
                      sizes="(max-width: 900px) 92vw, 320px"
                    />
                  </span>
                  <span className="tk-wire-meta">
                    CRUX-{String(i + 1).padStart(2, "0")} · {video.duration}
                  </span>
                  <span className="tk-wire-title">{video.title}</span>
                  <span className="tk-wire-go">
                    Watch <span aria-hidden="true">↗</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="tk-links">
            <a href={motionChannel} target="_blank" rel="noopener noreferrer">
              The CruxLog channel <span aria-hidden="true">↗</span>
            </a>
          </p>
        </Section>

        <section className="tk-order" id="order" aria-labelledby="tk-order-title">
          <p className="tk-section-n">§05 · Place an order</p>
          <h2 id="tk-order-title">
            Hire at <span>market.</span>
          </h2>
          <p className="tk-order-note">
            {`Open to ${PROFILE.openTo.toLowerCase()}. Email is the fastest way to reach me.`}
          </p>
          <div className="tk-cmd">
            <span className="tk-cmd-prompt" aria-hidden="true">
              &gt;
            </span>
            <a href={`mailto:${SITE_CONFIG.email}`}>{SITE_CONFIG.email}</a>
            <CopyEmail email={SITE_CONFIG.email} className="tk-cmd-copy" />
          </div>
          <p className="tk-links">
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

      <footer className="tk-foot">
        <span>Figures are counted from each project&apos;s repository.</span>
        <span>Review build 3 · Ticker</span>
      </footer>
    </>
  );
}
