import React, { useState, useRef, useCallback, useEffect } from "react";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import gsap from "gsap";
import { SocialLink } from "../../types/social";
import { fetchSocialStats } from "../../utils/social";

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
  const infoBoxRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

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
            profileImage: stats.github?.profileImage || "/images/github-profile.jpg",
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
            profileImage: stats.linkedin?.profileImage || "/images/linkedin-profile.jpg",
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
            profileImage: stats.twitter?.profileImage || "/images/twitter-profile.jpg",
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
    setActiveLink(index);
    
    if (animationRef.current) {
      animationRef.current.kill();
    }

    if (infoBoxRef.current) {
      gsap.set(infoBoxRef.current, {
        opacity: 0,
        y: 10,  
        scale: 0.95,
      });

      animationRef.current = gsap.to(infoBoxRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: ANIMATION_CONFIG.INFO_BOX.SHOW.DURATION,
        ease: ANIMATION_CONFIG.INFO_BOX.SHOW.EASE,
      });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.kill();
    }

    if (infoBoxRef.current) {
      animationRef.current = gsap.to(infoBoxRef.current, {
        opacity: 0,
        y: 10,
        scale: 0.95,
        duration: ANIMATION_CONFIG.INFO_BOX.HIDE.DURATION,
        ease: ANIMATION_CONFIG.INFO_BOX.HIDE.EASE,
        onComplete: () => {
          setActiveLink(null);
        }
      });
    }
  }, []);

  return (
    <div className="relative inline-block">
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
        <div
          ref={infoBoxRef}
          className="absolute z-50 w-72 p-4 rounded-xl bg-gray-800/95 backdrop-blur-sm
            border border-gray-700/50 shadow-xl left-1/2 -top-[220px]"
          style={{ 
            willChange: "transform, opacity",
            transform: "translateX(-50%)"
          }}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {socialLinks[activeLink].profileImage ? (
                <img 
                  src={socialLinks[activeLink].profileImage} 
                  alt={socialLinks[activeLink].label}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                <div 
                  className="p-2 rounded-lg bg-gray-700/50 w-12 h-12 flex items-center justify-center"
                  style={{ color: socialLinks[activeLink].hoverIconColor }}
                >
                  {socialLinks[activeLink].icon}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-white">
                  {socialLinks[activeLink].username}
                </h3>
                <p className="text-sm text-gray-400">
                  {socialLinks[activeLink].label}
                </p>
              </div>
            </div>
            
            <p className="text-sm text-gray-300 border-l-2 pl-3 py-1" 
               style={{ borderColor: socialLinks[activeLink].color || socialLinks[activeLink].hoverIconColor }}>
              {socialLinks[activeLink].description}
            </p>
            
            <div className="grid grid-cols-3 gap-2">
              {socialLinks[activeLink].stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-2 rounded-lg bg-gray-700/30"
                >
                  <div className="text-sm font-medium text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div 
            className="absolute left-1/2 bottom-0 w-4 h-4 -mb-2 bg-gray-800/95 border-r border-b border-gray-700/50"
            style={{ 
              transform: "translateX(-50%) rotate(45deg)"
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SocialLinks;
