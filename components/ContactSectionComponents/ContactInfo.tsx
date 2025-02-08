import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import InfoItem from "./InfoItem";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const ContactInfo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const SOCIAL_LINKS = [
    { icon: <FaGithub />, url: "#", label: "GitHub" },
    { icon: <FaLinkedin />, url: "#", label: "LinkedIn" },
    { icon: <FaTwitter />, url: "#", label: "Twitter" },
  ];

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const title = containerRef.current.querySelector(".title");
      const description = containerRef.current.querySelector(".description");
      const infoItems = containerRef.current.querySelectorAll(".info-item");
      const socialLinks = containerRef.current.querySelector(".social-links");
      const socialIcons =
        containerRef.current.querySelectorAll(".social-links a");

      const tl = gsap.timeline();
      tl.addLabel("start");

      if (title) {
        tl.fromTo(
          title,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
          "start",
        );
      }
      if (description) {
        tl.fromTo(
          description,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" },
          "start+=0.2",
        );
      }

      if (infoItems) {
        tl.fromTo(
          Array.from(infoItems),
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.15,
            duration: 0.6,
            ease: "power2.out",
          },
          "start+=0.4",
        );
      }

      if (socialLinks) {
        tl.fromTo(
          socialLinks,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "start+=0.7",
        );
      }

      return () => tl.kill();
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full justify-between space-y-8 contact-info"
    >
      <div className="space-y-6">
        <div>
          <h3 className="title text-2xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Contact Information
          </h3>
          <p className="description text-gray-300 leading-relaxed">
            {`Feel free to reach out. I'm always open to discussing new projects,
            creative ideas or opportunities to be part of your visions.`}
          </p>
        </div>

        <div className="space-y-6">
          <InfoItem
            type="email"
            title="example@email.com"
            value="mailto:example@email.com"
          />
          <InfoItem
            type="phone"
            title="+1 234 567 890"
            value="tel:+1234567890"
          />
          <InfoItem
            type="location"
            title="New York, NY"
            value="https://maps.google.com"
          />
        </div>
      </div>

      <div className="social-links">
        <h4 className="text-accent font-medium mb-4">Connect with me</h4>
        <div className="flex space-x-4">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-secondary/50 border border-primary/20
                flex items-center justify-center text-primary hover:text-accent
                hover:border-accent/50 hover:scale-110 transform
                transition-transform duration-300"
              aria-label={link.label}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
