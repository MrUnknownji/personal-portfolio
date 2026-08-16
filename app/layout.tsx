import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LazyBot from "@/components/LazyBot";
import GlobalBackground from "@/components/GlobalBackground";
import ScrollRevealController from "@/components/ui/ScrollRevealController";
import ClickSpark from "@/components/ui/ClickSpark";
import { SITE_CONFIG } from "@/data/site";
import { SOCIAL_PROFILES } from "@/data/social";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0908",
};

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
    `Portfolio of ${SITE_CONFIG.name}, a ${SITE_CONFIG.role.toLowerCase()} building performant web, mobile, and AI-powered product experiences.`,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Sandeep Kumar | Full Stack Developer",
    description:
      "Explore Sandeep Kumar's full stack projects, technical skills, and contact information.",
    url: "/",
    siteName: "Sandeep Kumar Portfolio",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sandeep Kumar | Full Stack Developer",
    description:
      "Full stack developer portfolio featuring web, mobile, and AI-powered products.",
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
      <body className="bg-transparent text-foreground" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personStructuredData) }}
        />
        <GlobalBackground />
        <ScrollRevealController />
        <ClickSpark />
        <Header />
        <main className="relative min-h-screen">{children}</main>
        <Footer />
        <LazyBot />

      </body>
    </html>
  );
}
