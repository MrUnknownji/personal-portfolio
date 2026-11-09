"use client";

import { useState } from "react";
import Link from "next/link";
import { buildStages } from "@/data/sections";
import type { ProjectSummary } from "@/types/Project";

const practices = new Set<string>(buildStages[0].tools);
const labTools = new Set<string>(buildStages.find((stage) => stage.title === "Interaction")!.tools);

/** From idea to shipped: pick a tool to light up the work that uses it. */
export default function BuildMap({ projects }: { projects: ProjectSummary[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const active = preview ?? selected;
  const related = (technologies: string[]) =>
    !active || practices.has(active) || technologies.includes(active);

  return (
    <div className="ld-build">
      <ol className="ld-build-stages">
        {buildStages.map((stage, index) => (
          <li key={stage.title}>
            <span className="ld-anno">Station {String(index + 1).padStart(2, "0")}</span>
            <h3>{stage.title}</h3>
            <p>{stage.note}</p>
            <div className="ld-chips" role="group" aria-label={`${stage.title} tools`}>
              {stage.tools.map((tool) => (
                <button
                  key={tool}
                  type="button"
                  className="ld-chip"
                  aria-pressed={selected === tool}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== "touch") setPreview(tool);
                  }}
                  onPointerLeave={() => setPreview(null)}
                  onFocus={() => setPreview(tool)}
                  onBlur={() => setPreview(null)}
                  onClick={() => setSelected(selected === tool ? null : tool)}
                >
                  {tool}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <div className="ld-build-evidence" aria-live="polite">
        <p>
          <span className="ld-anno">Built with it</span>
          <strong>{active ?? "Select a tool"}</strong>
        </p>
        <div className="ld-build-links">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/review/my-projects/${project.id}`}
              data-related={related(project.technologies)}
            >
              {project.title}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
          <Link href="/review#lab" data-related={!active || labTools.has(active)}>
            The lab<span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
