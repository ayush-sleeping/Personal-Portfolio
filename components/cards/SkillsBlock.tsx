// The Skills & Technologies groups (established, then focusing), as v2's about-render.js built
// them. Shown once on the page, in About (task.md Phase 4).
import type { Skill } from "@/lib/types";

function SkillsGroup({ rows, className }: Readonly<{ rows: Skill[]; className: string }>) {
  const label = rows[0].group_label ?? rows[0].group;
  return (
    <div className={className}>
      <h5 style={{ marginBottom: 20 }}>{label}</h5>
      <div className="row">
        {rows.map((s) => (
          <div key={s.id} className="col-lg-6 col-md-6 col-12 mb-3">
            <div className={`skill-card${s.group === "focusing" ? " secondary" : ""}`}>
              <p className="skill-category">{s.category}</p>
              <h6 className="skill-name">{s.name}</h6>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SkillsBlock({ skills }: Readonly<{ skills: Skill[] }>) {
  const established = skills.filter((s) => s.group === "established");
  const focusing = skills.filter((s) => s.group === "focusing");
  return (
    <div>
      {established.length > 0 && <SkillsGroup rows={established} className="skills-section mb-4" />}
      {focusing.length > 0 && <SkillsGroup rows={focusing} className="skills-section" />}
    </div>
  );
}
