"use client";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const ViewProjectsButton = () => {
  return (
    <Link href="/my-projects" className="group relative inline-block">
      <div
        className="relative overflow-hidden rounded-full bg-card border border-white/5
                   transition-all duration-300 ease-out group-hover:border-primary/40 group-hover:shadow-[0_0_25px_hsl(var(--primary)/0.2)]"
      >
        {/* Subtle Inner Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Inner Content */}
        <div
          className="relative flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#0a0a0a]
                        transition-colors duration-300 ease-out
                        group-hover:bg-[#111]"
        >
          {/* Text */}
          <span className="text-sm font-bold tracking-[0.15em] uppercase text-foreground/80 group-hover:text-primary transition-colors duration-300">
            View Projects
          </span>

          {/* Arrow Icon */}
          <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-white/5 group-hover:bg-primary/20 transition-colors duration-300">
            <FiArrowRight className="w-3.5 h-3.5 text-foreground/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-primary" />
          </div>

          {/* Shine Effect */}
          <div
            className="absolute inset-0 -translate-x-[150%] skew-x-12 group-hover:animate-[shimmer_2s_infinite]
                       bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
            style={{ width: "200%" }}
          />
        </div>
      </div>
    </Link>
  );
};

export default ViewProjectsButton;
