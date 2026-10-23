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
        {/* v3-only CSS (section reset, no-JS reveal), then the v4 design's stylesheet, last. */}
        <link rel="stylesheet" href={asset("assets/css/v3.css")} />
        <link rel="stylesheet" href={asset("assets/css/v4.css")} />
      </head>
      <body style={{ backgroundColor: "#0F0F0F" }}>
        {children}

        {/* Bootstrap's JS, as the v4 design loads it (its CSS is still in use). */}
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
