"use client";

import { useRef, useState, type FormEvent } from "react";
import { FiSend } from "react-icons/fi";
import {
  CONTACT_FIELD_LIMITS,
  validateContactRequest,
  type ContactFormFields,
} from "@/lib/contactValidation";

type FieldName = "name" | "email" | "message";
type Errors = Partial<Record<FieldName | "form", string>>;

const initialFormValues: ContactFormFields = { name: "", email: "", message: "", company: "" };

const fields: { name: FieldName; label: string; type?: string; autoComplete?: string }[] = [
  { name: "name", label: "Name", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "message", label: "Your Message..." },
];

function Field({
  name,
  label,
  type = "text",
  autoComplete,
  value,
  error,
  disabled,
  onChange,
}: (typeof fields)[number] & {
  value: string;
  error?: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  const id = `contact-${name}`;
  const shared = {
    id,
    name,
    value,
    disabled,
    // A blank placeholder lets CSS float the label while the field has content.
    placeholder: " ",
    maxLength: CONTACT_FIELD_LIMITS[name],
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : undefined,
  };

  return (
    <div className={`contact-field contact-field-${name}`}>
      {name === "message" ? (
        <textarea {...shared} rows={4} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <input
          {...shared}
          type={type}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      <label htmlFor={id}>{label}</label>
      {error && (
        <span id={`${id}-error`} className="contact-field-error">
          {error}
        </span>
      )}
    </div>
  );
}

export default function Form({ onSubmitSuccess }: { onSubmitSuccess: () => void }) {
  const [values, setValues] = useState<ContactFormFields>(initialFormValues);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const update = (name: keyof ContactFormFields, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name as FieldName] || errors.form) {
      setErrors((current) => ({ ...current, [name]: undefined, form: undefined }));
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    const { errors: validationErrors } = validateContactRequest(values);
    setErrors(validationErrors);
    const firstInvalid = fields.find((field) => validationErrors[field.name]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid.name}"]`)?.focus();
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setErrors(
          data.errors || { form: data.message || "Unable to send your message right now." },
        );
        return;
      }
      onSubmitSuccess();
      setValues(initialFormValues);
      setErrors({});
    } catch {
      setErrors({ form: "Unable to send your message right now. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="contact-form" noValidate>
      <input
        type="text"
        name="company"
        value={values.company}
        onChange={(event) => update("company", event.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="sr-only"
        aria-hidden="true"
      />
      <div className="contact-form-row">
        {fields.slice(0, 2).map((field) => (
          <Field
            key={field.name}
            {...field}
            value={values[field.name]}
            error={errors[field.name]}
            disabled={isSubmitting}
            onChange={(value) => update(field.name, value)}
          />
        ))}
      </div>
      <Field
        {...fields[2]}
        value={values.message}
        error={errors.message}
        disabled={isSubmitting}
        onChange={(value) => update("message", value)}
      />
      {errors.form && (
        <p className="contact-form-error" role="alert">
          {errors.form}
        </p>
      )}
      <button type="submit" className="contact-submit" disabled={isSubmitting}>
        <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
        <FiSend aria-hidden="true" />
      </button>
    </form>
  );
}
