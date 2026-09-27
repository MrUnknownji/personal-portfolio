import { ImageResponse } from "next/og";

export const alt = "Sandeep Kumar — Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 72, color: "#19191a", background: "#f3f0eb", fontFamily: "Arial, sans-serif", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 690, width: 220, background: "#e9702c" }} />
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", width: "100%", fontSize: 17, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" }}><span>Sandeep Kumar</span><span>Full-stack developer</span></div>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", marginTop: 86, fontSize: 130, fontWeight: 900, letterSpacing: -9, lineHeight: .83, textTransform: "uppercase" }}><span>Building</span><span>Beyond</span><span>The brief.</span></div>
      <div style={{ position: "relative", marginTop: 58, fontSize: 25, fontWeight: 600 }}>Web and mobile products, from idea to launch.</div>
    </div>,
    size,
  );
}
