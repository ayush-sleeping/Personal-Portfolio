// Basic 404, exported as out/404.html (GitHub Pages serves it for unknown URLs).
//
// After the rename to ayush-sleeping.github.io (task.md T9) the site moves from /Personal-Portfolio/
// to the root, and every old link (bookmarks, search results, v2's .html pages) would land here.
// When the build has no basePath, a tiny inline script forwards /Personal-Portfolio/<rest> to
// /<rest>, keeping the query and the hash, so they still reach the right section (the .html
// redirect stubs take it from there). location.replace keeps the 404 out of the history. With a
// basePath (before the rename) the script isn't rendered at all.
import Link from "next/link";

import { LEGACY_BASE_PATH, basePath } from "@/lib/site";

const forwardOldLinks = `(function () {
  var prefix = ${JSON.stringify(LEGACY_BASE_PATH)};
  var l = window.location;
  if (l.pathname === prefix || l.pathname.indexOf(prefix + "/") === 0) {
    l.replace((l.pathname.slice(prefix.length) || "/") + l.search + l.hash);
  }
})();`;

export default function NotFound() {
  return (
    <main className="container py-5 text-center">
      {basePath === "" && <script dangerouslySetInnerHTML={{ __html: forwardOldLinks }} />}
      <h1>Page not found</h1>
      <p className="text-secondary">This page doesn&apos;t exist.</p>
      <Link href="/">Back to the portfolio</Link>
    </main>
  );
}
