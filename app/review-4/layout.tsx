import type { Metadata, Viewport } from "next";
import { Courier_Prime, Gloock, Hanken_Grotesk } from "next/font/google";
import "./post.css";

// Review 4 · Post. The portfolio as a piece of direct mail: a letter, a deck of postcards, a parcel
// tracking sheet, a sheet of stamps, and a reply slip. Not indexed, outside the live site's shell.
const display = Gloock({
  weight: "400",
  subsets: ["latin"],
  variable: "--ps-display",
  display: "swap",
});
const sans = Hanken_Grotesk({ subsets: ["latin"], variable: "--ps-sans", display: "swap" });
const type = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--ps-type",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Sandeep Kumar · Post review", template: "%s · Post review" },
  description:
    "Sandeep Kumar's portfolio as a letter and a deck of postcards. A design under review.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#ECE4D3" };

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`ps ${display.variable} ${sans.variable} ${type.variable}`}>{children}</div>
  );
}
