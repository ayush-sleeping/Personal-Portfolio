# Architecture — Next.js project (v3)

How the Next.js version of the portfolio is put together. For the plan and progress, see
[`version3.md`](version3.md). For the v2 HTML site, see [`docx.md`](docx.md).

---

## 1. The big picture

```text
┌──────────────┐  edit  ┌──────────────┐ every 6 h ┌───────────────────────┐
│    Ayush     ├───────▶│ Google Sheet ├──────────▶│ refresh-content.yml   │
└──────────────┘        └──────────────┘           │ fetch → validate →    │
                                                   │ commit assets/data/   │
                                                   └──────────┬────────────┘
                                                              │ JSON in the repo
                                                              ▼
                        ┌───────────────────────────────────────────────────┐
                        │ next build   (output: 'export')                   │
                        │  1. prebuild: scripts/validate-data.mjs           │
                        │  2. lib/data.ts reads assets/data/*.json          │
                        │  3. server components render the HTML             │
                        │  4. public/ copied as-is                          │
                        └──────────────────────────┬────────────────────────┘
                                                   ▼
                                     out/  — plain static files
                                     (index.html, 404.html, _next/, assets/ …)
```

- **Static export.** `next build` writes plain files to `out/`. There's no server, so it can run on free
  GitHub Pages like v2.
- **Content is baked in at build time.** The browser never fetches the JSON. Every piece of text is in the
  HTML, so crawlers that don't run JavaScript still see it. In v2, the browser filled it in.
- **The sheet pipeline is unchanged from v2:** `scripts/`, `sheets/`, `refresh-content.yml`, `assets/data/`.

## 2. Configuration

| File | Key settings |
|---|---|
| `next.config.ts` | `output: 'export'`, `images.unoptimized: true`, `basePath` from `NEXT_PUBLIC_BASE_PATH` (default `/Personal-Portfolio`), `trailingSlash: true` |
| `tsconfig.json` | `strict`, `@/*` → project root, excludes `version2/` |
| `eslint.config.mjs` | Next.js core-web-vitals + TypeScript rules, Prettier-compatible, ignores `version2/`, `out/`, `.next/` |
| `.nvmrc`, `package.json` `engines` | Node 22 (≥ 20.9) |

**`basePath`** is the URL prefix the site lives under. It's `/Personal-Portfolio` on GitHub Pages today. If
the repo is ever renamed to `ayush-sleeping.github.io`, set `NEXT_PUBLIC_BASE_PATH=""` and nothing else
changes. Code never hardcodes the prefix: it uses `asset()` from `lib/site.ts`.

## 3. The shared shell: `app/layout.tsx`

The `<html>`, `<head>` and `<body>` that every page shares.

**Stylesheets keep v2's exact order**, as plain `<link>` tags:

1. `public/assets/css/style.css`: the site's own CSS
2. Bootstrap 5.0.2 (CDN)
3. Remixicon 2.5.0 (CDN)
4. Font Awesome 6.0.0-beta3 (CDN)

**Why it matters:** Bootstrap loads *after* `style.css`, so where both set the same property on an element,
Bootstrap wins. The v2 look depends on those ties. Reordering, or bundling the CSS through Next.js, would
change it.

**Why `style.css` isn't imported into the bundle:** a bundler would process its `@import` of Google Fonts
and its paths, and could merge or reorder rules. Served as a plain file, it behaves byte for byte as in v2.

Also in the shell: the base meta tags, the favicon, Google Fonts preconnects, and the Font Awesome kit and
Ionicons scripts, loaded through `next/script`.

The shell doesn't include the portfolio's header, nav or footer. Those are components, built after v3.

## 4. Data layer: `lib/`

| File | Role |
|---|---|
| `lib/types.ts` | One TypeScript type per sheet tab. Mirrors `scripts/content-map.mjs`. |
| `lib/data.ts` | Typed getters (`getProfile()`, `getProjects()` …) that read `assets/data/*.json` with `fs` at build time. Server-only. |
| `lib/site.ts` | Site constants (name, URL, `basePath`) and `asset(path)`, which prefixes a public path with `basePath`. |

**Rules:**

- Only **server components** call `lib/data.ts`. It uses `fs`, so it can't run in the browser, by design.
- Sheet values are **strings**, as the pipeline writes them. Types say so, and the sections convert them
  where needed (`order`, booleans, lists split on `|` or `,`).
- **Bad content fails the build.** `prebuild` runs `scripts/validate-data.mjs`: the required columns, the
  row shapes, and every local image having `.avif` and `.webp` siblings under `public/`.

## 5. Components: server by default, client for behaviour

```text
components/
├── sections/   one component per portfolio section (Home, About, Projects, Services, Contact)
├── layout/     Header, Nav, Footer
├── cards/      reusable card markup (bento card, service card, project card …)
└── client/     'use client' components: behaviour only
```

- **Server components** render all markup and content. Most of the site is server components.
- **Client components** (`'use client'`) only add behaviour to markup that already exists: preloader,
  spotlight, GSAP scroll effect, scroll reveals, marquee, mobile menu, contact form. Each wraps the v2 script
  in a `useEffect` with cleanup.
- **Same markup as v2.** Components keep the v2 elements, classes and nesting, because `style.css` targets
  them.

These folders are empty at the end of v3, with a README each saying what goes there. They're filled while
building the portfolio (planned in `task.md`).

## 6. Assets

- `public/assets/img`, `public/assets/css`, `public/assets/video` hold everything the site serves. Paths
  match v2 (`assets/img/user/IMG_9358.jpg` etc.), so the relative image paths in the sheet JSON still work.
- Images come with **AVIF + WebP siblings** of each JPG/PNG. The validator enforces this.
- `next/image` optimisation is off (`images.unoptimized`). It needs a server, and the siblings already cover
  modern formats.

## 7. Local servers: `scripts/serve.mjs`

A dependency-free static server:

| Script | Serves | At |
|---|---|---|
| `npm run preview` | `out/` | `http://localhost:3000/Personal-Portfolio/` (mounted under `basePath`, like GitHub Pages) |
| `npm run v2` | `version2/` | `http://localhost:4000/` |

## 8. The `version2/` reference

The complete v2 site at the `v2-html-final` tag, gitignored, and excluded from ESLint, TypeScript, Prettier
and Playwright. It's there to open the old UI/UX side by side while building. Details:
[`version3.md`](version3.md) §5.1.

## 9. Tests and CI

- **Playwright** (`tests/`): phone (390 px), tablet (768 px) and desktop (1440 px) projects. The smoke test
  loads the built site through `npm run preview`, checks the name from the sheet data is on the page, the
  shell stylesheets loaded, and no page errors happened.
- **`ci.yml`**, on pushes to `v3-nextjs` and on pull requests: `npm ci` → `lint` → `typecheck` →
  `format:check` → `validate-data` → `build` → `test`. **No deploy.** Deployment is planned in `task.md`,
  together with the cutover from v2.
- `refresh-content.yml` and `liveness.yml` are unchanged, and scheduled workflows only run on `main`.
