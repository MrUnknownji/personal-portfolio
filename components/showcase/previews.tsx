"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import Image from "next/image";
import FrameControls from "@/components/showcase/FrameControls";
import type { ShowcaseFrame, ShowcaseProject } from "@/types/Project";

type FrameProps = {
  project: ShowcaseProject;
  frames: ShowcaseFrame[];
  frame: number;
  outgoingFrame: number | null;
  changeFrame: (next: number) => void;
};

/**
 * Picks a frame from the pointer's horizontal position. It is attached to the whole
 * preview, because the full-card case-study link sits above the browser window.
 */
export function scrubFrames(
  event: PointerEvent<HTMLElement>,
  count: number,
  changeFrame: (next: number) => void,
) {
  if (count === 0 || event.pointerType === "touch") return;
  if (event.target instanceof Element && event.target.closest("button")) return;
  const rect = event.currentTarget.getBoundingClientRect();
  const position = Math.max(0, Math.min(0.999, (event.clientX - rect.left) / rect.width));
  changeFrame(Math.floor(position * count));
}

/** A browser window whose screen follows the pointer across the preview (store flow: home → checkout). */
export function BrowserPreview({ project, frames, frame, outgoingFrame, changeFrame }: FrameProps) {
  const current = frames[frame] ?? frames[0];
  return (
    <>
      <div className="showcase-browser">
        <div className="showcase-browser-top">
          <span>● ● ●</span>
          <span>
            {project.title} / {current?.label}
          </span>
        </div>
        {outgoingFrame !== null && frames[outgoingFrame] && (
          <Image
            className="showcase-browser-frame showcase-browser-frame-outgoing"
            src={frames[outgoingFrame].src}
            alt=""
            fill
            sizes="(max-width: 900px) 90vw, 50vw"
          />
        )}
        <Image
          key={current?.src || project.image}
          className="showcase-browser-frame showcase-browser-frame-current"
          src={current?.src || project.image}
          alt={current?.alt || `${project.title} interface`}
          fill
          sizes="(max-width: 900px) 90vw, 50vw"
        />
      </div>
      <FrameControls
        label={`${project.title} preview screens`}
        frames={frames}
        frame={frame}
        onSelect={changeFrame}
      />
    </>
  );
}

/** Phone screens side by side; the active one comes forward (lock and home pairs). */
export function PhonePreview({ project, frames, frame, changeFrame }: FrameProps) {
  return (
    <>
      <div className="showcase-wallpapers">
        {frames.map((item, position) => {
          const active = frame === position;
          const image = (
            <Image src={item.src} alt={item.alt} fill sizes="(max-width: 900px) 28vw, 16vw" />
          );
          // The active screen lets clicks through to the case study; the others bring
          // themselves forward. Keyboard users have the step buttons below.
          return active ? (
            <div
              className="showcase-wallpaper"
              key={item.src}
              data-active="true"
              style={{ "--item": position } as CSSProperties}
            >
              {image}
            </div>
          ) : (
            <button
              type="button"
              className="showcase-wallpaper"
              key={item.src}
              data-active="false"
              tabIndex={-1}
              aria-hidden="true"
              onClick={() => changeFrame(position)}
              style={{ "--item": position } as CSSProperties}
            >
              {image}
            </button>
          );
        })}
      </div>
      <FrameControls
        label={`${project.title} preview steps`}
        frames={frames}
        frame={frame}
        onSelect={changeFrame}
      />
    </>
  );
}

const bidSteps = ["₹4,250", "₹4,300", "₹4,450", "SOLD"];

/** A product screen with a small ticker that steps through an auction's price updates. */
export function AuctionPreview({ project }: { project: ShowcaseProject }) {
  const [step, setStep] = useState(0);
  return (
    <>
      <StillPreview project={project} />
      <div className="showcase-bid-ticker">
        <span>Bid update / interaction sketch</span>
        <strong aria-live="polite">{bidSteps[step]}</strong>
        <button
          type="button"
          onClick={() => setStep((current) => (current + 1) % bidSteps.length)}
          aria-label="Preview next bid update"
        >
          Next bid ↗
        </button>
      </div>
    </>
  );
}

export function StillPreview({ project }: { project: ShowcaseProject }) {
  return (
    <div className="showcase-bid-screen">
      <Image
        src={project.image}
        alt={`${project.title} interface preview`}
        fill
        sizes="(max-width: 900px) 90vw, 50vw"
      />
    </div>
  );
}

/**
 * A muted loop of the studio reel. Nothing downloads until the row is near the screen; it
 * plays only while visible, and never on its own for reduced motion or data saver.
 */
export function FilmPreview({ project }: { project: ShowcaseProject }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const loop = project.showcaseLoop;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } })
      .connection;
    const holdStill =
      matchMedia("(prefers-reduced-motion: reduce)").matches || connection?.saveData === true;
    if (holdStill) userPaused.current = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  if (!loop) return <StillPreview project={project} />;

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    userPaused.current = !video.paused;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <>
      <div className="showcase-film-screen">
        {/* A lazy image instead of the video's poster attribute, which the browser would
            fetch with the first screen and delay the hero. */}
        <Image src={loop.poster} alt="" fill sizes="(max-width: 900px) 90vw, 50vw" />
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          aria-label={`${project.title} reel, muted`}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src={loop.src} type="video/mp4" />
        </video>
      </div>
      <div className="showcase-media-controls">
        <button type="button" onClick={toggle}>
          {playing ? "Pause reel" : "Play reel"}
        </button>
      </div>
    </>
  );
}
