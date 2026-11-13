import type { Metadata, Viewport } from "next";
import { Archivo, Martian_Mono } from "next/font/google";
import "./ticker.css";

// Review 3 · Ticker. The portfolio set as a market terminal: every number on it is counted from a
// repository. Like the other review builds it sits outside the live site's shell and is not indexed.
const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--tk-display",
  display: "swap",
});
const mono = Martian_Mono({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--tk-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Sandeep Kumar · Ticker review", template: "%s · Ticker review" },
  description: "Sandeep Kumar's portfolio as a market terminal. A design under review.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#0A0B09" };

export default function TickerLayout({ children }: { children: React.ReactNode }) {
  return <div className={`tk ${display.variable} ${mono.variable}`}>{children}</div>;
}
