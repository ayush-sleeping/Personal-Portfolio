// The page footer: tech icons with tooltips, brand, section links, copyright, source link.
// v2 markup from index.html, filled from the sheet as v2's site-render.js did.
import { Fragment } from "react";

import type { FooterTech, NavItem } from "@/lib/types";
import { SITE, sectionHref } from "@/lib/site";

interface FooterProps {
  brand: string;
  copyright: string;
  nav: NavItem[];
  tech: FooterTech[];
}

export default function Footer({ brand, copyright, nav, tech }: Readonly<FooterProps>) {
  return (
    <footer>
      <div className="footer">
        <div className="home__socials d-flex justify-content-center flex-wrap gap-3 pb-3">
          {tech.map((t) => {
            // The tooltip text is a CSS ::before, so it is also the focusable element's
            // accessible name (v2's Q10).
            const props = {
              className: "home__social-link",
              "data-tooltip": t.tooltip,
              tabIndex: 0,
              role: "img",
              "aria-label": t.tooltip,
            };
            // icon_html is inline SVG for logos Font Awesome lacks (Django, Next.js): our own
            // sheet content, not visitor input.
            return t.icon_class ? (
              <div key={t.id} {...props}>
                <i className={t.icon_class}></i>
              </div>
            ) : (
              <div key={t.id} {...props} dangerouslySetInnerHTML={{ __html: t.icon_html ?? "" }} />
            );
          })}
        </div>
        <div className="footer-content text-center">
          <h4 className="mb-4 mt-4" style={{ color: "#fff" }}>
            {brand}
          </h4>
        </div>
        <div className="row mb-0">
          <ul>
            {/* The <li>s are inline-block, so v2's whitespace between them is part of the
                spacing. JSX drops it; put it back. */}
            {nav.map((n) => (
              <Fragment key={n.id}>
                <li>
                  <a href={sectionHref(n.id)}>{n.label}</a>
                </li>{" "}
              </Fragment>
            ))}
          </ul>
        </div>
        <div className="row copyright mt-0">
          <p className="text-center mb-0">
            <span>{copyright}</span>
          </p>
          <p className="text-center mb-0 footer-source">
            <a href={SITE.repoUrl} target="_blank" rel="noopener">
              <i className="fab fa-github" aria-hidden="true"></i> View source on GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
