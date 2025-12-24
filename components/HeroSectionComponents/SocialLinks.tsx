"use client";

import React, { useState, useRef, useCallback, useEffect, memo } from "react";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import gsap from "gsap";
import { SocialLink } from "../../types/social";
import { fetchSocialStats } from "../../utils/social";
import SocialInfoBox from "./SocialInfoBox";

const ANIMATION_CONFIG = {
  INFO_BOX: {
    SHOW: { DURATION: 0.2, EASE: "back.out(1.7)" },
    HIDE: { DURATION: 0.15, EASE: "power2.in" },
  },
} as const;

// Memoized individual link component to prevent re-renders on mouse move
const SocialLinkItem = memo(({
  link,
  index,
  isActive,
  onMouseEnter,
  onMouseLeave
}: {
  link: SocialLink,
  index: number,
  isActive: boolean,
  onMouseEnter: (index: number) => void,
  onMouseLeave: () => void
}) => {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex items-center justify-center w-12 h-12 rounded-full
                 bg-white/[0.05] border border-white/[0.08]
                 transition-all duration-300 ease-out
                 hover:scale-110 hover:bg-white/[0.1]"
      style={{
        boxShadow: isActive ? `0 0 20px ${link.color}30` : 'none',
        borderColor: isActive ? `${link.color}50` : ''
      }}
      onMouseEnter={() => onMouseEnter(index)}
      onMouseLeave={onMouseLeave}
    >
      <div className="text-neutral-400 transition-colors duration-300 group-hover:text-white relative z-10"
        style={{ color: isActive ? link.color : undefined }}>
        {React.cloneElement(link.icon as React.ReactElement<{ className?: string }>, { className: "w-5 h-5" })}
      </div>

      {/* Hover Gradient Background */}
      <div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at center, ${link.color}15, transparent 70%)` }}
      />
    </a>
  );
});

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
    // Only track mouse move if we have an active link to avoid unnecessary work
    if (activeLink === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.pageX, y: e.pageY };
      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(updateInfoBoxPosition);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Explicitly update once on mount/activeLink change to catch up
    // But since this effect depends on activeLink, it runs when it changes.
    // We assume the mouse is already there.

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [activeLink, updateInfoBoxPosition]);

  useEffect(() => {
    const initializeSocialLinks = async () => {
      setIsLoading(true);
      try {
        const stats = await fetchSocialStats();
        // ... (Using same links structure as before, just abbreviated for logic clarity)
        const links: SocialLink[] = [
          {
            icon: <FiGithub className="w-5 h-5" />,
            label: "GitHub",
            href: "https://github.com/MrUnknownji",
            bgColor: "rgba(45, 186, 78, 0)",
            hoverBgColor: "rgba(45, 186, 78, 0.1)",
            iconColor: "rgb(209, 213, 219)",
            hoverIconColor: "rgb(45, 186, 78)",
            color: "rgb(45, 186, 78)",
            description: "Check out my open source projects",
            stats: [
              { label: "Repos", value: stats.github?.public_repos?.toString() || "20+" },
              { label: "Followers", value: stats.github?.followers?.toString() || "100+" },
              { label: "Stars", value: "50+" },
            ],
            profileImage: stats.github?.profileImage || "",
            username: stats.github?.username || "MrUnknownji",
          },
          {
            icon: <FiLinkedin className="w-5 h-5" />,
            label: "LinkedIn",
            href: "https://linkedin.com/in/sandeep-kumar-sk1707",
            bgColor: "rgba(0, 119, 181, 0)",
            hoverBgColor: "rgba(0, 119, 181, 0.1)",
            iconColor: "rgb(209, 213, 219)",
            hoverIconColor: "rgb(0, 119, 181)",
            color: "rgb(0, 119, 181)",
            description: "Connect with me professionally",
            stats: [
              { label: "Connections", value: stats.linkedin?.connections || "500+" },
              { label: "Posts", value: stats.linkedin?.posts?.toString() || "25+" },
              { label: "Views", value: "1k+" },
            ],
            profileImage: stats.linkedin?.profileImage || "",
            username: stats.linkedin?.name || "sandeep-kumar-sk1707",
          },
          {
            icon: <FaXTwitter className="w-5 h-5" />,
            label: "X",
            href: "https://twitter.com/MrUnknownG786",
            bgColor: "rgba(0, 0, 0, 0)",
            hoverBgColor: "rgba(0, 0, 0, 0.1)",
            iconColor: "rgb(209, 213, 219)",
            hoverIconColor: "rgb(0, 0, 0)",
            color: "rgb(0, 0, 0)",
            description: "Tech insights and updates",
            stats: [
              { label: "Followers", value: stats.twitter?.followers?.toString() || "250+" },
              { label: "Tweets", value: stats.twitter?.tweets?.toString() || "500+" },
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
    // Immediate position update on enter
    if (mousePositionRef.current.x === 0 && mousePositionRef.current.y === 0) {
      // Fallback or wait for first move
    } else {
      setInfoBoxPosition(mousePositionRef.current);
    }
    setInfoBoxOpacity(1);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (animationRef.current) animationRef.current.kill();
    setInfoBoxOpacity(0);
    // Delay setting activeLink to null to allow animation out? 
    // Actually, simple timeout is fine.
    hideTimeoutRef.current = setTimeout(() => {
      setActiveLink(null);
      hideTimeoutRef.current = null;
    }, ANIMATION_CONFIG.INFO_BOX.HIDE.DURATION * 1000);
  }, []);

  return (
    <div className="relative flex items-center gap-3">
      {isLoading ? (
        [1, 2, 3].map((_, i) => (
          <div key={i} className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
        ))
      ) : (
        socialLinks.map((link, index) => (
          <SocialLinkItem
            key={link.label}
            link={link}
            index={index}
            isActive={activeLink === index}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        ))
      )}

      {activeLink !== null && socialLinks.length > 0 && socialLinks[activeLink] && (
        <div className="pointer-events-none absolute left-0 top-full mt-4 z-50">
          <SocialInfoBox
            socialLink={socialLinks[activeLink]}
            position={infoBoxPosition}
            opacity={infoBoxOpacity}
            onHeightChange={() => { }}
          />
        </div>
      )}
    </div>
  );
};

export default SocialLinks;
