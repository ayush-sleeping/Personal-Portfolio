// One type per Google Sheet tab, mirroring scripts/content-map.mjs (the pipeline's single source
// of truth). Every value is a string, exactly as the pipeline writes it: numbers ("order"),
// booleans ("TRUE"/"FALSE") and lists ("a | b", "a, b") are converted where they're used.
//
// Required columns are plain fields; optional columns are `?:`. Keep this file in step with
// content-map.mjs when a tab or column changes.

/** A key/value tab: one object of copy. */
export type KeyValue = Record<string, string>;

// ------------------------------------------------------------------ site-wide

export interface Profile extends KeyValue {
  name: string;
  tagline: string;
  email: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  order: string;
}

export interface Social {
  id: string;
  label: string;
  href: string;
  order: string;
  icon_class?: string;
  show_in_nav?: string;
}

export interface FooterTech {
  id: string;
  tooltip: string;
  order: string;
  icon_class?: string;
  icon_html?: string;
}

// ------------------------------------------------------------------ page copy

export type PageId = "home" | "about" | "projects" | "services" | "contact" | "resume";
export type PageCopy = KeyValue;

// ----------------------------------------------------------------- collections

export interface Project {
  id: string;
  title: string;
  summary: string;
  image_url: string;
  order: string;
  slug?: string;
  description?: string;
  tech_stack?: string;
  github_url?: string;
  live_url?: string;
  category?: string;
  year?: string;
  featured?: string;
}

/** experience and education share one shape. */
export interface TimelineEntry {
  id: string;
  date_label: string;
  title: string;
  company: string;
  order: string;
  location?: string;
  duration_label?: string;
  description?: string;
  details?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  group: "established" | "focusing";
  order: string;
  group_label?: string;
  level?: string;
  icon_class?: string;
}

export interface Certification {
  id: string;
  title: string;
  image_url: string;
  order: string;
  issuer?: string;
  issued_date?: string;
  credential_url?: string;
  alt_text?: string;
}

export interface Service {
  id: string;
  title: string;
  order: string;
  icon_class?: string;
  summary?: string;
  bullet_points?: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  order: string;
  category?: string;
}

export interface Stat {
  id: string;
  value: string;
  label: string;
  order: string;
  value_style?: string;
}
