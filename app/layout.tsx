import type { Metadata, Viewport } from "next";
import { Outfit, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import SmoothScrollLenisGSAP from "@/components/SmoothScrollLenisGSAP";
import { LenisOptions } from "lenis";

gsap.registerPlugin(ScrollTrigger);

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sandeep's Portfolio",
  description: "How Bad Possibly It Could Be",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

const lenisOptions: LenisOptions = {
  lerp: 0.1,
  smoothWheel: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${outfit.variable} ${poppins.variable}`} lang="en">
      <body className="bg-secondary text-light" suppressHydrationWarning>
        <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-dark via-secondary to-dark"></div>
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: `
                radial-gradient(at 20% 30%, hsla(160, 80%, 40%, 0.3) 0px, transparent 50%),
                radial-gradient(at 80% 10%, hsla(197, 70%, 50%, 0.25) 0px, transparent 50%),
                radial-gradient(at 70% 80%, hsla(210, 60%, 35%, 0.2) 0px, transparent 50%),
                radial-gradient(at 30% 90%, hsla(160, 50%, 25%, 0.15) 0px, transparent 60%),
                radial-gradient(at 90% 60%, hsla(197, 40%, 30%, 0.2) 0px, transparent 50%)
              `,
            }}
          />
          <div
            className="absolute inset-0 opacity-15 mix-blend-soft-light"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <SmoothScrollLenisGSAP lenisOptions={lenisOptions}>
          <div className="relative z-10">
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </div>
        </SmoothScrollLenisGSAP>
      </body>
    </html>
  );
}
