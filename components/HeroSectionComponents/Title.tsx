"use client";
import { useRef, useCallback, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface GradientTheme {
  name: string;
  colors: string[];
}

const GRADIENT_THEMES: GradientTheme[] = [
  { name: "orange-base", colors: ["#ff9233", "#ffc899", "#ff9233"] },
  { name: "sunset", colors: ["#ff7e5f", "#feb47b", "#ff7e5f"] },
  { name: "gold", colors: ["#ffd700", "#ffdf00", "#d4af37"] },
  { name: "peach", colors: ["#ffeaa7", "#fdcb6e", "#ffe0b2"] },
  { name: "sand", colors: ["#e8d1b5", "#f4e0c6", "#e8d1b5"] },
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

    tl.from(containerRef.current, {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: "power3.out",
    }).to(
      {},
      {
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: function () {
          const progress = this.progress() * 100;
          setFillProgress(progress);
        },
      },
      "-=0.5",
    );
  }, []);

  const handleHover = useCallback(() => {
    if (isOnCooldown) return;

    setPrevTheme(currentTheme);

    const nextTheme = (currentTheme + 1) % GRADIENT_THEMES.length;
    setCurrentTheme(nextTheme);

    setIsOnCooldown(true);
    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    cooldownTimerRef.current = setTimeout(() => {
      setIsOnCooldown(false);
    }, COOLDOWN_MS);

    gsap.to(
      { val: 0 },
      {
        val: 100,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: function () {
          setFillProgress(this.targets()[0].val);
        },
      },
    );
  }, [currentTheme, isOnCooldown]);

  useEffect(() => {
    // Only auto-play if on a touch device (no hover capability)
    const isTouchDevice = window.matchMedia(
      "(hover: none) and (pointer: coarse)",
    ).matches;
    if (!isTouchDevice) return;

    const intervalId = setInterval(() => {
      handleHover();
    }, 4500); // Trigger slightly longer than the cooldown

    return () => clearInterval(intervalId);
  }, [handleHover]);

  const theme = GRADIENT_THEMES[currentTheme];
  const oldTheme = prevTheme !== null ? GRADIENT_THEMES[prevTheme] : null;

  return (
    <div
      ref={containerRef}
      className="relative overflow-visible py-2 pb-8 w-fit"
      onMouseEnter={handleHover}
    >
      <div className="relative">
        <h1 className="hero-title relative font-bold text-4xl md:text-5xl lg:text-7xl tracking-tight cursor-pointer select-none">
          <span className="text-neutral-700">Sandeep Kumar</span>

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

      <svg
        className="absolute left-0 w-full mt-1 overflow-visible pointer-events-none"
        height="36"
        viewBox="0 0 400 36"
        preserveAspectRatio="none"
        style={{ top: "100%", transform: "translateY(-24px)" }}
      >
        <defs>
          <linearGradient
            id={`wave-gradient-${currentTheme}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor={theme.colors[0]} />
            <stop offset="50%" stopColor={theme.colors[1]} />
            <stop offset="100%" stopColor={theme.colors[2]} />
          </linearGradient>

          {oldTheme && prevTheme !== null && (
            <linearGradient
              id={`wave-gradient-${prevTheme}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={oldTheme.colors[0]} />
              <stop offset="50%" stopColor={oldTheme.colors[1]} />
              <stop offset="100%" stopColor={oldTheme.colors[2]} />
            </linearGradient>
          )}
        </defs>

        {/* --- PREVIOUS THEME STATE (FULLY DRAWN / FADING OUT) --- */}
        {oldTheme && prevTheme !== null && (
          <g>
            {/* Elegant Main Swash */}
            <path
              d="M 0 8 C 80 8 130 8 160 18 C 175 23 185 28 200 28 C 215 28 225 23 240 18 C 270 8 320 8 400 8"
              stroke={`url(#wave-gradient-${prevTheme})`}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Blooming Lotus Core */}
            <g
              style={{
                transformOrigin: "200px 16px",
                transform: "scale(1)",
                opacity: 1,
              }}
            >
              <path
                d="M 200 4 C 196 14 196 22 200 34 C 204 22 204 14 200 4 Z"
                fill={`url(#wave-gradient-${prevTheme})`}
              />
              <path
                d="M 200 26 C 185 26 176 16 178 8 C 184 16 192 22 200 26 Z"
                fill={`url(#wave-gradient-${prevTheme})`}
              />
              <path
                d="M 200 26 C 215 26 224 16 222 8 C 216 16 208 22 200 26 Z"
                fill={`url(#wave-gradient-${prevTheme})`}
              />
              <circle
                cx="165"
                cy="18"
                r="2.5"
                fill={`url(#wave-gradient-${prevTheme})`}
              />
              <circle
                cx="235"
                cy="18"
                r="2.5"
                fill={`url(#wave-gradient-${prevTheme})`}
              />
              <circle
                cx="150"
                cy="12"
                r="1.5"
                fill={`url(#wave-gradient-${prevTheme})`}
              />
              <circle
                cx="250"
                cy="12"
                r="1.5"
                fill={`url(#wave-gradient-${prevTheme})`}
              />
            </g>
          </g>
        )}

        {/* --- CURRENT THEME STATE (ANIMATING IN) --- */}
        {/* Animated Sweep Line */}
        <path
          d="M 0 8 C 80 8 130 8 160 18 C 175 23 185 28 200 28 C 215 28 225 23 240 18 C 270 8 320 8 400 8"
          stroke={`url(#wave-gradient-${currentTheme})`}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="500"
          strokeDashoffset={500 - (fillProgress / 100) * 500}
        />

        {/* Animated Lotus Bloom Motif */}
        <g
          style={{
            transformOrigin: "200px 16px",
            transform: `scale(${0.3 + (fillProgress / 100) * 0.7})`,
            opacity: fillProgress / 100,
          }}
        >
          {/* Vertical Drop Diamond/Petal */}
          <path
            d="M 200 4 C 196 14 196 22 200 34 C 204 22 204 14 200 4 Z"
            fill={`url(#wave-gradient-${currentTheme})`}
          />

          {/* Sweeping Side Petals */}
          <path
            d="M 200 26 C 185 26 176 16 178 8 C 184 16 192 22 200 26 Z"
            fill={`url(#wave-gradient-${currentTheme})`}
          />
          <path
            d="M 200 26 C 215 26 224 16 222 8 C 216 16 208 22 200 26 Z"
            fill={`url(#wave-gradient-${currentTheme})`}
          />

          {/* Orbiting Bindis (Dots) */}
          <circle
            cx="165"
            cy="18"
            r="2.5"
            fill={`url(#wave-gradient-${currentTheme})`}
          />
          <circle
            cx="235"
            cy="18"
            r="2.5"
            fill={`url(#wave-gradient-${currentTheme})`}
          />
          <circle
            cx="150"
            cy="12"
            r="1.5"
            fill={`url(#wave-gradient-${currentTheme})`}
          />
          <circle
            cx="250"
            cy="12"
            r="1.5"
            fill={`url(#wave-gradient-${currentTheme})`}
          />
        </g>
      </svg>
    </div>
  );
};
