// One project card, as v2's project-render.js built it (card()).
import { Breaks } from "@/components/cards/CardParts";
import { splitList } from "@/lib/data";
import type { Project } from "@/lib/types";
import { pictureSources } from "@/lib/site";

interface ProjectCardProps {
  project: Project;
  /** Button labels from pages/projects (task.md T12). */
  sourceLabel?: string;
  demoLabel?: string;
}

export default function ProjectCard({
  project: p,
  sourceLabel,
  demoLabel,
}: Readonly<ProjectCardProps>) {
  const image = pictureSources(p.image_url);
  return (
    <div className="col-lg-6 col-12 mt-4">
      <div className="project-showcase-card h-100">
        <div className="project-image-wrapper">
          <picture>
            {image.avif && <source type="image/avif" srcSet={image.avif} />}
            {image.webp && <source type="image/webp" srcSet={image.webp} />}
            <img
              src={image.src}
              className="project-image"
              alt={p.title}
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
        <div className="project-content">
          <h3 className="project-title">{p.title}</h3>
          <div className="project-meta">
            <span className="project-type">{p.category}</span>
            <span className="project-date">{p.year}</span>
          </div>
          <p className="project-description">
            <Breaks text={p.summary} />
          </p>
          <div className="project-tags">
            {splitList(p.tech_stack, ",").map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
          <div className="project-links-visible">
            {p.github_url && (
              <a
                href={p.github_url}
                target="_blank"
                rel="noopener"
                className="project-link-btn source-btn"
              >
                <i className="fab fa-github" aria-hidden="true"></i>
                <span>{sourceLabel}</span>
              </a>
            )}
            {p.live_url && (
              <a
                href={p.live_url}
                target="_blank"
                rel="noopener"
                className="project-link-btn live-btn"
              >
                <i className="fas fa-external-link-alt" aria-hidden="true"></i>
                <span>{demoLabel}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
