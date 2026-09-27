import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./offset.css";
import "./build-file.css";
import "./award-upgrade.css";
import { Barlow_Condensed, DM_Sans, IBM_Plex_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LazyBot from "@/components/LazyBot";
import PortfolioPreferences from "@/components/PortfolioPreferences";
import { SITE_CONFIG } from "@/data/site";
import { SOCIAL_PROFILES } from "@/data/social";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3f0eb",
};

const displayFont = Barlow_Condensed({ subsets: ["latin"], weight: "800", variable: "--font-display", display: "swap" });
const bodyFont = DM_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const labelFont = IBM_Plex_Mono({ subsets: ["latin"], weight: "500", variable: "--font-label", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
  title: {
    default: "Sandeep Kumar | Full Stack Developer",
    template: "%s | Sandeep Kumar",
  },
  description:
    `Portfolio of ${SITE_CONFIG.name}, a ${SITE_CONFIG.role.toLowerCase()} building considered web and mobile products.`,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Sandeep Kumar | Full Stack Developer",
    description:
      "Explore Sandeep Kumar's selected projects, approach, and contact information.",
    url: "/",
    siteName: "Sandeep Kumar Portfolio",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sandeep Kumar | Full Stack Developer",
    description:
      "Full stack developer portfolio featuring considered web and mobile products.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-icon",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const personStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_CONFIG.name,
    jobTitle: SITE_CONFIG.role,
    email: `mailto:${SITE_CONFIG.email}`,
    url: "/",
    sameAs: [
      SOCIAL_PROFILES.github.href,
      SOCIAL_PROFILES.linkedin.href,
      SOCIAL_PROFILES.twitter.href,
    ],
  };

  return (
    <html lang="en">
      <body id="top" className={`${displayFont.variable} ${bodyFont.variable} ${labelFont.variable}`}>
        <PortfolioPreferences />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personStructuredData) }}
        />
        <Header />
        <main className="relative min-h-screen">{children}</main>
        <Footer />
        <LazyBot />
      </body>
    </html>
  );
}
