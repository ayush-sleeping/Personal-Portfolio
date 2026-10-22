// The shared shell: <html>, <head> and <body> for the whole site.
//
// The stylesheets are plain <link> tags in v2's exact order, and style.css is served from public/
// rather than imported into the bundle. Both matter for keeping the v2 look; see
// documentation/architecture.md §3 before changing anything here.
//
// SEO: one title, one description and one set of OG / Twitter tags for the one-page site, all from
// the sheet's profile (task.md Phase 8). The structured data is rendered by the page.
import type { Metadata, Viewport } from "next";

import { getProfile, getSocials } from "@/lib/data";
import { SITE, absoluteAsset, asset } from "@/lib/site";

const profile = getProfile();
const title = `${profile.name} | ${profile.role} Portfolio`;
const description = profile.meta_description;
const shareImage = { url: absoluteAsset(profile.hero_image), alt: profile.name };
const twitterHandle = getSocials()
  .find((s) => s.id === "twitter")
  ?.href.match(/(?:twitter|x)\.com\/([^/?#]+)/)?.[1];

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title,
  description,
  keywords: profile.meta_keywords
    ?.split(",")
    .map((k) => k.trim())
    .filter(Boolean),
  authors: [{ name: SITE.name, url: SITE.url }],
  alternates: { canonical: SITE.url },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: SITE.url,
    title: profile.og_title || title,
    description,
    siteName: profile.og_site_name || SITE.name,
    locale: "en_US",
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: profile.og_title || title,
    description,
    images: [shareImage],
    creator: twitterHandle && `@${twitterHandle}`,
  },
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
    // Ionicons' loader adds class="hydrated" to <html> before React hydrates; that one attribute
    // is expected to differ from the server HTML.
    <html lang="en" suppressHydrationWarning>
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
        {/* Font Awesome kit, where v2 had it: a blocking script after Bootstrap, so the FA 5
            styles it injects land before the FA 6 link below and FA 6 wins. Run any later (as
            next/script does) and FA 5 wins: different glyphs. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts -- must run during head parsing */}
        <script src="https://kit.fontawesome.com/4bff2ef1c5.js" crossOrigin="anonymous"></script>
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

        {/* Ionicons, as at the end of v2's <body>. Plain tags, not next/script: next/script
            preloads both files without crossorigin, so the module preload goes unused (a console
            warning) and module browsers also download the nomodule build, which v2 never did.
            Neither blocks parsing: module scripts are deferred, and module browsers skip nomodule. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts -- deferred: type="module" */}
        <script
          type="module"
          src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
        ></script>
        {/* eslint-disable-next-line @next/next/no-sync-scripts -- never runs in module browsers */}
        <script noModule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
        {/* Bootstrap's JS, for the certifications carousel, the why-hire modal and the FAQ
            accordion (task.md T5).
            v2 loaded it at the end of <body>; defer runs it at the same point. */}
        <script
          defer
          src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.0.2/js/bootstrap.bundle.min.js"
        ></script>
        {/* EmailJS for the contact form (components/client/ContactForm), as v2's contact.html
            loaded it. */}
        <script
          defer
          src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"
        ></script>
      </body>
    </html>
  );
}
