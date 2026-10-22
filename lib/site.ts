// Site-wide constants and URL helpers. Safe to import from server and client components.
import type { CSSProperties } from "react";

/**
 * The prefix GitHub Pages serves the site under while the repo is named Personal-Portfolio. After
 * the rename to ayush-sleeping.github.io (task.md T9) the site is at the root, and the 404 page
 * forwards old links that still carry this prefix (app/not-found.tsx).
 */
export const LEGACY_BASE_PATH = "/Personal-Portfolio";

/** URL prefix the site is served under. Set once in next.config.ts. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? LEGACY_BASE_PATH;

export const SITE = {
  name: "Ayush Mishra",
  origin: "https://ayush-sleeping.github.io",
  /** Public URL of the site root, with a trailing slash. */
  url: `https://ayush-sleeping.github.io${basePath}/`,
  themeColor: "#5B78F6",
  /** Linked from the footer's "View source on GitHub". */
  repoUrl: "https://github.com/ayush-sleeping/Personal-Portfolio",
} as const;

/**
 * The one-page sections, top to bottom (task.md T2). Each id is also its nav anchor and matches
 * the `id` column of the navigation sheet tab.
 */
export const SECTION_IDS = ["home", "about", "projects", "services", "contact"] as const;
export type SectionId = (typeof SECTION_IDS)[number];

/** In-page anchor for a section (task.md T4: nav links are anchors, not .html pages). */
export const sectionHref = (id: string) => `#${id}`;

/** Card decorations: the textured background, the circled arrow and the two stars. */
export const DECOR = {
  cardBg: asset("assets/img/decor/card-texture.png"),
  arrow: asset("assets/img/decor/arrow.svg"),
  ctaStar: asset("assets/img/decor/hanging-star.svg"),
  marqueeStar: asset("assets/img/decor/marquee-star.svg"),
} as const;

/**
 * Inline styles with `!important`, as v2 writes them (style.css has `!important` rules, such as
 * `h2 { font-size: 1.8rem !important }`, that only an inline `!important` beats).
 *
 * React can't set `!important` from the client, but it serialises the value verbatim into the
 * server HTML and hydration compares the same string, so on this statically exported site the
 * declaration reaches the browser intact. Only use it on server-rendered markup.
 */
export function important(style: Record<string, string>): CSSProperties {
  return Object.fromEntries(
    Object.entries(style).map(([prop, value]) => [prop, `${value} !important`]),
  );
}

/**
 * Sheet text as HTML with only simple inline tags let through (<strong>, <em>, <b>, <i>, <br>),
 * as v2's faq-render.js did: escape everything, then restore just those tags.
 */
export function inlineHtml(value: string): string {
  const escaped = value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
  return escaped.replace(
    /&lt;(\/?)(strong|em|b|i|br)\s*\/?&gt;/gi,
    (_, slash: string, tag: string) => `<${slash}${tag.toLowerCase()}>`,
  );
}

/** A CSS declaration string from the sheet ("font-size: 18px !important;") as a style object. */
export function parseInlineStyle(css: string | undefined): CSSProperties | undefined {
  const entries = (css ?? "")
    .split(";")
    .map((decl) => decl.split(/:(.*)/s, 2).map((s) => s.trim()))
    .filter(([prop, value]) => prop && value)
    .map(([prop, value]) => [prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()), value]);
  return entries.length ? Object.fromEntries(entries) : undefined;
}

/**
 * URL for a file in public/, prefixed with basePath.
 * Next.js doesn't add basePath to plain <link>, <img> or <source> URLs, so every public path
 * goes through here. Accepts paths as the sheet stores them ("assets/img/ayush sign.png").
 */
export function asset(path: string): string {
  return encodeURI(`${basePath}/${path.replace(/^\/+/, "")}`);
}

/** A sheet URL cell: remote URLs pass through, public/ paths get basePath via asset(). */
export function assetOrUrl(path: string): string {
  return /^https?:\/\//i.test(path) ? path : asset(path);
}

/** Absolute URL for a public file, for OG images, canonical links and JSON-LD. */
export function absoluteAsset(path: string): string {
  return `${SITE.origin}${asset(path)}`;
}

/**
 * The <picture> sources for a local raster image. Every local .jpg/.png ships with .avif and
 * .webp siblings (scripts/validate-data.mjs enforces it), matching v2's pictureHtml().
 * Remote URLs and non-raster files return only the fallback.
 */
export function pictureSources(path: string): { avif?: string; webp?: string; src: string } {
  const isRemote = /^https?:\/\//i.test(path);
  const raster = /\.(png|jpe?g)$/i;
  if (isRemote) return { src: path };
  if (!raster.test(path)) return { src: asset(path) };
  const base = path.replace(raster, "");
  return { avif: asset(`${base}.avif`), webp: asset(`${base}.webp`), src: asset(path) };
}
