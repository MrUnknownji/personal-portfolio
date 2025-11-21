"use client";
import Link from "next/link";

const ViewProjectsButton = () => {
  return (
    <Link href="/my-projects">
      <div
        className="relative overflow-hidden group px-8 py-3 rounded-xl
                   bg-white/5 border border-white/10 cursor-pointer
                   transition-all duration-300 ease-out
                   hover:bg-primary/10 hover:border-primary/30 hover:scale-105 hover:shadow-[0_0_20px_-5px_rgba(0,255,159,0.3)]"
      >
        <div
          className="absolute inset-0 -translate-x-[150%] skew-x-12 group-hover:animate-shimmer
                     bg-gradient-to-r from-transparent via-white/10 to-transparent"
          style={{ width: "200%" }}
        />

        <span className="relative text-neutral-200 group-hover:text-white font-medium tracking-wide z-10 transition-colors duration-300">
          View My Projects
        </span>
      </div>
    </Link>
  );
};

export default ViewProjectsButton;
