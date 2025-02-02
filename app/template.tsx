"use client";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import PageLoader from "@/components/PageLoader";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Template({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsTransitioning(true);

      const tl = gsap.timeline({
        onComplete: () => {
          setIsTransitioning(false);
          ScrollTrigger.refresh();
        }
      });

      tl.fromTo(
        ".transition-overlay",
        { yPercent: 100 },
        { yPercent: 0, duration: 0.5, ease: "power4.inOut" }
      )
        .fromTo(
          ".page-content",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5 },
          ">-0.1"
        );
    }, 2000); // simulate a loading delay

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const handleRouteChange = () => {
        setIsTransitioning(true);
        const tl = gsap.timeline({
          onComplete: () => {
            setIsTransitioning(false);
            ScrollTrigger.refresh();
          }
        });
        tl.fromTo(
          ".transition-overlay",
          { yPercent: 100 },
          { yPercent: 0, duration: 0.5, ease: "power4.inOut" }
        )
          .fromTo(
            ".page-content",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5 },
            ">-0.1"
          );
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
