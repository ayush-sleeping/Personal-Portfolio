// The slide-out menu the hamburger opens (.navigation__menu): header, section links, separator,
// socials, footer. v2 markup from index.html, filled from the sheet as v2's site-render.js did.
import type { NavItem, Social } from "@/lib/types";
import { sectionHref } from "@/lib/site";

interface NavigationMenuProps {
  brand: string;
  role: string;
  /** v2's menu footer: "© <year> <name>". */
  copyright: string;
  nav: NavItem[];
  socials: Social[];
  activeId: string;
}

export default function NavigationMenu({
  brand,
  role,
  copyright,
  nav,
  socials,
  activeId,
}: Readonly<NavigationMenuProps>) {
  return (
    <nav className="navigation__menu" id="navigation-menu">
      <div className="nav-header">
        <div className="nav-logo">
          <span className="logo-text">{brand}</span>
        </div>
        <div className="nav-tagline">
          <span>{role}</span>
        </div>
      </div>

      <ul className="nav-categories ul-base">
        {nav.map((n) => (
          <li key={n.id}>
            <a href={sectionHref(n.id)} className={n.id === activeId ? "active" : undefined}>
              <span>{n.label}</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="nav-separator"></div>

      <div className="nav-social">
        {socials.map((s) => {
          const external = s.href.startsWith("http");
          return (
            <a
              key={s.id}
              href={s.href}
              className="social-link"
              target={external ? "_blank" : undefined}
              rel={external ? "noopener" : undefined}
            >
              <span>{s.label}</span>
            </a>
          );
        })}
      </div>

      <div className="nav-footer">
        <span>{copyright}</span>
      </div>
    </nav>
  );
}
