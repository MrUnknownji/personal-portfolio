import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  DM_Sans,
  Figtree,
  Fraunces,
  IBM_Plex_Sans,
  JetBrains_Mono,
  Space_Grotesk,
  Unbounded,
} from "next/font/google";
import localFont from "next/font/local";
import SiteFooter from "@/components/lumen/SiteFooter";
import SiteHeader from "@/components/lumen/SiteHeader";
import TweakLauncher from "@/components/lumen/TweakLauncher";
import { DEFAULTS, EARLY_SCRIPT, compile } from "@/components/lumen/tweaks";
import { PROFILE } from "@/data/profile";
import { SITE_CONFIG } from "@/data/site";
import { SOCIAL_PROFILES } from "@/data/social";
import { springCssVariables } from "@/lib/lumen/springs";
import { SITE_URL, absolute } from "@/lib/siteUrl";
import "./lumen.css";

// The two faces every page uses, self-hosted and cut to the characters the site renders (see
// app/fonts/README.md). Both keep their weight and width axes.
const display = localFont({
  src: "./fonts/fredoka-site.woff2",
  weight: "300 700",
  declarations: [{ prop: "font-stretch", value: "75% 125%" }],
  variable: "--ld-font-display",
  display: "swap",
});
const text = localFont({
  src: "./fonts/instrument-sans-site.woff2",
  weight: "400 700",
  declarations: [{ prop: "font-stretch", value: "75% 100%" }],
  variable: "--ld-font-text",
  display: "swap",
});

// Alternates for the tweak panel. Not preloaded: a browser fetches a face only once a tweak uses it.
// (Font loaders must each be assigned to a module-level const, with literal options.)
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--ldf-bricolage",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  preload: false,
  display: "swap",
  variable: "--ldf-fraunces",
});
const space = Space_Grotesk({
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--ldf-space",
});
const unbounded = Unbounded({
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--ldf-unbounded",
});
const dm = DM_Sans({ subsets: ["latin"], preload: false, display: "swap", variable: "--ldf-dm" });
const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  axes: ["wdth"],
  preload: false,
  display: "swap",
  variable: "--ldf-plex",
});
const figtree = Figtree({
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--ldf-figtree",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  preload: false,
  display: "swap",
  variable: "--ldf-mono",
});
const alternates = [bricolage, fraunces, space, unbounded, dm, plex, figtree, mono]
  .map((font) => font.variable)
  .join(" ");

const title = `${SITE_CONFIG.name} · Full-stack developer`;
const description = `${SITE_CONFIG.name} is a full-stack developer in ${PROFILE.location} building web, mobile and real-time products with TypeScript, React, Next.js, React Native and Node.js.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s · ${SITE_CONFIG.name}` },
  description,
  applicationName: `${SITE_CONFIG.name} portfolio`,
  authors: [{ name: SITE_CONFIG.name, url: SITE_URL }],
  creator: SITE_CONFIG.name,
  keywords: [
    SITE_CONFIG.name,
    "full-stack developer",
    "frontend developer",
    "React",
    "Next.js",
    "TypeScript",
    "React Native",
    "Node.js",
    "portfolio",
    "India",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: `${SITE_CONFIG.name} portfolio`,
    locale: "en_IN",
    type: "profile",
    firstName: SITE_CONFIG.firstName,
    lastName: SITE_CONFIG.name.split(" ").slice(1).join(" "),
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: `@${SOCIAL_PROFILES.twitter.username}`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: { icon: "/favicon.svg", apple: "/apple-icon", shortcut: "/favicon.svg" },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ECEEE7" },
    { media: "(prefers-color-scheme: dark)", color: "#1D1F1B" },
  ],
};

const toCss = (variables: Record<string, string>) =>
  Object.entries(variables)
    .map(([key, value]) => `${key}:${value}`)
    .join(";");

// Springs become CSS easings once, on the server. Reduced motion gets critically damped ones.
const springStyles = `:root{${toCss(springCssVariables())}}@media (prefers-reduced-motion: reduce){:root{${toCss(springCssVariables(true))}}}`;
const themeScript = `try{var t=localStorage.getItem("ld-theme");if(t==="dark"||t==="light")document.documentElement.dataset.ldTheme=t}catch(e){}`;
// The site's chosen look, written on <html> by the server so it is there before the first paint.
const initial = compile(DEFAULTS);

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: `${SITE_CONFIG.name} portfolio`,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#person` },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: SITE_CONFIG.name,
      jobTitle: SITE_CONFIG.role,
      description: PROFILE.headline,
      url: SITE_URL,
      image: absolute("/images/sandeep-cutout-640.webp"),
      email: `mailto:${SITE_CONFIG.email}`,
      worksFor: [
        { "@type": "Organization", name: "Tata Consultancy Services" },
        {
          "@type": "Organization",
          name: "FrameRelay Studio",
          url: "https://framerelaystudio.com/",
        },
      ],
      alumniOf: PROFILE.education.map((entry) => ({
        "@type": "CollegeOrUniversity",
        name: entry.institution,
      })),
      address: { "@type": "PostalAddress", addressRegion: "Punjab", addressCountry: "IN" },
      knowsAbout: PROFILE.skills.flatMap((skill) => skill.items),
      sameAs: [
        SOCIAL_PROFILES.github.href,
        SOCIAL_PROFILES.linkedin.href,
        SOCIAL_PROFILES.twitter.href,
      ],
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning {...initial.a} style={initial.v}>
      <body id="top">
        <div className={`ld ${display.variable} ${text.variable} ${alternates}`}>
          <script dangerouslySetInnerHTML={{ __html: themeScript + EARLY_SCRIPT }} />
          <style dangerouslySetInnerHTML={{ __html: springStyles }} />
          <script
            type="application/ld+json"
            // "<" is escaped so no string in the data can close the script element.
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
            }}
          />
          <a className="ld-skip" href="#ld-main">
            Skip to content
          </a>
          <SiteHeader />
          <main id="ld-main" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
          <TweakLauncher />
        </div>
      </body>
    </html>
  );
}
