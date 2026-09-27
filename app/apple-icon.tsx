import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#19191a",
          color: "#f3f0eb",
          display: "flex",
          fontSize: 96,
          fontFamily: "Arial, sans-serif",
          fontWeight: 900,
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <span style={{ borderLeft: "14px solid #e9702c", paddingLeft: 12 }}>SK</span>
      </div>
    ),
    size,
  );
}
