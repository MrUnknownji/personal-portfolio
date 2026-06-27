"use client";

import React, { useState, useRef, useCallback, useEffect, memo } from "react";
import { FiGithub, FiLinkedin } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
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
    onMouseEnter: (
      event: React.MouseEvent<HTMLAnchorElement>,
      index: number,
    ) => void;
    onMouseLeave: () => void;
  }) => {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-12 h-12 rounded-xl
                 bg-[#111] border border-white/10
                 transition-[transform,border-color] duration-150 ease-out z-10
                 hover:-translate-y-0.5"
        style={{
          borderColor: isActive ? link.color : "",
        }}
        onMouseEnter={(event) => onMouseEnter(event, index)}
        onMouseLeave={onMouseLeave}
        aria-label={`Open ${link.label}`}
      >
        <div
          className="text-muted-foreground transition-transform duration-150 group-hover:scale-105 relative z-10"
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
  const [infoBoxPosition, setInfoBoxPosition] = useState({
    x: 0,
    top: 0,
    bottom: 0,
  });
  const [infoBoxOpacity, setInfoBoxOpacity] = useState(0);

  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      } catch {
        setSocialLinks([]);
      } finally {
        setIsLoading(false);
      }
    };
    initializeSocialLinks();
  }, []);

  const handleMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>, index: number) => {
      const rect = event.currentTarget.getBoundingClientRect();
      setInfoBoxPosition({
        x: rect.left + rect.width / 2,
        top: rect.top,
        bottom: rect.bottom,
      });

      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      setActiveLink(index);
      setInfoBoxOpacity(1);
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    setInfoBoxOpacity(0);
    hideTimeoutRef.current = setTimeout(() => {
      setActiveLink(null);
      hideTimeoutRef.current = null;
    }, ANIMATION_CONFIG.INFO_BOX.HIDE.DURATION * 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
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
            />
          </div>
        )}
    </div>
  );
};

export default SocialLinks;
