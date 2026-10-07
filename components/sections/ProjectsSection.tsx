// Projects: v2's project.html grid, from the sheet (pages/projects, projects). The Skills &
// Technologies block v2 repeated under the grid shows once on the page, in About (task.md
// Phase 4). The CreativeWork JSON-LD v2 injected from project-render.js is Phase 8 (SEO).
import ProjectCard from "@/components/cards/ProjectCard";
import { getPageCopy, getProjects, isTrue } from "@/lib/data";
import { important } from "@/lib/site";

export default function ProjectsSection() {
  const copy = getPageCopy("projects");
  // As in v2: a blank `featured` cell counts as shown.
  const projects = getProjects().filter((p) => !p.featured || isTrue(p.featured));

  return (
    <section id="projects">
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

          <div className="col-lg-12 col-12">
            {/* TODO(sheet): page_projects.source_label, demo_label (v2: "Source", "Live Demo") */}
            <div className="row">
              {projects.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  sourceLabel={copy.source_label}
                  demoLabel={copy.demo_label}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
