import type { Metadata, Viewport } from "next";
import { SITE_CONFIG } from "@/data/site";
import { PROFILE } from "@/data/profile";
import { SOCIAL_PROFILES } from "@/data/social";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3f0eb",
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
  description: `Portfolio of ${SITE_CONFIG.name}, a ${SITE_CONFIG.role.toLowerCase()} building considered web and mobile products.`,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Sandeep Kumar | Full Stack Developer",
    description: "Explore Sandeep Kumar's selected projects, approach, and contact information.",
    url: "/",
    siteName: "Sandeep Kumar Portfolio",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sandeep Kumar | Full Stack Developer",
    description: "Full stack developer portfolio featuring considered web and mobile products.",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-icon",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const personStructuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE_CONFIG.name,
    jobTitle: SITE_CONFIG.role,
    email: `mailto:${SITE_CONFIG.email}`,
    url: "/",
    worksFor: [
      { "@type": "Organization", name: "Tata Consultancy Services" },
      { "@type": "Organization", name: "FrameRelay Studio", url: "https://framerelaystudio.com/" },
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
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body id="top">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personStructuredData) }}
        />
        {children}
      </body>
    </html>
  );
}
