import React, { useState, useRef, useCallback, useEffect } from "react";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import gsap from "gsap";
import { SocialLink } from "../../types/social";
import { fetchSocialStats } from "../../utils/social";
// import Image from 'next/image';
import SocialInfoBox from "./SocialInfoBox";

const ANIMATION_CONFIG = {
  LINK_HOVER: {
    DURATION: 0.2,
    EASE: "power2.out"
  },
  INFO_BOX: {
    SHOW: {
      DURATION: 0.2,
      EASE: "back.out(1.7)"
    },
    HIDE: {
      DURATION: 0.15,
      EASE: "power2.in"
    }
  }
} as const;

const SocialLinks = () => {
  const [activeLink, setActiveLink] = useState<number | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [infoBoxOpacity, setInfoBoxOpacity] = useState(0);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Use page coordinates which include scroll position
      setMousePosition({
        x: e.pageX,
        y: e.pageY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
              { label: "Repositories", value: stats.github?.public_repos?.toString() || "20+" },
              { label: "Followers", value: stats.github?.followers?.toString() || "100+" },
              { label: "Following", value: stats.github?.following?.toString() || "50+" }
            ],
            profileImage: stats.github?.profileImage || "https://placehold.co/600x600?text=Sandeep+Kumar",
            username: stats.github?.username || "MrUnknownji"
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
            description: stats.linkedin?.headline || "Connect with me professionally",
            stats: [
              { label: "Connections", value: stats.linkedin?.connections || "500+" },
              { label: "Endorsements", value: stats.linkedin?.endorsements?.toString() || "50+" },
              { label: "Posts", value: stats.linkedin?.posts?.toString() || "25+" }
            ],
            profileImage: stats.linkedin?.profileImage || "https://placehold.co/600x600?text=Sandeep+Kumar",
            username: stats.linkedin?.name || "sandeep-kumar-sk1707"
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
            description: stats.twitter?.description || "Follow me for tech insights and updates",
            stats: [
              { label: "Followers", value: stats.twitter?.followers?.toString() || "250+" },
              { label: "Following", value: stats.twitter?.following?.toString() || "300+" },
              { label: "Tweets", value: stats.twitter?.tweets?.toString() || "500+" }
            ],
            profileImage: stats.twitter?.profileImage || "https://placehold.co/600x600?text=Sandeep+Kumar",
            username: stats.twitter?.name || "MrUnknownG786"
          }
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

  // Setup hover animations for social links
  useEffect(() => {
    // Store references to event handlers for proper cleanup
    const enterHandlers: (() => void)[] = [];
    const leaveHandlers: (() => void)[] = [];
    
    // Store current refs to use in cleanup
    const currentLinkRefs = linkRefs.current;
    const currentIconRefs = iconRefs.current;
    
    currentLinkRefs.forEach((link, index) => {
      if (!link || !currentIconRefs[index]) return;
      
      const icon = currentIconRefs[index];
      const socialLink = socialLinks[index];
      
      const handleMouseEnter = () => {
        gsap.to(link, {
          backgroundColor: socialLink.hoverBgColor,
          borderColor: 'rgba(75, 85, 99, 0.5)',
          duration: ANIMATION_CONFIG.LINK_HOVER.DURATION,
          ease: ANIMATION_CONFIG.LINK_HOVER.EASE
        });
        
        gsap.to(icon, {
          color: socialLink.hoverIconColor,
          duration: ANIMATION_CONFIG.LINK_HOVER.DURATION,
          ease: ANIMATION_CONFIG.LINK_HOVER.EASE
        });
      };
      
      const handleMouseLeave = () => {
        gsap.to(link, {
          backgroundColor: 'rgba(31, 41, 55, 0.5)',
          borderColor: 'rgba(55, 65, 81, 0.5)',
          duration: ANIMATION_CONFIG.LINK_HOVER.DURATION,
          ease: ANIMATION_CONFIG.LINK_HOVER.EASE
        });
        
        gsap.to(icon, {
          color: socialLink.iconColor,
          duration: ANIMATION_CONFIG.LINK_HOVER.DURATION,
          ease: ANIMATION_CONFIG.LINK_HOVER.EASE
        });
      };
      
      // Store handlers for cleanup
      enterHandlers.push(handleMouseEnter);
      leaveHandlers.push(handleMouseLeave);
      
      // Add event listeners
      link.addEventListener('mouseenter', handleMouseEnter);
      link.addEventListener('mouseleave', handleMouseLeave);
    });
    
    // Cleanup function
    return () => {
      currentLinkRefs.forEach((link, index) => {
        if (!link) return;
        
        // Remove event listeners with the same handler references
        link.removeEventListener('mouseenter', enterHandlers[index]);
        link.removeEventListener('mouseleave', leaveHandlers[index]);
      });
    };
  }, [socialLinks]);

  const handleMouseEnter = useCallback((index: number) => {
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    
    setActiveLink(index);
    
    if (animationRef.current) {
      animationRef.current.kill();
    }

    // Immediately show the info box
    setInfoBoxOpacity(1);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.kill();
    }

    // Start fading out
    setInfoBoxOpacity(0);
    
    // Clear any existing timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    
    // Set a new timeout to hide the component after animation completes
    hideTimeoutRef.current = setTimeout(() => {
      setActiveLink(null);
      hideTimeoutRef.current = null;
    }, ANIMATION_CONFIG.INFO_BOX.HIDE.DURATION * 1000);
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div className="flex items-center gap-4">
        {isLoading ? (
          // Loading skeleton
          <>
            {[1, 2, 3].map((_, index) => (
              <div 
                key={index}
                className="w-12 h-12 rounded-xl bg-gray-800/50 border border-gray-700/50 animate-pulse"
              />
            ))}
          </>
        ) : (
          // Actual social links
          socialLinks.map((link, index) => (
            <a
              key={link.label}
              ref={(el: HTMLAnchorElement | null) => {
                linkRefs.current[index] = el;
              }}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-3 rounded-xl bg-gray-800/50 border border-gray-700/50"
              style={{ willChange: "background-color, border-color" }}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <div 
                ref={(el: HTMLDivElement | null): void => {
                  iconRefs.current[index] = el;
                }}
                className="text-gray-300"
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
          position={mousePosition}
          opacity={infoBoxOpacity}
          onHeightChange={() => {}}
        />
      )}
    </div>
  );
};

export default SocialLinks;
