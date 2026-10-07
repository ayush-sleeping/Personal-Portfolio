// The certifications slider: a Bootstrap carousel (data-bs-ride), as v2's about.html and
// about-render.js built it. Bootstrap's JS (app/layout.tsx) drives it.
import type { Certification, PageCopy } from "@/lib/types";
import { pictureSources } from "@/lib/site";

// Labels come from pages/about (task.md T12) and render once the sheet has them:
// TODO(sheet): page_about.carousel_prev_label, carousel_next_label, certificate_link_label
export default function CertificationCarousel({
  certifications,
  copy,
}: Readonly<{ certifications: Certification[]; copy: PageCopy }>) {
  return (
    <div
      id="certificationCarousel"
      className="carousel slide certification-slider"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        {certifications.map((cert, i) => {
          const picture = pictureSources(cert.image_url);
          const href = cert.credential_url || undefined;
          return (
            <div key={cert.id} className={`carousel-item${i === 0 ? " active" : ""}`}>
              <div className="certification-card">
                <picture>
                  {picture.avif && <source type="image/avif" srcSet={picture.avif} />}
                  {picture.webp && <source type="image/webp" srcSet={picture.webp} />}
                  <img
                    src={picture.src}
                    className="certification-img"
                    alt={cert.alt_text || cert.title}
                    // The first slide sets the slider's height. Lazy, it loaded only after a
                    // nav jump past it and pushed every later section ~550px down, so links
                    // landed in About. The hidden slides stay lazy.
                    loading={i === 0 ? undefined : "lazy"}
                    decoding="async"
                  />
                </picture>
                <div className="certification-info mt-2">
                  {/* v2 wrote href="" when there's no credential URL, which reloaded the page;
                      without an href the label stays, styled, but isn't a dead link. */}
                  <a
                    href={href}
                    target={href ? "_blank" : undefined}
                    rel={href ? "noopener" : undefined}
                    className="certification-link"
                  >
                    <i className="fas fa-external-link-alt" aria-hidden="true"></i>{" "}
                    {copy.certificate_link_label}
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#certificationCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">{copy.carousel_prev_label}</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#certificationCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">{copy.carousel_next_label}</span>
      </button>
    </div>
  );
}
