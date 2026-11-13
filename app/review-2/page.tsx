import Image from "next/image";
import AtlasCanvas from "@/components/atlas/AtlasCanvas";
import CopyEmail from "@/components/review/CopyEmail";
import {
  BROADCAST_RECTS,
  contour,
  FEATURED,
  FEATURED_RECTS,
  HERO_RECT,
  LEGEND_RECTS,
  MORE,
  MORE_RECTS,
  projectLinks,
  REGIONS,
  SIGNAL_RECT,
  STATION_RECTS,
  STATION_Y,
  STATIONS,
  STOPS,
  WORLD,
  type AtlasLink,
  type Rect,
} from "@/components/atlas/content";
import { motionChannel, motionVideos } from "@/data/motion";
import { PROFILE } from "@/data/profile";
import { SITE_CONFIG } from "@/data/site";
import { SOCIAL_PROFILES } from "@/data/social";

const place = (rect: Rect, extra?: Record<string, string | number>) =>
  ({
    "--x": `${rect.x}px`,
    "--y": `${rect.y}px`,
    "--w": `${rect.w}px`,
    "--h": `${rect.h}px`,
    ...extra,
  }) as React.CSSProperties;

const current = PROFILE.experience.find((entry) => "current" in entry && entry.current);
const studio = PROFILE.experience.find((entry) => entry.organization === "FrameRelay Studio");
const stills: Partial<Record<number, string>> = { 13: "/images/framerelay/hero.webp" };
const SYMBOLS = ["●", "▲", "■", "◆", "✚", "◐", "✦"];
const regionById = Object.fromEntries(REGIONS.map((region) => [region.id, region]));
const centre = (rect: Rect) => [rect.x + rect.w / 2, rect.y + rect.h / 2] as const;

/** Dashed flight routes from the origin out to every other region. */
const routes = REGIONS.filter((region) => region.id !== "origin").map((region) => {
  const [x0, y0] = centre(regionById.origin.rect);
  const [x1, y1] = centre(region.rect);
  const mx = (x0 + x1) / 2 - (y1 - y0) * 0.18;
  const my = (y0 + y1) / 2 + (x1 - x0) * 0.18;
  return { id: region.id, d: `M${x0},${y0} Q${mx},${my} ${x1},${y1}` };
});

function Links({ links }: { links: AtlasLink[] }) {
  return (
    <p className="atlas-links">
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {link.label}
          <span aria-hidden="true">{link.external ? " ↗" : " →"}</span>
        </a>
      ))}
    </p>
  );
}

function RegionLabel({ id }: { id: string }) {
  const region = regionById[id];
  return (
    <h2 className="atlas-region-label" id={`atlas-region-${id}`} style={place(region.rect)}>
      <span className="atlas-numeral">{region.numeral}</span> {region.name}
    </h2>
  );
}

export default function AtlasHome() {
  return (
    <AtlasCanvas stops={STOPS} regions={REGIONS} world={WORLD}>
      <svg
        className="atlas-terrain"
        viewBox={`0 0 ${WORLD.w} ${WORLD.h}`}
        width={WORLD.w}
        height={WORLD.h}
        aria-hidden="true"
      >
        {REGIONS.map((region, r) =>
          [40, 110, 190, 280].map((by, i) => (
            <path
              key={`${region.id}-${by}`}
              d={contour(region.rect, by, r * 2.3 + i * 0.4)}
              className={i === 0 ? "atlas-contour atlas-contour-index" : "atlas-contour"}
            />
          )),
        )}
        {routes.map((route) => (
          <path key={route.id} d={route.d} className="atlas-route" />
        ))}
        <path
          d={`M${STATION_RECTS[0].x - 50},${STATION_Y} H${STATION_RECTS[3].x + STATION_RECTS[3].w + 50}`}
          className="atlas-line"
        />
        {STATION_RECTS.map((rect, i) => (
          <circle
            key={i}
            cx={rect.x + 34}
            cy={STATION_Y}
            r={i === STATION_RECTS.length - 1 ? 22 : 16}
            className="atlas-station-dot"
          />
        ))}
        <g className="atlas-compass" transform="translate(4930 300)">
          <circle r="120" />
          <path d="M0,-150 L22,0 L0,150 L-22,0 Z" />
          <path d="M-150,0 L0,18 L150,0 L0,-18 Z" />
          <text y="-170">N</text>
        </g>
      </svg>

      <section className="atlas-region" aria-labelledby="atlas-region-origin">
        <RegionLabel id="origin" />
        <article
          id="atlas-origin"
          className="atlas-island atlas-hero"
          data-stop="origin"
          style={place(HERO_RECT)}
        >
          <div className="atlas-hero-copy">
            <p className="atlas-coord">31° N · 75° E · {PROFILE.location}</p>
            <h1>
              Sandeep <em>Kumar</em>
            </h1>
            <p className="atlas-lede">{PROFILE.headline}</p>
            <dl className="atlas-hero-facts">
              <div>
                <dt>Now</dt>
                <dd>
                  {current?.role} at {current?.organization}
                </dd>
              </div>
              <div>
                <dt>Also</dt>
                <dd>
                  Founder, {studio?.organization} · {studio?.period}
                </dd>
              </div>
              <div>
                <dt>Open to</dt>
                <dd>{PROFILE.openTo}</dd>
              </div>
            </dl>
            <p className="atlas-links">
              <a href={PROFILE.resumePath} target="_blank" rel="noopener noreferrer">
                Résumé (PDF) <span aria-hidden="true">↗</span>
              </a>
              <a href={`mailto:${SITE_CONFIG.email}`}>
                {SITE_CONFIG.email} <span aria-hidden="true">→</span>
              </a>
            </p>
          </div>
          <figure className="atlas-pin">
            <div className="atlas-pin-disc">
              <Image
                src="/images/sandeep-cutout-640.webp"
                alt="Portrait of Sandeep Kumar"
                width={640}
                height={800}
                sizes="(max-width: 720px) 60vw, 420px"
                priority
              />
            </div>
            <figcaption>You are here</figcaption>
          </figure>
        </article>
      </section>

      <section className="atlas-region" aria-labelledby="atlas-region-works">
        <RegionLabel id="works" />
        {FEATURED.map((project, i) => {
          const code = `${project.title.replace(/[^A-Z]/g, "").slice(0, 2) || project.title.slice(0, 2).toUpperCase()}-${String(project.id).padStart(2, "0")}`;
          return (
            <article
              key={project.id}
              className="atlas-island atlas-project"
              data-stop={`project-${project.id}`}
              style={place(FEATURED_RECTS[i])}
              aria-labelledby={`atlas-p-${project.id}`}
            >
              <div className="atlas-card">
                <div className="atlas-shot">
                  <Image
                    src={stills[project.id] ?? project.image}
                    alt={`${project.title} screenshot`}
                    fill
                    sizes="(max-width: 720px) 90vw, 900px"
                  />
                </div>
                <header>
                  <span className="atlas-coord">
                    {code} · {project.category}
                    {project.year ? ` · ${project.year}` : ""}
                  </span>
                  <h3 id={`atlas-p-${project.id}`}>{project.title}</h3>
                </header>
                <p className="atlas-far" aria-hidden="true">
                  {project.title}
                </p>
              </div>
              <div className="atlas-notes">
                <p className="atlas-short">{project.shortDescription}</p>
                {project.caseStudy && (
                  <>
                    <h4>Problem</h4>
                    <p>{project.caseStudy.problem}</p>
                    <h4>Fix</h4>
                    <p>{project.caseStudy.solution}</p>
                  </>
                )}
                {project.facts && (
                  <dl className="atlas-facts">
                    {project.facts.slice(0, 4).map((fact) => (
                      <div key={fact.label}>
                        <dt>{fact.label}</dt>
                        <dd>{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                <p className="atlas-stack">{project.technologies.join(" · ")}</p>
                {project.sourceNote && <p className="atlas-note">{project.sourceNote}</p>}
                <Links links={projectLinks(project)} />
              </div>
            </article>
          );
        })}
        {MORE.map((project, i) => (
          <article
            key={project.id}
            className="atlas-island atlas-small"
            data-stop="more"
            style={place(MORE_RECTS[i])}
            aria-labelledby={`atlas-p-${project.id}`}
          >
            <div className="atlas-shot">
              <Image
                src={project.image}
                alt={`${project.title} screenshot`}
                fill
                sizes="(max-width: 720px) 90vw, 560px"
              />
            </div>
            <div className="atlas-small-copy">
              <span className="atlas-coord">
                {project.category}
                {project.year ? ` · ${project.year}` : ""}
              </span>
              <h3 id={`atlas-p-${project.id}`}>{project.title}</h3>
              <p>{project.shortDescription}</p>
              <Links links={projectLinks(project)} />
            </div>
            <p className="atlas-far" aria-hidden="true">
              {project.title}
            </p>
          </article>
        ))}
      </section>

      <section className="atlas-region" aria-labelledby="atlas-region-path">
        <RegionLabel id="path" />
        <ol className="atlas-stations">
          {STATIONS.map((station, i) => (
            <li
              key={station.title}
              className="atlas-island atlas-station"
              data-stop="path"
              data-last={i === STATIONS.length - 1}
              style={place(STATION_RECTS[i])}
            >
              <span className="atlas-coord">{station.period}</span>
              <h3>{station.title}</h3>
              <p className="atlas-place">{station.place}</p>
              <p>{station.note}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="atlas-region" aria-labelledby="atlas-region-legend">
        <RegionLabel id="legend" />
        <ul className="atlas-legend">
          {PROFILE.skills.map((group, i) => (
            <li
              key={group.group}
              className="atlas-island atlas-key"
              data-stop="legend"
              data-hue={i % 4}
              style={place(LEGEND_RECTS[i])}
            >
              <h3>
                <span className="atlas-symbol" aria-hidden="true">
                  {SYMBOLS[i]}
                </span>
                {group.group}
              </h3>
              <p>{group.items.join(" · ")}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="atlas-region" aria-labelledby="atlas-region-broadcasts">
        <RegionLabel id="broadcasts" />
        <ul className="atlas-broadcasts">
          {motionVideos.map((video, i) => (
            <li
              key={video.id}
              className="atlas-island atlas-film"
              data-stop="broadcasts"
              style={place(BROADCAST_RECTS[i])}
            >
              <div className="atlas-film-shot">
                <Image
                  src={`https://i.ytimg.com/vi/${video.id}/hq720.jpg`}
                  alt=""
                  fill
                  sizes="(max-width: 720px) 60vw, 420px"
                />
                <span className="atlas-film-time">{video.duration}</span>
              </div>
              <span className="atlas-coord">CruxLog · {String(i + 1).padStart(2, "0")}</span>
              <h3>{video.title}</h3>
              <a
                href={`https://www.youtube.com/watch?v=${video.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch on YouTube <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="atlas-sr">
          <a href={motionChannel} target="_blank" rel="noopener noreferrer">
            The CruxLog channel
          </a>
        </p>
      </section>

      <section className="atlas-region" aria-labelledby="atlas-region-signal">
        <RegionLabel id="signal" />
        <article
          className="atlas-island atlas-signal"
          data-stop="signal"
          style={place(SIGNAL_RECT)}
        >
          <p className="atlas-coord">Last stop · Contact</p>
          <h3>
            Send a <em>signal.</em>
          </h3>
          <p>{`Open to ${PROFILE.openTo.toLowerCase()}. Email is fastest.`}</p>
          <div className="atlas-signal-row">
            <a className="atlas-button" href={`mailto:${SITE_CONFIG.email}`}>
              {SITE_CONFIG.email}
            </a>
            <CopyEmail email={SITE_CONFIG.email} className="atlas-button atlas-button-quiet" />
          </div>
          <Links
            links={[
              { label: "LinkedIn", href: SOCIAL_PROFILES.linkedin.href, external: true },
              { label: "GitHub", href: SOCIAL_PROFILES.github.href, external: true },
              { label: "Résumé (PDF)", href: PROFILE.resumePath, external: true },
            ]}
          />
        </article>
      </section>
    </AtlasCanvas>
  );
}
