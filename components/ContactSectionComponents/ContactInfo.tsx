import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import InfoItem from "./InfoItem";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

const ContactInfo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const socialLinks = [
    { icon: <FaGithub />, url: "#", label: "GitHub" },
    { icon: <FaLinkedin />, url: "#", label: "LinkedIn" },
    { icon: <FaTwitter />, url: "#", label: "Twitter" },
  ];

  useEffect(() => {
    const title = containerRef.current?.querySelector(".title");
    const description = containerRef.current?.querySelector(".description");
    const infoItems = containerRef.current?.querySelectorAll(".info-item");
    const socialLinks = containerRef.current?.querySelector(".social-links");

    if (title && description && infoItems && socialLinks) {
      const tl = gsap.timeline();

      tl.fromTo(
        title,
        {
          opacity: 0,
          x: -20,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power2.out",
        },
      )
        .fromTo(
          description,
          {
            opacity: 0,
            x: -20,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4",
        )
        .fromTo(
          Array.from(infoItems),
          {
            opacity: 0,
            x: -20,
          },
          {
            opacity: 1,
            x: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4",
        )
        .fromTo(
          socialLinks,
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.4",
        );
    }
  }, []);
  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full justify-between space-y-8"
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
            icon="email"
            text="example@email.com"
            link="mailto:example@email.com"
          />
          <InfoItem icon="phone" text="+1 234 567 890" link="tel:+1234567890" />
          <InfoItem
            icon="location"
            text="New York, NY"
            link="https://maps.google.com"
          />
        </div>
      </div>

      <div className="social-links">
        <h4 className="text-accent font-medium mb-4">Connect with me</h4>
        <div className="flex space-x-4">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-secondary/50 border border-primary/20
                flex items-center justify-center text-primary hover:text-accent
                hover:border-accent/50 hover:scale-110 transform
                [transition:all_0.3s_cubic-bezier(0.4,0,0.2,1)]"
              aria-label={link.label}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 w-full h-1/2
        bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"
      />
    </div>
  );
};

export default ContactInfo;
