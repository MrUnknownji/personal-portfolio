import { useState, useEffect, useRef } from "react";
import SocialLinkButton from "./SocialLinkButton";
import SocialInfoBox from "./SocialInfoBox";
import { socialLinks } from "@/data/SocialLink";
import gsap from "gsap";

const SocialLinks = () => {
  const [activeLink, setActiveLink] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [initialY, setInitialY] = useState<number>(0);
  const infoBoxRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number,
  ) => {
    setInitialY(e.clientY);
    setActiveLink(index);

    // Animate info box in
    if (infoBoxRef.current) {
      gsap.fromTo(
        infoBoxRef.current,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        },
      );
    }
  };

  const handleMouseLeave = () => {
    // Animate info box out
    if (infoBoxRef.current) {
      gsap.to(infoBoxRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          setInitialY(0);
          setActiveLink(null);
        },
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (activeLink !== null) {
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [activeLink]);

  return (
    <div className="relative">
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
        {activeLink !== null && (
          <div ref={infoBoxRef} style={{ opacity: 0 }}>
            <SocialInfoBox
              socialLink={socialLinks[activeLink]}
              position={mousePosition}
              initialY={initialY}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SocialLinks;
