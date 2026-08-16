import { NextResponse } from "next/server";
import { selectedProjects } from "@/data/projects";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const projectId = Number(id);
  const project = selectedProjects.find((item) => item.id === projectId);

  if (!Number.isInteger(projectId) || !project) {
    return NextResponse.json(
      { message: "Project not found." },
      { status: 404 },
    );
  }

  return NextResponse.json(project, {
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
