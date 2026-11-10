import Image from "next/image";
import Link from "next/link";
import type { ProjectSummary } from "@/types/Project";
import { SoftLayers, softStyle, type Body } from "./Soft";

const bodies: Body[] = ["putty", "clay", "sage", "peach"];

/** A project in the index: the whole tile opens the case study. */
export default function ProjectTile({
  project,
  index,
}: {
  project: ProjectSummary;
  index: number;
}) {
  const body = bodies[index % bodies.length];
  return (
    <Link
      href={`/review/my-projects/${project.id}`}
      className="ld-tile-card ld-soft"
      style={softStyle(body)}
    >
      <SoftLayers />
      <span className="ld-tile-media">
        <Image src={project.image} alt="" fill sizes="(max-width: 700px) 92vw, 380px" />
      </span>
      <span className="ld-tile-copy">
        <span className="ld-anno">
          Dwg {String(index + 1).padStart(2, "0")} · {project.category}
          {project.year ? ` · ${project.year}` : ""}
        </span>
        <strong>{project.title}</strong>
        <span className="ld-tile-text">{project.shortDescription}</span>
        <span className="ld-tile-stack">{project.technologies.slice(0, 4).join(" · ")}</span>
      </span>
    </Link>
  );
}
