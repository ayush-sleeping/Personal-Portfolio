# task.md — The one-page portfolio

> **Status: 🚧 IN PROGRESS.** Started 2026-10-07. Follows [`documentation/version3.md`](documentation/version3.md)
> (v3 foundation, done). Branch: `v3-nextjs`. `main` is not touched until the cutover (Phase 10), and that
> phase needs Ayush.

---

## 1. Goal

One page with the six v2 pages stacked as sections, in this order: **Home → About (with Resume) → Projects →
Services → Contact**. The UI/UX is the **same as v2**: same markup and classes, the same `style.css`, the same
purple slide-reveal preloader. Content comes from the sheet JSON at build time, never from hardcoded copy.

Reference for every phase: `version2/*.html` and `version2/assets/js/*`. Open it with `npm run v2`
(http://localhost:4000).

## 2. Decisions (taken as recommended in version3.md §12, Ayush can override any)

| # | Decision |
|---|---|
| T1 | Resume merges into the About section. "Download PDF" prints a resume layout (`@media print`). |
| T2 | Section order: Home → About → Projects → Services → Contact. Section ids: `home`, `about`, `projects`, `services`, `contact`. |
| T3 | Link cards that v2 repeats across pages (Credentials, Projects, GitHub, Profiles, "Let's talk" CTA) show **once**, in the Home bento. |
| T4 | Nav links become `#section` anchors. "Let's talk" goes to `#contact`. |
| T5 | Bootstrap JS keeps loading from the CDN as in v2, only if a section still needs it (accordion/collapse). Replaced later (backlog). |
| T6 | 3D easter egg and terminal page: dropped. |
| T7 | Case studies: later, as expandable panels in Projects (backlog). |
| T8 | The 4 images hotlinked from `wpriverthemes.com`: keep hotlinked for parity now. Self-hosting waits on Ayush confirming the GridX licence (Phase 8). |
| T9 | Repo rename to `ayush-sleeping.github.io`: decided at cutover (Phase 10), by Ayush. |
| T10 | Values v2 hardcoded in the HTML and the sheet doesn't have (Home card images, Services/Profiles icon classes) stay as constants in the component, with a comment. Moving them into the sheet is a later option for Ayush. |
| T11 | v3-only CSS goes in one file, `public/assets/css/v3.css`, loaded after the four v2 stylesheets: a reset for the section wrappers (v2 had no `<section>` elements, so `style.css`'s `section` rule never applied there) and the Phase 3 print styles. `style.css` stays unchanged. |

## 3. Team workflow

Three Claude sessions work in parallel:

| Role | Session | Owns |
|---|---|---|
| Manager | `personal-portfolio-a6` | `task.md`, assigning work, relaying test findings, reporting to Ayush |
| Developer | `personal-portfolio-42` | All source changes on `v3-nextjs`, in the main working tree |
| Tester / monitor | `personal-portfolio-4f` | Verifying each finished phase, in its own git worktree. Never edits the main tree |

**The loop:**

1. The developer finishes a phase, runs `npm run lint && npm run typecheck && npm run build`, commits
   (following the protocol in `CLAUDE.md`), and sends **both** the manager and the tester:
   `Phase N done at <sha>`, plus anything deliberately left out.
2. The developer **does not wait**. It starts the next phase right away.
3. The tester checks out that exact commit in its own worktree (below), verifies the phase against its
   checklist in §5, and reports to the **manager only**: pass, or a numbered list of misses (each with what
   v2 does, what v3 does, the file, and the width).
4. The manager sends any misses to the developer as **fix-ups**. The developer fits them into its current
   phase as separate small commits (`fix(phase N): …`), and reports their shas the same way.
5. The manager updates §6 (progress) in this file.

**Shared working tree rules:** only the developer edits the main tree and commits. Nobody pushes except the
developer, at the end of each phase, over SSH. The tester never runs `git checkout`, `git stash` or any
other command that changes the main tree's files or HEAD.

**Tester's worktree** (a separate folder, so the developer's work in progress never gets in the way):

```bash
git worktree add --detach ../Personal-Portfolio-test <sha>   # first time
cd ../Personal-Portfolio-test && git checkout --detach <sha>  # each later phase
npm ci                                                        # own install: Turbopack rejects a node_modules symlink outside the project root
npm run build && npm test                                     # serves out/ at :3000/Personal-Portfolio/
```

v2 for comparison runs from the main tree: `npm run v2` → http://localhost:4000 (read-only).

**Ports:** `3001` is the dev server for Ayush (live reloading, no base path). `3000` is the tester's
`preview` / Playwright. `4000` is v2. Nobody else starts a server on these ports.

## 4. Ground rules (from CLAUDE.md, restated)

- Same UI/UX as v2: reuse `public/assets/css/style.css` **unchanged**, keep v2's classes, keep the stylesheet
  order. No Tailwind, no component kits.
- Server components by default. `'use client'` only for behaviour, each wrapping the matching v2 script in
  `useEffect` with cleanup. `lib/data.ts` is server-only.
- Never hardcode `/Personal-Portfolio`: use `asset()` / `basePath` from `lib/site.ts`.
- Don't hand-edit `assets/data/*.json`. If a section needs data the sheet doesn't have, stop and tell the
  manager.
- Small commits, one step each. `lint`, `typecheck` and `build` pass before every commit.

## 5. Phases

Every phase ends with a working build and a page that renders without console errors at 390, 768 and 1440 px.
"Matches v2" means: same blocks, same order inside the block, same text (from the sheet), same classes, same
look at all three widths, same hover/animation behaviour. Anything different that isn't listed as intentional
here is a bug.

### Phase 1 — The shell

Source: the shared part of every v2 page (`version2/index.html` lines ~111–227, footer ~476+ in
`resume.html`), `preloader.js`, `main.js`.

- `components/layout/`: Header (logo, navbar, hamburger, "Let's talk"), the slide-out navigation menu
  (`.navigation__menu`: header, categories, separator, socials, footer), and the page footer.
- `components/client/`: Preloader (the purple slide-reveal, **unchanged** timing) and the mobile menu
  (hamburger open/close). Spotlight from `main.js` if it is part of the shell.
- `app/page.tsx`: replace the placeholder with the shell plus five empty `<section id="…">` blocks in the
  order of T2, so the anchors work from day one.
- Nav and menu links are anchors (T4). Nav labels and socials come from the sheet (`getNavigation()` and the
  socials data), as v2's `site-render.js` did.
- Check before porting: v2's `main.js` calls `gsap` but no v2 page loads GSAP. Port what v2 actually
  does in the browser, not what the dead code says, and note it in the commit message.

**Tester checks:** preloader looks and times the same as v2; header and slide-out menu match v2 at all three
widths; hamburger opens and closes the menu; every nav link scrolls to its section; no console errors; no
hardcoded `/Personal-Portfolio`; the existing smoke test still passes (update it if the placeholder marker it
checks is gone).

### Phase 2 — Home section

Source: `version2/index.html` body, `render/home-render.js`.

- The bento grid in v2's order: intro card (name, photo, tagline), Credentials, Projects, GitHub, Services
  Offering, Profiles, stats (`02+`, `25+`), "Let's talk" CTA, marquee.
- Card links point to anchors (`#about`, `#projects`, …), not to `.html` pages.
- `components/cards/` for the cards reused later.

**Tester checks:** every block of v2's home is present, in order, with the same text; card links go to the
right sections; marquee animates as in v2; screenshots at 390/768/1440 match v2's `index.html`.

### Phase 3 — About section (with Resume)

Source: `version2/about.html`, `version2/resume.html`, `render/about-render.js`.

- About blocks: Experience, Education, Certifications, Skills & Technologies, social icons.
- Resume content merged in (T1) without repeating what About already shows. "Download PDF" prints a resume
  layout with `@media print`, added in a new stylesheet, never by editing `style.css`.
- The repeated link cards (Credentials, Projects, GitHub, Profiles, CTA) are **not** repeated here (T3).

**Tester checks:** every About block and every Resume fact (each job, each school, each skill) appears
once; print preview gives a clean resume; no duplicated link cards.

### Phase 4 — Projects section

Source: `version2/project.html`, `render/project-render.js`.

- Project cards from the sheet, in v2's order, with the same links and images. The Skills & Technologies
  block that v2 repeats here appears only once on the page (in About).

**Tester checks:** same projects, order, images, links and hover states as v2.

### Phase 5 — Services section

Source: `version2/services.html`, `render/services-render.js`.

**Tester checks:** same services, text, icons and layout as v2; repeated cards not duplicated (T3).

### Phase 6 — Contact section and FAQ

Source: `version2/contact.html`, `contactform.js`, `render/faq-render.js`.

- Contact block ("Get in touch_") and the form, with EmailJS loaded as in v2.
- The form is a client component porting `contactform.js`: same validation, messages and EmailJS call.
  Keys come from where v2 reads them; nothing secret is committed.
- FAQ accordion from the sheet (Bootstrap collapse, T5).

**Tester checks:** form validation messages match v2; a submit reaches EmailJS (or fails with v2's
message); FAQ opens and closes; layout matches v2.

### Phase 7 — Behaviour and polish

Source: `scroll-animations.js`, the rest of `main.js`.

- Scroll reveals for cards (`ScrollCardAnimations`) as a client component.
- Active-section highlighter for the nav (new: the one-page site needs it).
- `/site.webmanifest`: add a real manifest or drop the link (found during v3).

**Tester checks:** cards reveal on scroll as in v2; the nav highlights the section in view; with JavaScript
off all content is still visible; no 404s in the network log.

### Phase 8 — SEO and crawlers

- One title with the surname, one set of OG/Twitter tags, JSON-LD (`Person`, `WebSite`, `FAQPage`,
  `CreativeWork`).
- Single-URL `sitemap.xml`, updated `llms.txt`, `robots.txt`.
- Redirect stubs for `about.html`, `project.html`, `services.html`, `contact.html`, `resume.html` → the
  matching `#section`, since GitHub Pages has no server redirects.
- Self-hosted images: only after Ayush confirms the GridX licence (T8).

**Tester checks:** JSON-LD validates; every old `.html` URL lands on the right section under
`/Personal-Portfolio/`; the sitemap lists one URL.

### Phase 9 — Parity proof

- Playwright tests that screenshot each v2 block (served by `npm run v2`) and the matching v3 section at
  390, 768 and 1440 px, and compare them. Intentional differences (T1–T6) are listed in the test.
- Fix every unlisted difference.

**Tester checks:** the parity suite passes; the diffs that remain are all on the intentional list.

### Phase 10 — Deploy and cutover (needs Ayush)

Not started without Ayush's go-ahead.

- `deploy.yml` (build → upload `out/` → deploy Pages). `refresh-content.yml` calls it directly, because
  pushes made with `GITHUB_TOKEN` don't trigger other workflows. `liveness.yml` checks page content.
- Create the `v2-html` branch from `main`, merge, switch the Pages source to GitHub Actions. Rollback =
  switch the source back to `v2-html` (about 2 minutes).
- After cutover: verify in Google Search Console.

### Backlog (after parity, not in this plan)

Dark/light toggle (M5), container queries (M3), GSAP → CSS (M1), replacing Bootstrap (M10), Cloudflare
Turnstile (M6) and Web Analytics (M11), GitHub widget (M12), case studies (T7). Needs Ayush: the sheet
secrets and the Apps Script deploy (B21 Phases 0 and 2), and the `gh` login as `ayush-sleeping`.

## 6. Progress

| Phase | Developer | Commit(s) | Tester | Fix-ups |
|---|---|---|---|---|
| 1 Shell | ✅ done | `a02ea85` `d86d912` `112a2e6` | ✅ pass, 1 miss | F1.1 preloader bar stops short of 100% · F1.2 ionicons preload warning |
| 2 Home | 🚧 started | | | |
| 3 About + Resume | | | | |
| 4 Projects | | | | |
| 5 Services | | | | |
| 6 Contact + FAQ | | | | |
| 7 Behaviour | | | | |
| 8 SEO | | | | |
| 9 Parity | | | | |
| 10 Cutover | ⏸ needs Ayush | | | |

**Intentional differences from v2, recorded as they come up** (the tester does not report these):

- Phase 1: v2's GSAP block (no page loads GSAP, and its targets don't exist, so it only threw errors),
  Spotlight (no `[data-spotlight]` element) and the dead `.navbar.active` handling are not ported. A menu link
  now closes the slide-out menu, since it scrolls instead of loading a page. The hamburger gets `aria-label` /
  `aria-expanded`. Home stays `.active` in the nav until Phase 7. With JavaScript off, `.main-content` stays at
  opacity 0, as in v2, until Phase 7 fixes it.
- Phase 2: v2's Home bento nests `<a>` inside `<a>`, which the browser's parser splits apart. v3 renders the
  DOM the browser actually builds (same elements, same clickable areas), without the empty zero-height `<a>`
  the parser leaves before those cards.
