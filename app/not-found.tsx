// Basic 404, exported as out/404.html (GitHub Pages serves it for unknown URLs).
// The styled version is built with the portfolio (task.md).
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container py-5 text-center">
      <h1>Page not found</h1>
      <p className="text-secondary">This page doesn&apos;t exist.</p>
      <Link href="/">Back to the portfolio</Link>
    </main>
  );
}
