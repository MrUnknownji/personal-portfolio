import React, { useState, useRef, useCallback, useEffect } from "react";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import gsap from "gsap";

interface SocialLink {
  icon: React.ReactNode;
  label: string;
  href: string;
  bgColor: string;
  hoverBgColor: string;
  iconColor: string;
  hoverIconColor: string;
  description: string;
  stats: {
    label: string;
    value: string;
  }[];
}

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

const SOCIAL_LINKS: SocialLink[] = [
  {
    icon: <FiGithub className="w-6 h-6" />,
    label: "GitHub",
    href: "https://github.com/yourusername",
    bgColor: "rgba(45, 186, 78, 0)",
    hoverBgColor: "rgba(45, 186, 78, 0.1)",
    iconColor: "rgb(209, 213, 219)",
    hoverIconColor: "rgb(45, 186, 78)",
    description: "Check out my open source projects and contributions",
    stats: [
      { label: "Repositories", value: "50+" },
      { label: "Stars", value: "100+" },
      { label: "Contributions", value: "500+" }
    ]
  },
  {
    icon: <FiLinkedin className="w-6 h-6" />,
    label: "LinkedIn",
    href: "https://linkedin.com/in/yourusername",
    bgColor: "rgba(0, 119, 181, 0)",
    hoverBgColor: "rgba(0, 119, 181, 0.1)",
    iconColor: "rgb(209, 213, 219)",
    hoverIconColor: "rgb(0, 119, 181)",
    description: "Connect with me professionally",
    stats: [
      { label: "Connections", value: "500+" },
      { label: "Endorsements", value: "50+" },
      { label: "Posts", value: "100+" }
    ]
  },
  {
    icon: <FiTwitter className="w-6 h-6" />,
    label: "Twitter",
    href: "https://twitter.com/yourusername",
    bgColor: "rgba(29, 161, 242, 0)",
    hoverBgColor: "rgba(29, 161, 242, 0.1)",
    iconColor: "rgb(209, 213, 219)",
    hoverIconColor: "rgb(29, 161, 242)",
    description: "Follow me for tech insights and updates",
    stats: [
      { label: "Followers", value: "1000+" },
      { label: "Following", value: "500+" },
      { label: "Tweets", value: "2000+" }
    ]
  }
];

const SocialLinks = () => {
  const [activeLink, setActiveLink] = useState<number | null>(null);
  const infoBoxRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Setup hover animations for social links
  useEffect(() => {
    linkRefs.current.forEach((link, index) => {
      if (!link || !iconRefs.current[index]) return;
      
      const icon = iconRefs.current[index];
      const socialLink = SOCIAL_LINKS[index];
      
      link.addEventListener('mouseenter', () => {
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
      });
      
      link.addEventListener('mouseleave', () => {
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
      });
    });
    
    return () => {
      linkRefs.current.forEach((link) => {
        if (!link) return;
        link.removeEventListener('mouseenter', () => {});
        link.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

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
        {SOCIAL_LINKS.map((link, index) => (
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
        ))}
      </div>

      {activeLink !== null && (
        <div
          ref={infoBoxRef}
          className="absolute z-50 w-64 p-4 rounded-xl bg-gray-800/95 backdrop-blur-sm
            border border-gray-700/50 shadow-xl left-1/2 -top-[220px]"
          style={{ 
            willChange: "transform, opacity",
            transform: "translateX(-50%)"
          }}
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg bg-gray-700/50"
                style={{ color: SOCIAL_LINKS[activeLink].hoverIconColor }}
              >
                {SOCIAL_LINKS[activeLink].icon}
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  {SOCIAL_LINKS[activeLink].label}
                </h3>
                <p className="text-sm text-gray-400">
                  {SOCIAL_LINKS[activeLink].description}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {SOCIAL_LINKS[activeLink].stats.map((stat, index) => (
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
