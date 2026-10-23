// Projects (design: #projects): the grid of articles, each with id="project-<slug>" for the
// sidebar and the palette.
import { getPageCopy, getProjects, splitList } from "@/lib/data";
import { imageSrc, projectAnchor } from "@/lib/site";

export default function ProjectsSection() {
  const copy = getPageCopy("projects");
  return (
    <section id="projects" data-screen-label="Projects">
      <div data-doc="" className="v4-doc">
        <div className="v4-sec">
          <div data-sec-head="" className="v4-sec-head">
            <div>
              <h2 data-h2="" className="v4-sec-title">
                {copy.heading}
              </h2>
            </div>
          </div>
          <div className="v4-grid-320">
            {getProjects().map((p) => (
              <article id={projectAnchor(p.title)} className="v4-proj" key={p.id}>
                <div className="v4-proj-img">
                  <img src={imageSrc(p.image_url)} alt={p.title} loading="lazy" />
                </div>
                <div className="v4-proj-text">
                  <div className="v4-proj-head">
                    <h3 className="v4-proj-title">{p.title}</h3>
                    {p.year && <span className="v4-proj-year">{p.year}</span>}
                  </div>
                  {p.category && <span className="v4-proj-cat">{p.category}</span>}
                </div>
                <p className="v4-proj-desc">
                  {p.summary
                    .replace(/<br\s*\/?>/gi, " ")
                    .replace(/\s+/g, " ")
                    .trim()}
                </p>
                <div className="v4-chip-list">
                  {splitList(p.tech_stack, ",").map((t) => (
                    <span className="v4-chip" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
                <div className="v4-proj-links">
                  {p.github_url && (
                    <a href={p.github_url} target="_blank" rel="noopener" className="v4-link">
                      <i className="fab fa-github" aria-hidden="true"></i>Source
                    </a>
                  )}
                  {p.live_url && (
                    <a href={p.live_url} target="_blank" rel="noopener" className="v4-link">
                      Live demo<i className="fa-solid fa-arrow-right v4-ext" aria-hidden="true"></i>
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
