import { ImageResponse } from "next/og";

export const alt = "Sandeep Kumar — Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, color: "#f7f2ed", background: "#0b0908", fontFamily: "sans-serif" }}>
      <div style={{ color: "#ff9233", fontSize: 28, letterSpacing: 8, textTransform: "uppercase" }}>Full Stack Developer</div>
      <div style={{ marginTop: 30, fontSize: 86, fontWeight: 700 }}>Sandeep Kumar</div>
      <div style={{ marginTop: 28, maxWidth: 900, color: "#c9c0b8", fontSize: 34, lineHeight: 1.35 }}>Performant web, mobile, and AI-powered product experiences.</div>
      <div style={{ marginTop: 50, width: 240, height: 6, background: "#ff9233" }} />
    </div>,
    size,
  );
}
