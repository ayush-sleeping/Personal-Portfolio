// JSON-LD for search engines and AI crawlers (task.md Phase 8): one @graph with the Person, the
// WebSite, the FAQ and the projects, all from the sheet data the page itself renders. Replaces v2's
// hand-written Person and WebSite blocks.
import { getExperience, getFaqs, getProfile, getProjects, getSkills, getSocials } from "@/lib/data";
import { SITE, absoluteAsset, assetOrUrl } from "@/lib/site";

const PERSON_ID = `${SITE.url}#person`;
const WEBSITE_ID = `${SITE.url}#website`;

/** Sheet text without its inline HTML (<br>, <strong> …), for plain-text JSON-LD values. */
function plain(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** "Laravel, PHP" and "Laravel + PHP" both become ["Laravel", "PHP"]. */
const splitTech = (value: string) =>
  value
    .split(/[,+]/)
    .map((t) => t.trim())
    .filter(Boolean);

export default function StructuredData() {
  const profile = getProfile();
  const current = getExperience()[0];
  const [locality, region, country] = profile.location.split(",").map((p) => p.trim());

  const person = {
    "@type": "Person",
    "@id": PERSON_ID,
    name: profile.name,
    alternateName: profile.brand,
    jobTitle: current?.title || profile.role,
    description: plain(profile.bio),
    url: SITE.url,
    image: absoluteAsset(profile.profile_image),
    email: `mailto:${profile.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: locality,
      addressRegion: region,
      addressCountry: country,
    },
    ...(current?.company && { worksFor: { "@type": "Organization", name: current.company } }),
    knowsAbout: [...new Set(getSkills().flatMap((s) => splitTech(s.name)))],
    sameAs: getSocials()
      .map((s) => s.href)
      .filter((href) => /^https?:\/\//.test(href)),
  };

  const website = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: profile.og_site_name || SITE.name,
    alternateName: profile.brand,
    url: SITE.url,
    inLanguage: "en",
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
  };

  const faq = {
    "@type": "FAQPage",
    "@id": `${SITE.url}#faq`,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: getFaqs().map((f) => ({
      "@type": "Question",
      name: plain(f.question),
      acceptedAnswer: { "@type": "Answer", text: plain(f.answer) },
    })),
  };

  const projects = getProjects().map((p) => ({
    "@type": "CreativeWork",
    "@id": `${SITE.url}#project-${p.slug || p.id}`,
    name: p.title,
    description: plain(p.description || p.summary),
    url: p.live_url || p.github_url || `${SITE.url}#projects`,
    ...(p.image_url && { image: new URL(assetOrUrl(p.image_url), SITE.origin).href }),
    keywords: splitTech(p.tech_stack ?? "").join(", "),
    ...(p.category && { genre: p.category }),
    creator: { "@id": PERSON_ID },
  }));

  const graph = {
    "@context": "https://schema.org",
    "@graph": [person, website, faq, ...projects],
  };

  return (
    <script
      type="application/ld+json"
      // Escape "<" so sheet text can never close the script tag (Next.js JSON-LD guide).
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }}
    />
  );
}
