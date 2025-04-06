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
    DURATION: 0.6,
    STAGGER: 0.08,
    Y_OFFSET: 25,
    EASE: "power2.out",
  },
} as const;

const SOCIAL_LINKS = [
  {
    href: "https://github.com/MrUnknownji",
    icon: <FiGithub className="w-6 h-6" />,
    label: "GitHub",
  },
  {
    href: "https://linkedin.com/in/sandeep-kumar-sk1707",
    icon: <FiLinkedin className="w-6 h-6" />,
    label: "LinkedIn",
  },
  {
    href: "https://twitter.com/MrUnknownG786",
    icon: <FiTwitter className="w-6 h-6" />,
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
    text: "+91 9876543210", // Placeholder
    href: "tel:+919876543210", // Placeholder
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
        opacity: 0,
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
        },
        clearProps: "all",
        force3D: true,
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
      className="w-full bg-secondary/70 border-t border-neutral/30 py-12 md:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden backdrop-blur-sm"
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--color-border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--color-border))_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-5 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div className="container mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12">
          <div className="animate-footer-col">
            <FooterHeading>Connect With Me</FooterHeading>
            <div className="flex gap-3">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-11 h-11 flex items-center justify-center rounded-full bg-neutral/40 text-muted
                                               border border-transparent hover:border-primary/40
                                               transition-all duration-300 ease-out transform-gpu
                                               hover:bg-neutral/60 hover:text-primary hover:scale-110 hover:-translate-y-1"
                  aria-label={link.label}
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
                    className="group flex items-center gap-3 text-muted transition-all duration-300 ease-out
                                                   hover:text-light focus-visible:text-light outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded px-1 py-0.5"
                  >
                    <span
                      className="flex-shrink-0 p-1.5 rounded-md bg-neutral/40 transition-colors duration-300 ease-out
                                                       group-hover:bg-primary/20"
                      aria-hidden="true"
                    >
                      {info.icon}
                    </span>
                    <span className="transition-transform duration-300 ease-out group-hover:translate-x-1">
                      {info.text}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom mt-12 md:mt-16 pt-8 border-t border-neutral/30 text-center text-muted text-sm">
          <p>© {currentYear} Sandeep Kumar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
