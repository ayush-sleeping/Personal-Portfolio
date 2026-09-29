import type { NextConfig } from "next";

// The URL prefix the site is served under. GitHub Pages serves this repo at
// /Personal-Portfolio. If the repo is ever renamed to ayush-sleeping.github.io,
// build with NEXT_PUBLIC_BASE_PATH="" and nothing else needs to change.
// lib/site.ts reads the same variable, so public/ asset URLs stay in step.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/Personal-Portfolio";

const nextConfig: NextConfig = {
  // Plain static files in out/, so the site runs on free GitHub Pages.
  output: "export",
  basePath,
  // GitHub Pages serves /Personal-Portfolio/ -> index.html; keep URLs folder-style.
  trailingSlash: true,
  // Image optimisation needs a server. Images already ship AVIF + WebP siblings.
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
