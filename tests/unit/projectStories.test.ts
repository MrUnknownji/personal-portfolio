import { describe, expect, it } from "vitest";
import { selectedProjects } from "@/data/projects";
import { projectStories } from "@/data/projectStories";

describe("selected project stories", () => {
  it("has inspectable, distinct media for every selected case study", () => {
    for (const project of selectedProjects) {
      const story = projectStories[project.id];
      expect(story, `${project.title} has an editorial story`).toBeDefined();
      if (!story) continue;

      const matches = story.gallery.map(({ match }) => project.gallery?.filter((item) =>
        item.type === "image" && item.alt?.toLowerCase().includes(match.toLowerCase()),
      ) ?? []);
      expect(matches.every((items) => items.length === 1), `${project.title} media selectors are unambiguous`).toBe(true);
      expect(new Set(matches.map(([item]) => item.src)).size, `${project.title} media are distinct`).toBe(matches.length);
    }
  });
});
