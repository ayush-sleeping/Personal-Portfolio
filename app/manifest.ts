// The web app manifest (v2 linked /site.webmanifest, which never existed: a 404 on every page).
// Next.js serves this at manifest.webmanifest under basePath and links it from <head>.
// Name and brand come from the sheet; the colours are the site's theme and background.
import type { MetadataRoute } from "next";

import { getProfile } from "@/lib/data";
import { SITE, asset, basePath } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const profile = getProfile();
  return {
    name: `${profile.name} | ${profile.role}`,
    short_name: profile.brand,
    // TODO(sheet): site_profile.meta_description (T12), once it exists.
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: "standalone",
    background_color: "#0F0F0F",
    theme_color: SITE.themeColor,
    icons: [
      { src: asset("assets/img/favicon-portfolio.svg"), sizes: "any", type: "image/svg+xml" },
    ],
  };
}
