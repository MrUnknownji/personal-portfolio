import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { selectedProjects } from "@/data/projects";

describe("selected project data", () => {
  it("has unique stable IDs and complete public summaries", () => {
    const ids = selectedProjects.map((project) => project.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const project of selectedProjects) {
      expect(project.title.trim()).not.toBe("");
      expect(project.shortDescription.trim()).not.toBe("");
      expect(project.image).toMatch(/^(https:\/\/|\/images\/)/);
      expect(project.technologies.length).toBeGreaterThan(0);
    }
  });

  it("ships every local image and film it references", () => {
    for (const project of selectedProjects) {
      const paths = [
        project.image,
        ...(project.gallery ?? []).map((item) => item.src),
        ...(project.showcaseFrames ?? []).map((frame) => frame.src),
        project.showcaseLoop?.src,
        project.showcaseLoop?.poster,
        ...(project.films ?? []).flatMap((film) => [film.src, film.poster]),
      ].filter((path): path is string => Boolean(path?.startsWith("/")));
      for (const path of paths) {
        expect(existsSync(join(process.cwd(), "public", path)), `${project.title}: ${path}`).toBe(
          true,
        );
      }
    }
  });

  it("gives every film-style showcase a loop to play", () => {
    for (const project of selectedProjects.filter((item) => item.showcaseVariant === "film")) {
      expect(project.showcaseLoop, project.title).toBeDefined();
    }
  });
});
