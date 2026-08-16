export const Title = () => {
  return (
    <div className="relative w-fit overflow-visible pb-8 pt-2">
      <h1 className="hero-title bg-gradient-to-r from-[#ffeaa7] via-[#fdcb6e] to-[#ffe0b2] bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl lg:text-7xl">
        Sandeep Kumar
      </h1>

      <svg
        className="pointer-events-none absolute left-0 mt-1 w-full overflow-visible"
        height="36"
        viewBox="0 0 400 36"
        preserveAspectRatio="none"
        style={{ top: "100%", transform: "translateY(-24px)" }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="hero-title-wave" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffeaa7" />
            <stop offset="50%" stopColor="#fdcb6e" />
            <stop offset="100%" stopColor="#ffe0b2" />
          </linearGradient>
        </defs>
        <path
          d="M 0 8 C 80 8 130 8 160 18 C 175 23 185 28 200 28 C 215 28 225 23 240 18 C 270 8 320 8 400 8"
          stroke="url(#hero-title-wave)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <g fill="url(#hero-title-wave)">
          <path d="M 200 4 C 196 14 196 22 200 34 C 204 22 204 14 200 4 Z" />
          <path d="M 200 26 C 185 26 176 16 178 8 C 184 16 192 22 200 26 Z" />
          <path d="M 200 26 C 215 26 224 16 222 8 C 216 16 208 22 200 26 Z" />
          <path d="M 165 15.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
          <path d="M 235 15.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z" />
        </g>
      </svg>
    </div>
  );
};
