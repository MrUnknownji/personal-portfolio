"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
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
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.pageX, y: e.pageY };
      if (activeLink !== null && !rafIdRef.current) {
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
        const stats = await fetchSocialStats();
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
            icon: <FiTwitter className="w-5 h-5" />,
            label: "Twitter",
            href: "https://twitter.com/MrUnknownG786",
            bgColor: "rgba(29, 161, 242, 0)",
            hoverBgColor: "rgba(29, 161, 242, 0.1)",
            iconColor: "rgb(209, 213, 219)",
            hoverIconColor: "rgb(29, 161, 242)",
            color: "rgb(29, 161, 242)",
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
    setInfoBoxPosition(mousePositionRef.current);
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
      {isLoading ? (
        [1, 2, 3].map((_, i) => (
          <div key={i} className="w-10 h-10 rounded-full bg-white/5 animate-pulse" />
        ))
      ) : (
        socialLinks.map((link, index) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center w-10 h-10 rounded-full
                       bg-white/5 border border-white/10
                       transition-all duration-300 ease-out
                       hover:bg-white/10 hover:scale-110 hover:border-white/20"
            style={{
                boxShadow: activeLink === index ? `0 0 15px ${link.color}40` : 'none',
                borderColor: activeLink === index ? `${link.color}60` : ''
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="text-neutral-400 transition-colors duration-300 group-hover:text-white"
                 style={{ color: activeLink === index ? link.color : undefined }}>
              {link.icon}
            </div>
          </a>
        ))
      )}

      {activeLink !== null && socialLinks.length > 0 && (
        <SocialInfoBox
          socialLink={socialLinks[activeLink]}
          position={infoBoxPosition}
          opacity={infoBoxOpacity}
          onHeightChange={() => {}}
        />
      )}
    </div>
  );
};

export default SocialLinks;
