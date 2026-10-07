// Home: v2's index.html bento grid, in v2's order. Copy comes from the sheet (profile, home page
// copy, stats, socials); card links are in-page anchors (task.md T4). This is the only place the
// Credentials / Projects / GitHub / Profiles / CTA link cards appear (T3).
import { preload } from "react-dom";

import { Breaks, CardBg, CardHeading, ArrowIcon } from "@/components/cards/CardParts";
import LinkCard from "@/components/cards/LinkCard";
import { getPageCopy, getProfile, getSocials, getStats, splitList } from "@/lib/data";
import { GRIDX, asset, important, parseInlineStyle, pictureSources, sectionHref } from "@/lib/site";

// Hardcoded in v2's index.html and not in the sheet (kept as v2 had them).
const PROJECTS_CARD_IMAGE = { src: "assets/img/my works.png", alt: "My works" };
const GITHUB_CARD_IMAGE = { src: "assets/img/github3.png", alt: "GitHub" };
const SERVICES_CARD_ICONS = [
  "fas fa-code",
  "fab fa-dev",
  "fas fa-code-branch",
  "fa-solid fa-terminal",
];
const PROFILE_CARD_ICONS: Record<string, string> = {
  twitter: "fa-brands fa-twitter",
  linkedin: "fa-brands fa-linkedin-in",
};

/** "Let's Work Together." -> Let's<br>Work <span>Together.</span>, as v2 laid it out. */
function CtaTitle({ text }: Readonly<{ text: string }>) {
  const words = text.trim().split(/\s+/);
  if (words.length < 2) return <h2>{text}</h2>;
  const middle = words.slice(1, -1).join(" ");
  return (
    <h2>
      {words[0]}
      <br />
      {middle && `${middle} `}
      <span>{words.at(-1)}</span>
    </h2>
  );
}

/** One marquee item, with v2's whitespace: the spans are inline, so the spaces show. */
function MarqueeItem({ text, star = true }: Readonly<{ text: string; star?: boolean }>) {
  return (
    <span>
      <img decoding="async" src={star ? GRIDX.marqueeStar : undefined} alt="" />
      {"   "}
      <b>{text}</b>{" "}
    </span>
  );
}

export default function HomeSection() {
  const profile = getProfile();
  const copy = getPageCopy("home");
  const stats = getStats();
  const socials = getSocials();
  const portrait = pictureSources(profile.hero_image);
  const marquee = splitList(copy.marquee_items, ",");
  const profileLinks = socials.filter((s) => s.id in PROFILE_CARD_ICONS);

  // v2 preloaded the portrait (the LCP image) from <head>.
  if (portrait.avif) {
    preload(portrait.avif, { as: "image", type: "image/avif", fetchPriority: "high" });
  }

  const cardLink = { className: "text-decoration-none text-reset", style: { display: "block" } };

  return (
    <section id="home">
      <div
        className="container max-w-7xl pb-12 mb-12"
        style={important({ paddingTop: "10px", paddingBottom: "10px" })}
      >
        <div className="row g-4 mt-3">
          {/* Intro: photo, tagline, name, intro. */}
          <div className="col-lg-6 col-12">
            <a href={sectionHref("about")} {...cardLink}>
              <div className="primary-card" style={{ cursor: "pointer" }}>
                <CardBg />
                <div className="row">
                  <div className="col-lg-6 col-12">
                    <div className="img-box">
                      <picture>
                        {portrait.avif && <source type="image/avif" srcSet={portrait.avif} />}
                        {portrait.webp && <source type="image/webp" srcSet={portrait.webp} />}
                        <img
                          src={portrait.src}
                          className="home__img"
                          alt={profile.name}
                          width={509}
                          height={679}
                          fetchPriority="high"
                          decoding="async"
                        />
                      </picture>
                    </div>
                  </div>
                  <div className="col-lg-6 col-12">
                    <div className="infos mt-4">
                      <h5>{profile.tagline}</h5>
                      <h2>{profile.name}</h2>
                      <p className="mt-3">{profile.intro}</p>
                      <div className="about-btn">
                        <ArrowIcon />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </div>

          <div className="col-lg-6 col-12">
            <div className="row">
              {/* Role marquee: one empty leading item, then the list twice, which is what the
                  -33.33% keyframe in style.css is tuned against. */}
              <div className="col-lg-12 col-12">
                <div className="primary-card2">
                  <CardBg />
                  <div className="marquee-container">
                    <div className="marquee">
                      <MarqueeItem text="" star={false} />
                      {[...marquee, ...marquee].map((text, i) => (
                        <MarqueeItem key={i} text={text} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-12 col-12">
                <div className="row">
                  <div className="col-lg-6 col-12 mt-4">
                    <LinkCard
                      href={sectionHref("about")}
                      label={copy.credentials_title}
                      style={important({ padding: "50px 25px" })}
                      media={
                        <img
                          src={asset(profile.signature_image)}
                          className="proj-img mx-auto d-block"
                          alt={`${profile.name} signature`}
                          width={224}
                          height={126}
                          loading="lazy"
                          decoding="async"
                        />
                      }
                      heading={
                        <CardHeading
                          className="mt-4"
                          label={copy.credentials_label}
                          title={copy.credentials_title}
                        />
                      }
                    />
                  </div>
                  <div className="col-lg-6 col-12 mt-4">
                    <LinkCard
                      href={sectionHref("projects")}
                      label={copy.projects_title}
                      style={important({ padding: "50px 25px" })}
                      media={
                        <img
                          src={asset(PROJECTS_CARD_IMAGE.src)}
                          className="proj-img mx-auto d-block"
                          alt={PROJECTS_CARD_IMAGE.alt}
                          width={224}
                          height={126}
                          loading="lazy"
                          decoding="async"
                        />
                      }
                      heading={
                        <CardHeading
                          className="mt-4"
                          label={copy.projects_label}
                          title={copy.projects_title}
                        />
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* GitHub: one external link around the whole card (no nested link in v2 here). */}
          <div className="col-lg-3 col-12">
            <a
              href={copy.github_url}
              target="_blank"
              rel="noopener"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                className="primary-card credentials-card"
                style={important({ padding: "35px 25px" })}
              >
                <CardBg />
                <img
                  src={asset(GITHUB_CARD_IMAGE.src)}
                  className="proj-img mx-auto d-block mb-3"
                  alt={GITHUB_CARD_IMAGE.alt}
                  width={224}
                  height={126}
                  loading="lazy"
                  decoding="async"
                />
                <div className="d-flex align-items-center justify-content-between">
                  <CardHeading
                    className="mt-2"
                    label={copy.github_label}
                    title={copy.github_title}
                  />
                  <div className="about-btn">
                    <ArrowIcon />
                  </div>
                </div>
              </div>
            </a>
          </div>

          <div className="col-lg-6 col-12">
            <LinkCard
              href={sectionHref("services")}
              label={copy.services_title}
              style={important({ padding: "35px 25px" })}
              media={
                <div className="icon-boxes">
                  {SERVICES_CARD_ICONS.map((icon) => (
                    <i key={icon} className={icon} aria-hidden="true"></i>
                  ))}
                </div>
              }
              heading={
                <CardHeading
                  className="mt-2"
                  label={copy.services_label}
                  title={copy.services_title}
                />
              }
            />
          </div>

          {/* Profiles: the social links themselves; the arrow goes to Contact. */}
          <div className="col-lg-3 col-12">
            <div
              className="primary-card credentials-card"
              style={important({ padding: "35px 25px" })}
            >
              <CardBg />
              <div className="inner-profile-icons">
                <div className="row mt-lg-0 mt-4">
                  {profileLinks.map((s) => (
                    <div key={s.id} className="col-lg-6 col-6">
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener"
                        aria-label={s.label}
                        style={{ textDecoration: "none" }}
                      >
                        <div className="social-card">
                          <i className={PROFILE_CARD_ICONS[s.id]} aria-hidden="true"></i>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <CardHeading
                  className="mt-2"
                  label={copy.profiles_label}
                  title={copy.profiles_title}
                  labelStyle={important({ zIndex: "999" })}
                />
                <a
                  href={sectionHref("contact")}
                  className="about-btn"
                  aria-label={copy.profiles_title}
                >
                  <ArrowIcon />
                </a>
              </div>
            </div>
          </div>

          {/* Stats. */}
          <div className="col-lg-6 col-12">
            <div className="primary-card" style={important({ padding: "25px 25px" })}>
              <CardBg />
              <div className="row">
                {stats.map((s) => (
                  <div key={s.id} className="col-lg-4 col-12 mt-lg-0 mt-4">
                    <div className="client-card">
                      <h2 style={parseInlineStyle(s.value_style)}>
                        <Breaks text={s.value} />
                      </h2>
                      <p className="mb-0">
                        <Breaks text={s.label} />
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-lg-6 col-12">
            <LinkCard
              href={sectionHref("contact")}
              label={copy.cta_title}
              style={important({ padding: "50px 25px" })}
              media={<img decoding="async" src={GRIDX.ctaStar} alt="" className="star-icon" />}
              heading={
                <div className="last-infos">
                  <CtaTitle text={copy.cta_title} />
                </div>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
