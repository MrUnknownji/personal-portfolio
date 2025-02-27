"use client";
import Link from "next/link";
import {
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const ANIMATION_CONFIG = {
  SCROLL_TRIGGER: {
    START: "top 90%",
    END: "bottom bottom",
    TOGGLE_ACTIONS: "play none none reverse"
  },
  DURATIONS: {
    CONTAINER: 0.8,
    GRID_ITEMS: 0.7,
    SOCIAL_ICONS: 0.6,
    QUICK_LINKS: 0.5,
    CONTACT_ITEMS: 0.5,
    FOOTER_BOTTOM: 0.6
  },
  DELAYS: {
    GRID_ITEMS: -0.6,
    SOCIAL_ICONS: -0.5,
    QUICK_LINKS: -0.4,
    CONTACT_ITEMS: -0.4,
    FOOTER_BOTTOM: -0.3
  },
  STAGGER: {
    GRID_ITEMS: 0.2,
    SOCIAL_ICONS: 0.15,
    QUICK_LINKS: 0.1,
    CONTACT_ITEMS: 0.1
  },
  HOVER: {
    DURATION: 0.3,
    ROTATION_DURATION: 5,
    SCALE: 1.05,
    Y_OFFSET: -2
  }
} as const;

const SOCIAL_LINKS = [
  {
    href: "https://github.com/yourusername",
    icon: <FiGithub className="w-6 h-6" />,
    label: "GitHub",
  },
  {
    href: "https://linkedin.com/in/yourusername",
    icon: <FiLinkedin className="w-6 h-6" />,
    label: "LinkedIn",
  },
  {
    href: "https://twitter.com/yourusername",
    icon: <FiTwitter className="w-6 h-6" />,
    label: "Twitter",
  },
];

const QUICK_LINKS = [
  { href: "/", text: "Home" },
  { href: "#about", text: "About" },
  { href: "#projects", text: "Projects" },
  { href: "#contact", text: "Contact" },
];

const CONTACT_INFO = [
  {
    icon: <FiMail className="w-5 h-5 text-primary" />,
    text: "example@email.com",
  },
  {
    icon: <FiPhone className="w-5 h-5 text-primary" />,
    text: "+1 234 567 890",
  },
  {
    icon: <FiMapPin className="w-5 h-5 text-primary" />,
    text: "New York, NY",
  },
];

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const socialIconsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const currentYear: number = new Date().getFullYear();

  const setupAnimations = useCallback(() => {
    if (!contentRef.current || !footerRef.current) return;

    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const gridContainer = contentRef.current.querySelector(".grid");
    const gridItems = Array.from(gridContainer?.querySelectorAll(".grid-item") || []);
    const footerBottom = contentRef.current.querySelector(".footer-bottom");
    const socialAnchors = Array.from(contentRef.current.querySelectorAll(".social-icon"));
    const listItems = Array.from(contentRef.current.querySelectorAll(".quick-link"));
    const contactItems = Array.from(contentRef.current.querySelectorAll(".contact-item"));

    timelineRef.current = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: ANIMATION_CONFIG.SCROLL_TRIGGER.START,
        end: ANIMATION_CONFIG.SCROLL_TRIGGER.END,
        toggleActions: ANIMATION_CONFIG.SCROLL_TRIGGER.TOGGLE_ACTIONS,
      },
    });

    timelineRef.current
      .fromTo(
        contentRef.current,
        { 
          y: 70, 
          opacity: 0 
        },
        { 
          y: 0, 
          opacity: 1, 
          duration: ANIMATION_CONFIG.DURATIONS.CONTAINER, 
          ease: "power3.out",
          clearProps: "transform"
        }
      )
      .fromTo(
        gridItems,
        { 
          y: 30, 
          opacity: 0, 
          rotationX: -15, 
          scale: 0.9 
        },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          scale: 1,
          duration: ANIMATION_CONFIG.DURATIONS.GRID_ITEMS,
          ease: "power3.out",
          stagger: ANIMATION_CONFIG.STAGGER.GRID_ITEMS,
          clearProps: "transform"
        },
        ANIMATION_CONFIG.DELAYS.GRID_ITEMS
      )
      .fromTo(
        socialAnchors,
        { 
          y: 20, 
          opacity: 0, 
          scale: 0.7, 
          rotationZ: -10 
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationZ: 0,
          duration: ANIMATION_CONFIG.DURATIONS.SOCIAL_ICONS,
          ease: "elastic.out(1, 0.5)",
          stagger: ANIMATION_CONFIG.STAGGER.SOCIAL_ICONS,
          clearProps: "transform"
        },
        ANIMATION_CONFIG.DELAYS.SOCIAL_ICONS
      )
      .fromTo(
        listItems,
        { 
          y: 15, 
          opacity: 0 
        },
        {
          y: 0,
          opacity: 1,
          duration: ANIMATION_CONFIG.DURATIONS.QUICK_LINKS,
          ease: "power2.out",
          stagger: ANIMATION_CONFIG.STAGGER.QUICK_LINKS,
          clearProps: "transform"
        },
        ANIMATION_CONFIG.DELAYS.QUICK_LINKS
      )
      .fromTo(
        contactItems,
        { 
          y: 15, 
          opacity: 0, 
          scale: 0.95 
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: ANIMATION_CONFIG.DURATIONS.CONTACT_ITEMS,
          ease: "power3.out",
          stagger: ANIMATION_CONFIG.STAGGER.CONTACT_ITEMS,
          clearProps: "transform"
        },
        ANIMATION_CONFIG.DELAYS.CONTACT_ITEMS
      )
      .fromTo(
        footerBottom,
        { 
          y: 30, 
          opacity: 0, 
          scale: 0.95 
        },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1, 
          duration: ANIMATION_CONFIG.DURATIONS.FOOTER_BOTTOM, 
          ease: "power3.out",
          clearProps: "transform"
        },
        ANIMATION_CONFIG.DELAYS.FOOTER_BOTTOM
      );
  }, []);

  const handleLinkHover = useCallback((index: string, isEntering: boolean) => {
    setHoveredLink(isEntering ? index : null);
    gsap.to(`.quick-link-${index} .underline`, {
      width: isEntering ? "100%" : "0%",
      duration: ANIMATION_CONFIG.HOVER.DURATION,
      ease: "power3.out"
    });
  }, []);

  useGSAP(() => {
    setupAnimations();

    // Setup social icon hover animations
    socialIconsRef.current.forEach((icon, i) => {
      if (!icon) return;

      const border = document.createElement("div");
      border.className = "absolute inset-0 border-2 border-dashed border-primary/50 rounded-full opacity-0 transform-gpu";
      icon.appendChild(border);

      const ctx = gsap.context(() => {
        const rotationTween = gsap.to(border, {
          rotation: 360,
          duration: ANIMATION_CONFIG.HOVER.ROTATION_DURATION,
          ease: "none",
          repeat: -1,
          paused: true
        });

        icon.addEventListener("mouseenter", () => {
          gsap.to(border, { opacity: 1, duration: ANIMATION_CONFIG.HOVER.DURATION });
          gsap.to(icon.querySelector("svg"), { 
            color: "#00ff9f", 
            scale: ANIMATION_CONFIG.HOVER.SCALE,
            y: ANIMATION_CONFIG.HOVER.Y_OFFSET,
            duration: ANIMATION_CONFIG.HOVER.DURATION,
            ease: "power2.out"
          });
          rotationTween.play();
        });

        icon.addEventListener("mouseleave", () => {
          gsap.to(border, { opacity: 0, duration: ANIMATION_CONFIG.HOVER.DURATION });
          gsap.to(icon.querySelector("svg"), {
            color: "rgb(156 163 175)",
            scale: 1,
            y: 0,
            duration: ANIMATION_CONFIG.HOVER.DURATION,
            ease: "power2.out"
          });
          rotationTween.pause();
        });
      }, icon);

      return () => ctx.revert();
    });

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [setupAnimations]);

  return (
    <footer
      ref={footerRef}
      className="w-full bg-gray-900/50 backdrop-blur-sm border-t border-gray-800/50 py-12 px-8 relative overflow-hidden"
    >
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Background glow effects */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

      <div ref={contentRef} className="container mx-auto px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12">
          <div className="grid-item flex justify-center md:justify-start">
            <div>
              <h3 className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Connect With Me
              </h3>
              <div className="flex gap-4">
                {SOCIAL_LINKS.map((link, index) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    ref={(el: HTMLAnchorElement | null) => {
                      if (el) {
                        socialIconsRef.current[index] = el;
                      }
                    }}
                    className="social-icon relative w-12 h-12 flex items-center justify-center rounded-full bg-gray-800/50 text-gray-400 hover:text-primary transition-colors duration-300 transform-gpu"
                    aria-label={link.label}
                  >
                    {link.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="grid-item">
            <h3 className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link, index) => (
                <li key={link.text}>
                  <Link
                    href={link.href}
                    className={`quick-link quick-link-${index} relative inline-block text-gray-400 hover:text-white transition-colors duration-300`}
                    onMouseEnter={() => handleLinkHover(index.toString(), true)}
                    onMouseLeave={() => handleLinkHover(index.toString(), false)}
                  >
                    {link.text}
                    <div className="underline absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transform-gpu" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid-item">
            <h3 className="text-xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Contact Info
            </h3>
            <ul className="space-y-4">
              {CONTACT_INFO.map((info, index) => (
                <li
                  key={index}
                  className="contact-item flex items-center gap-3 text-gray-400 hover:text-white transition-colors duration-300 group"
                >
                  <span className="flex-shrink-0 p-2 rounded-lg bg-gray-800/50 group-hover:bg-primary/20 transition-colors duration-300">
                    {info.icon}
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">
                    {info.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom mt-12 pt-8 border-t border-gray-800/30 text-center text-gray-400">
          <p>
            © {currentYear} Your Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
