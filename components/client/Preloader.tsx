"use client";

// The purple slide-reveal preloader, ported from v2's preloader.js with the same timings and the
// same sequence. The page content (.main-content) fades in underneath the panel as soon as the
// panel covers the screen, so the animation never decides when the page is "there" (v2's Q18).
// Under reduced motion it is skipped entirely (v2's Q7).
import { useEffect, useRef } from "react";

const TIMING = {
  progress: 700, // cosmetic fill; the real trigger is window load
  settle: 60, // hold at 100% before the reveal starts
  slideUp: 200, // preloader fade-out before the purple panel rises
  slideAway: 700, // how long the panel holds before sweeping away
  cleanup: 950, // after this the elements are display:none
};

export default function Preloader({ brand }: Readonly<{ brand: string }>) {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const percentageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const preloader = preloaderRef.current;
    const panel = panelRef.current;
    const mainContent = document.querySelector(".main-content");
    if (!preloader || !panel) return;

    const frames = new Set<number>();
    const timers: number[] = [];
    const frame = (fn: () => void) => {
      const id = requestAnimationFrame(() => {
        frames.delete(id);
        fn();
      });
      frames.add(id);
    };
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      mainContent?.classList.add("fade-in");
      preloader.style.display = "none";
      panel.style.display = "none";
      return;
    }

    // Progress bar. As in v2, every update starts its own easing chain toward the target, so the
    // bar's feel depends on that; kept as-is rather than "fixed".
    let currentProgress = 0;
    let targetProgress = 0;
    // v2's page loaded slower than the 700ms simulated fill, so its bar always finished first.
    // v3 loads faster, and the fill kept pulling the target back under 95 after load, so the
    // loader faded out at ~40%. Now load stops the fill, and the reveal waits for both load and
    // the bar showing 100%.
    let loaded = false;
    let revealScheduled = false;

    const animateProgressBar = () => {
      const diff = targetProgress - currentProgress;
      currentProgress += diff * 0.1;
      if (progressRef.current) progressRef.current.style.width = `${currentProgress}%`;
      if (percentageRef.current) {
        percentageRef.current.textContent = `${Math.round(currentProgress)}%`;
      }
      if (loaded && !revealScheduled && Math.round(currentProgress) >= 100) {
        revealScheduled = true;
        later(startRevealAnimation, TIMING.settle);
      }
      if (Math.abs(diff) > 0.1) frame(animateProgressBar);
    };

    const updateProgressBar = (progress: number) => {
      targetProgress = progress;
      animateProgressBar();
    };

    const startTime = Date.now();
    const simulateProgress = () => {
      if (loaded) return;
      const progress = Math.min(((Date.now() - startTime) / TIMING.progress) * 100, 95);
      updateProgressBar(progress);
      if (progress < 95) frame(simulateProgress);
    };
    frame(simulateProgress);

    const startRevealAnimation = () => {
      // Phase 1: fade out the preloader.
      preloader.classList.add("fade-out");

      // Phase 2: the panel rises and covers the screen; the content fades in behind it.
      later(() => {
        panel.classList.add("slide-up");
        mainContent?.classList.add("fade-in");

        // Phase 3: the panel sweeps up and off, revealing the page.
        later(() => {
          panel.classList.add("slide-away");

          // Phase 4: take both out of the layer tree.
          later(() => {
            preloader.style.display = "none";
            panel.style.display = "none";
          }, TIMING.cleanup);
        }, TIMING.slideAway);
      }, TIMING.slideUp);
    };

    // On window load: fill to 100%. animateProgressBar starts the reveal once the bar reads 100%,
    // after TIMING.settle, as in v2.
    const completeLoading = () => {
      loaded = true;
      updateProgressBar(100);
    };

    if (document.readyState === "complete") {
      completeLoading();
    } else {
      window.addEventListener("load", completeLoading, { once: true });
    }

    return () => {
      window.removeEventListener("load", completeLoading);
      frames.forEach((id) => cancelAnimationFrame(id));
      timers.forEach((id) => clearTimeout(id));
    };
  }, []);

  return (
    <>
      <div className="preloader" ref={preloaderRef}>
        <div className="preloader-bg"></div>
        <div className="preloader-content">
          <div className="loader-container">
            <div className="loader-text">
              {Array.from(brand).map((letter, i) => (
                <span key={i} className="loader-letter">
                  {letter}
                </span>
              ))}
            </div>
            <div className="loader-bar">
              <div className="loader-progress" ref={progressRef}></div>
            </div>
            <div className="loader-percentage" ref={percentageRef}>
              0%
            </div>
          </div>
        </div>
      </div>

      <div className="slide-reveal-panel" ref={panelRef}></div>
    </>
  );
}
