import Image from "next/image";
import Link from "next/link";
import type { ShowcaseProject } from "@/types/Project";
import LoopVideo from "./LoopVideo";
import { SoftLayers, softStyle, type Body } from "./Soft";

const mats: Body[] = ["clay", "sage", "peach", "putty"];
const pad = (value: number) => String(value).padStart(2, "0");

/**
 * A featured project drawn as one sheet of a drawing set: the screen sits in a pastel mat, the
 * copy carries a large index number, the evidence reads like dimensions, and a title block runs
 * along the foot. Holding the sheet splits it into the screen, story, evidence, and stack.
 */
export default function ProjectSheet({
  project,
  index,
  total,
}: {
  project: ShowcaseProject;
  index: number;
  total: number;
}) {
  const mat = mats[index % mats.length];
  const stack = project.technologies.slice(0, 3).join(" / ");
  const caseStudy = `/review/my-projects/${project.id}`;
  return (
    <article
      className="ld-sheet ld-soft"
      style={softStyle("sheet", 6, { "--ld-mat": `var(--ld-${mat})` } as React.CSSProperties)}
      data-flip={index % 2 === 1}
      aria-labelledby={`ld-work-${project.id}`}
      data-ld-inspect=""
      data-ld-name={`${project.title} sheet`}
      data-ld-base={`Sheet · mat ${mat} · z 6`}
    >
      <SoftLayers sheen={false} />
      <figure className="ld-sheet-mat" data-ld-layer={`Screen · ${project.category}`}>
        <div className="ld-sheet-screen">
          {project.showcaseLoop ? (
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
              sizes="(max-width: 900px) 92vw, 640px"
              priority={index === 0}
            />
          )}
        </div>
        <figcaption className="ld-anno">
          Fig. {pad(index + 1)} · {project.title}
          {project.showcaseLoop ? " · screen recording" : " · screenshot"}
        </figcaption>
      </figure>
      <div className="ld-sheet-copy" data-ld-layer="Story · the problem in one line">
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
        <dl className="ld-facts" data-ld-layer="Evidence · counted from the repo">
          {project.facts.slice(0, 3).map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className="ld-sheet-foot" data-ld-layer={`Stack · ${stack}`}>
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
      <dl className="ld-sheet-block">
        <div>
          <dt className="ld-anno">Drawing</dt>
          <dd>{project.title}</dd>
        </div>
        <div>
          <dt className="ld-anno">Type</dt>
          <dd>{project.category}</dd>
        </div>
        {project.year && (
          <div>
            <dt className="ld-anno">Year</dt>
            <dd>{project.year}</dd>
          </div>
        )}
        <div>
          <dt className="ld-anno">Sheet</dt>
          <dd>
            {pad(index + 1)} of {pad(total)}
          </dd>
        </div>
      </dl>
    </article>
  );
}
