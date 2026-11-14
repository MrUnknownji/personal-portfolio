import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { PROFILE } from "@/data/profile";
import { SITE_CONFIG } from "@/data/site";

export const alt = `${SITE_CONFIG.name}, full-stack developer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#1d1f1b";
const PAPER = "#eceee7";
const ACCENT = "#7fe3b4";

export default async function OpenGraphImage() {
  const portrait = await readFile(
    join(process.cwd(), "public/images/sandeep-cutout-gray.png"),
    "base64",
  );
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: 56,
          background: PAPER,
          color: INK,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 48 }}>
          <div
            style={{
              display: "flex",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#5d6157",
            }}
          >
            Portfolio · {PROFILE.location}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 54,
              fontSize: 112,
              fontWeight: 700,
              lineHeight: 0.92,
              letterSpacing: -4,
            }}
          >
            <span>Sandeep</span>
            <span>Kumar</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 34,
              fontSize: 30,
              lineHeight: 1.3,
              color: "#3d4139",
            }}
          >
            Full-stack developer building web, mobile and real-time products.
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
            {["TypeScript", "React", "Next.js", "React Native", "Node.js"].map((tool) => (
              <span
                key={tool}
                style={{
                  display: "flex",
                  padding: "8px 16px",
                  border: `2px solid ${INK}`,
                  borderRadius: 999,
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            width: 420,
            height: "100%",
            borderRadius: 32,
            background: ACCENT,
            overflow: "hidden",
          }}
        >
          <img
            src={`data:image/png;base64,${portrait}`}
            width={400}
            height={497}
            alt=""
            style={{ width: 400, height: 497 }}
          />
        </div>
      </div>
    ),
    size,
  );
}
