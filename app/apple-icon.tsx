import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          alignItems: "center",
          background: "#1d1f1b",
          color: "#eceee7",
          display: "flex",
          fontSize: 82,
          fontFamily: "Arial, sans-serif",
          fontWeight: 700,
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 28,
            right: 28,
            width: 34,
            height: 34,
            borderRadius: 17,
            background: "#7fe3b4",
          }}
        />
        <span style={{ marginRight: 12, marginTop: 14 }}>SK</span>
      </div>
    ),
    size,
  );
}
