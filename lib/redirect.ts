// Redirect pages for v2's old URLs (task.md Phase 8). GitHub Pages has no server redirects, so each
// old .html page becomes a tiny static page that sends visitors, and search engines, to the
// matching section of the one-page site. Each app/<page>.html/route.ts serves one of them.
import { SITE, type SectionId } from "./site";

const escape = (value: string) =>
  value.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export function redirectPage(section: SectionId, label: string): Response {
  // Relative, so it lands on the same site it was served from: production, preview, or after a
  // repo rename. The old pages sit next to index.html, so "./" is the site root.
  const target = `./#${section}`;
  const href = escape(target);
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(label)} | ${escape(SITE.name)}</title>
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="${escape(SITE.url)}">
<meta http-equiv="refresh" content="0; url=${href}">
<script>location.replace(${JSON.stringify(target).replace(/</g, "\\u003c")});</script>
<style>body{margin:0;padding:2rem;background:#0F0F0F;color:#bcbcbc;font-family:system-ui,sans-serif}a{color:#5B78F6}</style>
</head>
<body>
<p>This page has moved to <a href="${href}">the ${escape(label)} section</a>.</p>
</body>
</html>
`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
