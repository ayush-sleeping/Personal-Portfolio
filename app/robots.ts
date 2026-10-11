// robots.txt: every crawler, search and AI alike, is allowed explicitly. This is a portfolio; the
// point is to be found and quoted. A crawler obeys only the most specific group that names it, so
// each AI crawler gets its own group rather than relying on "*".
//
// Crawlers only read robots.txt at the host root, so this file takes effect once the site is
// served from ayush-sleeping.github.io/ (the repo rename, task.md T9). Until then the sitemap is
// found through Search Console and the <link rel="canonical">.
import type { MetadataRoute } from "next";

import { SITE } from "@/lib/site";

export const dynamic = "force-static";

const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE.url}sitemap.xml`,
  };
}
