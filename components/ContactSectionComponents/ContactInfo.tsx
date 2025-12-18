"use client";
import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiGithub,
  FiLinkedin,
} from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import InfoItem from "./InfoItem";

const CONTACT_INFO = [
  {
    icon: <FiMail className="w-5 h-5" />,
    label: "Email",
    value: "sandeepkhati788@gmail.com",
    link: "mailto:sandeepkhati788@gmail.com",
  },
  {
    icon: <FiPhone className="w-5 h-5" />,
    label: "Phone",
    value: "+91 9878692682",
    link: "tel:+919878692682",
  },
  {
    icon: <FiMapPin className="w-5 h-5" />,
    label: "Location",
    value: "Punjab, India",
    link: "https://maps.google.com/?q=Punjab,India",
  },
] as const;

const SOCIAL_LINKS = [
  {
    icon: <FiGithub className="w-5 h-5" />,
    label: "GitHub",
    link: "https://github.com/MrUnknownji",
  },
  {
    icon: <FiLinkedin className="w-5 h-5" />,
    label: "LinkedIn",
    link: "https://linkedin.com/in/sandeep-kumar-sk1707",
  },
  {
    icon: <FaXTwitter className="w-5 h-5" />,
    label: "X",
    link: "https://twitter.com/MrUnknownG786",
  },
] as const;

const ContactInfo = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const title = containerRef.current?.querySelector(".contact-title");
      const infoItems = gsap.utils.toArray<HTMLElement>(
        containerRef.current?.querySelectorAll(".info-item") ?? [],
      );
      const socialTitle = containerRef.current?.querySelector(".social-title");
      const socialIcons = gsap.utils.toArray<HTMLElement>(
        containerRef.current?.querySelectorAll(".social-link") ?? [],
      );

      if (
        !title ||
        infoItems.length === 0 ||
        !socialTitle ||
        socialIcons.length === 0
      )
        return;

      // Initial States
      gsap.set([title, socialTitle], { opacity: 0, y: 20 });
      gsap.set(infoItems, { opacity: 0, x: -20 });
      gsap.set(socialIcons, { opacity: 0, scale: 0.8 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(title, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      })
        .to(
          infoItems,
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.2"
        )
        .to(
          socialTitle,
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.2"
        )
        .to(
          socialIcons,
          {
            opacity: 1,
            scale: 1,
            duration: 0.4,
            stagger: 0.08,
            ease: "back.out(1.5)",
          },
          "-=0.2"
        );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="w-full relative h-full flex flex-col justify-between gap-10">
      <div className="space-y-8">
        <div>
          <h3 className="contact-title text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            Contact Information
          </h3>
          <div className="space-y-5">
            {CONTACT_INFO.map((info) => (
              <div key={info.label} className="info-item">
                <InfoItem {...info} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="social-title text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
            Connect With Me
          </h4>
          <div className="flex gap-3">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link w-11 h-11 flex items-center justify-center rounded-xl 
                           bg-foreground/5 text-muted-foreground border border-border
                           transition-all duration-200 ease-out
                           hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
