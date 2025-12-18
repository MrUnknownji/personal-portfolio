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
        className="relative w-80 p-5 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]
                   bg-[#0a0a0a] border border-white/10 overflow-hidden group"
      >
        {/* Dynamic Gradient Glow */}
        <div
          className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl pointer-events-none transition-colors duration-300"
          style={{ background: socialLink.color }}
        />

        <div className="relative z-10 space-y-5">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-xl opacity-50 blur-sm" style={{ background: socialLink.color }}></div>
              <Image
                src={socialLink.profileImage || ""}
                alt={socialLink.label}
                width={52}
                height={52}
                className="relative rounded-xl object-cover border border-white/10 shadow-lg bg-neutral-900"
                onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/52x52/1a1a1a/f1f1f1?text=${socialLink.label.charAt(0)}`;
                }}
              />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg tracking-tight leading-tight">
                {socialLink.username}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: socialLink.color }} />
                <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">{socialLink.label}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="relative pl-3 py-1">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full opacity-50" style={{ background: socialLink.color }} />
            <p className="text-sm text-neutral-300 leading-relaxed italic">
              {socialLink.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            {socialLink.stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl 
                           bg-white/[0.03] border border-white/[0.05]
                           transition-colors duration-300 group-hover:bg-white/[0.05]"
              >
                <span className="text-base font-bold text-white tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[10px] text-neutral-500 font-semibold uppercase tracking-wider mt-0.5">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Arrow */}
        <div
          className="absolute left-1/2 w-4 h-4 border-white/10
                     bg-[#0a0a0a]"
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
