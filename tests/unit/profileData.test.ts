import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { PROFILE } from "@/data/profile";
import { selectedProjects } from "@/data/projects";

describe("profile data", () => {
  it("links experience highlights to real routes", () => {
    const projectRoutes = new Set(selectedProjects.map((project) => `/my-projects/${project.id}`));

    for (const entry of PROFILE.experience) {
      for (const highlight of entry.highlights) {
        if (!highlight.href || highlight.href.startsWith("https://")) continue;
        expect(projectRoutes.has(highlight.href), `${highlight.href} is a case study`).toBe(true);
      }
    }
  });

  it("serves the résumé it links to", () => {
    expect(existsSync(join(process.cwd(), "public", PROFILE.resumePath))).toBe(true);
  });

  it("states repository facts as plain counts", () => {
    for (const project of selectedProjects) {
      for (const fact of project.facts ?? []) {
        expect(fact.value, `${project.title}: ${fact.label}`).toMatch(/^\d+%?$/);
      }
    }
  });
});
