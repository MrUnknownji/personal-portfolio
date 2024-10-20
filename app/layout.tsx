import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/Header";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "Sandeep's Portfolio",
  description: "How bad possibly it could be",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="bg-secondary"
        style={{ "--background": "#1A202C" } as React.CSSProperties}
      >
        <CustomCursor />
        <Header />
        <main className="bg-secondary min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
