import React from "react";
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
  return (
    <div className="w-full relative h-full flex flex-col justify-between gap-10">
      <div className="space-y-8">
        <div>
          <h3 className="contact-title text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            Contact Information
          </h3>
          <div className="space-y-5">
            {CONTACT_INFO.map((info) => (
              <div key={info.label}>
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
                className="social-link group w-12 h-12 flex items-center justify-center rounded-xl
                           bg-[#111] text-muted-foreground border border-white/10
                           transition-[transform,border-color,background-color,color] duration-150 ease-out
                           hover:border-primary/70 hover:text-primary hover:bg-primary/10 hover:-translate-y-0.5"
                aria-label={social.label}
              >
                <div className="transition-transform duration-150 group-hover:scale-105">
                  {social.icon}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
