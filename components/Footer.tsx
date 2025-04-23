"use client";
import React, { useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const ANIMATION_CONFIG = {
  SCROLL_TRIGGER: {
    START: "top 95%",
    END: "bottom 90%",
    TOGGLE_ACTIONS: "play none none reverse",
  },
  ENTRANCE: {
    DURATION: 0.7,
    STAGGER: 0.1,
    Y_OFFSET: 30,
    OPACITY: 0,
    EASE: "power3.out",
  },
  HOVER: {
    DURATION: 0.25,
    EASE: "power2.out",
  },
} as const;

const SOCIAL_LINKS = [
  {
    href: "https://github.com/MrUnknownji",
    icon: <FiGithub className="w-5 h-5" />,
    label: "GitHub",
  },
  {
    href: "https://linkedin.com/in/sandeep-kumar-sk1707",
    icon: <FiLinkedin className="w-5 h-5" />,
    label: "LinkedIn",
  },
  {
    href: "https://twitter.com/MrUnknownG786",
    icon: <FiTwitter className="w-5 h-5" />,
    label: "Twitter",
  },
];

const QUICK_LINKS = [
  { href: "/", id: "", text: "Home" },
  { href: "/#about", id: "about", text: "About" },
  { href: "/my-projects", id: "", text: "Projects" },
  { href: "/#contact", id: "contact", text: "Contact" },
];

const CONTACT_INFO = [
  {
    icon: <FiMail className="w-5 h-5 text-primary" />,
    text: "sandeepkhati788@gmail.com",
    href: "mailto:sandeepkhati788@gmail.com",
    label: "Email Sandeep",
  },
  {
    icon: <FiPhone className="w-5 h-5 text-primary" />,
    text: "+91 9876543210",
    href: "tel:+919876543210",
    label: "Call Sandeep",
  },
  {
    icon: <FiMapPin className="w-5 h-5 text-primary" />,
    text: "Punjab, India",
    href: "https://maps.google.com/?q=Punjab,India",
    label: "View location on map",
  },
];

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const currentYear: number = new Date().getFullYear();
  const pathname = usePathname();
  const router = useRouter();

  const scrollToElement = useCallback((elementId: string) => {
    if (!elementId) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleQuickLinkClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, link: (typeof QUICK_LINKS)[0]) => {
      e.preventDefault();
      const isHome = pathname === "/";
      const isProjectsPage = pathname === "/my-projects";

      if (link.text === "Home") {
        if (isHome) scrollToElement("");
        else router.push("/");
      } else if (link.text === "Projects") {
        if (isProjectsPage) scrollToElement("");
        else router.push("/my-projects");
      } else if (link.id) {
        if (isHome) scrollToElement(link.id);
        else router.push(`/#${link.id}`);
      } else {
        router.push(link.href);
      }
    },
    [pathname, router, scrollToElement],
  );

  useGSAP(
    () => {
      const elementsToAnimate = gsap.utils.toArray<HTMLElement>(
        footerRef.current?.querySelectorAll(
          ".animate-footer-col, .footer-bottom",
        ) ?? [],
      );

      if (elementsToAnimate.length === 0) return;

      gsap.set(elementsToAnimate, {
        opacity: ANIMATION_CONFIG.ENTRANCE.OPACITY,
        y: ANIMATION_CONFIG.ENTRANCE.Y_OFFSET,
        force3D: true,
        willChange: "transform, opacity",
      });

      gsap.to(elementsToAnimate, {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.ENTRANCE.DURATION,
        stagger: ANIMATION_CONFIG.ENTRANCE.STAGGER,
        ease: ANIMATION_CONFIG.ENTRANCE.EASE,
        scrollTrigger: {
          trigger: footerRef.current,
          start: ANIMATION_CONFIG.SCROLL_TRIGGER.START,
          end: ANIMATION_CONFIG.SCROLL_TRIGGER.END,
          toggleActions: ANIMATION_CONFIG.SCROLL_TRIGGER.TOGGLE_ACTIONS,
          markers: false,
        },
        clearProps: "all",
        force3D: true,
      });

      const socialLinks = gsap.utils.toArray<HTMLAnchorElement>(
        footerRef.current?.querySelectorAll(".social-link") ?? [],
      );
      socialLinks.forEach((link) => {
        const icon = link.querySelector("svg");
        link.addEventListener("mouseenter", () => {
          gsap.to(link, {
            scale: 1.1,
            y: -2,
            duration: ANIMATION_CONFIG.HOVER.DURATION,
            ease: ANIMATION_CONFIG.HOVER.EASE,
          });
          if (icon)
            gsap.to(icon, {
              color: "var(--color-primary)",
              duration: ANIMATION_CONFIG.HOVER.DURATION,
              ease: ANIMATION_CONFIG.HOVER.EASE,
            });
        });
        link.addEventListener("mouseleave", () => {
          gsap.to(link, {
            scale: 1,
            y: 0,
            duration: ANIMATION_CONFIG.HOVER.DURATION,
            ease: ANIMATION_CONFIG.HOVER.EASE,
          });
          if (icon)
            gsap.to(icon, {
              color: "var(--color-muted)",
              duration: ANIMATION_CONFIG.HOVER.DURATION,
              ease: ANIMATION_CONFIG.HOVER.EASE,
            });
        });
      });

      const contactItems = gsap.utils.toArray<HTMLAnchorElement>(
        footerRef.current?.querySelectorAll(".contact-item") ?? [],
      );
      contactItems.forEach((item) => {
        const iconContainer = item.querySelector(".contact-icon-container");
        item.addEventListener("mouseenter", () => {
          gsap.to(item, {
            color: "var(--color-light)",
            x: 4,
            duration: ANIMATION_CONFIG.HOVER.DURATION,
            ease: ANIMATION_CONFIG.HOVER.EASE,
          });
          if (iconContainer)
            gsap.to(iconContainer, {
              backgroundColor: "rgba(0, 255, 159, 0.15)",
              duration: ANIMATION_CONFIG.HOVER.DURATION,
              ease: ANIMATION_CONFIG.HOVER.EASE,
            });
        });
        item.addEventListener("mouseleave", () => {
          gsap.to(item, {
            color: "var(--color-muted)",
            x: 0,
            duration: ANIMATION_CONFIG.HOVER.DURATION,
            ease: ANIMATION_CONFIG.HOVER.EASE,
          });
          if (iconContainer)
            gsap.to(iconContainer, {
              backgroundColor: "rgba(55, 65, 81, 0.5)",
              duration: ANIMATION_CONFIG.HOVER.DURATION,
              ease: ANIMATION_CONFIG.HOVER.EASE,
            });
        });
      });
    },
    { scope: footerRef },
  );

  const FooterHeading: React.FC<{ children: React.ReactNode }> = ({
    children,
  }) => (
    <h3 className="text-xl font-semibold mb-5 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
      {children}
    </h3>
  );

  return (
    <footer
      ref={footerRef}
      className="w-full bg-gradient-to-b from-secondary via-dark to-dark border-t border-neutral/20 py-12 md:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden backdrop-blur-sm"
    >
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.svg')] bg-repeat"></div>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12">
          <div className="animate-footer-col">
            <FooterHeading>Connect With Me</FooterHeading>
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link group relative w-11 h-11 flex items-center justify-center rounded-lg bg-neutral/30 text-muted
                                 border border-neutral/40 ring-1 ring-inset ring-neutral/50 transition-colors duration-300 ease-out transform-gpu
                                 hover:bg-neutral/50 hover:border-primary/30 hover:ring-primary/30"
                  aria-label={link.label}
                  style={{ willChange: "transform, color" }}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="animate-footer-col">
            <FooterHeading>Quick Links</FooterHeading>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.text}>
                  <a
                    href={link.href}
                    onClick={(e) => handleQuickLinkClick(e, link)}
                    className="group relative inline-block text-muted transition-colors duration-300 ease-out
                                   hover:text-primary focus-visible:text-primary outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded px-1"
                  >
                    {link.text}
                    <span
                      className="absolute bottom-0 left-0 block h-0.5 bg-gradient-to-r from-primary to-accent origin-left
                                     w-full scale-x-0 transition-transform duration-300 ease-out
                                     group-hover:scale-x-100 group-focus-visible:scale-x-100"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-footer-col">
            <FooterHeading>Contact Info</FooterHeading>
            <ul className="space-y-3">
              {CONTACT_INFO.map((info, index) => (
                <li key={index}>
                  <a
                    href={info.href}
                    target={
                      info.text.includes("@") || info.text.includes("+")
                        ? "_self"
                        : "_blank"
                    }
                    rel={
                      info.text.includes("@") || info.text.includes("+")
                        ? undefined
                        : "noopener noreferrer"
                    }
                    aria-label={info.label}
                    className="contact-item group flex items-center gap-3 text-muted transition-colors duration-300 ease-out
                                   focus-visible:text-light outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded px-1 py-0.5"
                    style={{ willChange: "transform, color" }}
                  >
                    <span
                      className="contact-icon-container flex-shrink-0 p-1.5 rounded-md bg-neutral/50 border border-neutral/40 transition-colors duration-300 ease-out"
                      aria-hidden="true"
                      style={{ willChange: "background-color" }}
                    >
                      {info.icon}
                    </span>
                    <span>{info.text}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom mt-12 md:mt-16 pt-8 border-t border-neutral/20 text-center text-muted text-sm">
          <p>© {currentYear} Sandeep Kumar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
