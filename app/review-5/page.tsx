import Image from "next/image";
import Console, { type Channel, type Track } from "@/components/mixer/Console";
import Spectrum from "@/components/mixer/Spectrum";
import CopyEmail from "@/components/review/CopyEmail";
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

const COLORS = ["#ff5f1f", "#f2b000", "#00a19b", "#3355ff", "#1f9e45", "#ff4f8b", "#7a5cff"];
const SHORT = ["LANG", "FRNT", "BACK", "DATA", "QA", "MOTN", "AI"];

// Which channel (skill set, in PROFILE.skills order) each project technology belongs to.
const TECH_CHANNEL: Record<string, number> = {
  TypeScript: 0,
  JavaScript: 0,
  Python: 0,
  "Next.js": 1,
  React: 1,
  "React Native": 1,
  Expo: 1,
  "Tailwind CSS": 1,
  Vite: 1,
  Astro: 1,
  "Canvas API": 1,
  JSZip: 1,
  "Node.js": 2,
  Express: 2,
  FastAPI: 2,
  "Socket.io": 2,
  Stripe: 2,
  Razorpay: 2,
  "Cloudflare Workers": 2,
  MongoDB: 3,
  Supabase: 3,
  PostgreSQL: 3,
  Cloudinary: 3,
  Playwright: 4,
  Vitest: 4,
  Jest: 4,
  "Lighthouse CI": 4,
  "Three.js": 5,
  WebGL2: 5,
  Remotion: 5,
  "Framer Motion": 5,
  Reanimated: 5,
  "Gemini API": 6,
  "OpenAI API": 6,
};

const channels: Channel[] = PROFILE.skills.map((group, i) => ({
  name: group.group,
  short: SHORT[i],
  items: [...group.items],
  color: COLORS[i],
}));

// Raw counts per channel: technologies in that channel, plus counted test suites for Quality.
const counts = ALL.map((project) => {
  const c = channels.map(() => 0);
  for (const tech of project.technologies) {
    const ch = TECH_CHANNEL[tech];
    if (ch !== undefined) c[ch] += 1;
  }
  c[4] += (project.facts ?? []).filter((fact) => /\btests?\b|test cases/i.test(fact.label)).length;
  return c;
});
const peak = channels.map((_, ch) => Math.max(1, ...counts.map((c) => c[ch])));

const tracks: Track[] = ALL.map((project, p) => ({
  id: project.id,
  code: SYMBOLS[project.id],
  title: project.title,
  category: project.category,
  year: project.year,
  short: project.shortDescription,
  problem: project.caseStudy?.problem,
  fix: project.caseStudy?.solution,
  facts: project.facts ?? [],
  image: stillFor(project),
  links: projectLinks(project),
  weights: counts[p].map((count, ch) => count / peak[ch]),
  stack: project.technologies.map((tech) => ({ tech, ch: TECH_CHANNEL[tech] ?? -1 })),
}));

export default function MixerHome() {
  return (
    <>
      <a className="mx-skip" href="#desk">
        Skip to the desk
      </a>
      <header className="mx-top">
        <a className="mx-mark" href="#top">
          <span className="mx-mark-dot" aria-hidden="true" />
          SK-7
          <span>Portfolio console</span>
        </a>
        <nav className="mx-nav" aria-label="Sections">
          <a href="#desk">Desk</a>
          <a href="#tape">Tape</a>
          <a href="#talkback">Talkback</a>
        </nav>
        <VersionSwitch current={5} className="mx-versions" />
      </header>

      <main>
        <section className="mx-hero" aria-labelledby="mx-name">
          <Spectrum>
            <div className="mx-hero-copy">
              <p className="mx-label">Full-stack developer · {PROFILE.location}</p>
              <h1 id="mx-name">
                Sandeep
                <br />
                Kumar
              </h1>
            </div>
          </Spectrum>
          <div className="mx-hero-side">
            <p className="mx-lede">{PROFILE.headline}</p>
            <div className="mx-lcd">
              <figure className="mx-lcd-face">
                <Image
                  src="/images/sandeep-cutout-640.webp"
                  alt="Portrait of Sandeep Kumar"
                  width={640}
                  height={800}
                  sizes="120px"
                  priority
                />
              </figure>
              <dl>
                <div>
                  <dt>Now playing</dt>
                  <dd>
                    {CURRENT?.role} · {CURRENT?.organization}
                  </dd>
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
            </div>
            <p className="mx-links">
              <a href={PROFILE.resumePath} target="_blank" rel="noopener noreferrer">
                Résumé (PDF) <span aria-hidden="true">↗</span>
              </a>
              <a href={`mailto:${SITE_CONFIG.email}`}>
                Email <span aria-hidden="true">→</span>
              </a>
            </p>
          </div>
        </section>

        <section className="mx-section" id="desk" aria-labelledby="mx-desk">
          <header className="mx-head">
            <h2 id="mx-desk">Mix the work</h2>
            <p>
              Push up the skills your role needs. Each project is scored by how much of its stack
              sits in those channels, and the list re-orders as you mix. Solo a channel to hear it
              alone. Open any project for its problem, its fix, and the numbers.
            </p>
          </header>
          <Console channels={channels} tracks={tracks} />
        </section>

        <section className="mx-section" id="tape" aria-labelledby="mx-tape">
          <header className="mx-head">
            <h2 id="mx-tape">The career tape</h2>
            <p>Side A is the path so far. Side B is the films I made for CruxLog.</p>
          </header>
          <div className="mx-jcard">
            <div className="mx-jcard-spine" aria-hidden="true">
              <span>Sandeep Kumar</span>
              <span>Career tape · {CAREER[0].period} → now</span>
            </div>
            <div className="mx-jcard-side">
              <h3>
                <span>A</span> The path
              </h3>
              <ol>
                {CAREER.map((entry, i) => (
                  <li key={entry.title + entry.place}>
                    <span className="mx-tn">A{i + 1}</span>
                    <span className="mx-tt">
                      <strong>{entry.title}</strong>
                      <span>{entry.place}</span>
                      <span className="mx-tnote">{entry.note}</span>
                    </span>
                    <span className="mx-td">{entry.period}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mx-jcard-side">
              <h3>
                <span>B</span> CruxLog films
              </h3>
              <ol>
                {motionVideos.map((video, i) => (
                  <li key={video.id}>
                    <span className="mx-tn">B{i + 1}</span>
                    <a
                      className="mx-tt mx-film"
                      href={`https://www.youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="mx-film-shot">
                        <Image
                          src={`https://i.ytimg.com/vi/${video.id}/hq720.jpg`}
                          alt=""
                          fill
                          sizes="96px"
                        />
                      </span>
                      <strong>
                        {video.title} <span aria-hidden="true">↗</span>
                      </strong>
                    </a>
                    <span className="mx-td">{video.duration}</span>
                  </li>
                ))}
              </ol>
              <p className="mx-links">
                <a href={motionChannel} target="_blank" rel="noopener noreferrer">
                  The CruxLog channel <span aria-hidden="true">↗</span>
                </a>
              </p>
            </div>
          </div>
        </section>

        <section className="mx-section mx-talk" id="talkback" aria-labelledby="mx-talkback">
          <div className="mx-talk-copy">
            <p className="mx-label">Talkback</p>
            <h2 id="mx-talkback">Press to talk.</h2>
            <p>{`Open to ${PROFILE.openTo.toLowerCase()}. Email is the fastest way to reach me.`}</p>
            <p className="mx-talk-email">{SITE_CONFIG.email}</p>
            <CopyEmail email={SITE_CONFIG.email} className="mx-chip" />
          </div>
          <a className="mx-talk-button" href={`mailto:${SITE_CONFIG.email}`}>
            <span>Talk</span>
            <span className="mx-talk-sub">Opens your mail app</span>
          </a>
          <ul className="mx-jacks" aria-label="Elsewhere">
            {[
              { label: "LinkedIn", href: SOCIAL_PROFILES.linkedin.href },
              { label: "GitHub", href: SOCIAL_PROFILES.github.href },
              { label: "Résumé", href: PROFILE.resumePath },
              { label: "CruxLog", href: motionChannel },
            ].map((jack, i) => (
              <li key={jack.label}>
                <a href={jack.href} target="_blank" rel="noopener noreferrer">
                  <span className="mx-jack" aria-hidden="true" />
                  <span className="mx-jack-n" aria-hidden="true">
                    OUT {i + 1}
                  </span>
                  {jack.label} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <footer className="mx-foot">
        <span>Scores come from each project&apos;s stack and counted tests.</span>
        <span>Review build 5 · Mixer</span>
      </footer>
    </>
  );
}
