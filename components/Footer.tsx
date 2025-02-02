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
import { useRef } from "react";
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
  const currentYear: number = new Date().getFullYear();

  useGSAP(() => {
    if (contentRef.current && footerRef.current) {
      const gridContainer = contentRef.current.querySelector(".grid");
      const gridItems = gridContainer
        ? gridContainer.querySelectorAll(".grid-item")
        : null;
      const footerBottom = contentRef.current.querySelector(".footer-bottom");
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 80%",
          end: "bottom bottom",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(contentRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      });

      if (gridItems) {
        tl.from(
          gridItems,
          {
            y: 20,
            opacity: 0,
            rotation: -2,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.2,
          },
          "-=0.5"
        );
      }

      const socialAnchors = contentRef.current.querySelectorAll(
        ".grid-item:first-child .flex a"
      );
      if (socialAnchors.length) {
        tl.from(
          socialAnchors,
          {
            y: 10,
            opacity: 0,
            scale: 0.9,
            duration: 0.6,
            ease: "back.out(1.7)",
            stagger: 0.1,
          },
          "-=0.5"
        );
      }

      const listItems = contentRef.current.querySelectorAll(".grid-item ul li");
      if (listItems.length) {
        tl.from(
          listItems,
          {
            y: 10,
            opacity: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
            stagger: 0.1,
          },
          "-=0.3"
        );
      }

      if (footerBottom) {
        tl.from(
          footerBottom,
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4"
        );
      }
    }
  }, []);

  return (
    <footer
      ref={footerRef}
      className="w-full bg-gray-900/50 backdrop-blur-sm py-16"
    >
      <div ref={contentRef} className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="grid-item">
            <h2 className="text-xl font-semibold text-white mb-4">
              Connect With Me
            </h2>
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-primary"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="grid-item">
            <h2 className="text-xl font-semibold text-white mb-4">
              Quick Links
            </h2>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-primary"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid-item">
            <h2 className="text-xl font-semibold text-white mb-4">
              Contact Info
            </h2>
            <ul className="space-y-4">
              {CONTACT_INFO.map((item, index) => (
                <li key={index} className="flex items-center space-x-3">
                  {item.icon}
                  <span className="text-white/70 hover:text-primary">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-white/60">
            {currentYear} <span className="text-primary">Sandeep Kumar</span>.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
