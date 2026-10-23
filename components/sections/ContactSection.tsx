// Contact (design: #contact): heading, blurb and the contact rows on the left, the form card on
// the right. Email and location from the profile; the three profiles from socials.
import ContactForm from "@/components/client/ContactForm";
import { getPageCopy, getProfile, getSocials } from "@/lib/data";

const SOCIAL_ICONS: Record<string, string> = {
  github: "fab fa-github",
  linkedin: "fab fa-linkedin-in",
  twitter: "fab fa-twitter",
};
const handle = (href: string) => href.replace(/\/$/, "").split("/").pop() ?? "";
const shown = (id: string, href: string) =>
  id === "twitter"
    ? `@${handle(href)}`
    : href.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

export default function ContactSection() {
  const profile = getProfile();
  const copy = getPageCopy("contact");
  const socials = getSocials();
  const items = [
    {
      label: "Email",
      value: profile.email,
      icon: "fa-solid fa-envelope",
      href: `mailto:${profile.email}`,
      target: "_self",
    },
    {
      label: "Location",
      value: profile.location,
      icon: "fa-solid fa-location-dot",
      href: "#contact",
      target: "_self",
    },
    ...Object.keys(SOCIAL_ICONS)
      .map((id) => socials.find((s) => s.id === id))
      .filter((s) => s !== undefined)
      .map((s) => ({
        label: s.label,
        value: shown(s.id, s.href),
        icon: SOCIAL_ICONS[s.id],
        href: s.href,
        target: "_blank",
      })),
  ];

  return (
    <section id="contact" data-screen-label="Contact">
      <div data-doc="" className="v4-doc">
        <div className="v4-sec">
          <div data-contact="" className="v4-contact">
            <div className="v4-col-28">
              <div className="v4-sec-text">
                <h2 data-h2="" className="v4-sec-title">
                  {copy.heading}
                </h2>
                <p className="v4-sec-intro">{copy.subheading}</p>
              </div>
              <div className="v4-contact-list">
                {items.map((c) => (
                  <a
                    href={c.href}
                    target={c.target}
                    rel="noopener"
                    className="v4-item"
                    key={c.label}
                  >
                    <span className="v4-icon-box">
                      <i className={c.icon} aria-hidden="true"></i>
                    </span>
                    <div>
                      <h3 className="v4-item-title">{c.label}</h3>
                      <p className="v4-item-text">{c.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
            <ContactForm
              copy={{
                formHeading: copy.form_heading,
                formHeadingAccent: copy.form_heading_accent,
                namePlaceholder: copy.name_placeholder,
                emailPlaceholder: copy.email_placeholder,
                messagePlaceholder: copy.message_placeholder,
                submitLabel: "Send message",
                statusInitial: "",
                msgMissing: copy.msg_missing,
                msgSent: copy.msg_sent,
                msgError: copy.msg_error,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
