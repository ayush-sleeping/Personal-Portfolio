// One service card, as v2's services-render.js built it (card()). bullet_points holds the
// features as "Title::Description | Title::Description".
import { CardBg } from "@/components/cards/CardParts";
import { splitPairs } from "@/lib/data";
import type { Service } from "@/lib/types";

export default function ServiceCard({ service: s }: Readonly<{ service: Service }>) {
  const features = splitPairs(s.bullet_points);
  return (
    <div className="col-lg-6 col-md-6 col-12">
      <div className="primary-card h-100 service-card">
        <CardBg />
        <div className="service-icon mb-3">
          <i className={`${s.icon_class} service-icon-style`} aria-hidden="true"></i>
        </div>
        <h4 className="mb-3 service-title">{s.title}</h4>
        <div className="service-features">
          {features.map((f, i) => (
            <div
              key={f.label}
              className={`feature-item${i === features.length - 1 ? "" : " mb-3"}`}
            >
              <div className="d-flex align-items-start">
                <i
                  className="fas fa-check-circle feature-check-icon me-2 mt-1"
                  aria-hidden="true"
                ></i>
                <div>
                  <h6 className="mb-1 feature-title">{f.label}</h6>
                  <p className="mb-0 small feature-description">{f.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
