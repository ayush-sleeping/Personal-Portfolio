// About (design: #about "About me"): heading, bio, and the quick-facts grid from the profile's
// info_rows ("Label::value | …"). Icons per label are the design's (T10).
import { getProfile, splitPairs } from "@/lib/data";

const INFO_ICONS: Record<string, string> = {
  Interest: "fa-solid fa-lightbulb",
  Skilled: "fa-solid fa-code",
  "Focusing On": "fa-solid fa-seedling",
  Experience: "fa-solid fa-briefcase",
  Education: "fa-solid fa-graduation-cap",
  EMAIL: "fa-solid fa-envelope",
  ADDRESS: "fa-solid fa-location-dot",
};
const titleCase = (s: string) =>
  s === s.toUpperCase() ? s.charAt(0) + s.slice(1).toLowerCase() : s;

export default function AboutSection() {
  const profile = getProfile();
  const rows = splitPairs(profile.info_rows);
  return (
    <section id="about" data-screen-label="About me">
      <div data-doc="" className="v4-doc">
        <div className="v4-sec">
          <div data-sec-head="" className="v4-sec-head">
            <div>
              <h2 data-h2="" className="v4-sec-title">
                About me
              </h2>
              <p className="v4-sec-intro">{profile.bio}</p>
            </div>
          </div>
          <div className="v4-grid-300">
            {rows.map((r) => (
              <div className="v4-item" key={r.label}>
                <span className="v4-icon-box">
                  <i
                    className={INFO_ICONS[r.label] ?? "fa-solid fa-circle-info"}
                    aria-hidden="true"
                  ></i>
                </span>
                <div>
                  <h3 className="v4-item-title">{titleCase(r.label)}</h3>
                  <p className="v4-item-text">{r.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
