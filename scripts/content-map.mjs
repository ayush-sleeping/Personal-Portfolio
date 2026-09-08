// Single source of truth for the content pipeline.
//
// Every consumer — the GitHub Action, the local fetcher, the validator, the
// CSV exporter and the browser data layer — derives its list of files from
// here, so a new tab is added in exactly one place.
//
// Google Sheets has no folders, so tabs are flat and prefixed. The `file`
// field is where the tab lands under assets/data/.
//
// kind:
//   'rows'      -> tab is a table with a header row; JSON is an array of objects
//   'keyvalue'  -> tab has `key` / `value` columns; JSON is a single object
//
// Anything under site/ or pages/ is copy that used to be hardcoded in the HTML.
// Anything under collections/ is a repeating list.

export const CONTENT = [
  // ---------------------------------------------------------------- site-wide
  { tab: 'site_profile',      file: 'site/profile.json',       kind: 'keyvalue',
    required: ['name', 'tagline', 'email'] },
  { tab: 'site_navigation',   file: 'site/navigation.json',    kind: 'rows',
    required: ['id', 'label', 'href', 'order'] },
  { tab: 'site_socials',      file: 'site/socials.json',       kind: 'rows',
    required: ['id', 'label', 'href', 'order'], optional: ['icon_class', 'show_in_nav'] },
  { tab: 'site_footer_tech',  file: 'site/footer-tech.json',   kind: 'rows',
    required: ['id', 'tooltip', 'order'], optional: ['icon_class', 'icon_html'] },

  // ------------------------------------------------------------- page copy
  { tab: 'page_home',         file: 'pages/home.json',         kind: 'keyvalue' },
  { tab: 'page_about',        file: 'pages/about.json',        kind: 'keyvalue' },
  { tab: 'page_projects',     file: 'pages/projects.json',     kind: 'keyvalue' },
  { tab: 'page_services',     file: 'pages/services.json',     kind: 'keyvalue' },
  { tab: 'page_contact',      file: 'pages/contact.json',      kind: 'keyvalue' },
  { tab: 'page_resume',       file: 'pages/resume.json',       kind: 'keyvalue' },

  // ------------------------------------------------------------ collections
  { tab: 'projects',          file: 'collections/projects.json',       kind: 'rows',
    required: ['id', 'title', 'summary', 'image_url', 'order'],
    optional: ['slug', 'description', 'tech_stack', 'github_url', 'live_url', 'category', 'year', 'featured'] },
  { tab: 'experience',        file: 'collections/experience.json',     kind: 'rows',
    required: ['id', 'date_label', 'title', 'company', 'order'],
    optional: ['location', 'duration_label', 'description', 'details'] },
  { tab: 'education',         file: 'collections/education.json',      kind: 'rows',
    required: ['id', 'date_label', 'title', 'company', 'order'],
    optional: ['location', 'duration_label', 'description', 'details'] },
  { tab: 'skills',            file: 'collections/skills.json',         kind: 'rows',
    required: ['id', 'name', 'category', 'group', 'order'],
    optional: ['group_label', 'level', 'icon_class'],
    enums: { group: ['established', 'focusing'] } },
  { tab: 'certifications',    file: 'collections/certifications.json', kind: 'rows',
    required: ['id', 'title', 'image_url', 'order'],
    optional: ['issuer', 'issued_date', 'credential_url', 'alt_text'] },
  { tab: 'services',          file: 'collections/services.json',       kind: 'rows',
    required: ['id', 'title', 'order'],
    optional: ['icon_class', 'summary', 'bullet_points'] },
  { tab: 'faqs',              file: 'collections/faqs.json',           kind: 'rows',
    required: ['id', 'question', 'answer', 'order'], optional: ['category'] },
  { tab: 'stats',             file: 'collections/stats.json',          kind: 'rows',
    required: ['id', 'value', 'label', 'order'], optional: ['value_style'] },
  { tab: 'blog_posts',        file: 'collections/blog-posts.json',     kind: 'rows',
    required: ['id', 'slug', 'title', 'status'],
    optional: ['excerpt', 'cover_image', 'published_date', 'tags', 'content_md'],
    allowEmpty: true },
];

export const DATA_DIR = 'assets/data';
export const byTab = (tab) => CONTENT.find((c) => c.tab === tab);
export const tabs = () => CONTENT.map((c) => c.tab);
