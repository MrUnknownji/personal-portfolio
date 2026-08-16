import { describe, expect, it } from "vitest";
import { selectedProjects } from "@/data/projects";

describe("selected project data", () => {
  it("has unique stable IDs and complete public summaries", () => {
    const ids = selectedProjects.map((project) => project.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const project of selectedProjects) {
      expect(project.title.trim()).not.toBe("");
      expect(project.shortDescription.trim()).not.toBe("");
      expect(project.image).toMatch(/^https:\/\//);
      expect(project.technologies.length).toBeGreaterThan(0);
    }
  });
});
