import React, { useState, useRef, useCallback } from "react";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";
import gsap from "gsap";

interface SocialLink {
  icon: React.ReactNode;
  label: string;
  href: string;
  bgColor: string;
  iconColor: string;
  description: string;
  stats: {
    label: string;
    value: string;
  }[];
}

const SOCIAL_LINKS: SocialLink[] = [
  {
    icon: <FiGithub className="w-6 h-6" />,
    label: "GitHub",
    href: "https://github.com/yourusername",
    bgColor: "hover:bg-[#2dba4e]/10",
    iconColor: "text-gray-300 group-hover:text-[#2dba4e]",
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
    bgColor: "hover:bg-[#0077b5]/10",
    iconColor: "text-gray-300 group-hover:text-[#0077b5]",
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
    bgColor: "hover:bg-[#1da1f2]/10",
    iconColor: "text-gray-300 group-hover:text-[#1da1f2]",
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
        duration: 0.2,
        ease: "back.out(1.7)",
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
        duration: 0.15,
        ease: "power2.in",
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
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group relative p-3 rounded-xl bg-gray-800/50 border border-gray-700/50 
              transition-all duration-300 hover:bg-gray-800/70 hover:border-gray-600/50 ${link.bgColor}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div className={link.iconColor}>
              {link.icon}
            </div>
          </a>
        ))}
      </div>

      {activeLink !== null && (
        <div
          ref={infoBoxRef}
          className="absolute z-50 w-64 p-4 rounded-xl bg-gray-800/95 backdrop-blur-sm
            border border-gray-700/50 shadow-xl -translate-x-1/2 left-1/2 -top-[220px]"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gray-700/50 ${SOCIAL_LINKS[activeLink].iconColor}`}>
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

          <div className="absolute left-1/2 bottom-0 w-4 h-4 -mb-2 transform -translate-x-1/2 rotate-45 bg-gray-800/95 border-r border-b border-gray-700/50" />
        </div>
      )}
    </div>
  );
};

export default SocialLinks;
