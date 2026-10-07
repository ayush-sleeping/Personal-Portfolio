"use client";

// Ported from v2's scroll-animations.js. Phones have no hover, so at 768px and below each card
// briefly borrows its hover look (`.scroll-animated`, styled in style.css) as it crosses the
// middle of the screen. Its arrow button, star, stat cards and social cards pulse with it. The
// same scroll position also feeds --scroll-progress for the progress bar style.css draws.
//
// As in v2: an IntersectionObserver with the root collapsed to the centre line (no layout reads
// per scroll frame), one pulse per element per 2s, 800ms long, skipped under reduced motion, and
// torn down and rebuilt 200ms after a resize, so crossing the breakpoint switches it on or off.
import { useEffect } from "react";

const TARGETS = [".primary-card", ".primary-card2", ".home__social-link"];
const COOLDOWN_MS = 2000;
const PULSE_MS = 800;

function start(): () => void {
  const enabled =
    window.innerWidth <= 768 && !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (!enabled) return () => {};

  const lastPulse = new WeakMap<Element, number>();
  const timers = new Set<number>();

  const childTargets = (card: Element) => [
    ...card.querySelectorAll(".client-card, .social-card"),
    ...[card.querySelector(".about-btn"), card.querySelector(".star-icon")].filter(
      (el): el is Element => el !== null,
    ),
  ];

  const pulse = (el: Element) => {
    const now = Date.now();
    const last = lastPulse.get(el);
    // Scrolling back and forth over one card should not strobe it.
    if (last && now - last < COOLDOWN_MS) return;
    lastPulse.set(el, now);

    const children = el.classList.contains("primary-card") ? childTargets(el) : [];
    el.classList.add("scroll-animated");
    children.forEach((c) => c.classList.add("scroll-animated"));
    const id = window.setTimeout(() => {
      timers.delete(id);
      el.classList.remove("scroll-animated");
      children.forEach((c) => c.classList.remove("scroll-animated"));
    }, PULSE_MS);
    timers.add(id);
  };

  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && pulse(e.target)),
    // The root collapsed to a line across the middle of the screen: an element "intersects"
    // exactly while it covers the centre.
    { rootMargin: "-50% 0px -50% 0px", threshold: 0 },
  );
  document.querySelectorAll(TARGETS.join(", ")).forEach((el) => observer.observe(el));

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      document.documentElement.style.setProperty("--scroll-progress", `${pct}%`);
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  return () => {
    observer.disconnect();
    window.removeEventListener("scroll", onScroll);
    timers.forEach((id) => {
      clearTimeout(id);
    });
    document.querySelectorAll(".scroll-animated").forEach((el) => {
      el.classList.remove("scroll-animated");
    });
  };
}

export default function ScrollCardAnimations() {
  useEffect(() => {
    let stop = start();
    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        stop();
        stop = start();
      }, 200);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
      stop();
    };
  }, []);

  return null;
}
