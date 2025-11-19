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
  FiTwitter,
} from "react-icons/fi";
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
    icon: <FiGithub className="w-6 h-6" />,
    label: "GitHub",
    link: "https://github.com/MrUnknownji",
  },
  {
    icon: <FiLinkedin className="w-6 h-6" />,
    label: "LinkedIn",
    link: "https://linkedin.com/in/sandeep-kumar-sk1707",
  },
  {
    icon: <FiTwitter className="w-6 h-6" />,
    label: "Twitter",
    link: "https://twitter.com/MrUnknownG786",
  },
] as const;

const ANIMATION_CONFIG = {
  ENTRANCE: {
    DURATION: 0.6,
    EASE: "power2.out",
    Y_OFFSET: 20,
    OPACITY: 0,
    STAGGER: 0.08,
  },
  SOCIAL_ENTRANCE: {
    DURATION: 0.5,
    STAGGER: 0.05,
    SCALE: 0.9,
    OPACITY: 0,
    EASE: "back.out(1.5)",
  },
  SCROLL_TRIGGER: {
    START: "top 85%",
    END: "bottom center",
    TOGGLE_ACTIONS: "play none none none",
  },
} as const;

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

      gsap.set([title, socialTitle], {
        opacity: ANIMATION_CONFIG.ENTRANCE.OPACITY,
        y: ANIMATION_CONFIG.ENTRANCE.Y_OFFSET,
        force3D: true,
        willChange: "transform, opacity",
      });
      gsap.set(infoItems, {
        opacity: ANIMATION_CONFIG.ENTRANCE.OPACITY,
        y: ANIMATION_CONFIG.ENTRANCE.Y_OFFSET,
        force3D: true,
        willChange: "transform, opacity",
      });
      gsap.set(socialIcons, {
        opacity: ANIMATION_CONFIG.SOCIAL_ENTRANCE.OPACITY,
        scale: ANIMATION_CONFIG.SOCIAL_ENTRANCE.SCALE,
        force3D: true,
        willChange: "transform, opacity",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: ANIMATION_CONFIG.SCROLL_TRIGGER.START,
          end: ANIMATION_CONFIG.SCROLL_TRIGGER.END,
          toggleActions: ANIMATION_CONFIG.SCROLL_TRIGGER.TOGGLE_ACTIONS,
          markers: false,
        },
        defaults: {
          force3D: true,
          willChange: "transform, opacity",
        },
      });

      tl.to(title, {
        opacity: 1,
        y: 0,
        duration: ANIMATION_CONFIG.ENTRANCE.DURATION,
        ease: ANIMATION_CONFIG.ENTRANCE.EASE,
        clearProps: "all",
      })
        .to(
          infoItems,
          {
            opacity: 1,
            y: 0,
            duration: ANIMATION_CONFIG.ENTRANCE.DURATION,
            stagger: ANIMATION_CONFIG.ENTRANCE.STAGGER,
            ease: ANIMATION_CONFIG.ENTRANCE.EASE,
            clearProps: "all",
          },
          "-=0.3",
        )
        .to(
          socialTitle,
          {
            opacity: 1,
            y: 0,
            duration: ANIMATION_CONFIG.ENTRANCE.DURATION,
            ease: ANIMATION_CONFIG.ENTRANCE.EASE,
            clearProps: "all",
          },
          "-=0.4",
        )
        .to(
          socialIcons,
          {
            opacity: 1,
            scale: 1,
            duration: ANIMATION_CONFIG.SOCIAL_ENTRANCE.DURATION,
            stagger: ANIMATION_CONFIG.SOCIAL_ENTRANCE.STAGGER,
            ease: ANIMATION_CONFIG.SOCIAL_ENTRANCE.EASE,
            clearProps: "all",
          },
          "-=0.3",
        );
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className="w-full relative h-full flex flex-col justify-between">
      <div className="space-y-8">
        <div>
          <h3 className="contact-title text-3xl font-bold text-light mb-8 tracking-tight">
            Contact Information
          </h3>
          <div className="space-y-6">
            {CONTACT_INFO.map((info) => (
              <div key={info.label} className="info-item">
                <InfoItem {...info} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="social-title text-lg font-semibold text-light/90 mb-5 tracking-wide">
            Connect With Me
          </h4>
          <div className="flex gap-4">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link group w-12 h-12 flex items-center justify-center rounded-xl bg-neutral/10 text-muted
                           border border-neutral/20 backdrop-blur-sm
                           transition-all duration-300 ease-out transform-gpu
                           hover:border-primary/40 hover:bg-primary/10 hover:text-primary hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -left-8 -bottom-8 w-48 h-48 bg-primary/10 rounded-full filter blur-[60px] pointer-events-none -z-10 opacity-50" />
      <div className="absolute -right-8 -top-8 w-48 h-48 bg-accent/10 rounded-full filter blur-[60px] pointer-events-none -z-10 opacity-50" />
    </div>
  );
};

export default ContactInfo;
