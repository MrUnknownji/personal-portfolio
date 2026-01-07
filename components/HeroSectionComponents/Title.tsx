"use client";
import { useRef, useCallback, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface GradientTheme {
  name: string;
  colors: string[];
}

const GRADIENT_THEMES: GradientTheme[] = [
  { name: "aesthetic", colors: ["#ffafcc", "#bde0fe", "#a2d2ff"] },
  { name: "funky", colors: ["#ff006e", "#ffbe0b", "#8338ec"] },
  { name: "punchy", colors: ["#ff5400", "#ff9e00", "#ffdd00"] },
  { name: "modern", colors: ["#00ff9f", "#00d1ff", "#b388ff"] },
  { name: "cyberpunk", colors: ["#ff00ff", "#00ffff", "#ffff00"] },
  { name: "cold", colors: ["#4cc9f0", "#4361ee", "#7209b7"] },
];

const COOLDOWN_MS = 1000;

export const Title = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTheme, setCurrentTheme] = useState(3);
  const [prevTheme, setPrevTheme] = useState<number | null>(null);
  const [isOnCooldown, setIsOnCooldown] = useState(false);
  const [fillProgress, setFillProgress] = useState(0);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline();

    // Entrance animation
    tl.from(containerRef.current, {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: "power3.out",
    })
      // Initial Gradient fill animation
      .to(
        {},
        {
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: function () {
            const progress = this.progress() * 100;
            setFillProgress(progress);
          },
        },
        "-=0.5"
      );
  }, []);

  const handleHover = useCallback(() => {
    if (isOnCooldown) return;

    // Set previous theme to current before changing
    setPrevTheme(currentTheme);

    // Select new theme
    const nextTheme = (currentTheme + 1) % GRADIENT_THEMES.length;
    setCurrentTheme(nextTheme);

    setIsOnCooldown(true);
    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    cooldownTimerRef.current = setTimeout(() => {
      setIsOnCooldown(false);
    }, COOLDOWN_MS);


    gsap.to({ val: 0 }, {
      val: 100,
      duration: 0.8,
      ease: "power2.out",
      onUpdate: function () {
        setFillProgress(this.targets()[0].val);
      },
    });
  }, [currentTheme, isOnCooldown]);

  const theme = GRADIENT_THEMES[currentTheme];
  const oldTheme = prevTheme !== null ? GRADIENT_THEMES[prevTheme] : null;

  return (
    <div
      ref={containerRef}
      className="relative overflow-visible py-2 pb-8 w-fit"
      onMouseEnter={handleHover}
    >
      <div className="relative">
        {/* Title with gradient fill */}
        <h1 className="hero-title relative font-bold text-4xl md:text-5xl lg:text-7xl tracking-tight cursor-pointer select-none">

          <span className="text-neutral-700">
            Sandeep Kumar
          </span>


          {oldTheme && (
            <span
              className="absolute top-0 left-0 w-full -bottom-4"
              style={{
                backgroundImage: `linear-gradient(to right, ${oldTheme.colors[0]}, ${oldTheme.colors[1]}, ${oldTheme.colors[2]})`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",

                clipPath: "inset(0 0 0 0)",
              }}
            >
              Sandeep Kumar
            </span>
          )}


          <span
            className="absolute top-0 left-0 w-full -bottom-4"
            style={{
              backgroundImage: `linear-gradient(to right, ${theme.colors[0]}, ${theme.colors[1]}, ${theme.colors[2]})`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",

              clipPath: `inset(0 ${100 - fillProgress}% 0 0)`,
            }}
          >
            Sandeep Kumar
          </span>
        </h1>
      </div>

      {/* Wavy underline SVG */}
      <svg
        className="absolute left-0 w-full mt-1 overflow-visible"
        height="10"
        viewBox="0 0 400 10"
        preserveAspectRatio="none"
        style={{ top: "100%", transform: "translateY(-24px)" }}
      >
        <defs>
          <linearGradient id={`wave-gradient-${currentTheme}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={theme.colors[0]} />
            <stop offset="50%" stopColor={theme.colors[1]} />
            <stop offset="100%" stopColor={theme.colors[2]} />
          </linearGradient>

          {oldTheme && prevTheme !== null && (
            <linearGradient id={`wave-gradient-${prevTheme}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={oldTheme.colors[0]} />
              <stop offset="50%" stopColor={oldTheme.colors[1]} />
              <stop offset="100%" stopColor={oldTheme.colors[2]} />
            </linearGradient>
          )}
        </defs>

        {oldTheme && prevTheme !== null && (
          <path
            className="wave-path"
            d="M 0 5 Q 20 0, 40 5 T 80 5 T 120 5 T 160 5 T 200 5 T 240 5 T 280 5 T 320 5 T 360 5 T 400 5"
            stroke={`url(#wave-gradient-${prevTheme})`}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        )}

        <path
          className="wave-path"
          d="M 0 5 Q 20 0, 40 5 T 80 5 T 120 5 T 160 5 T 200 5 T 240 5 T 280 5 T 320 5 T 360 5 T 400 5"
          stroke={`url(#wave-gradient-${currentTheme})`}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="450"
          strokeDashoffset={450 - (fillProgress / 100) * 450}
        />
      </svg>
    </div>
  );
};
