"use client";

// The header gains `.active` (shadow + blur) once the page is scrolled, ported from v2's main.js.
//
// Not ported, because it did nothing in v2's browser: the `.navbar.active` removal on scroll and
// on #nav-close (nothing ever adds that class), Spotlight (no v2 page has a [data-spotlight]
// element) and the GSAP ScrollTrigger block (no v2 page loads GSAP, and none has the
// .dx-fixed-background elements it targets; in v2 it only threw "gsap is not defined").
import { useEffect } from "react";

export default function StickyHeader() {
  useEffect(() => {
    const header = document.querySelector(".header");
    if (!header) return;

    const update = () => header.classList.toggle("active", window.scrollY > 0);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("load", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("load", update);
    };
  }, []);

  return null;
}
