"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ICONS } from "@/constants/icons";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    ScrollTrigger.batch(".footer-content > div", {
      start: "top bottom",
      onEnter: (elements) => {
        gsap.to(elements, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          clearProps: "all",
        });
      },
      once: true,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  useEffect(() => {
    gsap.set(".footer-content > div", {
      y: 50,
      opacity: 0,
    });
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative bg-secondary py-16 overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-accent/5 rounded-full" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="footer-content grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="space-y-6">
            <Link
              href="/"
              className="inline-block text-3xl font-bold text-primary hover:text-accent transition-colors duration-300"
            >
              SK
            </Link>
            <p className="text-white/80 leading-relaxed max-w-xs">
              Crafting digital experiences with passion and precision.
              Full-stack developer focused on creating innovative solutions.
            </p>
            <div className="flex space-x-5">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-white/70 hover:text-primary transition-colors duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-primary">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-white/70 hover:text-primary transition-colors duration-300"
                  >
                    <span className="w-1.5 h-1.5 bg-primary mr-3 opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300" />
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-xl font-semibold text-primary">Contact Info</h4>
            <ul className="space-y-4">
              {contactInfo.map((item, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.icon}
                    />
                  </svg>
                  <span className="text-white/70 hover:text-primary transition-colors duration-300">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 text-center">
          <p className="text-white/60">
            © {currentYear} <span className="text-primary">Sandeep Kumar</span>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

const socialLinks = [
  {
    name: "Facebook",
    href: "#",
    icon: ICONS.FACEBOOK,
  },
  {
    name: "Twitter",
    href: "#",
    icon: ICONS.TWITTER,
  },
  {
    name: "LinkedIn",
    href: "#",
    icon: ICONS.LINKEDIN,
  },
  {
    name: "GitHub",
    href: "#",
    icon: ICONS.GITHUB,
  },
];

const quickLinks = [
  { href: "/", text: "Home" },
  { href: "#about", text: "About" },
  { href: "#projects", text: "Projects" },
  { href: "#contact", text: "Contact" },
];

const contactInfo = [
  {
    icon: ICONS.EMAIL,
    text: "example@email.com",
  },
  {
    icon: ICONS.PHONE,
    text: "+1 234 567 890",
  },
  {
    icon: ICONS.LOCATION,
    text: "New York, NY",
  },
];

export default Footer;
