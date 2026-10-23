// Education (design: #education): one card per sheet row, the school linked to institution_url,
// and the course list parsed into code / name pairs.
import { getEducation, getPageCopy, splitPairs } from "@/lib/data";

const parseItems = (value: string) =>
  value
    .split(/\s*,\s*|\s+&\s+/)
    .filter(Boolean)
    .map((x) => {
      const m = x.match(/^([A-Z]{2,}\d+)\s*:\s*(.+)$/);
      return m ? { code: m[1], name: m[2] } : { code: "", name: x };
    });

export default function EducationSection() {
  const rows = getEducation();
  const copy = getPageCopy("about");
  return (
    <section id="education" data-screen-label="Education">
      <div data-doc="" className="v4-doc">
        <div className="v4-sec">
          <div data-sec-head="" className="v4-sec-head">
            <div>
              <h2 data-h2="" className="v4-sec-title">
                {copy.education_heading}
              </h2>
            </div>
          </div>
          <div className="v4-grid-340">
            {rows.map((e) => (
              <div className="v4-panel" key={e.id}>
                <div className="v4-panel-head">
                  <span className="v4-icon-box">
                    <i className="fa-solid fa-graduation-cap" aria-hidden="true"></i>
                  </span>
                  <span className="v4-mono-12">{e.date_label}</span>
                </div>
                <div className="v4-panel-text">
                  <h3 className="v4-panel-title">{e.title}</h3>
                  {e.institution_url ? (
                    <a
                      href={e.institution_url}
                      target="_blank"
                      rel="noopener"
                      className="v4-link-blue"
                    >
                      {e.company}
                    </a>
                  ) : (
                    <span className="v4-link-blue">{e.company}</span>
                  )}
                  <span className="v4-muted-13">
                    {e.location} · {e.duration_label}
                  </span>
                </div>
                <p className="v4-panel-desc">{e.description}</p>
                {splitPairs(e.details).map((d) => (
                  <div className="v4-detail" key={d.label}>
                    <span className="v4-detail-label">{d.label}</span>
                    <ul className="v4-ul">
                      {parseItems(d.value).map((it) => (
                        <li className="v4-li" key={it.code + it.name}>
                          <span className="v4-dot"></span>
                          <span>{it.name}</span>
                          {it.code && <span className="v4-code">{it.code}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
