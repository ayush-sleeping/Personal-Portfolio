// About: v2's about.html, from the sheet (profile, pages/about, experience, education,
// certifications, skills, socials). The link cards v2 repeated down the right column
// (Credentials, Projects, GitHub, Profiles, CTA) are left out: they show once, in Home (T3).
// The Resume merge is Phase 3b.
import { Fragment } from "react";

import { ArrowIcon, Breaks, CardBg } from "@/components/cards/CardParts";
import CertificationCarousel from "@/components/cards/CertificationCarousel";
import SkillsBlock from "@/components/cards/SkillsBlock";
import TimelineItem from "@/components/cards/TimelineItem";
import {
  getCertifications,
  getEducation,
  getExperience,
  getPageCopy,
  getProfile,
  getSkills,
  getSocials,
  splitPairs,
} from "@/lib/data";
import type { TimelineEntry } from "@/lib/types";
import { GRIDX, important, pictureSources, sectionHref } from "@/lib/site";

const padded = important({ padding: "25px 25px" });

/** The why-hire title with its highlighted phrase (v2: "Why should we <span>hire you</span> ?"). */
function WhyHireLabel({ text, highlight }: Readonly<{ text: string; highlight?: string }>) {
  const at = highlight ? text.indexOf(highlight) : -1;
  if (!highlight || at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="why-hire-highlight">{highlight}</span>
      {text.slice(at + highlight.length)}
    </>
  );
}

function TimelineCard({
  heading,
  entries,
}: Readonly<{ heading: string; entries: TimelineEntry[] }>) {
  return (
    <div className="col-lg-12 col-12 mt-4">
      <div className="primary-card credentials-card about-exp" style={padded}>
        <div className="d-flex align-items-start justify-content-between">
          <div className="infos w-100">
            <h4 style={{ marginBottom: 30 }}>{heading}</h4>
            <div className="timeline-container">
              {entries.map((entry) => (
                <TimelineItem key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AboutSection() {
  const profile = getProfile();
  const copy = getPageCopy("about");
  const portrait = pictureSources(profile.profile_image);

  return (
    <section id="about">
      <div
        className="container max-w-7xl pb-12 mb-12"
        style={important({ paddingTop: "10px", paddingBottom: "10px" })}
      >
        <div className="row g-4 mt-3">
          <div className="col-lg-12 col-12">
            <div className="row">
              <div className="col-12">
                <div className="text-center mb-4 mb-md-5">
                  <h1 className="section-heading mb-3">
                    <span>{copy.heading}</span>
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8 col-12">
            <div className="row">
              {/* Bio. */}
              <div className="col-lg-12 col-12">
                <div className="primary-card credentials-card" style={padded}>
                  <CardBg />
                  <img decoding="async" src={GRIDX.ctaStar} alt="" className="star-icon" />
                  <div className="d-flex align-items-center justify-content-between pt-2">
                    <div className="last-infos mt-4">
                      {/* TODO(sheet): site_profile.bio paragraph break. v2 had <br><br> between its
                          two paragraphs; Breaks renders it as soon as the cell has it. */}
                      <p className="mb-0 mt-4">
                        <Breaks text={profile.bio} />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info rows. */}
              <div className="col-lg-12 col-12 mt-4">
                <div className="primary-card credentials-card" style={padded}>
                  <CardBg />
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="last-infos">
                      <div className="home__data" style={important({ marginTop: "0px" })}>
                        <dl className="home__list">
                          {splitPairs(profile.info_rows).map(({ label, value }) => (
                            <Fragment key={label}>
                              <dt>{label}:</dt>
                              <dd>{value}</dd>
                            </Fragment>
                          ))}
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <TimelineCard heading={copy.experience_heading} entries={getExperience()} />
              <TimelineCard heading={copy.education_heading} entries={getEducation()} />

              {/* Why hire: the whole card opens the video modal (components/client/WhyHire). */}
              <div className="col-lg-12 col-12 mt-4">
                <div
                  className="primary-card credentials-card about-exp why-hire-card"
                  id="whyHireCard"
                >
                  <div className="d-flex align-items-start justify-content-between">
                    <img
                      className="bg-img why-hire-bg-img"
                      src={GRIDX.cardBg}
                      alt=""
                      decoding="async"
                    />
                    <button className="btn why-hire-btn">
                      {/* TODO(sheet): page_about.why_hire_highlight */}
                      <WhyHireLabel
                        text={copy.video_modal_title}
                        highlight={copy.why_hire_highlight}
                      />
                    </button>
                    <a
                      href={sectionHref("about")}
                      className="about-btn why-hire-star-link"
                      aria-label={copy.video_modal_title}
                    >
                      <ArrowIcon />
                    </a>
                  </div>
                </div>
              </div>

              {/* Certifications. v2 gave this card id="whyHireCard" too (a duplicate id that
                  getElementById never reached); dropped. */}
              <div className="col-lg-12 col-12 mt-4">
                <div className="primary-card credentials-card about-exp">
                  <div className="d-flex align-items-start justify-content-between">
                    <div className="infos w-100">
                      <h4 style={{ marginBottom: 100 }}>{copy.certifications_heading}</h4>
                      {/* TODO(sheet): page_about.certifications_intro */}
                      {copy.certifications_intro && (
                        <p style={{ marginBottom: 30 }}>{copy.certifications_intro}</p>
                      )}
                      <div className="d-flex align-items-center justify-content-between">
                        <CertificationCarousel certifications={getCertifications()} copy={copy} />
                      </div>
                      {/* v2: href="#", the top of the About page. */}
                      <a
                        href={sectionHref("about")}
                        className="about-btn"
                        aria-label={copy.certifications_heading}
                      >
                        <ArrowIcon />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-12">
            <div className="row">
              {/* Profile card. */}
              <div className="col-lg-12 col-12">
                <div className="primary-card" style={important({ padding: "25px 25px 25px 25px" })}>
                  <div className="img-box" style={important({ height: "55%" })}>
                    <picture>
                      {portrait.avif && <source type="image/avif" srcSet={portrait.avif} />}
                      {portrait.webp && <source type="image/webp" srcSet={portrait.webp} />}
                      <img
                        src={portrait.src}
                        className="home__img"
                        alt={profile.name}
                        width={509}
                        height={679}
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                  </div>
                  <div className="home__data" style={important({ marginTop: "0px" })}>
                    <h1 className="home__name d-flex justify-content-center mt-4">
                      {profile.name}
                    </h1>
                    <div className="home__socials  d-flex justify-content-center mt-4">
                      {getSocials().map((s) => {
                        const external = s.href.startsWith("http");
                        return (
                          <a
                            key={s.id}
                            href={s.href}
                            className="home__social-link"
                            title={s.label}
                            aria-label={s.label}
                            target={external ? "_blank" : undefined}
                            rel={external ? "noopener" : undefined}
                          >
                            <i className={s.icon_class} aria-hidden="true"></i>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                  <div className="home__info d-flex justify-content-center pt-4">
                    {/* TODO(sheet): page_about.contact_button_label (proposed key; v2: "Contact
                        Me"). Not in the T12 key list yet. */}
                    <a href={sectionHref("contact")} className="contact-card-btn">
                      {copy.contact_button_label}
                    </a>
                  </div>
                </div>
              </div>

              {/* Skills & Technologies (the only copy on the page; v2 repeated it in Projects). */}
              <div className="col-lg-12 col-12 mt-4">
                <div className="primary-card credentials-card about-exp" style={padded}>
                  <div className="d-flex align-items-start justify-content-between">
                    <div className="infos w-100">
                      <h4 style={{ marginBottom: 30 }}>{copy.skills_heading}</h4>
                      <SkillsBlock skills={getSkills()} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
