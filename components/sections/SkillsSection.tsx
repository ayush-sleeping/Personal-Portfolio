// Skills (design: #skills): the two groups from the skills sheet tab. Icons per category are the
// design's (T10); the "focusing" group gets the blue icon box.
import { getPageCopy, getSkills } from "@/lib/data";

const SKILL_ICONS: Record<string, string> = {
  Backend: "fa-solid fa-server",
  Database: "fa-solid fa-database",
  Frontend: "fa-solid fa-window-maximize",
  Others: "fa-solid fa-toolbox",
  Language: "fa-solid fa-code",
  "AI tools": "fa-solid fa-microchip",
};

export default function SkillsSection() {
  const copy = getPageCopy("about");
  const skills = getSkills();
  const groups = ["established", "focusing"] as const;
  return (
    <section id="skills" data-screen-label="Skills">
      <div data-doc="" className="v4-doc">
        <div className="v4-sec">
          <div data-sec-head="" className="v4-sec-head">
            <div>
              <h2 data-h2="" className="v4-sec-title">
                {copy.skills_heading}
              </h2>
            </div>
          </div>
          <div className="v4-col-36">
            {groups.map((g) => {
              const rows = skills.filter((s) => s.group === g);
              if (!rows.length) return null;
              return (
                <div className="v4-col-20" key={g}>
                  <h3 className="v4-sub-head">{rows[0].group_label}</h3>
                  <div className="v4-grid-240">
                    {rows.map((s) => (
                      <div className="v4-item" key={s.id}>
                        <span
                          className={`v4-icon-box${g === "focusing" ? " v4-icon-box-blue" : ""}`}
                        >
                          <i
                            className={SKILL_ICONS[s.category] ?? "fa-solid fa-code"}
                            aria-hidden="true"
                          ></i>
                        </span>
                        <div>
                          <h3 className="v4-item-title">{s.category}</h3>
                          <p className="v4-item-text">{s.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
