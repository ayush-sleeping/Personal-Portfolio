// Contact: v2's contact.html, from the sheet (profile, pages/contact, faqs, socials): the
// "Get in touch_" block, the form, then the FAQ accordion. The FAQPage JSON-LD v2 injected from
// faq-render.js is Phase 8 (SEO).
import ContactForm from "@/components/client/ContactForm";
import FaqAccordion from "@/components/client/FaqAccordion";
import { CardBg } from "@/components/cards/CardParts";
import { getFaqs, getPageCopy, getProfile, getSocials } from "@/lib/data";
import { important, inlineHtml } from "@/lib/site";

// Which socials v2's contact block showed, in its order, with its Remix icons (T10: icon
// classes stay in code). The hrefs come from the sheet.
const CONTACT_SOCIAL_ICONS: Record<string, string> = {
  github: "ri-github-fill",
  linkedin: "ri-linkedin-box-fill",
  twitter: "ri-twitter-line",
};

const container = {
  className: "container max-w-7xl pb-12 mb-12",
  style: important({ paddingTop: "10px", paddingBottom: "10px" }),
};
const white = important({ color: "#fff" });

export default function ContactSection() {
  const profile = getProfile();
  const copy = getPageCopy("contact");
  const socials = getSocials();
  const contactSocials = Object.keys(CONTACT_SOCIAL_ICONS)
    .map((id) => socials.find((s) => s.id === id))
    .filter((s) => s !== undefined);

  return (
    <section id="contact">
      <div {...container}>
        <div className="row g-4 mt-3">
          <div className="col-lg-4 col-12">
            <div
              className="primary-card"
              style={important({
                padding: "25px 25px 25px 25px",
                background: "none",
                boxShadow: "none",
              })}
            >
              <div className="home__data" style={important({ marginTop: "0px" })}>
                <div className="home__data">
                  <h1 className="home__name">
                    <span>{copy.heading}</span>
                  </h1>
                  <p className="home__work">{copy.subheading}</p>
                  <h2 className="home__name mt-5">{copy.get_in_touch_label}</h2>
                  {/* TODO(sheet): page_contact.email_label, location_label (v2: "Email :",
                      "Location :") */}
                  <p className="home__work mt-4">
                    {copy.email_label && <span style={white}>{copy.email_label} </span>}
                    {profile.email}
                  </p>
                  <p className="home__work">
                    {copy.location_label && <span style={white}>{copy.location_label} </span>}
                    {profile.location}
                  </p>
                </div>
                <div className="home__socials  d-flex justify-content-center">
                  {contactSocials.map((s) => (
                    <a
                      key={s.id}
                      href={s.href}
                      target="_blank"
                      rel="noopener"
                      className="home__social-link"
                      aria-label={s.label}
                    >
                      <i className={CONTACT_SOCIAL_ICONS[s.id]} aria-hidden="true"></i>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8 col-12">
            <div
              className="primary-card credentials-card about-exp"
              style={important({ padding: "25px 25px" })}
            >
              <CardBg />
              {/* TODO(sheet): page_contact.status_initial, msg_missing, msg_sent, msg_error */}
              <ContactForm
                copy={{
                  formHeading: copy.form_heading,
                  formHeadingAccent: copy.form_heading_accent,
                  namePlaceholder: copy.name_placeholder,
                  emailPlaceholder: copy.email_placeholder,
                  messagePlaceholder: copy.message_placeholder,
                  submitLabel: copy.submit_label,
                  statusInitial: copy.status_initial,
                  msgMissing: copy.msg_missing,
                  msgSent: copy.msg_sent,
                  msgError: copy.msg_error,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ. */}
      <div {...container}>
        <div className="row g-4">
          <div className="col-lg-4 col-12">
            <div className="text-center mb-5">
              <h2 className="section-heading mb-3">{copy.faq_heading}</h2>
              {/* TODO(sheet): page_contact.faq_intro_lead, faq_intro (v2: "Got questions?" in
                  white, then the intro in the brand colour) */}
              {(copy.faq_intro_lead || copy.faq_intro) && (
                <p
                  className="mx-auto"
                  style={{ maxWidth: 600, ...important({ color: "#5B78F6" }) }}
                >
                  {copy.faq_intro_lead && <span style={white}>{copy.faq_intro_lead} </span>}
                  {copy.faq_intro}
                </p>
              )}
            </div>
          </div>

          <div className="col-lg-8 col-12">
            <div className="faq-container">
              {getFaqs().map((f, i) => {
                const id = `faq${i + 1}`;
                return (
                  <div key={f.id} className="primary-card faq-item mb-3">
                    <div
                      className="faq-question"
                      data-bs-toggle="collapse"
                      data-bs-target={`#${id}`}
                      aria-expanded="false"
                    >
                      <h5 className="mb-0 faq-question-text">
                        {f.question}{" "}
                        <i className="fas fa-chevron-down faq-icon" aria-hidden="true"></i>
                      </h5>
                    </div>
                    <div id={id} className="collapse faq-answer">
                      <div className="faq-answer-content">
                        {/* Sheet answers may carry <strong>/<em>/<br>; nothing else gets through. */}
                        <p dangerouslySetInnerHTML={{ __html: inlineHtml(f.answer) }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <FaqAccordion />
    </section>
  );
}
