import { useState, useEffect, useRef } from "react";
import SocialLinkButton from "./SocialLinkButton";
import SocialInfoBox from "./SocialInfoBox";
import { socialLinks } from "@/data/SocialLink";
import gsap from "gsap";

const SocialLinks = () => {
  const [activeLink, setActiveLink] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const infoBoxRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [infoBoxHeight, setInfoBoxHeight] = useState(0);
  const [infoBoxDimensions, setInfoBoxDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [infoBoxOpacity, setInfoBoxOpacity] = useState(0);

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number,
  ) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      setMousePosition({ x: e.clientX, y: e.clientY - containerRect.top });
    }
    if (infoBoxRef.current) {
      const rect = infoBoxRef.current.getBoundingClientRect();
      setInfoBoxDimensions({ width: rect.width, height: rect.height });
    }
    setActiveLink(index);
    setInfoBoxOpacity(1);
    animationRef.current?.kill();
    animationRef.current = gsap.fromTo(
      infoBoxRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
    );
  };

  const handleMouseLeave = () => {
    if (infoBoxRef.current) {
      animationRef.current?.kill();
      animationRef.current = gsap.to(infoBoxRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setInfoBoxOpacity(0);
          setActiveLink(null);
        },
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (activeLink !== null && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        setMousePosition({ x: e.clientX, y: e.clientY - containerRect.top });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [activeLink]);

  const calculatedPosition = {
    x: mousePosition.x - infoBoxDimensions.width / 4,
    y: mousePosition.y + 20 + infoBoxHeight,
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex gap-6">
        {socialLinks.map((link, index) => (
          <div
            key={index}
            onMouseEnter={(e) => handleMouseEnter(e, index)}
            onMouseLeave={handleMouseLeave}
          >
            <SocialLinkButton {...link} />
          </div>
        ))}
      </div>
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 9999 }}
      >
        <div ref={infoBoxRef} style={{ opacity: 0 }}>
          {activeLink !== null && (
            <SocialInfoBox
              socialLink={socialLinks[activeLink]}
              position={{
                x: calculatedPosition.x,
                y: calculatedPosition.y - infoBoxHeight * 2 - 40,
              }}
              opacity={infoBoxOpacity}
              onHeightChange={setInfoBoxHeight}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;
