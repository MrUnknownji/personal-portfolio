"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import gsap from "gsap";
import { SocialLink } from "../../types/social";
import { fetchSocialStats } from "../../utils/social";
import SocialInfoBox from "./SocialInfoBox";

const ANIMATION_CONFIG = {
  LINK_HOVER: {
    DURATION: 0.2,
    EASE: "power2.out",
  },
  INFO_BOX: {
    SHOW: {
      DURATION: 0.2,
      EASE: "back.out(1.7)",
    },
    HIDE: {
      DURATION: 0.15,
      EASE: "power2.in",
    },
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
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
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
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [activeLink, updateInfoBoxPosition]);

  useEffect(() => {
    const initializeSocialLinks = async () => {
      setIsLoading(true);
      try {
        const stats = await fetchSocialStats();

        const links: SocialLink[] = [
          {
            icon: <FiGithub className="w-6 h-6" />,
            label: "GitHub",
            href: "https://github.com/MrUnknownji",
            bgColor: "rgba(45, 186, 78, 0)",
            hoverBgColor: "rgba(45, 186, 78, 0.1)",
            iconColor: "rgb(209, 213, 219)",
            hoverIconColor: "rgb(45, 186, 78)",
            color: "rgb(45, 186, 78)",
            description: "Check out my open source projects and contributions",
            stats: [
              {
                label: "Repositories",
                value: stats.github?.public_repos?.toString() || "20+",
              },
              {
                label: "Followers",
                value: stats.github?.followers?.toString() || "100+",
              },
              {
                label: "Following",
                value: stats.github?.following?.toString() || "50+",
              },
            ],
            profileImage:
              stats.github?.profileImage ||
              "https://placehold.co/48x48/27272a/f1f1f1?text=GH",
            username: stats.github?.username || "MrUnknownji",
          },
          {
            icon: <FiLinkedin className="w-6 h-6" />,
            label: "LinkedIn",
            href: "https://linkedin.com/in/sandeep-kumar-sk1707",
            bgColor: "rgba(0, 119, 181, 0)",
            hoverBgColor: "rgba(0, 119, 181, 0.1)",
            iconColor: "rgb(209, 213, 219)",
            hoverIconColor: "rgb(0, 119, 181)",
            color: "rgb(0, 119, 181)",
            description:
              stats.linkedin?.headline || "Connect with me professionally",
            stats: [
              {
                label: "Connections",
                value: stats.linkedin?.connections || "500+",
              },
              {
                label: "Endorsements",
                value: stats.linkedin?.endorsements?.toString() || "50+",
              },
              {
                label: "Posts",
                value: stats.linkedin?.posts?.toString() || "25+",
              },
            ],
            profileImage:
              stats.linkedin?.profileImage ||
              "https://placehold.co/48x48/27272a/f1f1f1?text=LI",
            username: stats.linkedin?.name || "sandeep-kumar-sk1707",
          },
          {
            icon: <FiTwitter className="w-6 h-6" />,
            label: "Twitter",
            href: "https://twitter.com/MrUnknownG786",
            bgColor: "rgba(29, 161, 242, 0)",
            hoverBgColor: "rgba(29, 161, 242, 0.1)",
            iconColor: "rgb(209, 213, 219)",
            hoverIconColor: "rgb(29, 161, 242)",
            color: "rgb(29, 161, 242)",
            description:
              stats.twitter?.description ||
              "Follow me for tech insights and updates",
            stats: [
              {
                label: "Followers",
                value: stats.twitter?.followers?.toString() || "250+",
              },
              {
                label: "Following",
                value: stats.twitter?.following?.toString() || "300+",
              },
              {
                label: "Tweets",
                value: stats.twitter?.tweets?.toString() || "500+",
              },
            ],
            profileImage:
              stats.twitter?.profileImage ||
              "https://placehold.co/48x48/27272a/f1f1f1?text=TW",
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

  useEffect(() => {
    const enterHandlers: (() => void)[] = [];
    const leaveHandlers: (() => void)[] = [];

    const currentLinkRefs = linkRefs.current;
    const currentIconRefs = iconRefs.current;

    currentLinkRefs.forEach((link, index) => {
      if (!link || !currentIconRefs[index] || !socialLinks[index]) return;

      const icon = currentIconRefs[index];
      const socialLink = socialLinks[index];

      const handleMouseEnter = () => {
        gsap.to(link, {
          backgroundColor: socialLink.hoverBgColor,
          borderColor: "rgba(75, 85, 99, 0.5)",
          duration: ANIMATION_CONFIG.LINK_HOVER.DURATION,
          ease: ANIMATION_CONFIG.LINK_HOVER.EASE,
        });

        gsap.to(icon, {
          color: socialLink.hoverIconColor,
          duration: ANIMATION_CONFIG.LINK_HOVER.DURATION,
          ease: ANIMATION_CONFIG.LINK_HOVER.EASE,
        });
      };

      const handleMouseLeave = () => {
        gsap.to(link, {
          backgroundColor: "rgba(31, 41, 55, 0.5)",
          borderColor: "rgba(55, 65, 81, 0.5)",
          duration: ANIMATION_CONFIG.LINK_HOVER.DURATION,
          ease: ANIMATION_CONFIG.LINK_HOVER.EASE,
        });

        gsap.to(icon, {
          color: socialLink.iconColor,
          duration: ANIMATION_CONFIG.LINK_HOVER.DURATION,
          ease: ANIMATION_CONFIG.LINK_HOVER.EASE,
        });
      };

      enterHandlers.push(handleMouseEnter);
      leaveHandlers.push(handleMouseLeave);

      link.addEventListener("mouseenter", handleMouseEnter);
      link.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      currentLinkRefs.forEach((link, index) => {
        if (!link || !enterHandlers[index] || !leaveHandlers[index]) return;
        link.removeEventListener("mouseenter", enterHandlers[index]);
        link.removeEventListener("mouseleave", leaveHandlers[index]);
      });
      currentLinkRefs.forEach((link) => {
        if (link) gsap.killTweensOf(link);
      });
      currentIconRefs.forEach((icon) => {
        if (icon) gsap.killTweensOf(icon);
      });
    };
  }, [socialLinks]);

  const handleMouseEnter = useCallback((index: number) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    setActiveLink(index);

    if (animationRef.current) {
      animationRef.current.kill();
    }

    setInfoBoxPosition(mousePositionRef.current);
    setInfoBoxOpacity(1);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.kill();
    }

    setInfoBoxOpacity(0);

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    hideTimeoutRef.current = setTimeout(() => {
      setActiveLink(null);
      hideTimeoutRef.current = null;
    }, ANIMATION_CONFIG.INFO_BOX.HIDE.DURATION * 1000);

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div className="flex items-center gap-4">
        {isLoading ? (
          <>
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="w-12 h-12 rounded-xl bg-gray-800/50 border border-gray-700/50 animate-pulse"
              />
            ))}
          </>
        ) : (
          socialLinks.map((link, index) => (
            <a
              key={link.label}
              ref={(el: HTMLAnchorElement | null) => {
                linkRefs.current[index] = el;
              }}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 rounded-xl bg-white/5 border border-white/10 transition-all duration-300 hover:scale-110 hover:border-primary/30"
              style={{ willChange: "background-color, border-color, transform" }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div
                ref={(el: HTMLDivElement | null): void => {
                  iconRefs.current[index] = el;
                }}
                className="text-neutral-300 transition-colors duration-200"
                style={{ willChange: "color" }}
              >
                {link.icon}
              </div>
            </a>
          ))
        )}
      </div>

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
