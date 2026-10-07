"use client";

// The contact form, ported from v2's contactform.js: every field required ("fill in all fields"
// message), a honeypot that silently drops bot submissions, then EmailJS's sendForm with v2's
// IDs, a success message that clears after 5 seconds, and an error message on failure.
//
// Not ported: v2's Apps Script logging (logToSheet). Its URL and token were empty, so it never
// ran; wiring it up needs the Apps Script deploy (task.md backlog, B21).
import { useEffect, useRef, useState, type FormEvent } from "react";

import { important } from "@/lib/site";

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
    <div className="contact__form">
      <p className="contact__form-title" style={{ fontSize: 44, ...important({ color: "#fff" }) }}>
        {accentAt < 0 ? (
          copy.formHeading
        ) : (
          <>
            {copy.formHeading.slice(0, accentAt)}
            <span style={important({ color: "#5B78F6" })}>{copy.formHeadingAccent}</span>
            {copy.formHeading.slice(accentAt + (copy.formHeadingAccent?.length ?? 0))}
          </>
        )}
      </p>
      <form id="contact-form" ref={formRef} onSubmit={onSubmit}>
        <div className="contact__input-div">
          <input
            type="text"
            name="name"
            placeholder={copy.namePlaceholder}
            className="contact__input"
            id="contact-name"
          />
        </div>
        <div className="contact__input-div">
          <input
            type="email"
            name="email"
            placeholder={copy.emailPlaceholder}
            className="contact__input"
            id="contact-email"
          />
        </div>
        <div className="contact__input-div">
          <textarea
            name="message"
            placeholder={copy.messagePlaceholder}
            className="contact__input textarea"
            id="message"
            cols={30}
            rows={10}
          ></textarea>
        </div>
        <p
          className={`contact__message text-sm${status.tone ? ` ${status.tone}` : ""}`}
          id="contact-message"
          aria-live="polite"
        >
          {status.text}
        </p>
        {/* Honeypot: hidden from people, filled in by bots. aria-hidden + tabindex keep it out
            of the accessibility tree. */}
        <div className="hp-field" aria-hidden="true">
          <label htmlFor="contact-honey">{HONEYPOT_LABEL}</label>
          <input type="text" id="contact-honey" name="honey" tabIndex={-1} autoComplete="off" />
        </div>

        <button type="submit" className="button contact__button">
          {copy.submitLabel}
        </button>
      </form>
    </div>
  );
}
