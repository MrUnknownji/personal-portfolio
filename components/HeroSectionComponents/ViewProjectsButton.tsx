"use client";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

const ViewProjectsButton = () => {
  return (
    <Link href="/my-projects" className="group relative inline-block">
      <div
        className="relative overflow-hidden rounded-full
                   bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a]
                   p-[1px]" // This p-[1px] acts as the border container
      >
        {/* Gradient Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/20 to-white/10 opacity-50" />

        {/* Inner Content */}
        <div className="relative flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#0f0f0f]/90 backdrop-blur-xl
                        transition-all duration-300 ease-out
                        group-hover:bg-[#151515]/90 group-hover:shadow-[0_0_25px_-5px_rgba(0,255,159,0.15)]
                        group-hover:scale-105">

          {/* Text */}
          <span className="text-[15px] font-medium tracking-wide text-gray-200 group-hover:text-white transition-colors">
            View Projects
          </span>

          {/* Arrow Icon */}
          <FiArrowRight className="w-4 h-4 text-[#00ff9f] transition-transform duration-300 group-hover:translate-x-1" />

          {/* Shine Effect */}
          <div
            className="absolute inset-0 -translate-x-[150%] skew-x-12 group-hover:animate-shimmer
                       bg-gradient-to-r from-transparent via-white/5 to-transparent"
            style={{ width: "200%" }}
          />
        </div>
      </div>
    </Link>
  );
};

export default ViewProjectsButton;
