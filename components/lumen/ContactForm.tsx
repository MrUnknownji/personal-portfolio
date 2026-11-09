"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  CONTACT_FIELD_LIMITS,
  validateContactRequest,
  type ContactFormFields,
} from "@/lib/contactValidation";
import { animate, Spring } from "@/lib/lumen/springs";
import { SoftLayers, softStyle } from "./Soft";
import { haptic, tone } from "./feedback";

type FieldName = "name" | "email" | "message";
type Errors = Partial<Record<FieldName | "form", string>>;
const empty: ContactFormFields = { name: "", email: "", message: "", company: "" };
const fields: { name: FieldName; label: string; type?: string; autoComplete?: string }[] = [
  { name: "name", label: "Name", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "message", label: "Message" },
];

/** The note form. On success the same sheet grows into the confirmation; it isn't swapped. */
export default function ContactForm({ email }: { email: string }) {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const sheet = useRef<HTMLDivElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const done = useRef<HTMLDivElement>(null);
  const height = useRef<Spring | null>(null);

  // Morph the sheet's height between the form and the confirmation on the morph spring.
  useEffect(() => {
    const el = sheet.current;
    const next = sent ? done.current : form.current;
    if (!el || !next) return;
    const target = next.offsetHeight;
    if (!height.current) {
      height.current = new Spring(target, "morph", 0.5);
      return;
    }
    const spring = height.current;
    spring.target = target;
    el.style.height = `${spring.x}px`;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stop = animate((dt) => {
      spring.step(dt, reduced);
      if (spring.resting) {
        spring.jump(spring.target);
        el.style.height = "";
        return false;
      }
      el.style.height = `${spring.x.toFixed(1)}px`;
      return true;
    });
    (sent ? done.current : form.current)?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    return () => {
      stop();
    };
  }, [sent]);

  const update = (name: keyof ContactFormFields, value: string) => {
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name as FieldName] || errors.form)
      setErrors((current) => ({ ...current, [name]: undefined, form: undefined }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (sending) return;
    const { errors: found } = validateContactRequest(values);
    setErrors(found);
    const first = fields.find((field) => found[field.name]);
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first.name}"]`)?.focus();
      tone("drift", 0.6);
      return;
    }
    setSending(true);
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
      if (height.current && sheet.current) height.current.jump(sheet.current.offsetHeight);
      setSent(true);
      setValues(empty);
      setErrors({});
      tone("snap");
      haptic(10);
    } catch {
      setErrors({ form: "Unable to send your message right now. Please try again." });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="ld-form-sheet ld-soft" style={softStyle("sheet")} ref={sheet} data-sent={sent}>
      <SoftLayers />
      {!sent ? (
        <form ref={form} onSubmit={submit} noValidate className="ld-form">
          <input
            type="text"
            name="company"
            value={values.company}
            onChange={(event) => update("company", event.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="ld-sr-only"
            aria-hidden="true"
          />
          {fields.map((field) => {
            const id = `ld-contact-${field.name}`;
            const shared = {
              id,
              name: field.name,
              value: values[field.name],
              disabled: sending,
              maxLength: CONTACT_FIELD_LIMITS[field.name],
              "aria-invalid": Boolean(errors[field.name]),
              "aria-describedby": errors[field.name] ? `${id}-error` : undefined,
            };
            return (
              <div className={`ld-field-input ld-field-${field.name}`} key={field.name}>
                <label htmlFor={id} className="ld-anno">
                  {field.label}
                </label>
                {field.name === "message" ? (
                  <textarea
                    {...shared}
                    rows={5}
                    onChange={(event) => update(field.name, event.target.value)}
                  />
                ) : (
                  <input
                    {...shared}
                    type={field.type ?? "text"}
                    autoComplete={field.autoComplete}
                    onChange={(event) => update(field.name, event.target.value)}
                  />
                )}
                {errors[field.name] && (
                  <span id={`${id}-error`} className="ld-field-error">
                    {errors[field.name]}
                  </span>
                )}
              </div>
            );
          })}
          {errors.form && (
            <p className="ld-field-error" role="alert">
              {errors.form}
            </p>
          )}
          <button
            type="submit"
            className="ld-key ld-soft ld-key-signal"
            style={softStyle("signal")}
            disabled={sending}
          >
            <SoftLayers />
            <span>{sending ? "Sending…" : "Send note"}</span>
          </button>
        </form>
      ) : (
        <div ref={done} className="ld-form-done" role="status">
          <span className="ld-anno">Received</span>
          <h3 tabIndex={-1} data-autofocus>
            Thanks. Your note is in.
          </h3>
          <p>
            I&apos;ll take it from here. Thanks for reaching out. You can also write to me directly
            at <strong>{email}</strong>.
          </p>
          <button type="button" className="ld-textbtn" onClick={() => setSent(false)}>
            Write another note
          </button>
        </div>
      )}
    </div>
  );
}
