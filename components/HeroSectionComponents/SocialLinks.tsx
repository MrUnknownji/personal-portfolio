import { useState, useEffect } from "react";
import SocialLinkButton from "./SocialLinkButton";
import SocialInfoBox from "./SocialInfoBox";
import { socialLinks } from "@/data/SocialLink";
import { AnimatePresence } from "framer-motion";

const SocialLinks = () => {
  const [activeLink, setActiveLink] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [initialY, setInitialY] = useState<number>(0);

  const handleMouseEnter = (
    e: React.MouseEvent<HTMLDivElement>,
    index: number,
  ) => {
    setInitialY(e.clientY);
    setActiveLink(index);
  };

  const handleMouseLeave = () => {
    setInitialY(0);
    setActiveLink(null);
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
        <AnimatePresence>
          {activeLink !== null && (
            <SocialInfoBox
              socialLink={socialLinks[activeLink]}
              position={mousePosition}
              initialY={initialY}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SocialLinks;
