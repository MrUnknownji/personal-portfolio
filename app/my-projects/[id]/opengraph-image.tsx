import { ImageResponse } from "next/og";
import { getProject, selectedProjects } from "@/data/projects";

export const alt = "A case study by Sandeep Kumar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return selectedProjects.map((project) => ({ id: String(project.id) }));
}

export default async function CaseStudyImage({ params }: { params: Promise<{ id: string }> }) {
  const project = getProject((await params).id);
  const index = project ? selectedProjects.findIndex((item) => item.id === project.id) : 0;
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: 64,
          background: "#1d1f1b",
          color: "#eceee7",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#a3a99a",
          }}
        >
          <span>Case study · Dwg {String(index + 1).padStart(2, "0")}</span>
          <span>Sandeep Kumar</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 70,
            fontSize: 104,
            fontWeight: 700,
            letterSpacing: -4,
            lineHeight: 0.95,
            color: "#7fe3b4",
          }}
        >
          {project?.title ?? "Case study"}
        </div>
        <div style={{ display: "flex", marginTop: 30, fontSize: 32, lineHeight: 1.3 }}>
          {project?.shortDescription ?? ""}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: "auto" }}>
          {(project?.technologies ?? []).slice(0, 6).map((tool) => (
            <span
              key={tool}
              style={{
                display: "flex",
                padding: "8px 16px",
                border: "2px solid #eceee766",
                borderRadius: 999,
                fontSize: 21,
                fontWeight: 700,
              }}
            >
              {tool}
            </span>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
