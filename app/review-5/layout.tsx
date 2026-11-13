import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Mono, Unbounded } from "next/font/google";
import "./mixer.css";

// Review 5 · Mixer. The portfolio as a mixing desk: each skill set is a channel fader, and the
// projects re-rank as you mix. Like the other review builds it is not indexed.
const display = Unbounded({ subsets: ["latin"], variable: "--mx-display", display: "swap" });
const sans = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["wdth", "opsz"],
  variable: "--mx-sans",
  display: "swap",
});
const mono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--mx-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Sandeep Kumar · Mixer review", template: "%s · Mixer review" },
  description:
    "Sandeep Kumar's portfolio as a mixing desk: set the faders and the work re-ranks. A design under review.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#E3E0D8" };

export default function MixerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`mx ${display.variable} ${sans.variable} ${mono.variable}`}>{children}</div>
  );
}
