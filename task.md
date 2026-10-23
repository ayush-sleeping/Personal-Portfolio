# task.md — The one-page portfolio

> **Status: 🚧 IN PROGRESS.** Started 2026-10-07. **2026-10-22/23: Phase 10 done through 10C; v3 is live at
> https://ayush-sleeping.github.io/ from `main`. 2026-10-24: Phase 11 (the v4 redesign, §5) started on branch
> `v4-redesign`.** Follows [`documentation/version3.md`](documentation/version3.md) (v3 foundation, done).
> `main` is live; only Phase 11F touches it again.
>
> **Phase 11 overrides §1, §2 T1–T5 and §4 wherever they say "same as v2".** The design in
> `documentation/design/v4.dc.html` is the single source of truth for the UI from now on.

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
| T8 | The 4 decorative images v2 hotlinked (card texture, circled arrow, CTA star, marquee star): replaced on 2026-10-11 (Ayush) with our own originals in `public/assets/img/decor/`, served locally. |
| T9 | Repo rename to `ayush-sleeping.github.io`: **approved by Ayush on 2026-10-11**, done at cutover (Phase 10) together with deploying v3, not before. The site moves to `https://ayush-sleeping.github.io/`; build with `NEXT_PUBLIC_BASE_PATH=""`. Old `/Personal-Portfolio/` links need a plan (they 404 after the rename). The profile README repo `ayush-sleeping/ayush-sleeping` is unrelated and untouched. |
| T10 | Values v2 hardcoded in the HTML and the sheet doesn't have (Home card images, Services/Profiles icon classes) stay as constants in the component, with a comment. Moving them into the sheet is a later option for Ayush. |
| T12 | **Content v2 hardcoded in the HTML goes into the Google Sheet first** (Ayush, 2026-10-07): job company/location and stack lines, the Anudip entry, the college, course codes, schooling, the certifications intro, the whyHire text, and the like. Until it's in the sheet, the spot renders nothing and carries `TODO(sheet)`. Ayush's follow-up rulings: the sheet wins every conflict with `resume.html`; the per-job resume summaries are dropped (About shows each job's `description`); both "why hire" texts read **"Why should you hire me?"**; UI labels and the Home card images go in the sheet too, so T10 now covers only the icon classes. The new keys and columns are in `sheets/seed-csv/` (`d96f665`) and reach `assets/data/` after Ayush creates the sheet and the first fetch runs. That unblocks 3b. Until then (Ayush, 2026-10-11: use the JSON only), `getPageCopy()` fills page keys the JSON lacks from `sheets/seed-csv/page_*.csv`, so UI labels such as "Contact Me", "Live Demo" and the form messages don't render empty; the JSON wins once the sheet has the key. Experience and education rows get the same fallback for blank cells (3b). |
| T11 | v3-only CSS goes in one file, `public/assets/css/v3.css`, loaded after the four v2 stylesheets: a reset for the section wrappers (v2 had no `<section>` elements, so `style.css`'s `section` rule never applied there) and the Phase 3 print styles. `style.css` stays unchanged. |

## 3. Team workflow

Three Claude sessions work in parallel:

| Role | Session | Owns |
|---|---|---|
| Manager | `personal-portfolio-9c` | `task.md`, assigning work, relaying test findings, reporting to Ayush |
| Developer | `personal-portfolio-9b` | All source changes on the working branch (`v3-nextjs`; `v4-redesign` from Phase 11), in the main working tree |
| Tester / monitor | `personal-portfolio-77` | Verifying each finished phase, in its own git worktree. Never edits the main tree |

(Sessions changed on 2026-10-22. Earlier phases ran with `a6` / `42` / `4f`.)

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
npm run build && npm test                                     # serves out/ at :7310/Personal-Portfolio/
```

v2 for comparison runs from the main tree: `npm run v2` → http://localhost:4000 (read-only).

**Ports** (moved off 3000 on 2026-10-11: another project's Docker container holds it): `7300` is the dev
server (live reloading, no base path), `7301` is `npm run preview` (the built site under `/Personal-Portfolio/`),
`7310` is Playwright's own server, `4000` is v2. The Docker services use the same 7300 / 7301.

## 4. Ground rules (from CLAUDE.md, restated)

- ~~Same UI/UX as v2: reuse `public/assets/css/style.css` **unchanged**, keep v2's classes~~ **Superseded by
  Phase 11 (2026-10-24):** the UI/UX is the v4 design, 1:1. `style.css` still loads (the marquee, the footer
  tech icons and the old print rules use it) but may now change where the design needs it. New CSS goes in
  `public/assets/css/v4.css` as classes, never inline. Keep the stylesheet order. No Tailwind, no component kits.
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

**Tester checks:** JSON-LD validates; every old `.html` URL lands on the right section under
`/Personal-Portfolio/`; the sitemap lists one URL.

### Phase 9 — Parity proof

- Playwright tests that screenshot each v2 block (served by `npm run v2`) and the matching v3 section at
  390, 768 and 1440 px, and compare them. Intentional differences (T1–T6) are listed in the test.
- Fix every unlisted difference.

**Tester checks:** the parity suite passes; the diffs that remain are all on the intentional list.

### Phase 10 — Deploy and cutover (planned 2026-10-22)

Split into 10A–10F. 10A and 10B change nothing live and run now, in parallel. 10C needs Ayush's go-ahead.
Facts this plan rests on (checked 2026-10-22): `main` (`d5f6306`) is an ancestor of `v3-nextjs`, so the merge
is a fast-forward. Pages builds from branch `main` (legacy). `ayush-sleeping/ayush-sleeping.github.io`
doesn't exist yet, so the T9 rename is free. The repo has no Actions secrets yet. Other repos (DailyBuzz,
WriteOn …) keep their own `/<repo>/` Pages paths after the rename.

**10A — Pre-flight (tester).** In the tester worktree at `761600d`: `npm ci`, `npm run build`, `npm test`
(smoke, resume and parity at 390/768/1440). Parity was last proven before 3b, so this is the re-check.
Report pass, or numbered misses.

**10B — Deploy setup (developer; nothing goes live).** One commit per item, each checked by the tester:

1. `deploy.yml`: on push to `main`, manual run, and `workflow_call`. Node from `.nvmrc`, `npm ci`, build,
   upload `out/`, deploy Pages. `NEXT_PUBLIC_BASE_PATH` comes from `actions/configure-pages`' `base_path`
   output, so the same file builds `/Personal-Portfolio` before the T9 rename and `""` after it.
2. Old links after the rename: `app/not-found.tsx` (the exported `404.html`) sends any
   `/Personal-Portfolio/<rest>` URL to `/<rest>`, keeping the hash, so old bookmarks and the old `.html`
   redirect stubs still land on the right section. It does nothing when `basePath` isn't `""`.
3. A root build check: build with `NEXT_PUBLIC_BASE_PATH=""` and run the smoke tests at `/`, locally and in
   `ci.yml` (`preview` and `playwright.config.ts` take the base from the same variable).
4. `refresh-content.yml`: Node 20 → `.nvmrc`; after a content commit, call `deploy.yml` (pushes made with
   `GITHUB_TOKEN` trigger nothing). Bot identity unchanged.
5. `liveness.yml`: v3 doesn't publish `assets/data/`, so check the page itself: the site root and one old
   `.html` stub return 200 and contain known text (the name, each section id). Base URL from one variable.
6. `ci.yml`: also run on pushes to `main`; drop the "live site is still v2" comment.
7. Untrack the five committed `.DS_Store` files (`.gitignore` already lists it).

**10C — Cutover (Ayush's go-ahead; one sitting, ~15 min).** Create `v2-html` from `main` and push it.
Rename the repo to `ayush-sleeping.github.io` (T9) and update the local remote. Fast-forward `main` to
`v3-nextjs`, push. Switch Pages to "GitHub Actions" and watch the first deploy. Tester checks the live site:
5 sections × 3 widths, old `/Personal-Portfolio/` and `.html` URLs land on the right section, no 404s or
console errors, contact form sends, Download PDF prints. Rollback: Pages source back to branch `v2-html`
(v2 runs at the root, as `npm run v2` shows); renaming back restores the old path.

**10D — After launch.** Ayush: Search Console (new root property, submit `sitemap.xml`). Team: liveness green
for 3 days; `SITE.repoUrl`, README, `architecture.md`, `CLAUDE.md` and this file updated to "v3 live on
`main`".

**10E — Content pipeline (needs Ayush).** Sheet + `SHEET_ID` / `GOOGLE_API_KEY` secrets (`sheets/SETUP.md`),
Apps Script deploy (B21 Phases 0 and 2). Then: one manual refresh, confirm the bot commit triggers a deploy.

**10F — Backlog**, below, one item per round after 10D. Needs Ayush first: may `style.css` change now that
parity is proven (M3, M5, M10 need it)? The preloader stays either way.

**10C result (2026-10-23):** `v2-html` branch and tag `v2-html-final` at `d5f6306`; repo renamed to
`ayush-sleeping/ayush-sleeping.github.io`; Pages switched to GitHub Actions; `main` fast-forwarded to
`266aa49`; CI run 39730817342 and deploy run 39731432704 green. Live checks: root 200 with the 5 section ids,
`about.html` / `sitemap.xml` / `robots.txt` / `404.html` 200, all 12 old URLs land on the right section,
`/DailyBuzz/` untouched. 10D and 10E are still open and now run alongside Phase 11.

### Phase 11 — The v4 redesign (started 2026-10-24)

**Source of truth:** `documentation/design/v4.dc.html`, Ayush's redesign made in Claude Design over several
days. It is split for reading into `v4-styles.css` (its style block), `v4-template.html` (its markup; `{{ }}`,
`<sc-for>` and `<sc-if>` are the design tool's template syntax) and `v4-logic.js` (its behaviour; `DCLogic` is
the design tool's React wrapper). **Ayush's ruling: nothing in the design is dropped or changed.** Anything the
old site had and the design does not show (the why-hire modal, the purple preloader, the slide-out menu, the
old header) is **not** ported. The design's colours, fonts, Bootstrap, Remixicon and Font Awesome are the
ones already loaded; no new library.

**What carries over from v3 unchanged (invisible plumbing):** content from the sheet JSON via `lib/data.ts`
(the design hardcodes its strings; every one of them already exists in `assets/data/`, same field names);
the real EmailJS send in `ContactForm.tsx` (honeypot, "fill in all fields", 5-second clear); SEO metadata,
structured data, sitemap, robots, llms.txt, manifest; the old `.html` redirect routes and the 404 forwarder;
print-to-PDF; the data pipeline and validator; Docker, CI, deploy, liveness.

**Facts checked 2026-10-24:** the download's `style.css`, `v3.css`, all 24 JSON files and all images are
byte-identical to the repo. The design's two "GitHub" links use the old repo name; use `SITE.repoUrl`. The
design's "Last updated on Oct 2026" and the footer copyright come from the sheet (`profile.copyright`, or a
new `last_updated` key: `TODO(sheet)` until then).

Section ids, top to bottom: `home`, `about`, `experience`, `education`, `certifications`, `skills`,
`projects` (each project also gets `id="project-<slug>"`), `services`, `contact`, `faq`, then the un-id'd
Help band and the footer. `resume.html` now redirects to `#experience`; the other `.html` stubs keep their
targets.

**11A — Prep (manager, then developer).**
1. ✅ Branch `v4-redesign` from `v3-nextjs`; design files into `documentation/design/`; this plan; rule
   changes in `CLAUDE.md` and §4 (manager, this commit).
2. Developer: `public/assets/css/v4.css`. Start from `v4-styles.css`, then turn every inline `style=""` and
   `style-hover=""` in the template into classes (`v4-` prefix, one class per distinct style string; a
   `style-hover` becomes `.cls:hover`). Load it last in `layout.tsx`, after `v3.css`. Move the print rules
   that target `#about` into `v4.css` and point them at `#about`, `#experience`, `#education`, `#skills`.
3. Developer: `lib/site.ts` `SECTION_IDS` → the ten ids above; `llms.txt` notes for the new ids;
   `resume.html` → `experience`; `SITE.repoUrl` → `ayush-sleeping.github.io`.

**11B — Shell (developer; tester verifies at 390/768/1440).**
1. `components/layout/Sidebar.tsx` (server markup from navigation, projects and socials JSON) +
   `components/client/SidebarDrawer.tsx`: open/close, backdrop, Escape, body scroll lock, closes on a hash
   link click and when the viewport reaches 1024 px (the design's `drawer` state).
2. `components/layout/TopBar.tsx` (mobile only, sticky, with search, "Let's talk" and the drawer toggle).
3. Remove `Header.tsx`, `NavigationMenu.tsx`, `MobileMenu.tsx`, `StickyHeader.tsx`, `Preloader.tsx`,
   `WhyHire.tsx`, `WhyHireModal.tsx`, `ScrollCardAnimations.tsx` and their CSS hooks in `v3.css`.
4. `ActiveSection.tsx` rewritten: the `active` (5 nav ids, top ≤ 120 px) and `activeItem` (all spy ids,
   top ≤ 140 px, last id when scrolled to the bottom) rules, the `parent` state for Career/Projects, and the
   sliding `[data-ind]` indicator (`_placeInd` in `v4-logic.js`).
5. `Footer.tsx` rewritten: four columns (brand + tagline, Sections, first 5 Projects, Connect), the
   `home__socials` tech row from `footer-tech.json` plus the two inline SVGs (Django, Next.js), copyright and
   "View source on GitHub".
6. `app/page.tsx` assembles: progress bar, backdrop, sidebar, `main-content` with top bar, `<main>` with the
   ten sections, Help band, footer, then the certificate lightbox, search palette, back-to-top and toast.

**11C — Sections (developer, one commit each; tester verifies each).**
1. Home: breadcrumb, `<h1>`, typed terminal line (client; 650 ms start, 38/70 ms per char), intro, three
   buttons, then the 12-column bento: photo card (span 4, row-span 3), marquee (8), Credentials (4),
   Projects (4), stats (8, three cells from `stats.json`; the chips from the sheet's stack line), GitHub (3),
   Services Offering (6), Profiles (3), CTA (12).
2. About: heading + bio from `about.json`, the 7-item info grid (`profile`/`about` keys; icons per
   `INFO_ICONS` in `v4-logic.js`, a T10 constant).
3. Experience: first three rows as "Professional" with chips grouped from `details` (`Backend::…`), the
   "Current role" pill on the first, then the rest as "Training & programs · during college" rows with the
   stack line. The sheet's `order` decides the split, as the design's `slice(0, 3)` does.
4. Education: cards with icon, dates, title, linked school (`institution_url`), location · duration,
   description, and the course list parsed into `code` / `name` (`/^([A-Z]{2,}\d+)\s*:\s*(.+)$/`).
5. Certifications: heading, intro, prev/next buttons, snap scroller (4 per row, 82% on phones), and the
   lightbox (`components/client/CertLightbox.tsx`: Escape, ←/→, prev/next/close buttons, "n / total",
   body scroll lock, fade/pop animations). Replaces the Bootstrap carousel.
6. Skills: "Established / Working With" and "Currently Focusing On" grids from `skills.json`
   (`SKILL_ICONS` as a T10 constant; focus items get the blue icon box).
7. Projects: `auto-fill 320px` grid, `article id="project-<slug>"`, 16:10 image, title + year, category,
   summary with `<br>` flattened, tag chips from `tech_stack`, Source and (if `live_url`) Live demo links.
8. Services: cards from `services.json` with the check-list from `bullet_points`.
9. Contact: left column heading, blurb and the 5 contact rows (`contact.json` + socials); right card
   "Let's work together." wrapping the existing `ContactForm` restyled to the design's labelled inputs,
   status text colour by tone, "Send message →" button. EmailJS and the honeypot stay.
10. FAQ: `FaqAccordion.tsx` restyled: one open at a time, chevron rotates, answer HTML from the sheet.
11. Help band (Download my resume → `window.print()`, Have a project in mind? → `#contact`) and the
    "Last updated" / "Edit on GitHub" line.

**11D — Behaviour (developer; each its own client component, all idle under `prefers-reduced-motion`).**
1. `SearchPalette.tsx`: ⌘K / Ctrl K and `/` open, Escape closes, ↑/↓/Enter, mouse hover selects, groups
   Sections / Projects / Actions (copy email, download resume, open GitHub / LinkedIn / Twitter), "No results
   for …", `⌘K` vs `Ctrl K` hint by platform, body scroll lock, focus on open.
2. `ScrollProgress.tsx`: the 2 px top bar and the back-to-top ring (`stroke-dashoffset`), shown after
   0.6 × viewport height, hidden while the drawer is open; click scrolls to top and clears the hash.
3. `Reveal.tsx`: IntersectionObserver reveal for bento cards (120 ms + 60 ms × i) and every `[data-doc] >
   div`, the experience-row line sweep, chip stagger (30 ms × i, max 600, +200), stat counters (1200 ms
   ease-out, zero-padded), heading scramble (650 ms), 2.5 s fallback if the observer never fires.
4. `SectionLinks.tsx`: click on an `h2` copies the section URL (`history.replaceState` + clipboard with the
   textarea fallback) and shows the toast for 1.8 s; card spotlight (`--mx`/`--my` on `[data-card]`).
5. The console greeting (`%c ayushSleeping …`), once per page.

**11E — Quality (tester leads, developer fixes).**
1. Delete `tests/parity.spec.ts` and the `version2/` step in `ci.yml`; `npm run v2` stays as a historical
   viewer only.
2. `tests/smoke.spec.ts` rewritten for the new shell: the ten section ids in order, sidebar links and the
   indicator, drawer open/close at 390, search palette (open, type, Enter lands on the section), lightbox,
   every old `.html` and `/Personal-Portfolio/` URL still lands on the right section, contact form messages,
   Download PDF opens print, back-to-top.
3. `tests/seo.spec.ts`: the new ids in `sitemap.xml` / `llms.txt`; `tests/resume.spec.ts`: print shows
   About + Experience + Education + Skills only.
4. No-JS render (content visible, no fixed overlays stuck), reduced-motion (no animations run), console and
   network clean at 390/768/1440, both the `/Personal-Portfolio` build and the root build.
5. `lint`, `typecheck`, `build`, `npm test` green on every commit.

**11F — Cutover (manager).** Tag `v3-final` on `main`. Merge `v4-redesign` into `v3-nextjs` (fast-forward
or merge commit), CI green, fast-forward `main`; the deploy is automatic. Tester repeats the 10C live
checks. Then `README.md`, `documentation/architecture.md`, `documentation/version3.md`, `CLAUDE.md` and
this file say "v4 live". Rollback: `git push origin v3-final:main --force-with-lease`.

### Backlog (after parity, not in this plan)

Dark/light toggle (M5), container queries (M3), GSAP → CSS (M1), replacing Bootstrap (M10), Cloudflare
Turnstile (M6) and Web Analytics (M11), GitHub widget (M12), case studies (T7). Needs Ayush: the sheet
secrets and the Apps Script deploy (B21 Phases 0 and 2), and the `gh` login as `ayush-sleeping`.

## 6. Progress

| Phase | Developer | Commit(s) | Tester | Fix-ups |
|---|---|---|---|---|
| 1 Shell | ✅ done | `a02ea85` `d86d912` `112a2e6` | ✅ pass, 1 miss | F1.1 preloader bar stops short of 100% (`9e82b78` ✅) · F1.2 ionicons preload warning (`7f1fc9b` ✅) |
| 2 Home | ✅ done | `0c0b3f7` `ef343c2` `1517c1f` `a020b58` | ✅ pass, 1 miss | F2.1 Font Awesome kit loads after the FA 6 stylesheet, so icons render as FA 5 (`0e6b9e8` ✅) |
| 3a About (sheet data only) | ✅ done | `e2057d1` `2772906` `06dbdb3` `827830d` | ✅ re-checked 2026-10-11 (parity suite + smoke tests, no console errors or 404s at 390/768/1440) | arrow-link aria-labels from card titles (`a5fc921`, to retest) |
| 3b Resume merge + sheet-less facts | ✅ done 2026-10-11, from the JSON plus the seed CSV fallback | `f10ecb7` `c3b47ab` `8c9d965` `818b3a2` `022e634` | ✅ `npm test` 86/86, resume prints on 3 A4 sheets like v2 | |
| 4 Projects | ✅ done | `e4dc5bd` | ✅ re-checked 2026-10-11 (parity suite + smoke tests, no console errors or 404s at 390/768/1440) | |
| 5 Services | ✅ done | `94dfcb3` | ✅ re-checked 2026-10-11 (parity suite + smoke tests, no console errors or 404s at 390/768/1440) | |
| 6 Contact + FAQ | ✅ done | `ac0474d` `bf8331e` `8f18ea3` | ✅ re-checked 2026-10-11 (parity suite + smoke tests, no console errors or 404s at 390/768/1440) | |
| 7 Behaviour | ✅ done | `3bece56` `52b98c9` `794efd0` `3aea948` `53a04cc` | ✅ re-checked 2026-10-11 (parity suite + smoke tests, no console errors or 404s at 390/768/1440) | `aba5f6f` fix(3a): first certificate image loaded late and pushed later sections down |
| 8 SEO | ✅ done | `88b35a8` `336ae8a` `67a7e5c` `c3c7b1a` | ✅ `npm test` 62/62 (no tester session; checked by the developer) | |
| 9 Parity | ✅ done | see `git log -- tests/parity.spec.ts` | ✅ 15/15 (5 sections × 3 widths); a one-word change in the build fails it | none needed: every block matches v2 except the three listed in the test |
| 10A Pre-flight | — | `761600d` | ✅ pass 2026-10-22 | |
| 10B Deploy setup | ✅ done 2026-10-23 (11 items) | `b952455` `5c7751f` `de99876` `236cb4d` `afdde56` `5f89301` `24ab6f1` `78d2945` `a72802a` `2045698` `7a37913` `96ec4c6` `266aa49` | ✅ each item verified | |
| 10C Cutover | ✅ done 2026-10-23 (manager) | `main` = `266aa49`; runs 39730817342 / 39731432704 | ✅ live checks pass (old URLs, sitemap, robots, DailyBuzz) | |
| 10D After launch | 🔄 open: `SITE.repoUrl`, README, docs; Search Console (Ayush) | | | |
| 10E Content pipeline | ⏸ needs Ayush (sheet secrets, Apps Script) | | | |
| 11A Prep | ✅ 2026-10-24 (manager) | `fa8f7dc` + the port commit | | |
| 11B Shell | ✅ 2026-10-24 (manager built it: no helper sessions, Ayush deferred testing) | in the port commit | ⏸ 11E | |
| 11C Sections | ✅ 2026-10-24, all 11 items | in the port commit | ⏸ 11E | |
| 11D Behaviour | ✅ 2026-10-24, all 5 items | in the port commit | ⏸ 11E | |
| 11E Quality | ⏸ Ayush: test at the end (2026-10-24) | | | |
| 11F Cutover | ⏸ | | | |

**Intentional differences from v2, recorded as they come up** (the tester does not report these):

- Phase 1: v2's GSAP block (no page loads GSAP, and its targets don't exist, so it only threw errors),
  Spotlight (no `[data-spotlight]` element) and the dead `.navbar.active` handling are not ported. A menu link
  now closes the slide-out menu, since it scrolls instead of loading a page. The hamburger gets `aria-label` /
  `aria-expanded`. Home stays `.active` in the nav until Phase 7. With JavaScript off, `.main-content` stays at
  opacity 0, as in v2, until Phase 7 fixes it.
- Phase 2: v2's Home bento nests `<a>` inside `<a>`, which the browser's parser splits apart. v3 renders the
  DOM the browser actually builds (same elements, same clickable areas), without the empty zero-height `<a>`
  the parser leaves before those cards.
- Phase 3a: decorative card images are `alt=""` (v2: "BG" / "star"). Certificates with no `credential_url` show
  "View Certificate" without an `href` (v2's `href=""` reloaded the page).
- Phase 4–5: the Skills block and the link-card rows v2 repeated on Projects and Services are shown once (T3).
- T8: the card texture, circled arrow and two stars are our own drawings, close to v2's but not pixel-identical.
- Phase 3b: printing the page prints the resume (About only, in resume.html's order), whatever triggers it. Education shows resume.html's course list and subjects as one line each, and the schools are links. Experience shows each job's sheet `description`, not resume.html's one-line summaries (T12). The profile card has both of resume.html's buttons.
- Phase 8: the page title is "Ayush Mishra | FullStack Developer Portfolio" (v2: "Ayush | FullStack Web Developer | …"), and v2's six pages share one set of tags. The old `.html` URLs are redirect pages marked `noindex`.
- Phase 6: v2's Apps Script logging (`logToSheet`) is not ported; its URL was empty, so it never ran (B21). The
  status line gets `aria-live`. "Let's work together." uses the sheet's straight apostrophe.
