// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { FilmPreview } from "@/components/showcase/previews";
import type { ShowcaseProject } from "@/types/Project";

const project: ShowcaseProject = {
  id: 13,
  title: "FrameRelay Studio",
  shortDescription: "Motion studio",
  image: "/images/framerelay/hero.webp",
  technologies: ["Remotion"],
  category: "Studio",
  showcaseVariant: "film",
  showcaseLoop: {
    src: "/images/framerelay/reel-loop.mp4",
    poster: "/images/framerelay/reel-loop.webp",
  },
};

let reportVisibility: (visible: boolean) => void = () => {};
let reducedMotion = false;

beforeEach(() => {
  reducedMotion = false;
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        reportVisibility = (visible) =>
          callback(
            [{ isIntersecting: visible } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
          );
      }
      observe() {}
      disconnect() {}
    },
  );
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: reducedMotion, media: query }));
  // jsdom has no media playback; emulate the element's paused state and events.
  vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function (
    this: HTMLMediaElement,
  ) {
    Object.defineProperty(this, "paused", { value: false, configurable: true });
    this.dispatchEvent(new Event("play"));
    return Promise.resolve();
  });
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(function (
    this: HTMLMediaElement,
  ) {
    Object.defineProperty(this, "paused", { value: true, configurable: true });
    this.dispatchEvent(new Event("pause"));
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("FilmPreview", () => {
  it("loads nothing up front and plays only while on screen", () => {
    const { container } = render(<FilmPreview project={project} />);
    const video = container.querySelector("video")!;
    expect(video.getAttribute("preload")).toBe("none");
    expect(video.muted).toBe(true);
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();

    act(() => reportVisibility(true));
    expect(screen.getByRole("button", { name: "Pause reel" })).toBeTruthy();

    act(() => reportVisibility(false));
    expect(screen.getByRole("button", { name: "Play reel" })).toBeTruthy();
  });

  it("stays paused after the visitor pauses it, even when scrolled back into view", () => {
    render(<FilmPreview project={project} />);
    act(() => reportVisibility(true));
    fireEvent.click(screen.getByRole("button", { name: "Pause reel" }));
    act(() => reportVisibility(false));
    act(() => reportVisibility(true));
    expect(screen.getByRole("button", { name: "Play reel" })).toBeTruthy();
  });

  it("never starts on its own when the visitor prefers reduced motion", () => {
    reducedMotion = true;
    render(<FilmPreview project={project} />);
    act(() => reportVisibility(true));
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Play reel" }));
    expect(screen.getByRole("button", { name: "Pause reel" })).toBeTruthy();
  });
});
