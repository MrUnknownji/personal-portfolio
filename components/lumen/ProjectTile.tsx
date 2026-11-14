import Image from "next/image";
import Link from "next/link";
import type { ProjectSummary } from "@/types/Project";
import { SoftLayers, softStyle } from "./Soft";

/** A project in the index: the whole tile opens the case study. */
export default function ProjectTile({
  project,
  index,
}: {
  project: ProjectSummary;
  index: number;
}) {
  return (
    <Link
      href={`/my-projects/${project.id}`}
      className="ld-tile-card ld-soft"
      style={softStyle("sheet")}
    >
      <SoftLayers sheen={false} />
      <span className="ld-tile-media">
        {/* The first tile is the largest paint on arrival; the rest load as they come into view. */}
        <Image
          src={project.image}
          alt=""
          fill
          sizes="(max-width: 700px) 92vw, 380px"
          loading={index === 0 ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : undefined}
        />
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
