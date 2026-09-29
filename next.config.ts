import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default function config(phase: string): NextConfig {
  // The URL prefix the site is served under. GitHub Pages serves this repo at /Personal-Portfolio,
  // so build, preview and CI use that. `npm run dev` uses no prefix, so http://localhost:3000/
  // opens the site directly. If the repo is ever renamed to ayush-sleeping.github.io, build with
  // NEXT_PUBLIC_BASE_PATH="". lib/site.ts reads the same variable, so public/ asset URLs stay in
  // step in every mode.
  const basePath =
    process.env.NEXT_PUBLIC_BASE_PATH ??
    (phase === PHASE_DEVELOPMENT_SERVER ? "" : "/Personal-Portfolio");

  return {
    // Plain static files in out/, so the site runs on free GitHub Pages.
    output: "export",
    basePath,
    // GitHub Pages serves /Personal-Portfolio/ -> index.html; keep URLs folder-style.
    trailingSlash: true,
    // Image optimisation needs a server. Images already ship AVIF + WebP siblings.
    images: { unoptimized: true },
    env: { NEXT_PUBLIC_BASE_PATH: basePath },
  };
}
