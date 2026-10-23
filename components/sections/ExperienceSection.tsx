// Experience (design: #experience): the first three sheet rows as "Professional" (chips grouped
// from `details`, "Current role" on the first), the rest as "Training & programs".
import { getExperience, getPageCopy, splitPairs } from "@/lib/data";

const PROFESSIONAL = 3;
const chipsOf = (value: string) =>
  value
    .split(" - ")[0]
    .split(/\s*[,+]\s*/)
    .map((c) => c.trim())
    .filter(Boolean);

export default function ExperienceSection() {
  const rows = getExperience();
  const copy = getPageCopy("about");
  const jobs = rows.slice(0, PROFESSIONAL);
  const training = rows.slice(PROFESSIONAL);

  return (
    <section id="experience" data-screen-label="Experience">
      <div data-doc="" className="v4-doc">
        <div className="v4-sec">
          <div data-sec-head="" className="v4-sec-head">
            <div>
              <h2 data-h2="" className="v4-sec-title">
                {copy.experience_heading}
              </h2>
            </div>
          </div>
          <div className="v4-col">
            <p className="v4-eyebrow">Professional</p>
            {jobs.map((e, i) => {
              const groups = splitPairs(e.details);
              return (
                <div data-exp-row="" className="v4-exp-row" key={e.id}>
                  <div className="v4-exp-left">
                    <span className="v4-exp-date">{e.date_label}</span>
                    <span className="v4-exp-dur">{e.duration_label}</span>
                    {i === 0 && (
                      <span className="v4-pill">
                        <span className="v4-pill-dot"></span>Current role
                      </span>
                    )}
                  </div>
                  <div className="v4-exp-body">
                    <div className="v4-exp-head">
                      <h3 className="v4-exp-title">{e.title}</h3>
                      <p className="v4-exp-company">
                        <b>{e.company}</b> · {e.location}
                      </p>
                    </div>
                    <p className="v4-text">{e.description}</p>
                    {groups.length > 0 && (
                      <div className="v4-groups">
                        {groups.map((d) => (
                          <div className="v4-group-row" key={d.label}>
                            <span className="v4-group-label">{d.label}</span>
                            <div className="v4-chip-list">
                              {chipsOf(d.value).map((c) => (
                                <span className="v4-chip" key={c}>
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {training.length > 0 && (
            <div className="v4-col v4-mt-12">
              <p className="v4-eyebrow">
                Training &amp; programs <small>· during college</small>
              </p>
              {training.map((e) => {
                const stack = splitPairs(e.details)
                  .flatMap((d) => chipsOf(d.value))
                  .join(" · ");
                return (
                  <div data-exp-row="" className="v4-exp-row v4-train-row" key={e.id}>
                    <span className="v4-train-date">{e.date_label}</span>
                    <div className="v4-train-body">
                      <p className="v4-train-title">
                        <b>{e.title}</b> · <span className="v4-accent">{e.company}</span>
                      </p>
                      <p className="v4-train-desc">{e.description}</p>
                      {stack && <p className="v4-train-stack">{stack}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
