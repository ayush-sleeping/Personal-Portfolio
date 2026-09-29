// Site-wide constants and URL helpers. Safe to import from server and client components.

/** URL prefix the site is served under. Set once in next.config.ts. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/Personal-Portfolio";

export const SITE = {
  name: "Ayush Mishra",
  origin: "https://ayush-sleeping.github.io",
  /** Public URL of the site root, with a trailing slash. */
  url: `https://ayush-sleeping.github.io${basePath}/`,
  themeColor: "#5B78F6",
} as const;

/**
 * URL for a file in public/, prefixed with basePath.
 * Next.js doesn't add basePath to plain <link>, <img> or <source> URLs, so every public path
 * goes through here. Accepts paths as the sheet stores them ("assets/img/ayush sign.png").
 */
export function asset(path: string): string {
  return encodeURI(`${basePath}/${path.replace(/^\/+/, "")}`);
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
