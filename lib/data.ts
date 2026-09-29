// Build-time content access. Reads the JSON the Google Sheet pipeline commits to assets/data/.
//
// Server-only by design: it uses the filesystem, and content is meant to be written into the HTML
// at build time so crawlers see it without running JavaScript. Import it from server components
// only; `server-only` turns a client import into a build error.
import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";

import type {
  Certification,
  Faq,
  FooterTech,
  NavItem,
  PageCopy,
  PageId,
  Profile,
  Project,
  Service,
  Skill,
  Social,
  Stat,
  TimelineEntry,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "assets", "data");

// Same file read many times during one build (every section asks for the profile, etc.).
const cache = new Map<string, unknown>();

function read<T>(file: string): T {
  const cached = cache.get(file);
  if (cached !== undefined) return cached as T;

  const full = path.join(DATA_DIR, file);
  let parsed: T;
  try {
    parsed = JSON.parse(readFileSync(full, "utf8")) as T;
  } catch (err) {
    // Fail the build loudly: a missing or broken content file must never ship as an empty page.
    throw new Error(
      `Content file assets/data/${file} is missing or not valid JSON. ` +
        `Run \`npm run validate-data\` for details.`,
      { cause: err },
    );
  }
  cache.set(file, parsed);
  return parsed;
}

/** Rows sorted by their numeric `order` column, as every v2 renderer did. */
function sorted<T extends { order: string }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => Number(a.order) - Number(b.order));
}

// ------------------------------------------------------------------ site-wide
export const getProfile = () => read<Profile>("site/profile.json");
export const getNavigation = () => sorted(read<NavItem[]>("site/navigation.json"));
export const getSocials = () => sorted(read<Social[]>("site/socials.json"));
export const getFooterTech = () => sorted(read<FooterTech[]>("site/footer-tech.json"));

// ------------------------------------------------------------------ page copy
export const getPageCopy = (page: PageId) => read<PageCopy>(`pages/${page}.json`);

// ----------------------------------------------------------------- collections
export const getProjects = () => sorted(read<Project[]>("collections/projects.json"));
export const getExperience = () => sorted(read<TimelineEntry[]>("collections/experience.json"));
export const getEducation = () => sorted(read<TimelineEntry[]>("collections/education.json"));
export const getSkills = () => sorted(read<Skill[]>("collections/skills.json"));
export const getCertifications = () =>
  sorted(read<Certification[]>("collections/certifications.json"));
export const getServices = () => sorted(read<Service[]>("collections/services.json"));
export const getFaqs = () => sorted(read<Faq[]>("collections/faqs.json"));
export const getStats = () => sorted(read<Stat[]>("collections/stats.json"));

// ------------------------------------------------------------------ helpers

/** Split a sheet list cell ("a | b | c") into trimmed, non-empty items. */
export function splitList(value: string | undefined, separator = "|"): string[] {
  return (value ?? "")
    .split(separator)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Split "Title::Description | Title::Description" cells (services, info rows) into pairs. */
export function splitPairs(value: string | undefined): { label: string; value: string }[] {
  return splitList(value).map((item) => {
    const [label, ...rest] = item.split("::");
    return { label: label.trim(), value: rest.join("::").trim() };
  });
}

/** Sheet booleans are the strings "TRUE" / "FALSE". */
export const isTrue = (value: string | undefined) => value?.trim().toUpperCase() === "TRUE";
