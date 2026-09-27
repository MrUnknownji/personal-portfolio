"use client";

import { useState } from "react";
import Link from "next/link";
import { selectedProjects } from "@/data/projects";

const stages = [
  { title: "Idea", note: "Find the useful flow.", tools: [] },
  { title: "Interface", note: "Make the flow legible.", tools: ["React Native", "Next.js", "TypeScript"] },
  { title: "Interaction", note: "Give feedback a purpose.", tools: ["GSAP", "Anime.js", "SVG"] },
  { title: "Systems", note: "Keep the product in sync.", tools: ["Pusher", "PostgreSQL", "Supabase"] },
  { title: "Delivery", note: "Put it in people's hands.", tools: [] },
] as const;

const projectEvidence = selectedProjects.filter((project) => [9, 11, 10].includes(project.id));
const labTools = new Set(["GSAP", "Anime.js", "SVG"]);

export default function HowIBuild() {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [previewTool, setPreviewTool] = useState<string | null>(null);
  const activeTool = previewTool ?? selectedTool;

  const related = (technologies: string[]) => !activeTool || technologies.includes(activeTool);

  return (
    <section id="skills" className="offset-toolkit" aria-labelledby="how-i-build-title" data-build-file="HowIBuild.tsx" data-offset-reveal>
      <div className="offset-toolkit-heading"><span className="offset-kicker">04 / How I build</span><h3 id="how-i-build-title">From idea<br />to shipped<span>.</span></h3><p>Follow a tool to the work that uses it.</p></div>
      <div className="build-map" aria-label="How I build, from idea to delivery">
        {stages.map((stage, index) => <div className="build-map-stage" key={stage.title}>
          <span className="build-map-stage-index">{String(index + 1).padStart(2, "0")}</span>
          <h4>{stage.title}</h4>
          <p>{stage.note}</p>
          {stage.tools.length > 0 && <div className="build-map-tools">{stage.tools.map((tool) => <button key={tool} type="button" aria-pressed={selectedTool === tool} onPointerEnter={(event) => { if (event.pointerType !== "touch") setPreviewTool(tool); }} onPointerLeave={() => setPreviewTool(null)} onFocus={() => setPreviewTool(tool)} onBlur={() => setPreviewTool(null)} onClick={() => setSelectedTool(selectedTool === tool ? null : tool)}>{tool}</button>)}</div>}
        </div>)}
      </div>
      <div className="build-evidence" aria-live="polite">
        <div className="build-evidence-heading"><span>Built with it</span><strong>{activeTool ? activeTool : "Select a tool"}</strong></div>
        <div className="build-evidence-links">{projectEvidence.map((project) => <Link key={project.id} href={`/my-projects/${project.id}`} data-related={related(project.technologies)}>{project.title}<span aria-hidden="true">↗</span></Link>)}<Link href="/#lab" data-related={!activeTool || labTools.has(activeTool)}>The Lab<span aria-hidden="true">↗</span></Link></div>
      </div>
    </section>
  );
}
