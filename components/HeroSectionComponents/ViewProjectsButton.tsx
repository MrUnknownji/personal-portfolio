"use client";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

const ViewProjectsButton = () => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const button = buttonRef.current;
      const sweep = sweepRef.current;
      if (!button || !sweep) return;

      gsap.set(sweep, { rotate: -45, x: "100%", y: "-100%", opacity: 0 });

      const tl = gsap.timeline({ paused: true });
      tl.to(sweep, {
        x: "-100%",
        y: "100%",
        opacity: 1,
        duration: 1,
        ease: "power2.inOut",
      });

      const handleEnter = () => {
        gsap.set(sweep, { x: "100%", y: "-100%", opacity: 0 });
        tl.play(0);
      };

      const handleLeave = () => {
        gsap.to(sweep, {
          x: "100%",
          y: "-100%",
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
        });
      };

      button.addEventListener("mouseenter", handleEnter);
      button.addEventListener("mouseleave", handleLeave);
    },
    { scope: buttonRef },
  );

  return (
    <Link href="/my-projects">
      <div
        ref={buttonRef}
        className="relative overflow-hidden group px-8 py-3 rounded-xl
                   bg-primary/15 border border-white/20 cursor-pointer"
      >
        <div
          ref={sweepRef}
          className="sweep absolute inset-0 w-[200%] h-[200%] top-[-50%] left-[-50%]"
          style={{
            background:
              "linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
          }}
        />
        <span className="relative text-white font-medium z-10">
          View My Projects
        </span>
      </div>
    </Link>
  );
};

export default ViewProjectsButton;
