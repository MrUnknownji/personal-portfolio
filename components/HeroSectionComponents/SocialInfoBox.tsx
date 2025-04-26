import Image from "next/image";
import { SocialLink } from "../../types/social";
import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface SocialInfoBoxProps {
  socialLink: SocialLink;
  position: { x: number; y: number };
  opacity: number;
  onHeightChange: (height: number) => void;
}

const SocialInfoBox = ({
  socialLink,
  position,
  opacity,
  onHeightChange,
}: SocialInfoBoxProps) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);
    const initialScroll = window.scrollY;
    setScrollY(initialScroll);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (boxRef.current && opacity > 0.1) {
      const height = boxRef.current.offsetHeight;
      onHeightChange(height);
    }
  }, [opacity, onHeightChange, socialLink]);

  const offsetY = 25;
  const adjustedY = position.y - scrollY;

  const content = (
    <div
      ref={boxRef}
      className="fixed pointer-events-none z-[60] transform-gpu"
      style={{
        left: `${position.x}px`,
        top: `${adjustedY - offsetY}px`,
        opacity: opacity,
        transform: `translate(-50%, -100%) scale(${opacity * 0.1 + 0.9})`,
        transition: "opacity 0.15s ease-out, transform 0.15s ease-out",
        willChange: "opacity, transform",
      }}
    >
      <div
        className="relative w-72 p-4 rounded-xl shadow-xl
                   bg-gradient-to-br from-gray-800/95 via-secondary/90 to-gray-900/95
                   border border-neutral/30 ring-1 ring-inset ring-white/10"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            {socialLink.profileImage ? (
              <Image
                src={socialLink.profileImage}
                alt={socialLink.label}
                width={48}
                height={48}
                className="rounded-lg object-cover border border-neutral/20 shadow-sm"
              />
            ) : (
              <div
                className="p-2 rounded-lg bg-neutral/50 w-12 h-12 flex items-center justify-center
                           border border-neutral/30 shadow-inner shadow-black/20"
                style={{ color: socialLink.hoverIconColor }}
              >
                {socialLink.icon}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-light">
                {socialLink.username}
              </h3>
              <p className="text-sm text-muted">{socialLink.label}</p>
            </div>
          </div>

          <p
            className="text-sm text-light/90 border-l-2 pl-3 py-1"
            style={{
              borderColor: socialLink.color || socialLink.hoverIconColor,
            }}
          >
            {socialLink.description}
          </p>

          <div className="grid grid-cols-3 gap-2">
            {socialLink.stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-2 rounded-lg bg-neutral/30 border border-neutral/40 shadow-sm"
              >
                <div className="text-sm font-medium text-light">
                  {stat.value}
                </div>
                <div className="text-xs text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="absolute left-1/2 w-4 h-4 border-neutral/30
                     bg-gradient-to-br from-gray-800/95 via-secondary/90 to-gray-900/95"
          style={{
            bottom: "-8px",
            transform: "translateX(-50%) rotate(-45deg)",
            borderRightWidth: "1px",
            borderBottomWidth: "1px",
            clipPath: "polygon(0% 0%, 100% 100%, 0% 100%)",
          }}
        />
      </div>
    </div>
  );

  return mounted && typeof document !== "undefined"
    ? createPortal(content, document.body)
    : null;
};

export default SocialInfoBox;
