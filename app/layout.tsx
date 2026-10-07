// The shared shell: <html>, <head> and <body> for the whole site.
//
// The stylesheets are plain <link> tags in v2's exact order, and style.css is served from public/
// rather than imported into the bundle. Both matter for keeping the v2 look; see
// documentation/architecture.md §3 before changing anything here.
//
// Page-specific SEO (final title, OG tags, JSON-LD) is planned in task.md with the portfolio.
import type { Metadata, Viewport } from "next";
import Script from "next/script";

import { SITE, asset } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "Ayush Mishra | Backend Developer Portfolio",
  description:
    "Ayush Mishra, FullStack Web Developer in Mumbai. Scalable web apps and REST APIs in Laravel, PHP and MySQL, React on the frontend, now building with Python, Django and Next.js.",
  authors: [{ name: SITE.name }],
  robots: { index: true, follow: true },
  icons: {
    icon: { url: asset("assets/img/favicon-portfolio.svg"), type: "image/svg+xml" },
    apple: asset("assets/img/favicon-portfolio.svg"),
  },
  other: { "msapplication-TileColor": SITE.themeColor },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: SITE.themeColor,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" />
        <link rel="preconnect" href="https://kit.fontawesome.com" />

        {/* v2 order. Bootstrap after style.css wins ties the v2 look depends on. */}
        <link rel="stylesheet" href={asset("assets/css/style.css")} />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.0.2/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
          integrity="sha512-Fo3rlrZj/k7ujTnHg4CGR2D7kSs0v4LLanw2qksYuRlEzO+tcaEPQogQ0KaoGN26/zrn20ImR1DfuLWnOo7aBA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/* v3-only CSS, last so it can correct for the one-page structure. See its header. */}
        <link rel="stylesheet" href={asset("assets/css/v3.css")} />
      </head>
      <body style={{ backgroundColor: "#0F0F0F" }}>
        {children}

        {/* Social icons kit (v2 loaded it in <head>). */}
        <Script
          src="https://kit.fontawesome.com/4bff2ef1c5.js"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* Ionicons, as at the end of v2's <body>. */}
        <Script
          type="module"
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
          strategy="afterInteractive"
        />
        <Script
          noModule
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
