import type { Metadata } from "next";
import MotionPiece from "@/components/MotionPiece";
import { motionVideos as videos } from "@/data/motion";
import "@/app/styles/motion.css";

export const metadata: Metadata = {
  title: "Motion & Visual Work",
  description: "Selected visual stories made for CruxLog by Sandeep Kumar.",
  alternates: { canonical: "/motion" },
};

export default function MotionPage() {
  return (
    <section className="motion-page offset-wrap" aria-labelledby="motion-title">
      <header className="motion-page-header">
        <span className="offset-kicker">Motion / Visual work</span>
        <h1 id="motion-title">
          Stories in
          <br />
          motion<span>.</span>
        </h1>
        <div className="motion-page-intro">
          <p>
            Technology stories told through research, pacing, and visuals. Selected videos from
            CruxLog.
          </p>
          <a href="https://www.youtube.com/@cruxlog" target="_blank" rel="noopener noreferrer">
            Visit the channel ↗
          </a>
        </div>
      </header>
      <div className="motion-page-grid">
        {videos.map((video, index) => (
          <MotionPiece key={video.id} {...video} index={index} />
        ))}
      </div>
    </section>
  );
}
