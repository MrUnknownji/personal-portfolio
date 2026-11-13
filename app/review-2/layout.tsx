import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./atlas.css";

// Review 2 · Atlas. Like /review, it sits outside the live site's shell and is not indexed.
const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--atlas-serif",
  display: "swap",
});
const sans = Inter_Tight({ subsets: ["latin"], variable: "--atlas-sans", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--atlas-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Sandeep Kumar · Atlas review", template: "%s · Atlas review" },
  description: "Sandeep Kumar's portfolio drawn as a map you explore. A design under review.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F4F2EC" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0F24" },
  ],
};

const themeScript = `try{var t=localStorage.getItem("atlas-theme");if(t==="dark"||t==="light")document.documentElement.dataset.atlasTheme=t}catch(e){}`;

export default function AtlasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`atlas ${serif.variable} ${sans.variable} ${mono.variable}`}>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      {children}
    </div>
  );
}
