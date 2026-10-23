"use client";

// The design's motion (documentation/design/v4-logic.js, `_initMotion` and `_onDocClick`): the typed
// terminal line, scroll reveals with the stagger delays, the experience-row line sweep, chip
// stagger, stat counters, heading scramble, the card spotlight, copy-link on section headings, and
// the console greeting. Everything but the spotlight and copy-link is off under reduced motion.
import { useEffect } from "react";

import { copyText } from "./Shell";

declare global {
  interface Window {
    __aySaid?: boolean;
  }
}

export default function Motion() {
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    const on = <K extends keyof WindowEventMap>(
      target: Window | Document,
      type: K | string,
      fn: EventListener,
      opts?: AddEventListenerOptions,
    ) => {
      target.addEventListener(type, fn, opts);
      cleanups.push(() => target.removeEventListener(type, fn, opts));
    };

    // Copy the section link when a heading is clicked.
    on(document, "click", (e) => {
      const t = (e.target as HTMLElement).closest?.("[data-h2]");
      if (!t) return;
      const sec = t.closest("section[id]");
      if (!sec) return;
      try {
        history.replaceState(null, "", "#" + sec.id);
      } catch {
        /* ignore */
      }
      copyText(location.href.split("#")[0] + "#" + sec.id, "Link to section copied");
    });

    if (!window.__aySaid) {
      window.__aySaid = true;
      console.log(
        "%c ayushSleeping ",
        "background:#5B78F6;color:#fff;font:700 13px monospace;padding:4px 8px;border-radius:4px",
        "\n\nHey, fellow developer. Thanks for looking under the hood.\nPress ⌘K / Ctrl K on the page to search everything.\n\nCode   → https://github.com/ayush-sleeping\nEmail  → ayushbm84@gmail.com",
      );
    }

    // Card spotlight follows the pointer.
    on(
      document,
      "pointermove",
      (e) => {
        const ev = e as PointerEvent;
        const c = (ev.target as HTMLElement).closest?.("[data-card]") as HTMLElement | null;
        if (!c) return;
        const r = c.getBoundingClientRect();
        c.style.setProperty("--mx", `${ev.clientX - r.left}px`);
        c.style.setProperty("--my", `${ev.clientY - r.top}px`);
      },
      { passive: true },
    );

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return () => cleanups.forEach((f) => f());

    const timers: number[] = [];
    const raf = (fn: FrameRequestCallback) => requestAnimationFrame(fn);

    const count = (el: HTMLElement) => {
      const m = el.textContent?.match(/^(\d+)(\+?)$/);
      if (!m) return;
      const end = +m[1];
      const pad = m[1].length;
      const t0 = performance.now();
      const dur = 1200;
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const v = Math.round(end * (1 - Math.pow(1 - p, 3)));
        el.textContent = String(v).padStart(pad, "0") + m[2];
        if (p < 1) raf(step);
      };
      raf(step);
    };

    const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/{}[]=+*#";
    const scramble = (t: HTMLElement) => {
      if (t.children.length || t.hasAttribute("data-sx")) return;
      t.setAttribute("data-sx", "");
      const fin = t.textContent ?? "";
      const L = fin.length;
      const t0 = performance.now();
      const dur = 650;
      const step = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        const n = Math.floor(p * L);
        let s = fin.slice(0, n);
        for (let i = n; i < L; i++) {
          s += fin[i] === " " ? " " : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        t.textContent = p < 1 ? s : fin;
        if (p < 1) raf(step);
      };
      raf(step);
    };

    let ioFired = false;
    const io = new IntersectionObserver(
      (ents) => {
        ioFired = true;
        ents.forEach((en) => {
          if (en.isIntersecting) show(en.target as HTMLElement);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    const show = (el: HTMLElement) => {
      if (el.hasAttribute("data-in")) return;
      el.setAttribute("data-in", "");
      io.unobserve(el);
      const hh = el.querySelector<HTMLElement>("[data-h2]");
      if (hh) scramble(hh);
      if (el.hasAttribute("data-stats")) {
        el.querySelectorAll<HTMLElement>("span").forEach((s) => {
          if (/^\d+\+?$/.test(s.textContent?.trim() ?? "")) count(s);
        });
      }
    };
    const pending = () =>
      document.querySelectorAll<HTMLElement>(
        "[data-reveal]:not([data-in]), [data-exp-row]:not([data-in])",
      );
    const revealCheck = () => {
      const vh = window.innerHeight;
      pending().forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh - 40 && r.bottom > 0) show(el);
      });
    };
    const tag = (el: HTMLElement, d: number) => {
      if (el.hasAttribute("data-reveal")) return;
      el.setAttribute("data-reveal", "");
      if (d) el.style.setProperty("--d", `${d}ms`);
      io.observe(el);
    };
    document
      .querySelectorAll<HTMLElement>("[data-bento-wrap] > div > *")
      .forEach((el, i) => tag(el, 120 + i * 60));
    document.querySelectorAll<HTMLElement>("[data-doc] > div").forEach((el) => tag(el, 0));
    document.querySelectorAll<HTMLElement>("[data-exp-row]").forEach((el) => io.observe(el));
    document.querySelectorAll<HTMLElement>("main [data-reveal]").forEach((sec) => {
      let i = 0;
      sec.querySelectorAll<HTMLElement>(".v4-chip, .v4-chip-blue, .v4-pill").forEach((s) => {
        if (s.closest("[data-stats]")) return;
        s.setAttribute("data-chip", "");
        s.style.transitionDelay = `${Math.min(i++ * 30, 600) + 200}ms`;
      });
    });
    revealCheck();
    on(window, "scroll", revealCheck, { passive: true });
    on(window, "resize", revealCheck);
    timers.push(
      window.setTimeout(() => {
        if (!ioFired) pending().forEach(show);
      }, 2500),
    );

    // The typed terminal line.
    const tgt = document.querySelector<HTMLElement>("[data-type]");
    if (tgt) {
      const full = tgt.textContent ?? "";
      tgt.textContent = "";
      let k = 0;
      const tick = () => {
        tgt.textContent = full.slice(0, ++k);
        if (k < full.length) timers.push(window.setTimeout(tick, full[k - 1] === " " ? 70 : 38));
      };
      timers.push(window.setTimeout(tick, 650));
      cleanups.push(() => {
        tgt.textContent = full;
      });
    }

    return () => {
      cleanups.forEach((f) => f());
      timers.forEach((t) => window.clearTimeout(t));
      io.disconnect();
    };
  }, []);

  return null;
}
