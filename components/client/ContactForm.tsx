"use client";

// The contact form in the v4 design's card, with v2's behaviour kept (contactform.js): every
// field required ("fill in all fields"), a honeypot that silently drops bot submissions, then
// EmailJS's sendForm with v2's IDs, a success message that clears after 5 seconds, and an error
// message on failure.
//
// Not ported: v2's Apps Script logging (logToSheet). Its URL and token were empty, so it never
// ran; wiring it up needs the Apps Script deploy (task.md backlog, B21).
import { useEffect, useRef, useState, type FormEvent } from "react";

// EmailJS identifiers, exactly as v2 used them. They are public by design: EmailJS sends from
// the browser, and the public key only works from the allowed origins set in EmailJS.
const EMAILJS = {
  serviceId: "service_g3vv0sw",
  templateId: "template_wg7j2k6",
  publicKey: "0Vtn0gI9c1Ks3SZnC",
};

// The honeypot's label is code, not content (task.md T12): only bots ever see it.
const HONEYPOT_LABEL = "Leave this field empty";

interface EmailJs {
  sendForm(
    serviceId: string,
    templateId: string,
    form: HTMLFormElement,
    key: string,
  ): Promise<unknown>;
}

export interface ContactFormCopy {
  formHeading: string;
  formHeadingAccent?: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  submitLabel: string;
  statusInitial?: string;
  msgMissing?: string;
  msgSent?: string;
  msgError?: string;
}

type Status = { text?: string; tone?: "color-light" | "color-dark" };

export default function ContactForm({ copy }: Readonly<{ copy: ContactFormCopy }>) {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>({ text: copy.statusInitial });
  const clearTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(clearTimer.current), []);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const value = (name: string) => (form.elements.namedItem(name) as HTMLInputElement).value;

    if (value("name") === "" || value("email") === "" || value("message") === "") {
      setStatus({ text: copy.msgMissing, tone: "color-dark" });
      return;
    }
    // Honeypot: hidden from real visitors, filled in by naive bots.
    if (value("honey") !== "") return;

    const emailjs = (window as unknown as { emailjs?: EmailJs }).emailjs;
    const sent = emailjs
      ? emailjs.sendForm(EMAILJS.serviceId, EMAILJS.templateId, form, EMAILJS.publicKey)
      : Promise.reject(new Error("EmailJS not loaded"));
    sent.then(
      () => {
        setStatus({ text: copy.msgSent, tone: "color-light" });
        window.clearTimeout(clearTimer.current);
        clearTimer.current = window.setTimeout(() => setStatus((s) => ({ ...s, text: "" })), 5000);
        formRef.current?.reset();
      },
      (error: unknown) => {
        console.error("Error sending email:", error);
        setStatus({ text: copy.msgError, tone: "color-dark" });
      },
    );
  };

  const accentAt = copy.formHeadingAccent ? copy.formHeading.indexOf(copy.formHeadingAccent) : -1;

  return (
    <div className="v4-panel v4-form-card">
      <p className="v4-form-title">
        {accentAt < 0 ? (
          copy.formHeading
        ) : (
          <>
            {copy.formHeading.slice(0, accentAt)}
            <span className="v4-accent">{copy.formHeadingAccent}</span>
            {copy.formHeading.slice(accentAt + (copy.formHeadingAccent?.length ?? 0))}
          </>
        )}
      </p>
      <form id="contact-form" ref={formRef} onSubmit={onSubmit} className="v4-form">
        <div className="v4-form-grid">
          <label className="v4-field">
            <span className="v4-field-label">Name</span>
            <input
              data-input=""
              type="text"
              name="name"
              id="contact-name"
              placeholder={copy.namePlaceholder}
              className="v4-input"
            />
          </label>
          <label className="v4-field">
            <span className="v4-field-label">Email</span>
            <input
              data-input=""
              type="email"
              name="email"
              id="contact-email"
              placeholder={copy.emailPlaceholder}
              className="v4-input"
            />
          </label>
        </div>
        <label className="v4-field">
          <span className="v4-field-label">Message</span>
          <textarea
            data-input=""
            name="message"
            id="message"
            placeholder={copy.messagePlaceholder}
            rows={6}
            className="v4-input v4-textarea"
          ></textarea>
        </label>
        {/* Honeypot: hidden from people, filled in by bots. */}
        <div className="v4-hp" aria-hidden="true">
          <label htmlFor="contact-honey">{HONEYPOT_LABEL}</label>
          <input type="text" id="contact-honey" name="honey" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="v4-form-foot">
          <span
            id="contact-message"
            aria-live="polite"
            className={`v4-status${status.tone ? ` ${status.tone}` : ""}`}
          >
            {status.text}
          </span>
          <button type="submit" className="v4-btn v4-submit">
            {copy.submitLabel} <i className="fa-solid fa-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      </form>
    </div>
  );
}
