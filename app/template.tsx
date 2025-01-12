"use client";
import { useEffect, useState } from "react";
import gsap from "gsap";
import PageLoader from "@/components/PageLoader";

export default function Template({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsTransitioning(true);

      const tl = gsap.timeline();
      tl.fromTo(
        ".transition-overlay",
        { yPercent: 100 },
        { yPercent: 0, duration: 0.5, ease: "power4.inOut" },
      )
        .fromTo(
          ".page-content",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          ">-0.1",
        )
        .then(() => setIsTransitioning(false));
    }, 2000); // Initial loading time

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const handleRouteChange = () => {
        setIsTransitioning(true);
        const tl = gsap.timeline();
        tl.fromTo(
          ".transition-overlay",
          { yPercent: 100 },
          { yPercent: 0, duration: 0.5, ease: "power4.inOut" },
        )
          .fromTo(
            ".page-content",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5 },
            ">-0.1",
          )
          .then(() => setIsTransitioning(false));
      };

      window.addEventListener("popstate", handleRouteChange);
      return () => window.removeEventListener("popstate", handleRouteChange);
    }
  }, [isLoading]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <>
      <div className="page-content">{children}</div>
      {isTransitioning && (
        <div className="transition-overlay fixed inset-0 bg-gray-950 z-50 transform translate-y-full pointer-events-none" />
      )}
    </>
  );
}
