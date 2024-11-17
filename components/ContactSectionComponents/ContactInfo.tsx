import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import InfoItem from "./InfoItem";

const ContactInfo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.5 },
    );
  }, []);

  return (
    <div ref={containerRef} className="flex-1">
      <h3 className="text-accent font-semibold text-xl mb-4">
        Contact Information
      </h3>
      <p className="text-gray-300 mb-6">
        {`Feel free to reach out. I'm always open to discussing new projects,
        creative ideas or opportunities to be part of your visions.`}
      </p>
      <div className="space-y-4">
        <InfoItem icon="email" text="example@email.com" />
        <InfoItem icon="phone" text="+1 234 567 890" />
        <InfoItem icon="location" text="New York, NY" />
      </div>
    </div>
  );
};

export default ContactInfo;
