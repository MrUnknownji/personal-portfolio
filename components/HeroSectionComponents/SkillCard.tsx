import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface SkillCardProps {
  icon: string;
  text: string;
}

const SkillCard = ({ icon, text }: SkillCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const svgPathRef = useRef<SVGPathElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

  const hoverTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const HOVER_ICON_Y = -4;
  const BORDER_TRACE_DURATION = 0.6;
  const ANIM_DURATION = 0.3;
  const EASE_TYPE = "power2.out";
  const BORDER_COLOR = "var(--color-primary)";
  const BORDER_WIDTH = 1.5;

  const svgInternalWidth = 200;
  const svgInternalHeight = 64;

  useGSAP(
    () => {
      const { current: cardElement } = cardRef;
      const { current: iconElement } = iconRef;
      const { current: pathElement } = svgPathRef;
      const { current: backgroundElement } = backgroundRef;

      if (!cardElement || !iconElement || !pathElement || !backgroundElement)
        return;

      gsap.delayedCall(0.01, () => {
        if (!pathElement || !iconElement || !backgroundElement) return;

        const pathLength = pathElement.getTotalLength();

        if (pathLength <= 0) {
          console.warn(
            "SkillCard: Could not get valid SVG path length for",
            text,
          );
          return;
        }

        gsap.set(iconElement, { y: 0, color: "rgb(209 213 219)" });
        gsap.set(pathElement, {
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
          opacity: 0,
        });
        gsap.set(backgroundElement, { opacity: 0 });

        hoverTimelineRef.current = gsap
          .timeline({ paused: true })
          .to(
            iconElement,
            {
              y: HOVER_ICON_Y,
              color: BORDER_COLOR,
              duration: ANIM_DURATION,
              ease: EASE_TYPE,
            },
            0,
          )
          .to(
            backgroundElement,
            {
              opacity: 1,
              duration: ANIM_DURATION * 0.8,
              ease: EASE_TYPE,
            },
            0,
          )
          .to(
            pathElement,
            {
              opacity: 0.8,
              duration: ANIM_DURATION * 0.5,
              ease: "none",
            },
            0.05,
          )
          .to(
            pathElement,
            {
              strokeDashoffset: 0,
              duration: BORDER_TRACE_DURATION,
              ease: "sine.inOut",
            },
            0.05,
          );

        const handleMouseEnter = () => {
          hoverTimelineRef.current?.timeScale(1).play();
        };

        const handleMouseLeave = () => {
          hoverTimelineRef.current?.timeScale(1.5).reverse();
        };

        cardElement.addEventListener("mouseenter", handleMouseEnter);
        cardElement.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          cardElement.removeEventListener("mouseenter", handleMouseEnter);
          cardElement.removeEventListener("mouseleave", handleMouseLeave);
          hoverTimelineRef.current?.kill();
          gsap.killTweensOf([iconElement, pathElement, backgroundElement]);
        };
      });
    },
    { scope: cardRef, dependencies: [text] },
  );

  const radius = 12;
  const strokeW = BORDER_WIDTH;
  const pathData = `M ${radius + strokeW / 2},${strokeW / 2}
                    L ${svgInternalWidth - radius - strokeW / 2},${strokeW / 2}
                    A ${radius},${radius} 0 0 1 ${svgInternalWidth - strokeW / 2},${radius + strokeW / 2}
                    L ${svgInternalWidth - strokeW / 2},${svgInternalHeight - radius - strokeW / 2}
                    A ${radius},${radius} 0 0 1 ${svgInternalWidth - radius - strokeW / 2},${svgInternalHeight - strokeW / 2}
                    L ${radius + strokeW / 2},${svgInternalHeight - strokeW / 2}
                    A ${radius},${radius} 0 0 1 ${strokeW / 2},${svgInternalHeight - radius - strokeW / 2}
                    L ${strokeW / 2},${radius + strokeW / 2}
                    A ${radius},${radius} 0 0 1 ${radius + strokeW / 2},${strokeW / 2} Z`;

  return (
    <div
      ref={cardRef}
      className="relative bg-neutral/60 rounded-xl p-4 cursor-pointer h-16 flex items-center overflow-hidden
                 transform-gpu shadow-md border border-neutral/50 transition-colors duration-300 hover:border-primary/30
                 w-full sm:w-auto"
      style={{
        willChange: "transform, box-shadow, border-color",
      }}
    >
      <div
        ref={backgroundRef}
        className="absolute inset-0 z-0 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent pointer-events-none"
        style={{ willChange: "opacity" }}
      />

      <svg
        className="absolute inset-0 w-full h-full z-10 pointer-events-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox={`0 0 ${svgInternalWidth} ${svgInternalHeight}`}
      >
        <path
          ref={svgPathRef}
          d={pathData}
          stroke={BORDER_COLOR}
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ willChange: "stroke-dashoffset, opacity" }}
        />
      </svg>

      <div className="relative z-20 flex items-center gap-3 w-full">
        <div
          ref={iconRef}
          className="text-2xl text-gray-300 transform-gpu flex-shrink-0"
          style={{ willChange: "transform, color" }}
        >
          {icon}
        </div>
        <div className="text-gray-200 text-sm font-medium truncate">{text}</div>
      </div>
    </div>
  );
};

export default SkillCard;
