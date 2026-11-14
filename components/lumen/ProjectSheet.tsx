import Image from "next/image";
import Link from "next/link";
import type { ShowcaseProject } from "@/types/Project";
import LoopVideo from "./LoopVideo";
import { SoftLayers, softStyle } from "./Soft";

const pad = (value: number) => String(value).padStart(2, "0");
/** The sheet's own timeline name; the sheet before it recedes as this one arrives. */
export const sheetTimeline = (index: number) => `--ld-sheet-${index}`;

/**
 * Stills chosen for the work sheets. FrameRelay's sheet is about the studio's own painted site,
 * so it shows that site rather than a client-style product film.
 */
const stills: Partial<Record<number, string>> = { 13: "/images/framerelay/hero.webp" };

/**
 * A featured project drawn as one sheet of a drawing set: the screen sits in a neutral bezel, the
 * copy carries a large index number, and the evidence reads like dimensions. On wide screens the
 * sheets stack as you scroll, each one settling over the last.
 */
export default function ProjectSheet({
  project,
  index,
  last,
}: {
  project: ShowcaseProject;
  index: number;
  last: boolean;
}) {
  const caseStudy = `/my-projects/${project.id}`;
  const still = stills[project.id];
  const host = project.demoLink ? new URL(project.demoLink).host.replace(/^www\./, "") : null;
  return (
    <article
      id={`ld-sheet-${project.id}`}
      className="ld-sheet ld-soft"
      style={softStyle("sheet", 6, {
        "--i": index,
        viewTimelineName: sheetTimeline(index),
        ...(last ? {} : { "--ld-next": sheetTimeline(index + 1) }),
      } as React.CSSProperties)}
      data-flip={index % 2 === 1}
      aria-labelledby={`ld-work-${project.id}`}
    >
      <SoftLayers sheen={false} />
      <figure className="ld-sheet-mat">
        <div className="ld-sheet-screen">
          {still ? (
            <Image
              src={still}
              alt={`${project.title} website`}
              fill
              sizes="(max-width: 900px) 92vw, 760px"
            />
          ) : project.showcaseLoop ? (
            <LoopVideo
              src={project.showcaseLoop.src}
              poster={project.showcaseLoop.poster}
              alt={`${project.title} reel`}
            />
          ) : (
            <Image
              src={project.image}
              alt={`${project.title} interface`}
              fill
              sizes="(max-width: 900px) 92vw, 760px"
            />
          )}
        </div>
        <figcaption className="ld-sheet-cap ld-anno">
          <span>{host ? "Live site" : "Product screen"}</span>
          <span>{host ?? project.title}</span>
        </figcaption>
      </figure>
      <div className="ld-sheet-copy">
        <span className="ld-sheet-num" aria-hidden="true">
          {pad(index + 1)}
        </span>
        <span className="ld-anno">
          {project.category}
          {project.year ? ` · ${project.year}` : ""}
        </span>
        <h3 id={`ld-work-${project.id}`}>{project.title}</h3>
        <p>{project.shortDescription}</p>
      </div>
      {project.facts && (
        <dl className="ld-facts">
          {project.facts.slice(0, 3).map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className="ld-sheet-foot">
        <ul className="ld-chips" aria-label="Stack">
          {project.technologies.map((tech) => (
            <li className="ld-chip" key={tech}>
              {tech}
            </li>
          ))}
        </ul>
        <div className="ld-links">
          <Link
            href={caseStudy}
            className="ld-key ld-soft ld-key-signal ld-key-sm"
            style={softStyle("signal")}
          >
            <SoftLayers />
            <span>
              Case study <span aria-hidden="true">→</span>
            </span>
          </Link>
          {project.demoLink && (
            <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
              Live site <span aria-hidden="true">↗</span>
            </a>
          )}
          {project.githubLink ? (
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
              Source <span aria-hidden="true">↗</span>
            </a>
          ) : (
            project.sourceNote && <span className="ld-anno">{project.sourceNote}</span>
          )}
        </div>
      </div>
    </article>
  );
}
