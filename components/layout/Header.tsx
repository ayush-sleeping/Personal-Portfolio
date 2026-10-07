// The top bar: logo, navbar, hamburger and "Let's talk". v2 markup from index.html; links are
// in-page anchors (task.md T4). Scroll and hamburger behaviour live in components/client/.
import type { NavItem } from "@/lib/types";
import { sectionHref } from "@/lib/site";

interface HeaderProps {
  brand: string;
  ctaLabel: string;
  nav: NavItem[];
  /** Nav item marked `.active`. v2 marked the current page; the scroll highlighter replaces it. */
  activeId: string;
}

export default function Header({ brand, ctaLabel, nav, activeId }: Readonly<HeaderProps>) {
  return (
    <header className="header">
      <div className="logo">
        <div className="icon rounded pt-1 pb-1">
          <span>
            <a className="logo-text" style={{ textDecoration: "none" }} href={sectionHref("home")}>
              <span>{brand}</span>
            </a>
          </span>
        </div>
      </div>
      <nav className="navbar">
        <div id="nav-close"></div>
        {nav.map((n) => (
          <a
            key={n.id}
            href={sectionHref(n.id)}
            className={n.id === activeId ? "active" : undefined}
          >
            {n.label}
          </a>
        ))}
      </nav>
      <button
        className="hamburger hamburger--emphatic"
        type="button"
        aria-label="Menu"
        aria-controls="navigation-menu"
        aria-expanded="false"
      >
        <span className="hamburger-box">
          <span className="hamburger-inner"></span>
        </span>
      </button>
      <div className="rounded pt-1 pb-1">
        <span className="talk-text">
          <a href={sectionHref("contact")} className="lets-talk-btn">
            {ctaLabel}
          </a>
        </span>
      </div>
    </header>
  );
}
