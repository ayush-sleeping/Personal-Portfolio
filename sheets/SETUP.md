# Google Sheets CMS — setup

The site already renders from `assets/data/*.json`, which is committed to the
repo. Those files were seeded from the old hardcoded HTML, so **the site works
right now with no Google account involved.**

This guide connects the sheet so that editing a cell updates the site.

---

## What you need to do (once)

### 1. Create the spreadsheet

Create a Google Sheet named **`portfolio-cms`**. It needs one tab per CSV in
`sheets/seed-csv/` — the filename *is* the tab name:

**Site-wide** (shared by every page)
`site_profile` · `site_navigation` · `site_socials` · `site_footer_tech`

**Page copy** (one tab per page)
`page_home` · `page_about` · `page_projects` · `page_services` · `page_contact` · `page_resume`

**Collections** (repeating lists)
`projects` · `experience` · `education` · `skills` · `certifications`
`services` · `faqs` · `stats` · `blog_posts`

Plus `contact_submissions`, which the form creates by itself.

For each tab: **File → Import → Upload → pick `sheets/seed-csv/<tab>.csv` →
Import location: "Replace current sheet" → Separator: Comma.**

There are two tab shapes, and the CSV already matches the right one:

- **Key/value tabs** (`site_profile`, every `page_*`) have exactly two columns,
  `key` and `value` — one setting per row.
- **Row tabs** (everything else) have a header row and one record per row.

Column names must match exactly; the pipeline matches by header name, not
position. `blog_posts` has no seed CSV — create it with just a header row:
`id, slug, title, excerpt, cover_image, published_date, tags, content_md, status`

Then **Share → Anyone with the link → Viewer.**

### 2. Get a read-only API key

1. [Google Cloud Console](https://console.cloud.google.com/) → **New Project**.
2. **APIs & Services → Library → Google Sheets API → Enable.**
3. **Credentials → Create credentials → API key.**
4. **Restrict key → API restrictions → Google Sheets API only.**
5. **Do not enable billing on this project.** Without billing, an exposed key
   cannot generate charges.

### 3. Add the repo secrets

GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Name | Value |
|---|---|
| `SHEET_ID` | the long id in the sheet URL, between `/d/` and `/edit` |
| `GOOGLE_API_KEY` | the key from step 2 |

### 4. Run it

**Actions → "Refresh content from Google Sheet" → Run workflow.**

It fetches every tab, validates the whole set, and commits `assets/data/*.json`
only if something changed. After that it runs itself every 6 hours.

If the run fails, the error names the tab and row. Nothing is committed on a
failed validation, so a bad edit can't reach the live site.

### 5. (Optional) Wire the contact form to the sheet

The form currently emails via EmailJS only. To also log submissions:

1. In the spreadsheet: **Extensions → Apps Script**.
2. Replace `Code.gs` with `sheets/apps-script/Code.gs`.
3. **Project Settings → Script Properties**, add:
   - `SHEET_ID` — same id as above
   - `TOKEN` — any random string you invent
4. **Deploy → New deployment → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the `/exec` URL.
6. In `assets/js/contactform.js`, set:
   ```js
   const APPS_SCRIPT_URL = "https://script.google.com/macros/s/.../exec";
   const SHARED_TOKEN    = "the TOKEN you set";
   ```

While `APPS_SCRIPT_URL` is empty the logging is skipped and the form behaves
exactly as before, so this step is safe to defer.

To keep the script in version control: `npm i -g @google/clasp`, `clasp login`,
`clasp clone <scriptId>` into `sheets/apps-script/`.

---

## How to update content, afterwards

Edit the cell in the sheet. Either wait up to 6 hours, or click
**Actions → Refresh content from Google Sheet → Run workflow** for an immediate
update. No code change, no deploy.

---

## Where each tab lands

`scripts/content-map.mjs` is the single source of truth mapping tab → file.
Add a tab there and the Action, the local fetcher, the validator and the CSV
exporter all pick it up.

```
assets/data/
├── site/          profile, navigation, socials, footer-tech   (shared)
├── pages/         home, about, projects, services, contact, resume  (page copy)
└── collections/   projects, experience, education, skills,
                   certifications, services, faqs, stats, blog-posts
```

## How the text on a page is filled in

Page copy is applied by `assets/js/render/site-render.js` through attributes in
the HTML:

| Attribute | Effect |
|---|---|
| `data-text="heading"` | element's text is replaced with the `heading` key |
| `data-html="body_html"` | element's markup is replaced (keys ending `_html` only) |
| `data-render="projects"` | container is filled by a collection renderer |
| `data-page="about"` | on `<body>`; picks which `pages/*.json` to apply |

So adding a new editable string is: add the key to the sheet, add
`data-text="that_key"` to the element. No renderer change.

## Cell format conventions

| Convention | Where | Example |
|---|---|---|
| `order` sorts rows | every tab | `1`, `2`, `3` |
| `id` must be unique within a tab | every tab | `larabasex` |
| Comma-separated list | `tech_stack` | `Laravel 12, ReactJS, MySQL` |
| `label::value` pairs, `\|`-separated | `details`, `bullet_points` | `Backend::Laravel + PHP \| Frontend::React` |
| Booleans as literal text | `featured` | `TRUE` / `FALSE` |
| Limited inline HTML allowed | `faqs.answer`, `projects.summary` | `<strong>`, `<em>`, `<br>` |

Anything else in those cells is escaped, so a stray `<script>` in the sheet
cannot execute on the site.

---

## Local development

```bash
node scripts/validate-data.mjs           # check assets/data against the schema
node scripts/validate-data.mjs --dry-run # report problems without failing
node scripts/json-to-csv.mjs             # regenerate sheets/seed-csv from assets/data
python3 -m http.server 8000              # then open http://localhost:8000
```

### Pulling the sheet locally

The website needs no environment variables — it is static and reads only the
committed JSON. But you can run the same fetch the Action runs, against your own
sheet, before trusting CI:

```bash
cp .env.example .env                 # fill in SHEET_ID and GOOGLE_API_KEY
node scripts/fetch-sheet.mjs --dry-run   # fetch + validate, write nothing
node scripts/fetch-sheet.mjs             # fetch + validate + update assets/data
git diff assets/data                     # review before committing
```

`.env` is gitignored. It is only for this script — in CI the same two names are
GitHub Actions secrets, not a file. If a tab fails to fetch or the set fails
validation, `assets/data` is rolled back untouched.

A plain `file://` open will **not** work — the renderers are ES modules and are
blocked by CORS on the file protocol. Use a local server.

---

## Architecture, in one line

The browser never talks to Google. A GitHub Action reads the sheet on a cron,
validates it, and commits plain JSON that ships on the Pages CDN — so reads cost
zero latency, have no quota ceiling, and leak no API key. Writes go the other
way, through an Apps Script web app. Full rationale in
[`../documentation/improvements-and-system-design.md`](../documentation/improvements-and-system-design.md) §B9–B22.
