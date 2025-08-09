"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface SkillCardProps {
  icon: string;
  text: string;
}

const SkillCard = ({ icon, text }: SkillCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const hoverTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useGSAP(
    () => {
      const card = cardRef.current;
      const path = pathRef.current;
      if (!card || !path) return;

      const pathLength = path.getTotalLength();
      gsap.set(path, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
        opacity: 0,
      });

      hoverTimelineRef.current = gsap
        .timeline({ paused: true })
        .to(
          card.querySelector(".skill-icon"),
          {
            y: -4,
            color: "var(--color-primary)",
            duration: 0.3,
            ease: "power2.out",
          },
          0,
        )
        .to(
          card.querySelector(".skill-bg"),
          {
            opacity: 1,
            duration: 0.2,
            ease: "power2.out",
          },
          0,
        )
        .to(
          path,
          {
            opacity: 1,
            duration: 0.1,
          },
          0,
        )
        .to(
          path,
          {
            strokeDashoffset: 0,
            duration: 0.6,
            ease: "sine.inOut",
          },
          0,
        );

      card.addEventListener("mouseenter", () =>
        hoverTimelineRef.current?.play(),
      );
      card.addEventListener("mouseleave", () =>
        hoverTimelineRef.current?.reverse(),
      );
    },
    { scope: cardRef },
  );

  const radius = 12;
  const strokeW = 1.5;
  const w = 200;
  const h = 64;
  const pathData = `M ${radius + strokeW / 2},${strokeW / 2} L ${w - radius - strokeW / 2},${strokeW / 2} A ${radius},${radius} 0 0 1 ${w - strokeW / 2},${radius + strokeW / 2} L ${w - strokeW / 2},${h - radius - strokeW / 2} A ${radius},${radius} 0 0 1 ${w - radius - strokeW / 2},${h - strokeW / 2} L ${radius + strokeW / 2},${h - strokeW / 2} A ${radius},${radius} 0 0 1 ${strokeW / 2},${h - radius - strokeW / 2} L ${strokeW / 2},${radius + strokeW / 2} A ${radius},${radius} 0 0 1 ${radius + strokeW / 2},${strokeW / 2} Z`;

  return (
    <div
      ref={cardRef}
      className="relative bg-neutral/60 rounded-xl p-4 h-16 flex items-center overflow-hidden border border-neutral/50 w-full sm:w-auto"
    >
      <div className="skill-bg absolute inset-0 z-0 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent opacity-0" />
      <svg
        className="absolute inset-0 w-full h-full z-10"
        fill="none"
        preserveAspectRatio="none"
        viewBox={`0 0 ${w} ${h}`}
      >
        <path
          ref={pathRef}
          d={pathData}
          stroke="var(--color-primary)"
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="relative z-20 flex items-center gap-3">
        <div className="skill-icon text-2xl text-gray-300">{icon}</div>
        <div className="text-gray-200 text-sm font-medium">{text}</div>
      </div>
    </div>
  );
};

export default SkillCard;
