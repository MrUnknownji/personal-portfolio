import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Sandeep's Portfolio",
  description: "How Bad Possibly It Could Be",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 overflow-x-hidden"
        suppressHydrationWarning
      >
        <Header />
        <div className="min-h-screen">
          {children}
        </div>
          <Footer />
      </body>
    </html>
  );
}
