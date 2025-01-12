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
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

const FOOTER_PADDING_Y: number = 16;
const ANIMATION_INITIAL_Y: number = 20;
const ANIMATION_OPACITY_HIDDEN: number = 0;
const ANIMATION_OPACITY_VISIBLE: number = 1;
const ANIMATION_DURATION: number = 0.6;
const ANIMATION_DELAY_MULTIPLIER: number = 0.1;
const SCROLL_TRIGGER_OFFSET: number = 100;

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const currentYear: number = new Date().getFullYear();

  useEffect(() => {
    if (!footerRef.current) return;

    const elements = footerRef.current.querySelectorAll(".animate-footer");

    elements.forEach((element, index) => {
      gsap.fromTo(
        element,
        {
          opacity: ANIMATION_OPACITY_HIDDEN,
          y: ANIMATION_INITIAL_Y,
        },
        {
          opacity: ANIMATION_OPACITY_VISIBLE,
          y: 0,
          duration: ANIMATION_DURATION,
          delay: index * ANIMATION_DELAY_MULTIPLIER,
          scrollTrigger: {
            trigger: element,
            start: `top bottom-=${SCROLL_TRIGGER_OFFSET}`,
            toggleActions: "play none none reverse",
          },
        },
      );
    });
  }, []);

  return (
    <footer
      ref={footerRef}
      className="w-full bg-gray-900/50 backdrop-blur-sm py-16"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="animate-footer">
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
                  className="text-white/70 hover:text-primary transition-colors duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="animate-footer">
            <h2 className="text-xl font-semibold text-white mb-4">
              Quick Links
            </h2>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-white/70 hover:text-primary transition-colors duration-300"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-footer">
            <h2 className="text-xl font-semibold text-white mb-4">
              Contact Info
            </h2>
            <ul className="space-y-4">
              {CONTACT_INFO.map((item, index) => (
                <li key={index} className="flex items-center space-x-3">
                  {item.icon}
                  <span className="text-white/70 hover:text-primary transition-colors duration-300">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center animate-footer">
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
