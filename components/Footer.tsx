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
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
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

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const currentYear: number = new Date().getFullYear();

  useGSAP(() => {
    if (contentRef.current && footerRef.current) {
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top bottom",
        end: "bottom bottom",
        scrub: 0.5,
        markers: true,
        onUpdate: (self) => {
          gsap.set(contentRef.current, {
            y: self.progress * -50,
            opacity: 1 - self.progress * 0.5,
          });
        },
      });

      ScrollTrigger.refresh();
    }
  }, []);

  return (
    <footer
      ref={footerRef}
      className="w-full bg-gray-900/50 backdrop-blur-sm py-16"
    >
      <div ref={contentRef} className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
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

          <div>
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

          <div>
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

        <div className="mt-16 pt-8 border-t border-white/10 text-center">
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
