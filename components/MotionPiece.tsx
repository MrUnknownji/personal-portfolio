"use client";

import { useState } from "react";
import Image from "next/image";

export default function MotionPiece({ id, title, duration, index }: { id: string; title: string; duration: string; index: number }) {
  const [playing, setPlaying] = useState(false);
  return <article className="motion-page-piece">
    <div className="motion-page-image">
      {playing ? <iframe src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /> : <button type="button" onClick={() => setPlaying(true)} aria-label={`Play ${title} here`}><Image src={`https://i.ytimg.com/vi/${id}/hq720.jpg`} alt="" fill sizes="(max-width: 760px) 100vw, 48vw" /><span>Play film ↗</span></button>}
      {!playing && <span className="motion-duration">{duration}</span>}
    </div>
    <div className="motion-page-piece-meta"><span>CruxLog / {String(index + 1).padStart(2, "0")}</span><span>{duration}</span></div>
    <h2>{title}</h2>
    <a className="motion-piece-link" href={`https://www.youtube.com/watch?v=${id}`} target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a>
  </article>;
}
