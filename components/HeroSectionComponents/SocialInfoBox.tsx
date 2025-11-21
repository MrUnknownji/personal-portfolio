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
    };
  }, []);

  useEffect(() => {
    if (boxRef.current && opacity > 0.1) {
      const height = boxRef.current.offsetHeight;
      onHeightChange(height);
    }
  }, [opacity, onHeightChange, socialLink]);

  const offsetY = 30;
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
        transition: "opacity 0.2s ease-out, transform 0.2s ease-out",
        willChange: "opacity, transform",
      }}
    >
      <div
        className="relative w-72 p-4 rounded-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)]
                   bg-[#18181b]/95 backdrop-blur-md
                   border border-white/10"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image
              src={socialLink.profileImage || ""}
              alt={socialLink.label}
              width={48}
              height={48}
              className="rounded-lg object-cover border border-white/10 shadow-sm"
              onError={(e) => {
                e.currentTarget.src = `https://placehold.co/48x48/27272a/f1f1f1?text=${socialLink.label.charAt(
                  0,
                )}`;
              }}
            />
            <div>
              <h3 className="font-semibold text-white tracking-wide">
                {socialLink.username}
              </h3>
              <p className="text-xs text-neutral-400 uppercase tracking-wider">{socialLink.label}</p>
            </div>
          </div>

          <p
            className="text-sm text-neutral-300 border-l-2 pl-3 py-1 italic"
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
                className="text-center p-2 rounded-lg bg-white/5 border border-white/5"
              >
                <div className="text-sm font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-[10px] text-neutral-500 uppercase tracking-wide truncate">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="absolute left-1/2 w-4 h-4 border-white/10
                     bg-[#18181b]/95 backdrop-blur-md"
          style={{
            bottom: "-8px",
            transform: "translateX(-50%) rotate(45deg)",
            borderRightWidth: "1px",
            borderBottomWidth: "1px",
            zIndex: -1,
          }}
        />
      </div>
    </div>
  );

  return mounted ? createPortal(content, document.body) : null;
};

export default SocialInfoBox;
