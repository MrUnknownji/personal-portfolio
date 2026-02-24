"use client";

import React, { useState, useRef, useCallback, useEffect, memo } from "react";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import gsap from "gsap";
import { SocialLink } from "../../types/social";
import { fetchSocialStats } from "../../utils/social";
import SocialInfoBox from "./SocialInfoBox";

let cachedStats: Awaited<ReturnType<typeof fetchSocialStats>> | null = null;

const ANIMATION_CONFIG = {
  INFO_BOX: {
    SHOW: { DURATION: 0.2, EASE: "back.out(1.7)" },
    HIDE: { DURATION: 0.15, EASE: "power2.in" },
  },
} as const;

const SocialLinkItem = memo(
  ({
    link,
    index,
    isActive,
    onMouseEnter,
    onMouseLeave,
  }: {
    link: SocialLink;
    index: number;
    isActive: boolean;
    onMouseEnter: (index: number) => void;
    onMouseLeave: () => void;
  }) => {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-12 h-12 rounded-xl
                 bg-[#111] border border-white/10 shadow-md
                 transition-all duration-300 ease-out z-10"
        style={{
          boxShadow: isActive ? `0 10px 30px -10px ${link.color}90` : "none",
          borderColor: isActive ? link.color : "",
          backgroundColor: isActive ? `${link.color}15` : "",
        }}
        onMouseEnter={() => onMouseEnter(index)}
        onMouseLeave={onMouseLeave}
      >
        {/* Inner abstract glow element */}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md pointer-events-none"
          style={{ background: link.color, opacity: isActive ? 0.2 : 0 }}
        />

        <div
          className="text-muted-foreground transition-transform duration-300 group-hover:scale-110 relative z-10"
          style={{ color: isActive ? link.color : undefined }}
        >
          {React.cloneElement(
            link.icon as React.ReactElement<{ className?: string }>,
            { className: "w-5 h-5" },
          )}
        </div>
      </a>
    );
  },
);

SocialLinkItem.displayName = "SocialLinkItem";

const SocialLinks = () => {
  const [activeLink, setActiveLink] = useState<number | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [infoBoxPosition, setInfoBoxPosition] = useState({ x: 0, y: 0 });
  const [infoBoxOpacity, setInfoBoxOpacity] = useState(0);

  const animationRef = useRef<gsap.core.Tween | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 });
  const rafIdRef = useRef<number | null>(null);

  const updateInfoBoxPosition = useCallback(() => {
    setInfoBoxPosition(mousePositionRef.current);
    rafIdRef.current = null;
  }, []);

  useEffect(() => {
    if (activeLink === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.pageX, y: e.pageY };
      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(updateInfoBoxPosition);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [activeLink, updateInfoBoxPosition]);

  useEffect(() => {
    const initializeSocialLinks = async () => {
      setIsLoading(true);
      try {
        const stats = cachedStats ?? (await fetchSocialStats());
        cachedStats = stats;
        const links: SocialLink[] = [
          {
            icon: <FiGithub className="w-5 h-5" />,
            label: "GitHub",
            href: "https://github.com/MrUnknownji",
            bgColor: "rgba(255, 146, 51, 0)",
            hoverBgColor: "rgba(255, 146, 51, 0.1)",
            iconColor: "rgb(209, 213, 219)",
            hoverIconColor: "#ff9233",
            color: "#ff9233",
            description: "Check out my open source projects",
            stats: [
              {
                label: "Repos",
                value: stats.github?.public_repos?.toString() || "20+",
              },
              {
                label: "Followers",
                value: stats.github?.followers?.toString() || "100+",
              },
              { label: "Stars", value: "50+" },
            ],
            profileImage: stats.github?.profileImage || "",
            username: stats.github?.username || "MrUnknownji",
          },
          {
            icon: <FiLinkedin className="w-5 h-5" />,
            label: "LinkedIn",
            href: "https://linkedin.com/in/sandeep-kumar-sk1707",
            bgColor: "rgba(255, 146, 51, 0)",
            hoverBgColor: "rgba(255, 146, 51, 0.1)",
            iconColor: "rgb(209, 213, 219)",
            hoverIconColor: "#ff9233",
            color: "#ff9233",
            description: "Connect with me professionally",
            stats: [
              {
                label: "Connections",
                value: stats.linkedin?.connections || "500+",
              },
              {
                label: "Posts",
                value: stats.linkedin?.posts?.toString() || "25+",
              },
              { label: "Views", value: "1k+" },
            ],
            profileImage: stats.linkedin?.profileImage || "",
            username: stats.linkedin?.name || "sandeep-kumar-sk1707",
          },
          {
            icon: <FaXTwitter className="w-5 h-5" />,
            label: "X",
            href: "https://twitter.com/MrUnknownG786",
            bgColor: "rgba(255, 146, 51, 0)",
            hoverBgColor: "rgba(255, 146, 51, 0.1)",
            iconColor: "rgb(209, 213, 219)",
            hoverIconColor: "#ff9233",
            color: "#ff9233",
            description: "Tech insights and updates",
            stats: [
              {
                label: "Followers",
                value: stats.twitter?.followers?.toString() || "250+",
              },
              {
                label: "Tweets",
                value: stats.twitter?.tweets?.toString() || "500+",
              },
              { label: "Likes", value: "1k+" },
            ],
            profileImage: stats.twitter?.profileImage || "",
            username: stats.twitter?.name || "MrUnknownG786",
          },
        ];
        setSocialLinks(links);
      } catch (error) {
        console.error("Error loading social links:", error);
      } finally {
        setIsLoading(false);
      }
    };
    initializeSocialLinks();
  }, []);

  const handleMouseEnter = useCallback((index: number) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setActiveLink(index);
    if (animationRef.current) animationRef.current.kill();
    if (mousePositionRef.current.x === 0 && mousePositionRef.current.y === 0) {
    } else {
      setInfoBoxPosition(mousePositionRef.current);
    }
    setInfoBoxOpacity(1);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (animationRef.current) animationRef.current.kill();
    setInfoBoxOpacity(0);
    hideTimeoutRef.current = setTimeout(() => {
      setActiveLink(null);
      hideTimeoutRef.current = null;
    }, ANIMATION_CONFIG.INFO_BOX.HIDE.DURATION * 1000);
  }, []);

  return (
    <div className="relative flex items-center gap-3">
      {isLoading
        ? [1, 2, 3].map((_, i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-full bg-white/5 animate-pulse"
            />
          ))
        : socialLinks.map((link, index) => (
            <SocialLinkItem
              key={link.label}
              link={link}
              index={index}
              isActive={activeLink === index}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          ))}

      {activeLink !== null &&
        socialLinks.length > 0 &&
        socialLinks[activeLink] && (
          <div className="pointer-events-none absolute left-0 top-full mt-4 z-50">
            <SocialInfoBox
              socialLink={socialLinks[activeLink]}
              position={infoBoxPosition}
              opacity={infoBoxOpacity}
              onHeightChange={() => {}}
            />
          </div>
        )}
    </div>
  );
};

export default SocialLinks;
