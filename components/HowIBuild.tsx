"use client";

import { useState } from "react";
import Link from "next/link";
import type { ProjectSummary } from "@/types/Project";
import { buildStages } from "@/data/sections";

const practices = new Set<string>(buildStages[0].tools);
const labTools = new Set<string>(buildStages.find((stage) => stage.title === "Interaction")!.tools);

export default function HowIBuild({ projects }: { projects: ProjectSummary[] }) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [previewTool, setPreviewTool] = useState<string | null>(null);
  const activeTool = previewTool ?? selectedTool;

  const related = (technologies: string[]) =>
    !activeTool || practices.has(activeTool) || technologies.includes(activeTool);

  return (
    <section
      id="build"
      className="offset-toolkit"
      aria-labelledby="how-i-build-title"
      data-build-file="HowIBuild.tsx"
      data-build-note="Each technology points to a project where it has a specific job."
      data-offset-reveal
    >
      <div className="offset-toolkit-heading">
        <span className="offset-kicker">04 / How I build</span>
        <h2 id="how-i-build-title">
          From idea
          <br />
          to shipped<span>.</span>
        </h2>
        <p>Follow a tool to the work that uses it.</p>
      </div>
      <div className="build-map" aria-label="How I build, from idea to delivery">
        {buildStages.map((stage, index) => (
          <div className="build-map-stage" key={stage.title}>
            <span className="build-map-stage-index">{String(index + 1).padStart(2, "0")}</span>
            <h3>{stage.title}</h3>
            <p>{stage.note}</p>
            {stage.tools.length > 0 && (
              <div className="build-map-tools">
                {stage.tools.map((tool) => (
                  <button
                    key={tool}
                    type="button"
                    aria-pressed={selectedTool === tool}
                    onPointerEnter={(event) => {
                      if (event.pointerType !== "touch") setPreviewTool(tool);
                    }}
                    onPointerLeave={() => setPreviewTool(null)}
                    onFocus={() => setPreviewTool(tool)}
                    onBlur={() => setPreviewTool(null)}
                    onClick={() => setSelectedTool(selectedTool === tool ? null : tool)}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="build-evidence" aria-live="polite">
        <div className="build-evidence-heading">
          <span>Built with it</span>
          <strong>{activeTool ? activeTool : "Select a tool"}</strong>
        </div>
        <div className="build-evidence-links">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/my-projects/${project.id}`}
              data-related={related(project.technologies)}
            >
              {project.title}
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
          <Link href="/#lab" data-related={!activeTool || labTools.has(activeTool)}>
            The Lab<span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
