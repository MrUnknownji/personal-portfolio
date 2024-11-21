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
    const formFields = formRef.current?.querySelectorAll(".form-field");
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

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      <InputWrapper key="name">
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Your Name"
          className="peer w-full bg-secondary/50 rounded-lg px-4 py-3 text-gray-100
              placeholder:text-gray-500 focus:outline-none border border-primary/10
              focus:border-primary/30 transition-colors duration-300 mb-1"
        />
      </InputWrapper>

      <InputWrapper key="email">
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Your Email"
          className="peer w-full bg-secondary/50 rounded-lg px-4 py-3 text-gray-100
              placeholder:text-gray-500 focus:outline-none border border-primary/10
              focus:border-primary/30 transition-colors duration-300 mb-1"
        />
      </InputWrapper>

      <InputWrapper key="subject">
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          placeholder="Subject"
          className="peer w-full bg-secondary/50 rounded-lg px-4 py-3 text-gray-100
              placeholder:text-gray-500 focus:outline-none border border-primary/10
              focus:border-primary/30 transition-colors duration-300 mb-1"
        />
      </InputWrapper>

      <InputWrapper key="message">
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Your Message"
          className="peer w-full bg-secondary/50 rounded-lg px-4 py-3 text-gray-100
              placeholder:text-gray-500 focus:outline-none border border-primary/10
              focus:border-primary/30 transition-colors duration-300 resize-none"
        />
      </InputWrapper>

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

const InputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="form-field relative">
    {children}
    <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-gray-700/50 mt-1">
      <div
        className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent
            transform origin-left scale-x-0 transition-transform duration-300 ease-out
            peer-focus:scale-x-100"
      />
    </div>
  </div>
);

export default Form;
