import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";

interface FormProps {
  onSubmitSuccess: () => void;
}

const Form: React.FC<FormProps> = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const formElements = Array.from(form.children);

    gsap.fromTo(
      formElements,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      },
    );
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", message: "" });
    onSubmitSuccess();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex-1 space-y-6">
      <div>
        <label htmlFor="name" className="block text-accent mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-accent mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-accent mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={4}
          className="w-full bg-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary transition duration-300"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-primary text-secondary font-semibold px-6 py-3 rounded-lg hover:bg-opacity-90 transition duration-300"
      >
        Send Message
      </button>
    </form>
  );
};

export default Form;
