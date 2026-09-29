# Portfolio v3 — Next.js Project Setup: Plan

> **Status: 🔄 IN PROGRESS — approved by Ayush on 2026-09-29.** Decisions D1–D4 taken as recommended (§4).
> Ayush asked for all phases to run back to back without a stop between them; progress is tracked in §9.
>
> Written: 2026-09-29 · Follows: [`version2.md`](version2.md) (closed) · Repo: `ayush-sleeping/Personal-Portfolio`

---

## Table of Contents

1. [The aim of v3](#1-the-aim-of-v3)
2. [What comes after v3](#2-what-comes-after-v3)
3. [Rules](#3-rules)
4. [Decisions needed before we start](#4-decisions-needed-before-we-start)
5. [Branch strategy — the live site never goes down](#5-branch-strategy--the-live-site-never-goes-down)
6. [Tech stack](#6-tech-stack)
7. [The core: what "ready" means](#7-the-core-what-ready-means)
8. [The getting-started docs](#8-the-getting-started-docs)
9. [Phases](#9-phases)
10. [Definition of done for v3](#10-definition-of-done-for-v3)
11. [Risks](#11-risks)
12. [Carried forward to `task.md`](#12-carried-forward-to-taskmd)

---

## 1. The aim of v3

**Set up the Next.js project, with all the important getting-started docs and a working core, so the
portfolio can be built on it.**

v3 is the **foundation only**:

- A new branch, `v3-nextjs`, holding a freshly installed and configured Next.js project.
- A local **`version2/` folder** on that branch: the complete v2 HTML site exactly as it is today, gitignored,
  so the old UI/UX is always open locally as a reference without going to GitHub (§5.1).
- The getting-started docs written first: `README.md`, `CLAUDE.md`, `documentation/architecture.md`.
- The core in place and working: config, folder structure, the shared page shell, the data layer that reads
  the Google Sheet JSON, the asset pipeline, tooling, tests and CI checks.
- **No portfolio sections are ported in v3.** The page shows a simple placeholder that proves the core works.

**The live HTML site is not touched.** It keeps running from `main` the whole time.

## 2. What comes after v3

When v3 is done:

1. We add **`task.md`** inside the Next.js project.
2. In `task.md` we plan the portfolio itself: the one-page layout with sections stacked one below the other,
   keeping the same UI/UX, the section order, and the rest.
3. We build it from that plan, systematically, task by task.

§12 lists what's already known for that planning, so nothing researched so far is lost.

## 3. Rules

| # | Rule |
|---|---|
| R1 | **Zero budget.** Free tiers and free npm packages only. |
| R2 | **`main` stays untouched.** All v3 work goes to the `v3-nextjs` branch. The live site keeps serving from `main`. |
| R3 | **Foundation only.** No portfolio sections, no visual design work in v3. That's planned in `task.md` afterwards. |
| R4 | **Docs before code.** The getting-started docs are written first, then kept true as the code lands. |
| R5 | **No new UI libraries.** No Tailwind, no component kits. The existing `style.css` and Bootstrap CSS stay the design system. |
| R6 | **The protocol** (`CLAUDE.md`): commits as Ayush Mishra `<ayushbm84@gmail.com>`, no Claude co-author trailer, push as `ayush-sleeping`. |
| R7 | **Small commits.** One step = one commit, with a clear message. |
| R8 | **Phase gates.** At the end of each phase: report, show proof (build output, test results), wait for Ayush's go. |
| R9 | **Standing decisions still apply:** keep the purple slide-reveal preloader, no blog, no gimmicks. |

## 4. Decisions needed before we start

| # | Question | Options | Recommendation |
|---|---|---|---|
| D1 | **TypeScript or JavaScript** | TS / JS | **TypeScript.** Typed sheet data catches broken content at build time, and it looks right on a backend engineer's code. |
| D2 | **Where the Next.js project lives on the branch** | (a) Repo root. (b) A `web/` subfolder. | **(a) Root.** The old site moves into `version2/` (§5.1), so the root is clean. No folder move later, and GitHub Actions and the sheet pipeline keep working from the root as they do now. |
| D3 | **`CLAUDE.md` stays local-only?** It's gitignored today ("local AI tooling, not part of the site"). | (a) Keep it local. (b) Commit it on the branch. | **(a) Keep local**, as you set it up. An untracked file doesn't change when you switch branches, so one `CLAUDE.md` covers both `main` and `v3-nextjs`, with a section for each. |
| D4 | **Visual-test tooling (Playwright) in the core** | (a) Set it up in v3, with one smoke test. (b) Add it later, while porting. | **(a).** The later port depends on screenshot comparison to keep the UI identical, so the tool should be ready and proven first. |

**Answers (2026-09-29):** D1 = TypeScript · D2 = (a) repo root · D3 = (a) `CLAUDE.md` stays local-only ·
D4 = (a) Playwright set up in v3.

The site URL (`basePath`) is **not** a v3 decision. The core reads it from one setting, so either URL works
later (§7).

## 5. Branch strategy — the live site never goes down

**How Pages works today:** GitHub Pages serves the `main` branch's files directly, with no build step. A
push to `main` is live about a minute later.

```
main ─────●─────●─────●─────────── live HTML site: untouched in v3
          │     (sheet bot content commits continue)
          │
          │ tag v2-html-final (a fixed restore point)
          │
v3-nextjs ●──P1──P2──P3──P4──P5──P6 ── Next.js core, never deployed
                                  │
                                  └─▶ after v3: task.md → portfolio port → cutover (planned in task.md)
```

1. **Tag `main` as `v2-html-final`.** A permanent restore point for the HTML site.
2. **Create `v3-nextjs` from `main` and push it.** Pages only serves `main`, so nothing on this branch is
   public. Pushing only backs the work up on GitHub.
3. **Move the old site into `version2/`** before installing anything (§5.1). On the branch, the root then
   holds only what the Next.js project reuses.
4. **Keep content in sync.** The sheet bot only commits to `main`. When it changes content, merge `main`
   into `v3-nextjs`. `assets/data/` keeps its path, so that merge stays clean. Scheduled workflows only run on
   the default branch, so the bot never runs twice.
5. **Test locally** with `npm run dev`, `npm run build` and `npm run preview`. **CI checks** run on the branch
   in GitHub Actions: lint, types, build and tests. Nothing is deployed.

### 5.1 The local `version2/` reference copy

**Why:** the Next.js build has to look exactly like today's site. The old site should always be one command
away, locally, without going to GitHub or switching branches.

**What it is:** a complete copy of the v2 site, **every file as it is in the repo today**, in a `version2/`
folder at the root of the `v3-nextjs` branch.

**How it's made (P2):**

1. `git archive v2-html-final | tar -x -C version2`: an exact copy of every tracked file at the tag. No
   `.git`, and no local-only files like `.env`.
2. **Gitignored** on the branch (`version2/` in `.gitignore`), **and** in `.git/info/exclude`. That second
   entry is local and covers every branch, so when you switch back to `main` the folder can't be committed
   there by accident.
3. Open it any time with **`npm run v2`**, which serves `version2/` at `http://localhost:4000`. It needs a
   local server, not a double-click, because the pages load their JSON with `fetch`.
4. Then clean the branch root. What moves where:

| Today's file | On `v3-nextjs` after P2 |
|---|---|
| `index.html`, `about.html`, `project.html`, `services.html`, `contact.html`, `resume.html`, `assets/js/` | **Removed from the root.** Still in `version2/`, and still live on `main`. |
| `assets/img/`, `assets/css/`, `assets/video/` | **Moved** to `public/assets/`, so they're served at the same URLs |
| `robots.txt`, `llms.txt`, `sitemap.xml` | **Moved** to `public/` |
| `assets/data/`, `scripts/`, `sheets/`, `.github/`, `documentation/`, `.env.example`, `.gitignore` | **Stay** at the root. The Next.js project reuses them. |
| `README.md` | Stays for now, rewritten in P3 |

**Facts to know:**

- `version2/` exists **only on this machine.** If it's deleted, or you clone on another computer, the same
  one command recreates it from the tag. That's why the `v2-html-final` tag must never move.
- It's a **snapshot**: its content is frozen at the tag, even if the sheet changes later. That's fine for a
  UI/UX reference.
- ESLint, TypeScript, Prettier and Playwright are all told to ignore it.
- `scripts/validate-data.mjs` checks image siblings on disk. On the branch it has to look under `public/`,
  because the images moved there. The JSON values stay `assets/img/...`, since that's still their URL.

## 6. Tech stack

All free. Versions checked on npm on 2026-09-29.

| Piece | Choice | Why |
|---|---|---|
| Framework | **Next.js 16.3.x**, App Router, `output: 'export'` | Static export = plain files, so it can stay on free GitHub Pages. No server needed. |
| UI runtime | React 19.3 (ships with Next 16) | — |
| Language | TypeScript, strict (if D1 = TS) | Typed sheet data |
| Node | 22 LTS locally (you have 22.16) and in CI. Next 16 needs ≥ 20.9. | Pinned with `.nvmrc` and `engines` |
| Package manager | npm | Already installed |
| Styling | The existing `style.css` + Bootstrap 5.0.2 CSS, loaded with plain `<link>` tags **in today's order** | Nothing gets rewritten or reordered (§7.3) |
| Lint / format | ESLint (as `create-next-app` sets it up) + Prettier | — |
| Tests | Playwright (`@playwright/test`), if D4 = (a) | Free; needed later for screenshot comparison |
| CI | GitHub Actions (free on public repos) | — |

Not used: Tailwind, UI kits, `next/image` optimisation (doesn't work with static export, and images already
have AVIF/WebP), server actions, API routes, anything that needs a server.

## 7. The core: what "ready" means

### 7.1 Configuration

- **`next.config.ts`**: `output: 'export'`, `images.unoptimized: true`, and `basePath` read from one env var.
  It's `/Personal-Portfolio` today, or empty if the repo is ever renamed to `ayush-sleeping.github.io`.
- **`tsconfig.json`**: strict mode, `@/` import alias.
- **`package.json` scripts:** `dev`, `build`, `preview` (serves `out/` locally), `lint`, `typecheck`,
  `format`, `validate-data`, `test`, and `v2` (serves the `version2/` reference at `localhost:4000`).
- **`.nvmrc`** = 22, and `engines.node` ≥ 20.9.
- **`.gitignore`**: add `node_modules/`, `.next/`, `out/`, `version2/`, and Playwright output. The existing
  entries stay.
- **Ignore `version2/`** in ESLint, `tsconfig.json`, Prettier and Playwright, so no tool scans the old site.

### 7.2 Folder structure

```
Personal-Portfolio/                      (v3-nextjs)
├── app/
│   ├── layout.tsx          the shared shell: <html>, <head>, stylesheets in order, fonts, icon scripts
│   ├── page.tsx            placeholder page that proves the core works (7.6)
│   └── not-found.tsx       basic 404
├── components/
│   ├── sections/           empty for now: the portfolio sections are built here after v3
│   ├── layout/             empty for now: header, nav, footer
│   ├── cards/              empty for now: reusable card markup
│   └── client/             empty for now: 'use client' behaviour (preloader, spotlight, GSAP …)
├── lib/
│   ├── data.ts             reads assets/data/*.json at build time
│   ├── types.ts            one TypeScript type per sheet tab
│   └── site.ts             site constants: URL, basePath, name
├── public/
│   ├── assets/             img/, css/, video/: moved here from /assets in P2, same URLs
│   └── robots.txt  llms.txt  sitemap.xml   (moved here in P2)
├── tests/                  Playwright config + smoke test
├── assets/data/            UNCHANGED: the sheet pipeline writes here, the build reads it
├── scripts/                UNCHANGED, except the validator's image path (§5.1)
├── sheets/                 UNCHANGED
├── documentation/          docx.md, version2.md, version3.md, architecture.md (new)
├── .github/workflows/      refresh-content.yml, liveness.yml (unchanged), ci.yml (new)
├── README.md               rewritten for the Next.js project
├── next.config.ts  tsconfig.json  package.json  .nvmrc  eslint + prettier config
└── version2/               GITIGNORED: the full v2 HTML site, local reference only (§5.1)
```

The empty folders hold a one-line `README.md` saying what goes there, so the structure is clear before
any code lands.

### 7.3 The shared shell (`app/layout.tsx`)

The `<head>` today's pages share, in one place:

- **Stylesheets in exactly today's order:** `style.css` → Bootstrap 5.0.2 → Remixicon → Font Awesome.
  Bootstrap loads *after* `style.css` today, so it wins some ties. The order is part of the look.
- `style.css` is served as a plain file, **not** imported into the bundler. Its Google Fonts `@import`,
  paths and rule order stay exactly as they are.
- Icon scripts (Font Awesome kit, Ionicons) through `next/script`.
- Base meta: charset, viewport, favicon, and theme colour.

The shell is **not** the portfolio's header, nav or footer. Those are built after v3.

### 7.4 Assets

Images, CSS and video live in `public/assets/`, moved there in P2 (§5.1). Next.js serves `public/` as-is,
so `assets/img/user/IMG_9358.jpg` keeps the same URL it has today, and the relative paths in the sheet JSON
still work.

If `main` changes an image later, merging `main` into the branch follows the move, because git detects the
rename.

### 7.5 Data layer

- **`lib/types.ts`**: one type per sheet tab: `site_profile`, `site_navigation`, `site_socials`,
  `site_footer_tech`, the six `page_*` tabs, and `projects`, `experience`, `education`, `skills`,
  `certifications`, `services`, `faqs`, `stats`. They mirror `scripts/content-map.mjs`.
- **`lib/data.ts`**: typed read functions (`getProfile()`, `getProjects()` …). They read the JSON **at build
  time**, so content ends up in the HTML, not fetched by the browser. That's what makes crawlers see
  everything.
- **The build fails** if `scripts/validate-data.mjs` fails, the same check the sheet pipeline already runs.
- **No change** to the sheet, its tabs, `refresh-content.yml` or `assets/data/` paths.

### 7.6 Placeholder page

`app/page.tsx` renders a plain block using the real shell and real data: the name, role and portrait from
`site_profile`, styled by the existing CSS. It proves that config, CSS, assets, `basePath` and the data layer
all work together, and it gets replaced during the port.

### 7.7 Tooling and CI

- **Playwright** (if D4 = a): config for phone (390), tablet (768) and desktop (1440) widths, plus one smoke
  test: the built page loads, shows the name from the data, and has no console errors.
- **`ci.yml`**: runs on pushes to `v3-nextjs` and on PRs: `npm ci` → `lint` → `typecheck` →
  `validate-data` → `build` → `test`. **It does not deploy.** The deploy workflow is planned in `task.md`
  with the cutover.
- `refresh-content.yml` and `liveness.yml` are **unchanged** in v3.

## 8. The getting-started docs

Written in P3, before any Next.js code, and updated at the end of v3 so they match what was built.

| File | Contents |
|---|---|
| **`README.md`** (rewritten on the branch) | What the project is. Requirements (Node 22, npm). Getting started: `npm install`, `npm run dev`, build, preview, lint, test. **The `version2/` reference:** what it is, `npm run v2`, and the one command that recreates it. How content works (sheet → JSON → build). Folder map. Where the docs are. Note that the live site is still the HTML version on `main`. |
| **`CLAUDE.md`** (local-only, D3) | The protocol, unchanged. Project overview with two parts: **`main`** = the live HTML site, and **`v3-nextjs`** = the Next.js project. Commands. Rules R1–R9. Where things go (components, lib, public). **`version2/` is read-only reference: never edit it, never commit it.** Pointer to `architecture.md`. |
| **`documentation/architecture.md`** (new) | How the Next.js project works: static export, build-time data flow (sheet → JSON → HTML), the shared shell and why the stylesheet order matters, where assets live, the `version2/` reference, server vs client components (client only for behaviour), CI. Short, with one diagram. |
| `documentation/version3.md` | This file: status → approved, then → done. |
| `documentation/docx.md` | **Not changed in v3.** It describes the live HTML site, which v3 doesn't change. |

## 9. Phases

Each phase ends with a **gate**: I report what was done with proof, and the next phase starts only after
you say go. Estimates are in working days.

| Phase | What | Exit criteria | Est. | Status |
|---|---|---|---|---|
| **P0 — Approve** | You approve this plan and answer D1–D4. Fix the `gh` login (needs you: remove the stale `GH_TOKEN` / `GITHUB_TOKEN` exports, then `gh auth login` as `ayush-sleeping`). | Plan status = approved; `gh auth status` shows `ayush-sleeping` | — | ✅ approved; `gh` login still pending (Ayush) |
| **P1 — Branch** | Tag `v2-html-final` on `main`. Create `v3-nextjs` from `main`, push it. | Branch and tag on GitHub; `main` unchanged; live site unchanged | 0.1 | ✅ `d5f6306`, tag `v2-html-final` |
| **P2 — `version2/` snapshot & clean root** | Create `version2/` from the tag and ignore it (§5.1). Check it runs locally with a server and looks the same as the live site. Then clean the root: remove the old pages and `assets/js/`, move `assets/img|css|video` and `robots.txt` / `llms.txt` / `sitemap.xml` into `public/`, and point the validator's image check at `public/`. | `version2/` opens at `localhost:4000` and matches the live site; `git status` doesn't list it; `validate-data` passes; `main` unchanged | 0.25 | ✅ |
| **P3 — Docs first** | Write `README.md`, `CLAUDE.md`, `documentation/architecture.md` describing the target setup. | Docs committed on the branch (`CLAUDE.md` saved locally) | 0.3 | ⬜ |
| **P4 — Install & configure** | Install Next.js 16.3 + React 19.3 + TypeScript. `create-next-app` won't install into a non-empty folder (the root still has `assets/data/`, `scripts/`, docs …), so it's generated in a scratch folder and the needed files copied in. Set up `next.config.ts`, `tsconfig`, ESLint, Prettier, `.nvmrc`, scripts, `.gitignore`. | `npm run dev` starts; `npm run build` produces `out/`; lint and typecheck pass | 0.3 | ⬜ |
| **P5 — Core** | Folder structure (7.2), shared shell (7.3), assets check (7.4), data layer + types (7.5), placeholder page (7.6). | The built page shows real data styled by the real CSS, at the right `basePath`; bad JSON fails the build | 0.5 | ⬜ |
| **P6 — Tooling, CI & close** | Playwright + smoke test (7.7). `ci.yml`. Update the docs to match what was built. Mark v3 done. | CI green on GitHub for `v3-nextjs`; docs match the code; `version3.md` = done | 0.3 | ⬜ |

**Total: about 1.75 working days.** Then the next step is `task.md` (§2).

## 10. Definition of done for v3

v3 is done when all of these are true:

- [ ] `v2-html-final` tag and `v3-nextjs` branch exist on GitHub.
- [ ] `main` and the live site are unchanged.
- [ ] `version2/` holds the full v2 site, opens with `npm run v2`, and is never tracked by git on any branch.
- [ ] The branch root has no old HTML pages or `assets/js/`; images, CSS and video are under `public/assets/`.
- [ ] `npm install && npm run build` works from a fresh clone, on Node 22.
- [ ] `npm run dev`, `preview`, `lint`, `typecheck`, `validate-data` and `test` all work.
- [ ] The placeholder page shows real sheet data, styled by the real `style.css`, with assets loading at the
      `basePath`.
- [ ] Broken JSON makes the build fail with a clear message.
- [ ] `ci.yml` is green on GitHub.
- [ ] `README.md`, `CLAUDE.md` and `architecture.md` describe exactly what exists.
- [ ] Every commit authored by Ayush, with no co-author trailer.

## 11. Risks

| Risk | Impact | Mitigation |
|---|---|---|
| `create-next-app` refuses the non-empty repo | Can't scaffold in place | Generate in a scratch folder and copy the files in (P3) |
| New `README.md` on the branch replaces the HTML-site README when merged | Docs mismatch later | The branch README states the HTML site is still live on `main`; the final README is settled at cutover |
| `CLAUDE.md` is gitignored | Not backed up in git | Your choice (D3). The file stays on this machine and works on both branches. |
| Sheet bot commits to `main` during v3 | Branch falls behind on content | Data paths unchanged → merging `main` in stays clean |
| `version2/` is local-only | Lost if the folder is deleted or on a new computer | Recreated with one command from the `v2-html-final` tag (§5.1); the tag never moves |
| `version2/` committed by accident on `main` | Old site duplicated in the repo | Ignored in `.git/info/exclude` too, which covers every branch |
| Tools scanning `version2/` | Slow or wrong lint and type errors | Explicit ignores in ESLint, TypeScript, Prettier, Playwright |
| Validator still looks for images in `assets/img/` | Build fails after the move | The image-sibling check points at `public/` in P2 |
| `gh` not logged in | Can't check CI from the CLI | Fixed in P0, or checked in the browser |

## 12. Carried forward to `task.md`

Already known, for the portfolio planning after v3. **Not part of v3.**

**Goal already set by Ayush:** one page, with the current pages stacked one below the other, and the **same
UI/UX** as today.

**Decisions to make there (with current recommendations):**

- Resume: merge into About; "Download PDF" prints a resume layout.
- Section order: Home → About → Projects → Services → Contact.
- Link cards repeated across pages (Credentials, Projects, GitHub, Profiles, CTA): show once, in the Home bento.
- Bootstrap JS: keep loading it as-is at first, replace it later.
- Site URL: rename the repo to `ayush-sleeping.github.io` at cutover (free; the name was available on 2026-09-29).
- Case studies: later, as expandable panels in Projects.
- 3D easter egg and terminal page: drop.
- The 4 images hotlinked from `wpriverthemes.com`: self-host, after confirming the GridX licence.

**Technical notes found so far:**

- **Proving parity:** Playwright screenshots of each old page's blocks, taken from `version2/` served locally
  (`npm run v2`), compared per section with the new page at 390, 768 and 1440 px. Anything different that isn't listed as
  intentional is a bug.
- **Old scripts to port as client components:** `preloader.js`, `main.js` (header, hamburger, `Spotlight`,
  GSAP ScrollTrigger), `scroll-animations.js`, `contactform.js`. Delete `render/*.js` and `data.js`, which
  server rendering replaces. Add an active-section highlighter for the one-page nav.
- **SEO:** one title with the surname in it, one set of OG tags, JSON-LD (`Person`, `WebSite`, `FAQPage`,
  `CreativeWork`), single-URL sitemap, updated `llms.txt`. Add redirect stubs for `about.html`, `project.html`,
  `services.html`, `contact.html` and `resume.html`, since GitHub Pages has no server redirects. After cutover,
  verify the site in Google Search Console.
- **Deploy:** `deploy.yml` (build → upload `out/` → deploy Pages). `refresh-content.yml` must call it
  directly, because commits pushed with `GITHUB_TOKEN` don't trigger other workflows. `liveness.yml` then
  checks page content, since the JSON is no longer served. The Pages source setting switches from branch to
  GitHub Actions.
- **Cutover and rollback:** create a `v2-html` branch from `main` before merging. Rollback = switch the
  Pages source back to that branch, about 2 minutes.

**v2 leftovers for the backlog:** dark/light toggle (M5), container queries (M3), GSAP → CSS (M1), replacing
Bootstrap (M10), Cloudflare Turnstile (M6) and Web Analytics (M11), GitHub widget (M12). Also Apps Script
deploy and confirming the sheet secrets (B21 Phases 0 and 2).
