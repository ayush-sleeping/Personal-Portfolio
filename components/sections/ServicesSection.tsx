// Services: v2's services.html, from the sheet (pages/services, services). The row of link
// cards v2 put under the grid (Profiles, CTA, Credentials) shows once, in Home (T3).
import ServiceCard from "@/components/cards/ServiceCard";
import { getPageCopy, getServices } from "@/lib/data";
import { important } from "@/lib/site";

export default function ServicesSection() {
  const copy = getPageCopy("services");

  return (
    <section id="services">
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

          <div className="col-12">
            <div className="row g-4">
              {getServices().map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
