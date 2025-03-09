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
    CONTAINER: 0.6,
    GRID_ITEMS: 0.5,
    SOCIAL_ICONS: 0.4,
    QUICK_LINKS: 0.4,
    CONTACT_ITEMS: 0.4,
    FOOTER_BOTTOM: 0.5
  },
  DELAYS: {
    GRID_ITEMS: -0.4,
    SOCIAL_ICONS: -0.3,
    QUICK_LINKS: -0.2,
    CONTACT_ITEMS: -0.2,
    FOOTER_BOTTOM: -0.1
  },
  STAGGER: {
    GRID_ITEMS: 0.1,
    SOCIAL_ICONS: 0.1,
    QUICK_LINKS: 0.05,
    CONTACT_ITEMS: 0.05
  },
  HOVER: {
    DURATION: 0.2,
    ROTATION_DURATION: 4,
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
  const quickLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const contactItemsRef = useRef<(HTMLLIElement | null)[]>([]);
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

    gsap.set([gridItems, socialAnchors, listItems, contactItems, footerBottom], {
      opacity: 0,
      y: 20
    });

    timelineRef.current = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: ANIMATION_CONFIG.SCROLL_TRIGGER.START,
        end: ANIMATION_CONFIG.SCROLL_TRIGGER.END,
        toggleActions: ANIMATION_CONFIG.SCROLL_TRIGGER.TOGGLE_ACTIONS,
      },
    });

    timelineRef.current
      .to(gridItems, {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.DURATIONS.GRID_ITEMS,
        stagger: ANIMATION_CONFIG.STAGGER.GRID_ITEMS,
        ease: "power2.out",
        clearProps: "transform"
      })
      .to(socialAnchors, {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.DURATIONS.SOCIAL_ICONS,
        stagger: ANIMATION_CONFIG.STAGGER.SOCIAL_ICONS,
        ease: "power2.out",
        clearProps: "transform"
      }, ANIMATION_CONFIG.DELAYS.SOCIAL_ICONS)
      .to(listItems, {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.DURATIONS.QUICK_LINKS,
        stagger: ANIMATION_CONFIG.STAGGER.QUICK_LINKS,
        ease: "power2.out",
        clearProps: "transform"
      }, ANIMATION_CONFIG.DELAYS.QUICK_LINKS)
      .to(contactItems, {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.DURATIONS.CONTACT_ITEMS,
        stagger: ANIMATION_CONFIG.STAGGER.CONTACT_ITEMS,
        ease: "power2.out",
        clearProps: "transform"
      }, ANIMATION_CONFIG.DELAYS.CONTACT_ITEMS)
      .to(footerBottom, {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.DURATIONS.FOOTER_BOTTOM,
        ease: "power2.out",
        clearProps: "transform"
      }, ANIMATION_CONFIG.DELAYS.FOOTER_BOTTOM);
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

    // Social icons animation setup
    socialIconsRef.current.forEach((icon) => {
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

    // Quick links animation setup
    quickLinksRef.current.forEach((link, index) => {
      if (!link) return;
      
      const ctx = gsap.context(() => {
        link.addEventListener("mouseenter", () => {
          gsap.to(link, {
            color: "#00ff9f",
            x: 3,
            duration: ANIMATION_CONFIG.HOVER.DURATION,
            ease: "power2.out"
          });
          handleLinkHover(index.toString(), true);
        });

        link.addEventListener("mouseleave", () => {
          gsap.to(link, {
            color: "rgb(156 163 175)",
            x: 0,
            duration: ANIMATION_CONFIG.HOVER.DURATION,
            ease: "power2.out"
          });
          handleLinkHover(index.toString(), false);
        });
      }, link);

      return () => ctx.revert();
    });

    // Contact items animation setup
    contactItemsRef.current.forEach((item) => {
      if (!item) return;
      
      const icon = item.querySelector(".contact-icon-container");
      const text = item.querySelector(".contact-text");
      
      const ctx = gsap.context(() => {
        item.addEventListener("mouseenter", () => {
          gsap.to(item, {
            color: "#ffffff",
            duration: ANIMATION_CONFIG.HOVER.DURATION,
            ease: "power2.out"
          });
          gsap.to(icon, {
            backgroundColor: "rgba(0, 255, 159, 0.2)",
            duration: ANIMATION_CONFIG.HOVER.DURATION,
            ease: "power2.out"
          });
          gsap.to(text, {
            x: 4,
            duration: ANIMATION_CONFIG.HOVER.DURATION,
            ease: "power2.out"
          });
        });

        item.addEventListener("mouseleave", () => {
          gsap.to(item, {
            color: "rgb(156 163 175)",
            duration: ANIMATION_CONFIG.HOVER.DURATION,
            ease: "power2.out"
          });
          gsap.to(icon, {
            backgroundColor: "rgba(31, 41, 55, 0.5)",
            duration: ANIMATION_CONFIG.HOVER.DURATION,
            ease: "power2.out"
          });
          gsap.to(text, {
            x: 0,
            duration: ANIMATION_CONFIG.HOVER.DURATION,
            ease: "power2.out"
          });
        });
      }, item);

      return () => ctx.revert();
    });

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [setupAnimations, handleLinkHover]);

  return (
    <footer
      ref={footerRef}
      className="w-full bg-gray-900/50 border-t border-gray-800/50 py-12 px-8 relative overflow-hidden"
      style={{ willChange: "transform" }}
    >
      {/* Replace blur with gradient background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div
        ref={contentRef}
        className="container mx-auto px-4 relative"
        style={{ willChange: "transform" }}
      >
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
                    className="social-icon relative w-12 h-12 flex items-center justify-center rounded-full bg-gray-800/50 text-gray-400 transform-gpu"
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
                    ref={(el: HTMLAnchorElement | null) => {
                      if (el) {
                        quickLinksRef.current[index] = el;
                      }
                    }}
                    className={`quick-link quick-link-${index} relative inline-block text-gray-400 transform-gpu ${hoveredLink === index.toString() ? 'text-primary' : ''}`}
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
                  ref={(el: HTMLLIElement | null) => {
                    if (el) {
                      contactItemsRef.current[index] = el;
                    }
                  }}
                  className="contact-item flex items-center gap-3 text-gray-400 transform-gpu"
                >
                  <span className="contact-icon-container flex-shrink-0 p-2 rounded-lg bg-gray-800/50">
                    {info.icon}
                  </span>
                  <span className="contact-text transform-gpu">
                    {info.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom mt-12 pt-8 border-t border-gray-800/30 text-center text-gray-400">
          <p>
            © {currentYear} Sandeep Kumar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
