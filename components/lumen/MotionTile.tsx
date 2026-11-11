"use client";

import { useState } from "react";
import Image from "next/image";
import { SoftLayers, softStyle } from "./Soft";

/** A CruxLog film that loads YouTube only when the visitor asks to play it. */
export default function MotionTile({
  id,
  title,
  duration,
  index,
}: {
  id: string;
  title: string;
  duration: string;
  index: number;
}) {
  const [playing, setPlaying] = useState(false);
  return (
    <article className="ld-film ld-soft" style={softStyle("sheet")}>
      <SoftLayers sheen={false} />
      <div className="ld-film-screen">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} aria-label={`Play film: ${title}`}>
            <Image
              src={`https://i.ytimg.com/vi/${id}/hq720.jpg`}
              alt=""
              fill
              sizes="(max-width: 760px) 92vw, 46vw"
            />
            <span className="ld-film-play">Play film</span>
          </button>
        )}
      </div>
      <div className="ld-film-meta">
        <span className="ld-anno">
          CruxLog / {String(index + 1).padStart(2, "0")} · {duration}
        </span>
        <h2>{title}</h2>
        <a href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer">
          Watch on YouTube <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
}
