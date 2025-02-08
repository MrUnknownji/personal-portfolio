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
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

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
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const currentYear: number = new Date().getFullYear();

  useGSAP(() => {
    if (!contentRef.current || !footerRef.current) return;

    const gridContainer = contentRef.current.querySelector(".grid");
    const gridItems = gridContainer?.querySelectorAll(".grid-item");
    const footerBottom = contentRef.current.querySelector(".footer-bottom");
    const socialAnchors = contentRef.current.querySelectorAll(
      ".grid-item:first-child .flex a",
    );
    const listItems = contentRef.current.querySelectorAll(
      ".grid-item:nth-child(2) ul li",
    );
    const contactItems = contentRef.current.querySelectorAll(
      ".grid-item:nth-child(3) ul li",
    );

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 90%",
        end: "bottom bottom",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      contentRef.current,
      { y: 70, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
    );

    if (gridItems) {
      tl.fromTo(
        gridItems,
        { y: 30, opacity: 0, rotationX: -15, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.2,
        },
        "-=0.6",
      );
    }

    if (socialAnchors.length) {
      tl.fromTo(
        socialAnchors,
        { y: 20, opacity: 0, scale: 0.7, rotationZ: -10 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotationZ: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.5)",
          stagger: 0.15,
        },
        "-=0.5",
      );
    }

    if (listItems.length) {
      tl.fromTo(
        listItems,
        { y: 15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.1,
        },
        "-=0.4",
      );
    }

    if (contactItems.length) {
      tl.fromTo(
        contactItems,
        { y: 15, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power3.out",
          stagger: 0.1,
        },
        "-=0.4",
      );
    }

    if (footerBottom) {
      tl.fromTo(
        footerBottom,
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" },
        "-=0.3",
      );
    }
    return () => tl.kill();
  }, []);

  const handleLinkMouseEnter = (index: string) => {
    setHoveredLink(index);
    gsap.to(`.quick-link-${index} .underline`, {
      width: "100%",
      duration: 0.6,
      ease: "power3.out",
    });
  };

  const handleLinkMouseLeave = (index: string) => {
    setHoveredLink(null);
    gsap.to(`.quick-link-${index} .underline`, {
      width: "0%",
      duration: 0.6,
      ease: "power3.out",
    });
  };

  useEffect(() => {
    const socialIcons = document.querySelectorAll(
      ".grid-item:first-child .flex a",
    );

    socialIcons.forEach((icon) => {
      const border = document.createElement("div");
      border.className = `absolute inset-0 border-2 border-dashed border-primary rounded-full opacity-0`;
      icon.appendChild(border);

      let rotationTween: gsap.core.Tween;

      const rotateBorder = () => {
        rotationTween = gsap.to(border, {
          rotation: "+=360",
          duration: 5,
          ease: "none",
          repeat: -1,
        });
      };

      icon.addEventListener("mouseenter", () => {
        gsap.to(border, { opacity: 1, duration: 0.3 });
        gsap.to(icon.querySelector("svg"), { color: "#00ff9f", duration: 0.3 });
        if (rotationTween) {
          rotationTween.resume(1);
        } else {
          rotateBorder();
        }
      });

      icon.addEventListener("mouseleave", () => {
        gsap.to(border, { opacity: 0, duration: 0.3 });
        gsap.to(icon.querySelector("svg"), {
          color: "rgb(156 163 175)",
          duration: 0.3,
        });
        if (rotationTween) {
          rotationTween.pause(0, true);
        }
      });
    });

    return () => {
      const socialIcons = document.querySelectorAll(
        ".grid-item:first-child .flex a",
      );
      socialIcons.forEach((icon) => {
        const border = icon.querySelector(".border-dashed");
        if (border) {
          gsap.killTweensOf(border);
        }
      });
    };
  }, []);

  return (
    <footer
      ref={footerRef}
      className="w-full bg-gray-900/50 backdrop-blur-sm p-8"
    >
      <div ref={contentRef} className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 lg:gap-12">
          <div className="grid-item flex justify-center md:justify-start">
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">
                Connect With Me
              </h2>
              <div className="flex items-center gap-4 relative">
                {SOCIAL_LINKS.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative text-white/70 items-center flex justify-center p-3"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="grid-item flex justify-center">
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">
                Quick Links
              </h2>
              <ul className="space-y-3">
                {QUICK_LINKS.map((link, index) => {
                  const linkIndex = `link-${index}`;
                  return (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className={`quick-link-${linkIndex} relative text-gray-400 overflow-hidden`}
                        onMouseEnter={() => handleLinkMouseEnter(linkIndex)}
                        onMouseLeave={() => handleLinkMouseLeave(linkIndex)}
                      >
                        <span
                          className={`relative z-10 transition-colors duration-500 ease-in-out ${
                            hoveredLink === linkIndex ? "text-primary" : ""
                          }`}
                        >
                          {link.text}
                        </span>
                        <div
                          className={`underline absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-primary to-accent`}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="grid-item flex justify-center md:justify-end">
            <div>
              <h2 className="text-xl font-semibold text-white mb-6">
                Contact Info
              </h2>
              <ul className="space-y-3">
                {CONTACT_INFO.map((item, index) => (
                  <li key={index} className="flex items-center space-x-3 group">
                    {item.icon}
                    <span className="text-white/70  transition-transform duration-300 group-hover:translate-x-1">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-white/70">
            &copy; {currentYear}{" "}
            <span className="text-primary">Sandeep Kumar</span>. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
