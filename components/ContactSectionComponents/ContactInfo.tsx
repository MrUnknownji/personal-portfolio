"use client";
import React from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiGithub,
  FiLinkedin,
  FiTwitter,
} from "react-icons/fi";
import InfoItem from "./InfoItem";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/data/contact";

const socialIcons: { [key: string]: React.ReactElement } = {
  GitHub: <FiGithub className="w-6 h-6" />,
  LinkedIn: <FiLinkedin className="w-6 h-6" />,
  Twitter: <FiTwitter className="w-6 h-6" />,
};

const contactIcons: { [key: string]: React.ReactElement } = {
  Email: <FiMail className="w-5 h-5" />,
  Phone: <FiPhone className="w-5 h-5" />,
  Location: <FiMapPin className="w-5 h-5" />,
};

const ContactInfo = () => {
  return (
    <div className="w-full relative">
      <div className="space-y-8 md:space-y-10">
        <div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
            Contact Information
          </h3>
          <div className="space-y-4">
            {CONTACT_INFO.map((info) => (
              <InfoItem
                key={info.label}
                icon={contactIcons[info.icon]}
                {...info}
              />
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-light mb-4">
            Connect With Me
          </h4>
          <div className="flex gap-4">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-12 h-12 flex items-center justify-center rounded-lg bg-neutral/50 text-muted
                           border border-transparent hover:border-primary/30
                           transition-all duration-300 ease-out transform-gpu
                           hover:bg-neutral/70 hover:text-primary hover:-translate-y-1"
                aria-label={social.label}
              >
                {socialIcons[social.label]}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -left-8 -bottom-8 w-48 h-48 bg-primary/5 rounded-full filter blur-3xl pointer-events-none -z-10" />
      <div className="absolute -right-8 -top-8 w-48 h-48 bg-accent/5 rounded-full filter blur-3xl pointer-events-none -z-10" />
    </div>
  );
};

export default ContactInfo;
