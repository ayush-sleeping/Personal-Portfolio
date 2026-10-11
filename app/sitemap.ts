// The sitemap: one URL, since the whole portfolio is one page (task.md Phase 8). Served at
// sitemap.xml under basePath. lastModified is the build date; every content refresh rebuilds.
import type { MetadataRoute } from "next";

import { SITE } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE.url, lastModified: new Date(), changeFrequency: "monthly", priority: 1 }];
}
