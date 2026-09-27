import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Motion & Visual Work",
  description: "Selected visual stories made for CruxLog by Sandeep Kumar.",
  alternates: { canonical: "/motion" },
};

const videos = [
  { id: "6mHdUbd3fh8", title: "Kese Ek $0.46 Ki Chip Ne Karwaya Nuclear Attack", duration: "9:10" },
  { id: "uYVl5RxheyM", title: "Ek Update Ne Duniya Bhar Ke Computers Crash Kar Diye", duration: "5:15" },
  { id: "05FY1I_uVnA", title: "₹450 Crore Mein Mars Kaise Pahuncha India? | Mangalyaan ki Incredible Story", duration: "6:08" },
  { id: "1TyCxKgJMeU", title: "45 Minute Mein $460 Million Kaise Doob Gaye? | Knight Capital", duration: "5:26" },
] as const;

export default function MotionPage() {
  return <section className="motion-page offset-wrap" aria-labelledby="motion-title">
    <header className="motion-page-header">
      <span className="offset-kicker">Motion / Visual work</span>
      <h1 id="motion-title">Stories in<br />motion<span>.</span></h1>
      <div className="motion-page-intro"><p>Technology stories told through research, pacing, and visuals. Selected videos from CruxLog.</p><a href="https://www.youtube.com/@cruxlog" target="_blank" rel="noopener noreferrer">Visit the channel ↗</a></div>
    </header>
    <div className="motion-page-grid">
      {videos.map((video, index) => <a className="motion-page-piece" href={`https://www.youtube.com/watch?v=${video.id}`} key={video.id} target="_blank" rel="noopener noreferrer" aria-label={`Watch ${video.title} on YouTube`}>
        <div className="motion-page-image"><Image src={`https://i.ytimg.com/vi/${video.id}/hq720.jpg`} alt="" fill sizes="(max-width: 760px) 100vw, 48vw" /><span>{video.duration}</span></div>
        <div className="motion-page-piece-meta"><span>CRUXLOG / {String(index + 1).padStart(2, "0")}</span><span>WATCH ↗</span></div>
        <h2>{video.title}</h2>
      </a>)}
    </div>
  </section>;
}
