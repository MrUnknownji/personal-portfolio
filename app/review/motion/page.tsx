import type { Metadata } from "next";
import MotionTile from "@/components/lumen/MotionTile";
import { motionChannel, motionVideos } from "@/data/motion";

export const metadata: Metadata = {
  title: "Motion & visual work",
  description: "Selected visual stories made for CruxLog by Sandeep Kumar.",
};

export default function ReviewMotion() {
  return (
    <div className="ld-wrap ld-page">
      <header className="ld-page-head">
        <span className="ld-anno">Motion · Visual work</span>
        <h1>Stories in motion.</h1>
        <p>
          Technology stories told through research, pacing, and visuals. Selected videos from
          CruxLog.{" "}
          <a href={motionChannel} target="_blank" rel="noopener noreferrer">
            Visit the channel <span aria-hidden="true">↗</span>
          </a>
        </p>
      </header>
      <div className="ld-films">
        {motionVideos.map((video, index) => (
          <MotionTile key={video.id} {...video} index={index} />
        ))}
      </div>
    </div>
  );
}
