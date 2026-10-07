"use client";

// The hamburger and the slide-out menu, ported from v2's main.js: a click toggles `.is-active`
// on the hamburger and `.open` on .navigation__menu.
//
// New for the one-page site: following a menu link closes the menu. In v2 every link loaded a new
// page, which closed it; now the link only scrolls, so without this the menu would stay over the
// section it just scrolled to.
import { useEffect } from "react";

export default function MobileMenu() {
  useEffect(() => {
    const hamburger = document.querySelector<HTMLButtonElement>(".hamburger");
    const navigation = document.querySelector<HTMLElement>(".navigation__menu");
    if (!hamburger || !navigation) return;

    const setOpen = (open: boolean) => {
      hamburger.classList.toggle("is-active", open);
      navigation.classList.toggle("open", open);
      hamburger.setAttribute("aria-expanded", String(open));
    };

    const onToggle = () => setOpen(!navigation.classList.contains("open"));
    const onMenuClick = (event: MouseEvent) => {
      if ((event.target as Element).closest("a[href^='#']")) setOpen(false);
    };

    hamburger.addEventListener("click", onToggle);
    navigation.addEventListener("click", onMenuClick);
    return () => {
      hamburger.removeEventListener("click", onToggle);
      navigation.removeEventListener("click", onMenuClick);
    };
  }, []);

  return null;
}
