// Services (design: #services): one card per sheet row with its check-list from bullet_points.
import { getPageCopy, getServices, splitPairs } from "@/lib/data";

export default function ServicesSection() {
  const copy = getPageCopy("services");
  return (
    <section id="services" data-screen-label="Services">
      <div data-doc="" className="v4-doc">
        <div className="v4-sec">
          <div data-sec-head="" className="v4-sec-head">
            <div>
              <h2 data-h2="" className="v4-sec-title">
                {copy.heading}
              </h2>
            </div>
          </div>
          <div className="v4-grid-cards">
            {getServices().map((s) => (
              <div className="v4-panel v4-panel-18" key={s.id}>
                <span className="v4-icon-box">
                  <i className={s.icon_class ?? "fas fa-code"} aria-hidden="true"></i>
                </span>
                <h3 className="v4-panel-title">{s.title}</h3>
                <div className="v4-features">
                  {splitPairs(s.bullet_points).map((f) => (
                    <div className="v4-feature" key={f.label}>
                      <i className="fas fa-check" aria-hidden="true"></i>
                      <div>
                        <p className="v4-feature-label">{f.label}</p>
                        <p className="v4-feature-text">{f.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
