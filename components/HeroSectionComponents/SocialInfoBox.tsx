import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import { SocialLink } from "../../types/social";
import { useEffect, useRef } from "react";
import gsap from "gsap";

interface SocialInfoBoxProps {
  socialLink: SocialLink;
  position: { x: number; y: number };
  initialY: number;
}

const SocialInfoBox = ({
  socialLink,
  position,
  initialY,
}: SocialInfoBoxProps) => {
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boxRef.current) {
      gsap.fromTo(
        boxRef.current,
        {
          opacity: 0,
          scale: 0.95,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        },
      );
    }

    return () => {
      if (boxRef.current) {
        gsap.to(boxRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 0.2,
          ease: "power2.in",
        });
      }
    };
  }, []);

  return (
    <div
      ref={boxRef}
      className="fixed pointer-events-none transform"
      style={{
        left: `${position.x - 80}px`,
        bottom: `${initialY - position.y}px`,
        opacity: 0,
      }}
    >
      <div
        className="w-72 bg-gray-900/95 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl"
        style={{
          border: `1px solid ${socialLink.color}40`,
          boxShadow: `0 4px 20px rgba(0, 0, 0, 0.3), 0 0 20px ${socialLink.color}20`,
        }}
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-4">
            <div
              className="relative w-14 h-14 rounded-full overflow-hidden border-2"
              style={{ borderColor: `${socialLink.color}40` }}
            >
              <Image
                src={socialLink.profileImage}
                alt={`${socialLink.label} Profile`}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h3 className="text-white font-medium text-lg">
                {socialLink.label}
              </h3>
              <p className="text-gray-400 text-sm">{socialLink.username}</p>
            </div>
          </div>

          <a
            href={socialLink.href}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto block"
          >
            <div
              className="flex items-center justify-between p-3 rounded-lg transition-all duration-300 hover:opacity-90"
              style={{
                backgroundColor: `${socialLink.color}20`,
                borderLeft: `3px solid ${socialLink.color}`,
              }}
            >
              <span className="text-sm text-white font-medium">
                View Profile
              </span>
              <FiArrowUpRight size={20} style={{ color: socialLink.color }} />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SocialInfoBox;
