import Image from "next/image";
import type { CSSProperties } from "react";

type GalleryItem = { src: string; alt?: string; caption: string };

export default function ProjectGallery({ items, title }: { items: GalleryItem[]; title: string }) {
  const style = {
    "--gallery-count": items.length,
    "--gallery-travel": `${-100 * (items.length - 1) / items.length}%`,
    "--gallery-pin-distance": `${(items.length - 1) * 72}svh`,
  } as CSSProperties;

  return <div className="study-gallery-story" style={style} aria-label={`${title} product screens`}>
    <div className="study-gallery-stage">
      <div className="study-gallery-intro">
        <span className="study-marker">Product walkthrough / 01—{String(items.length).padStart(2, "0")}</span>
        <h3>Inside the<br />product<span>.</span></h3>
        <p>Scroll down to follow the screens in order.</p>
        <div className="study-gallery-progress" aria-hidden="true"><i /></div>
        <span className="study-gallery-count">01 → {String(items.length).padStart(2, "0")}</span>
      </div>
      <div className="study-gallery-window">
        <div className="study-gallery-track">
          {items.map((item, index) => <figure key={item.src} className="study-gallery-frame">
            <span className="study-gallery-index">Fig. {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
            <a href={item.src} target="_blank" rel="noopener noreferrer" aria-label={`Open full image: ${item.alt || item.caption}`}>
              <Image src={item.src} alt={item.alt || `${title} detail ${index + 1}`} fill sizes="(max-width: 900px) 90vw, 720px" />
              <span>Open full image ↗</span>
            </a>
            <figcaption>{item.caption}</figcaption>
          </figure>)}
        </div>
      </div>
    </div>
  </div>;
}
