// Certifications (design: #certifications): heading, intro, prev/next, the snap scroller and the
// lightbox (components/client/CertScroller). Meta is "issuer · year".
import CertScroller from "@/components/client/CertScroller";
import { getCertifications, getPageCopy } from "@/lib/data";
import { assetOrUrl, imageSrc } from "@/lib/site";

export default function CertificationsSection() {
  const copy = getPageCopy("about");
  const certs = getCertifications().map((c) => {
    const year = c.issued_date?.match(/^\d{4}/)?.[0];
    const img = /^https?:/.test(c.image_url) ? c.image_url : imageSrc(c.image_url);
    return {
      img,
      title: c.title,
      meta: year ? `${c.issuer} · ${year}` : (c.issuer ?? ""),
      href: c.credential_url || assetOrUrl(c.image_url),
      alt: c.alt_text || c.title,
    };
  });
  return (
    <section id="certifications" data-screen-label="Certifications">
      <div data-doc="" className="v4-doc">
        <div className="v4-sec">
          <div data-sec-head="" className="v4-sec-head">
            <div>
              <h2 data-h2="" className="v4-sec-title">
                {copy.certifications_heading}
              </h2>
              <p className="v4-sec-intro">{copy.certifications_intro}</p>
            </div>
            <CertScroller certs={certs} />
          </div>
        </div>
      </div>
    </section>
  );
}
