// The v4 footer: brand + tagline, Sections (navigation tab), the first five Projects, Connect
// (socials), then the tech row from footer-tech (icon_class rows as <i>, icon_html rows as SVG),
// the copyright and "View source on GitHub".
import type { FooterTech, NavItem, Project, Social } from "@/lib/types";
import { SITE, projectAnchor } from "@/lib/site";

interface Props {
  brand: string;
  tagline: string;
  copyright: string;
  nav: NavItem[];
  projects: Project[];
  socials: Social[];
  tech: FooterTech[];
}

export default function Footer({
  brand,
  tagline,
  copyright,
  nav,
  projects,
  socials,
  tech,
}: Readonly<Props>) {
  return (
    <footer className="v4-footer">
      <div data-doc="" className="v4-doc">
        <div data-foot="" className="v4-foot-grid">
          <div className="v4-foot-col">
            <a href="#home" className="v4-foot-brand">
              {brand.slice(0, 5)}
              <span className="v4-accent">{brand.slice(5)}</span>
            </a>
            <p className="v4-foot-tag">{tagline}</p>
          </div>
          <div className="v4-foot-col">
            <span className="v4-foot-head">Sections</span>
            {nav.map((n) => (
              <a href={`#${n.id}`} className="v4-foot-link" key={n.id}>
                {n.label}
              </a>
            ))}
          </div>
          <div className="v4-foot-col">
            <span className="v4-foot-head">Projects</span>
            {projects.slice(0, 5).map((p) => (
              <a href={`#${projectAnchor(p.title)}`} className="v4-foot-link" key={p.id}>
                {p.title}
              </a>
            ))}
          </div>
          <div className="v4-foot-col">
            <span className="v4-foot-head">Connect</span>
            {socials.map((s) => (
              <a href={s.href} target="_blank" rel="noopener" className="v4-foot-link" key={s.id}>
                {s.label}
              </a>
            ))}
          </div>
        </div>
        <div className="v4-foot-tech">
          <span className="v4-foot-head">Skills &amp; tools I work with</span>
          <div className="home__socials">
            {tech.map((t) => (
              <div
                className="home__social-link"
                data-tooltip={t.tooltip}
                role="img"
                aria-label={t.tooltip}
                key={t.id}
                {...(t.icon_html && !t.icon_class
                  ? { dangerouslySetInnerHTML: { __html: t.icon_html } }
                  : {})}
              >
                {t.icon_class ? <i className={t.icon_class} aria-hidden="true"></i> : undefined}
              </div>
            ))}
          </div>
        </div>
        <div className="v4-foot-bottom">
          <span className="v4-meta">{copyright}</span>
          <a href={SITE.repoUrl} target="_blank" rel="noopener" className="v4-link v4-foot-src">
            <i className="fab fa-github" aria-hidden="true"></i>View source on GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
