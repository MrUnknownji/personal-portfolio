import Image from "next/image";
import Link from "next/link";
import type { ShowcaseProject } from "@/types/Project";
import LoopVideo from "./LoopVideo";
import { SoftLayers, softStyle, type Body } from "./Soft";

const bodies: Body[] = ["clay", "sage", "peach", "putty"];

/**
 * A featured project drawn as one soft sheet. Holding it splits the sheet into the layers a
 * reviewer cares about: the screen, the story, the evidence, and the stack.
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
  const body = bodies[index % bodies.length];
  const stack = project.technologies.slice(0, 3).join(" / ");
  const caseStudy = `/review/my-projects/${project.id}`;
  return (
    <article
      className="ld-sheet ld-soft"
      style={softStyle(body, 12)}
      data-flip={index % 2 === 1}
      aria-labelledby={`ld-work-${project.id}`}
      data-ld-inspect=""
      data-ld-name={`${project.title} sheet`}
      data-ld-base={`Sheet · ${body} · z 12`}
    >
      <SoftLayers z={12} sheen={false} />
      <div className="ld-sheet-screen" data-ld-layer={`Screen · ${project.category}`}>
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
      <div className="ld-sheet-copy" data-ld-layer="Story · the problem in one line">
        <span className="ld-anno">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} ·{" "}
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
          <Link href={caseStudy} className="ld-link-strong">
            Case study <span aria-hidden="true">→</span>
          </Link>
          {project.demoLink && (
            <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
              Live <span aria-hidden="true">↗</span>
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
