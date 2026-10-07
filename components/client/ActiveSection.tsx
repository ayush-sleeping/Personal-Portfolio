"use client";

// New for the one-page site (task.md Phase 7): the nav's `.active` follows the section in view,
// in both the header navbar and the slide-out menu. In v2 each page marked its own link.
//
// A section counts as "in view" while it covers the middle of the screen (the same centre-line
// observer the scroll animations use). Between sections, e.g. over the footer, the last one
// stays marked.
import { useEffect } from "react";

import { SECTION_IDS } from "@/lib/site";

export default function ActiveSection() {
  useEffect(() => {
    const links = (id: string) =>
      document.querySelectorAll(
        `.header .navbar a[href="#${id}"], .navigation__menu .nav-categories a[href="#${id}"]`,
      );
    const mark = (id: string) => {
      document
        .querySelectorAll(".header .navbar a.active, .navigation__menu .nav-categories a.active")
        .forEach((a) => a.classList.remove("active"));
      links(id).forEach((a) => a.classList.add("active"));
    };

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && mark(e.target.id)),
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
    );
    SECTION_IDS.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  return null;
}
