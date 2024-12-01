"use client";
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

interface FormProps {
  onSubmitSuccess: () => void;
}

const Form: React.FC<FormProps> = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const formRef = useRef<HTMLFormElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const formFields = formRef.current?.querySelectorAll("input, textarea");
    const submitButton = submitButtonRef.current;

    if (formFields && submitButton) {
      const tl = gsap.timeline();

      tl.fromTo(
        Array.from(formFields),
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: "power2.out",
        },
      ).fromTo(
        submitButton,
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
      );
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    gsap.to(submitButtonRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", subject: "", message: "" });
    onSubmitSuccess();
  };

  const inputClassName = `w-full bg-secondary/50 rounded-lg px-4 py-3 text-gray-100
    placeholder:text-gray-500 focus:outline-none border border-primary/10
    focus:border-primary/30 transition-colors duration-300`;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        placeholder="Your Name"
        className={inputClassName}
      />

      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        placeholder="Your Email"
        className={inputClassName}
      />

      <input
        type="text"
        id="subject"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        required
        placeholder="Subject"
        className={inputClassName}
      />

      <textarea
        id="message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        required
        rows={4}
        placeholder="Your Message"
        className={`${inputClassName} resize-none`}
        spellCheck="false"
      />

      <button
        ref={submitButtonRef}
        type="submit"
        className="w-full bg-primary text-secondary font-medium px-6 py-3 rounded-lg
            relative overflow-hidden group hover:ring-2 hover:ring-primary/50
            transition-all duration-300 active:scale-95"
      >
        <span className="relative z-10">Send Message</span>
        <div
          className="absolute inset-0 bg-gradient-to-r from-accent to-primary
            opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </button>
    </form>
  );
};

export default Form;
