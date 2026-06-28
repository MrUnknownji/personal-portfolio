export default function InitialLoader() {
  const petals = Array.from({ length: 7 });

  return (
    <div
      id="page-transition-overlay"
      role="status"
      aria-label="Loading portfolio"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        zIndex: 9999,
        pointerEvents: "none",
        opacity: 1,
        backgroundColor: "hsl(25 11% 6%)",
      }}
    >
      <div
        className="bloom-flower"
        style={{
          position: "relative",
          width: "7rem",
          height: "7rem",
          marginBottom: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <svg
          viewBox="-10 0 120 100"
          aria-hidden="true"
          style={{ width: "100%", height: "100%", overflow: "visible" }}
        >
          <defs>
            <linearGradient
              id="lotusGrad"
              x1="0%"
              y1="100%"
              x2="0%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#ff5500" />
              <stop offset="50%" stopColor="#ff8c00" />
              <stop offset="100%" stopColor="#ffcc00" />
            </linearGradient>
          </defs>
          <g transform="translate(50, 70)">
            <circle cx="0" cy="-10" r="4" fill="#ff8c00" opacity="0.8" />
            <circle
              className="center-glow"
              cx="0"
              cy="-10"
              r="15"
              fill="#ff8c00"
              transform="translate(0,-10) scale(0)"
              opacity="0"
            />
            {petals.map((_, index) => (
              <path
                key={index}
                className="petal"
                d="M0,0 C15,-15 20,-40 0,-60 C-20,-40 -15,-15 0,0 Z"
                fill="url(#lotusGrad)"
                opacity="0.85"
                transform="scale(0)"
              />
            ))}
          </g>
        </svg>
      </div>
      <span
        className="counter-text"
        style={{
          fontFamily: "var(--font-outfit), sans-serif",
          fontWeight: 300,
          fontSize: "3.5rem",
          background:
            "linear-gradient(to right,hsl(28 100% 60%),hsl(2 50% 51%),hsl(28 100% 60%))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          opacity: 0.35,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        0%
      </span>
    </div>
  );
}
