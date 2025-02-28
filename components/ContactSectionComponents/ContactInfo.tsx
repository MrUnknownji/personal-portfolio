import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiGithub,
  FiLinkedin,
  FiTwitter
} from "react-icons/fi";
import InfoItem from "./InfoItem";

const CONTACT_INFO = [
  {
    icon: <FiMail className="w-5 h-5" />,
    label: "Email",
    value: "contact@example.com",
    link: "mailto:contact@example.com"
  },
  {
    icon: <FiPhone className="w-5 h-5" />,
    label: "Phone",
    value: "+1 (234) 567-8900",
    link: "tel:+12345678900"
  },
  {
    icon: <FiMapPin className="w-5 h-5" />,
    label: "Location",
    value: "New York, NY",
    link: "https://maps.google.com"
  }
] as const;

const SOCIAL_LINKS = [
  {
    icon: <FiGithub className="w-6 h-6" />,
    label: "GitHub",
    link: "https://github.com/yourusername"
  },
  {
    icon: <FiLinkedin className="w-6 h-6" />,
    label: "LinkedIn",
    link: "https://linkedin.com/in/yourusername"
  },
  {
    icon: <FiTwitter className="w-6 h-6" />,
    label: "Twitter",
    link: "https://twitter.com/yourusername"
  }
] as const;

const ANIMATION_CONFIG = {
  CONTAINER: {
    DURATION: 0.8,
    EASE: "power3.out",
    Y_OFFSET: 30,
    OPACITY: 0
  },
  ITEMS: {
    DURATION: 0.6,
    STAGGER: 0.1,
    Y_OFFSET: 20,
    OPACITY: 0,
    EASE: "power2.out"
  },
  SOCIAL: {
    DURATION: 0.5,
    STAGGER: 0.1,
    SCALE: 0.8,
    OPACITY: 0,
    EASE: "back.out(1.7)"
  },
  HOVER: {
    DURATION: 0.3,
    SCALE: 1.1,
    Y_OFFSET: -2,
    EASE: "power2.out"
  }
} as const;

const ContactInfo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const socialRef = useRef<HTMLDivElement>(null);
  const socialItemsRef = useRef<HTMLAnchorElement[]>([]);

  useGSAP(() => {
    if (!containerRef.current || !socialRef.current) return;

    const tl = gsap.timeline();

    tl.fromTo(
      containerRef.current,
      {
        y: ANIMATION_CONFIG.CONTAINER.Y_OFFSET,
        opacity: ANIMATION_CONFIG.CONTAINER.OPACITY
      },
      {
        y: 0,
        opacity: 1,
        duration: ANIMATION_CONFIG.CONTAINER.DURATION,
        ease: ANIMATION_CONFIG.CONTAINER.EASE
      }
    )
    .fromTo(
      itemsRef.current,
      {
        y: ANIMATION_CONFIG.ITEMS.Y_OFFSET,
        opacity: ANIMATION_CONFIG.ITEMS.OPACITY
      },
      {
        y: 0,
        opacity: 1,
        duration: ANIMATION_CONFIG.ITEMS.DURATION,
        stagger: ANIMATION_CONFIG.ITEMS.STAGGER,
        ease: ANIMATION_CONFIG.ITEMS.EASE,
        clearProps: "transform"
      }
    )
    .fromTo(
      socialItemsRef.current,
      {
        scale: ANIMATION_CONFIG.SOCIAL.SCALE,
        opacity: ANIMATION_CONFIG.SOCIAL.OPACITY
      },
      {
        scale: 1,
        opacity: 1,
        duration: ANIMATION_CONFIG.SOCIAL.DURATION,
        stagger: ANIMATION_CONFIG.SOCIAL.STAGGER,
        ease: ANIMATION_CONFIG.SOCIAL.EASE,
        clearProps: "transform"
      }
    );
  }, []);

  return (
    <div ref={containerRef} className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
          Contact Information
        </h3>
        <div className="space-y-6">
          {CONTACT_INFO.map((info, index) => (
            <div
              key={info.label}
              ref={el => {
                if (el) itemsRef.current[index] = el;
              }}
              className="transform-gpu"
            >
              <InfoItem {...info} />
            </div>
          ))}
        </div>
      </div>

      <div ref={socialRef}>
        <h4 className="text-lg font-semibold text-gray-200 mb-4">
          Connect With Me
        </h4>
        <div className="flex gap-4">
          {SOCIAL_LINKS.map((social, index) => (
            <a
              key={social.label}
              ref={el => {
                if (el) socialItemsRef.current[index] = el;
              }}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-800/50 text-gray-400 hover:text-primary transition-colors duration-300 transform-gpu"
              aria-label={social.label}
              onMouseEnter={e => {
                gsap.to(e.currentTarget, {
                  scale: ANIMATION_CONFIG.HOVER.SCALE,
                  y: ANIMATION_CONFIG.HOVER.Y_OFFSET,
                  duration: ANIMATION_CONFIG.HOVER.DURATION,
                  ease: ANIMATION_CONFIG.HOVER.EASE
                });
              }}
              onMouseLeave={e => {
                gsap.to(e.currentTarget, {
                  scale: 1,
                  y: 0,
                  duration: ANIMATION_CONFIG.HOVER.DURATION,
                  ease: ANIMATION_CONFIG.HOVER.EASE
                });
              }}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>

      <div className="absolute -left-4 -bottom-4 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute -right-4 -top-4 w-64 h-64 bg-accent/5 rounded-full filter blur-3xl pointer-events-none" />
    </div>
  );
};

export default ContactInfo;
