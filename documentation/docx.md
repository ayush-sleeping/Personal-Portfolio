# Personal Portfolio — Complete Project Documentation

> Comprehensive reference for the **Ayush Mishra Personal Portfolio** website.
> Covers every page, the full design system, all colors, fonts, JS modules, assets and configuration.

- **Live URL:** https://ayush-sleeping.github.io/Personal-Portfolio/
- **Repository:** https://github.com/ayush-sleeping/Personal-Portfolio
- **Author:** Ayush Mishra — FullStack Web Developer (Backend Developer at Leapswitch Networks)
- **Location:** Mumbai, Maharashtra, India
- **Email:** ayushbm84@gmail.com
- **Last verified against the code:** 2026-09-21

> **Architecture note.** Page content is no longer hardcoded in the HTML. It is
> authored in a Google Sheet, committed to `assets/data/*.json` by a scheduled
> GitHub Action, and rendered client-side. See §2.1 before trusting any markup
> quoted in the page-by-page sections below — the DOM is built at runtime.

<br>

<br>

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Folder Structure](#3-folder-structure)
4. [Common SEO / Meta (All Pages)](#4-common-seo--meta-all-pages)
5. [Typography & Fonts](#5-typography--fonts)
6. [Color System (Full Palette)](#6-color-system-full-palette)
7. [Design System & UI/UX Patterns](#7-design-system--uiux-patterns)
8. [Animations & Keyframes](#8-animations--keyframes)
9. [Responsive Breakpoints](#9-responsive-breakpoints)
10. [Page-by-Page Documentation](#10-page-by-page-documentation)
    - [10.1 index.html — Home](#101-indexhtml--home)
    - [10.2 about.html — About](#102-abouthtml--about)
    - [10.3 project.html — Projects](#103-projecthtml--projects)
    - [10.4 services.html — Services](#104-serviceshtml--services)
    - [10.5 contact.html — Contact & FAQ](#105-contacthtml--contact--faq)
    - [10.6 resume.html — Resume](#106-resumehtml--resume)
11. [JavaScript Modules](#11-javascript-modules)
12. [Assets Inventory](#12-assets-inventory)
13. [Forms & Integrations (EmailJS)](#13-forms--integrations-emailjs)
14. [Performance Optimizations](#14-performance-optimizations)
15. [Accessibility & SEO](#15-accessibility--seo)
16. [Deployment](#16-deployment)
17. [Image-by-Image Visual Analysis](#17-image-by-image-visual-analysis)



<br>

<br>


## 1. Project Overview

A static, single-author portfolio site that showcases Ayush Mishra's profile, skills, work experience, projects, services and contact details. It is designed as a personal brand identity site — visitors can read the bio, browse projects, view a resume, see services offered, and reach out via a contact form (EmailJS).

The visual design language is **dark, glassmorphic, and modern** with cyan-blue and violet accent colors. The primary card layout was inspired by the [GridX Portfolio Template](https://wpriverthemes.com/gridx/).

**Key qualities:**
- Six static pages, all sharing one stylesheet and a common navigation/footer.
- Heavy use of glassmorphism (frosted glass cards), gradient accents, layered shadows.
- Animated preloader, slide-reveal page transition, mouse-tracking spotlight effect on cards, marquee, scroll-triggered card animations on mobile.
- Fully responsive — mobile-first, with a slide-in side navigation menu under the hamburger toggle.

---

## 2. Tech Stack & Dependencies

### Core
- **HTML5** — semantic markup, six pages.
- **CSS3** — single stylesheet `assets/css/style.css` (~70KB, ~3,300 lines).
- **JavaScript** (vanilla ES6+) — 4 classic scripts plus an ES-module content
  layer (`assets/js/data.js` and `assets/js/render/*.js`). The renderers are
  `type="module"`, so the site must be served over HTTP; opening `index.html`
  from the filesystem leaves every sheet-backed section empty.
- **Bootstrap 5.0.2** — grid system, modal, carousel, collapse (FAQ accordion).

### CDN-loaded resources

| Resource | Version | Source |
|---|---|---|
| Bootstrap CSS | 5.0.2 | `cdnjs.cloudflare.com/ajax/libs/bootstrap/5.0.2/css/bootstrap.min.css` |
| Bootstrap JS Bundle | 5.0.2 | `cdnjs.cloudflare.com/ajax/libs/bootstrap/5.0.2/js/bootstrap.bundle.min.js` |
| Font Awesome (Kit) | `4bff2ef1c5` | `kit.fontawesome.com` |
| Font Awesome (CDN) | 6.0.0-beta3 | `cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3` |
| Remixicon | 2.5.0 | `cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css` |
| Ionicons | 5.5.2 | `unpkg.com/ionicons@5.5.2/dist/ionicons/` |
| EmailJS | 3.x | `cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js` |
| Google Fonts | — | `fonts.googleapis.com` |

### 2.1 Content pipeline (Google Sheets CMS)

Added 2026-09. The browser never talks to Google.

```
Google Sheet  ──(scheduled GitHub Action, every 6h + manual)──▶  assets/data/*.json  ──▶  page
                 fetch → validate → promote → commit                committed to the repo
```

| Piece | What it does |
|---|---|
| `scripts/content-map.mjs` | Single source of truth: sheet tab → file, shape, schema |
| `scripts/fetch-sheet.mjs` | `--staging-only` then `--promote`; `assets/data` is only overwritten once every tab has been fetched **and** the whole set validates |
| `scripts/validate-data.mjs` | Schema gate; `--dry-run` for local checks |
| `scripts/json-to-csv.mjs` | Exports current JSON back to the seed CSVs |
| `.github/workflows/refresh-content.yml` | The cron; skips quietly when `SHEET_ID` / `GOOGLE_API_KEY` secrets are absent |
| `sheets/seed-csv/` | Seed data extracted from the original markup |
| `sheets/apps-script/Code.gs` | Write path: logs contact submissions to the sheet |

Data lives under `assets/data/` in three groups: `site/` (profile, navigation,
socials, footer-tech), `pages/` (one file of copy per page) and `collections/`
(projects, experience, education, skills, certifications, services, faqs,
stats, blog-posts).

Plain strings are filled in via `data-text` / `data-html` attributes, so a new
editable string needs a sheet key and one attribute — not a renderer change.
Repeating structures are built by the renderers in `assets/js/render/`.

**Current state:** the read path runs on committed seed data. `APPS_SCRIPT_URL`
and `SHARED_TOKEN` in `contactform.js` are still empty, so the sheet write path
is inert and the contact form behaves exactly as it did before.

### Performance hints used in `<head>`
- `preconnect` → `fonts.googleapis.com`, `fonts.gstatic.com`, `cdnjs.cloudflare.com`, `kit.fontawesome.com`
- `dns-prefetch` → `wpriverthemes.com`

---

## 3. Folder Structure

```
Personal-Portfolio/
├── index.html                  # Home
├── about.html                  # About + Experience + Education + Certifications
├── project.html                # Project showcase
├── services.html               # Service offerings
├── contact.html                # Contact form + FAQ
├── resume.html                 # Plain resume
├── README.md
├── robots.txt                  # Crawler policy; AI bots allowed explicitly
├── llms.txt                    # Plain-markdown index for LLM crawlers
├── sitemap.xml                 # Six URLs, referenced from robots.txt
├── CLAUDE.md                   # Agent instructions -- GITIGNORED, local only
├── .env.example                # SHEET_ID / GOOGLE_API_KEY for local fetches
├── .github/workflows/
│   └── refresh-content.yml     # Cron: sheet -> validate -> commit JSON
├── scripts/                    # Content pipeline, Node ESM (see 2.1)
│   ├── content-map.mjs         # Tab -> file/shape/schema: source of truth
│   ├── fetch-sheet.mjs         # --staging-only / --promote
│   ├── validate-data.mjs       # Schema gate (--dry-run)
│   ├── sheet-to-json.mjs
│   └── json-to-csv.mjs
├── sheets/
│   ├── SETUP.md                # How to wire the sheet up
│   ├── seed-csv/               # 17 CSVs seeded from the original markup
│   └── apps-script/            # Code.gs: contact-form write path
├── documentation/
│   ├── docx.md                 # This file
│   └── improvements-and-system-design.md   # v2 roadmap (zero-budget rule)
├── assets/
│   ├── css/
│   │   └── style.css           # Full stylesheet
│   ├── data/                   # GENERATED -- never hand-edit
│   │   ├── site/               # profile, navigation, socials, footer-tech
│   │   ├── pages/              # one file of copy per page
│   │   └── collections/        # projects, experience, education, skills,
│   │                           #   certifications, services, faqs, stats,
│   │                           #   blog-posts
│   ├── js/
│   │   ├── main.js             # Header, hamburger, spotlight effect
│   │   ├── preloader.js        # Animated loader + reveal
│   │   ├── scroll-animations.js# Mobile card pulses (IntersectionObserver)
│   │   ├── contactform.js      # EmailJS form + FAQ accordion + sheet log
│   │   ├── data.js             # ES module: fetch/cache/escape/pictureHtml
│   │   └── render/             # ES modules: one renderer per area
│   │       ├── site-render.js      project-render.js
│   │       ├── home-render.js      about-render.js
│   │       └── services-render.js  faq-render.js
│   ├── img/
│   │   ├── favicon-portfolio.svg
│   │   ├── Home page Profile image.jpg
│   │   ├── about me.png
│   │   ├── ayush sign.png
│   │   ├── github3.png, my works.png
│   │   ├── larabasex.png, write_on.png, daily_buzz.png,
│   │   │   portfolio project.png, 1.2 User homepage.png,
│   │   │   2 .png, jabritravelss.png       # project screenshots
│   │   └── certificate/        # 9 certificate images (see §12)
│   │   # every referenced raster also has .avif + .webp siblings
│   └── video/
│       └── batman.mp4          # "Why hire me" modal video
```

---

## 4. Common SEO / Meta (All Pages)

Shared tags are listed below. **Changed 2026-09:** `description`, `og:title`,
`og:description`, `twitter:title`, `twitter:description`, `canonical`, `og:url`
and `twitter:url` are now **per page**, not shared. Only the tags marked
"same on every page" below are still common.

| Tag | Value |
|---|---|
| `<meta name="description">` | Per page. Home: "Ayush Mishra, FullStack Web Developer in Mumbai. Scalable web apps and REST APIs in Laravel, PHP and MySQL, React on the frontend, now building with Python, Django and Next.js." |
| `<meta name="keywords">` | "Ayush Mishra, FullStack Developer, Backend Developer, Web Developer, Software Developer, Laravel, PHP, JavaScript, ReactJS, Python, Django, Next.js, MySQL, Portfolio" |
| `<meta name="author">` | Ayush Mishra |
| `<meta name="robots">` | index, follow |
| `<meta name="theme-color">` | `#5B78F6` |
| `<meta name="msapplication-TileColor">` | `#5B78F6` |
| `<link rel="canonical">` | Per page, self-referencing (e.g. `.../Personal-Portfolio/about.html`) |

### Open Graph
- `og:type` = website
- `og:title` = "Ayush Mishra - FullStack Web Developer Portfolio"
- `og:description` = "Passionate developer building scalable web applications and REST APIs with Laravel, PHP, JavaScript, and React, now focused on Python, Django, and Next.js."
- `og:image` = `https://ayush-sleeping.github.io/Personal-Portfolio/assets/img/about me.png`
- `og:site_name` = "Ayush Mishra Portfolio"

### Twitter
- `twitter:card` = `summary_large_image`
- `twitter:creator` = `@AyushBM1`
- `twitter:image` = same as OG image.

### Structured Data (JSON-LD)
A `Person` schema is embedded on every page:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Ayush Mishra",
  "jobTitle": "FullStack Web Developer",
  "description": "Passionate developer building modern web and software solutions",
  "url": "https://ayush-sleeping.github.io/Personal-Portfolio/",
  "sameAs": [
    "https://github.com/ayush-sleeping",
    "https://www.linkedin.com/in/ayush-bm/",
    "https://twitter.com/AyushBM1"
  ],
  "knowsAbout": ["Laravel", "PHP", "JavaScript", "ReactJS", "MySQL", "Python", "Django", "Next.js", "REST APIs", "Web Development"],
  "email": "ayushbm84@gmail.com"
}
```

### Favicon / Manifest
- `<link rel="icon" href="assets/img/favicon-portfolio.svg">`
- `<link rel="apple-touch-icon" href="assets/img/favicon-portfolio.svg">`
- `<link rel="manifest" href="/site.webmanifest">`

---

## 5. Typography & Fonts

### Fonts loaded

**1) Google Fonts — single import at the top of `style.css`:**
```css
@import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@100..700&family=Roboto:wght@100..900&display=swap');
```

The `wght@a..b` range syntax returns **one variable font file per family**
instead of the seven static weight files the site used to request. Same two
typefaces; every weight in use sits inside the axis.

| Font | Axis | Used For |
|---|---|---|
| **Roboto** (sans-serif) | wght 100–900 | Body text, paragraphs, general content |
| **Roboto Mono** (monospace) | wght 100–700 | Headings (h1–h4), nav links, labels, all "branded" titles |

**2) ~~Custom @font-face for "Inter" from Cloudinary~~ — removed 2026-09.**

Earlier revisions of this document said Inter was "used selectively (preloader
letters, certain buttons)". That was not true of the code: no rule in
`style.css` and no element in the markup ever set `font-family: Inter`, so the
face was declared, never matched, and never downloaded. The declaration has
been deleted, which also removed the last third-party font origin. There is now
no `@font-face` in the stylesheet.

### CSS Typography Variables (inside `:root`)

```css
--roboto-font: 'Roboto', sans-serif;
--mono-font:   'Roboto Mono', monospace;
--fs-base: 14px;
--fs-h1:   2.50rem;
--medium:   500;
--semibold: 600;
--bold:     700;
```

### Type Scale (resolved in CSS)

| Element | Size | Notes |
|---|---|---|
| `h1` (page heading) | `2.50rem` (40px) | Roboto Mono |
| Section heading | `45px` | "Get to Know Me Better", "My Projects", "My Offerings" |
| Client/stat card `h2` | `48px` | Gradient-fill text |
| Card titles | `1.8rem` | |
| `h3` | 20px | |
| `h4` | 16px | |
| `h5` (labels / category) | 12–14px, uppercase | Often colored `#5B78F6` |
| Body / paragraph | `14px` (`--fs-base`) | Roboto |

---

## 6. Color System (Full Palette)

### Variables defined in `:root` (`style.css` lines 7–40)

| Variable | Value | Purpose |
|---|---|---|
| `--text-color` | `#a1a1a1` | Default text |
| `--text-W-color` | `#fff` | White text |
| `--bright-text-color` | `#86C232` | Green accent |
| `--bg-color` | `#fff` | Light background (legacy) |
| `--text-para-color` | `#acafb3` | Paragraphs |
| `--text-para-color2` | `#999da0` | Muted paragraphs |
| `--hover-color` | `#2b2a2a` | Dark hover state |
| `--text-color-alt` | `#999` | Alt text |
| `--black-color` | `#000` | Pure black |
| `--hr-color` | `#cccccc` | Divider lines |
| `--background-color` | `#0F0F0F !important` | Main dark background |
| `--geist-foreground-rgb` | `255, 255, 255` | Shimmer / glow effects |
| `--bg-color3` | `rgba(255, 255, 255, 0.158)` | Light translucent overlay |

### Brand Palette (used throughout the design)

As of 2026-09 the two blues are **tokens, not literals**. `#5B78F6` used to be
written out in 45 places and `#7B9BFF` in 3; changing the brand colour now means
editing one line.

| Token | Value | Was | Usage |
|---|---|---|---|
| `--brand` | `oklch(61.70% 0.1905 270.20)` | `#5B78F6` | Buttons, accent text, theme color, gradient start, link highlights, FAQ chevrons |
| `--brand-light` | `oklch(70.96% 0.1507 268.94)` | `#7B9BFF` | Gradient mid/end, hover glow shadows |
| `--brand-hover` | `color-mix(in oklch, var(--brand) 85%, white)` | — | Derived hover step |
| `--brand-dim` | `color-mix(in oklch, var(--brand) 60%, var(--background-color))` | — | Derived muted step |
| `--brand-ring` | `color-mix(in oklch, var(--brand) 70%, transparent)` | — | Focus/glow rings |

The OKLCH values are exact equivalents of the hex they replaced — a rendered
swatch samples as `rgb(91, 120, 246)` and `rgb(123, 155, 255)`. On a P3 display
they may resolve slightly more saturated.

| Role | Hex | Usage |
|---|---|---|
| **Deep Purple / Violet** | `#9333EA` / `#8B5CF6` | Timeline, secondary gradients |
| **Green Accent** | `#86C232` | Highlight text (`--bright-text-color`) |

### Dark Surfaces (multiple shades layered for depth)

| Hex | Where it appears |
|---|---|
| `#0F0F0F` | Page background (set inline on `<body>` and via `--background-color`) |
| `#1a1a1a` / `#1c1c1c` | Card backgrounds (legacy / fallback) |
| `#252525` / `#2a2a2a` / `#2b2a2a` / `#323232` | Hover states, secondary surfaces |
| `#000` | Pure black (modal overlays, certain text) |

### Light / Text Tones

| Hex | Usage |
|---|---|
| `#ffffff` / `#fff` | Primary white text |
| `#E5E7EB` / `#BCBCBC` | Light gray text/icons |
| `#9CA3AF` / `#999da0` / `#a1a1a1` / `#acafb3` | Muted text |
| `#676767` / `#6B7280` | Subdued/disabled |
| `#cccccc` | Dividers |

### Translucent Overlays

- `rgba(255, 255, 255, 0.01)` → glass card faint surface
- `rgba(255, 255, 255, 0.05)` → glass card border baseline
- `rgba(255, 255, 255, 0.08)` → nav border-right
- `rgba(255, 255, 255, 0.10)` → glass surface highlight
- `rgba(255, 255, 255, 0.12)` → glass card border on hover
- `rgba(255, 255, 255, 0.158)` → light overlay (`--bg-color3`)
- `rgba(20, 22, 34, 0.95)` → modal backdrop
- `rgba(91, 120, 246, 0.05–0.20)` → blue-tinted shadows on cards

---

## 7. Design System & UI/UX Patterns

The visual style is a **dark, modern, glassmorphic** design language. Key design primitives:

### A. Glassmorphism
Used on virtually every card. Recipe:

```css
background: linear-gradient(120deg, rgba(255,255,255,0.10), rgba(255,255,255,0.01));
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
border: 1px solid rgba(255,255,255,0.05);   /* up to 0.12 on hover */
border-radius: 30px;                         /* 16–50px depending on element */
```

Applied to: `.primary-card`, `.primary-card2`, `.client-card`, `.social-card`, `.timeline-content`, `.skill-card`, `.navigation__menu`, contact form, FAQ items, project cards.

### B. Gradients

| Style | Value |
|---|---|
| Card surface | `linear-gradient(120deg, rgba(255,255,255,0.10), rgba(255,255,255,0.01))` |
| Brand gradient | `linear-gradient(135deg, #5B78F6 0%, #7B9BFF 100%)` |
| Tinted card overlay | `linear-gradient(135deg, rgba(91,120,246,0.10) 0%, rgba(139,92,246,0.05) 100%)` |
| Radial spotlight | `radial-gradient(circle at center, rgba(91,120,246,0.15) 0%, transparent 70%)` |
| Preloader | `linear-gradient(135deg, #5B78F6 0%, #7B9BFF 50%, #5B78F6 100%)` |
| Brand text fill | `linear-gradient(135deg, #5B78F6 0%, #7B9BFF 100%)` + `-webkit-background-clip: text; -webkit-text-fill-color: transparent;` |
| Variable | `--linear-gradient: linear-gradient(54deg, rgba(45,45,45,0.95) 34%, rgba(45,45,45,0.95))` |

### C. Box Shadows (layered, multi-stop)

**Card resting shadow**
```css
box-shadow:
  rgba(255,255,255,0.10) 0px 1px 1px 0px inset,
  rgba(50,50,93,0.10)    0px 50px 100px -20px,
  rgba(0,0,0,0.30)       0px 30px 60px -30px,
  rgb(91 120 246 / 5%)   0px 10px 40px 0px;
```

**Card hover shadow** (deeper + more blue glow)
```css
box-shadow:
  rgba(255,255,255,0.20) 0px 2px 4px 0px inset,
  rgba(50,50,93,0.25)    0px 50px 100px -20px,
  rgba(0,0,0,0.40)       0px 30px 60px -30px,
  rgb(91 120 246 / 20%)  0px 15px 50px 0px;
```

**Variables**
- `--box-shadow-1`: `rgba(0,0,0,0.4) 0 2px 4px, rgba(0,0,0,0.3) 0 7px 13px -3px, rgba(0,0,0,0.2) 0 -3px 0 inset`
- `--box-shadow-2`: `0 .5rem 1rem rgba(143,142,142,0.15) !important`
- `--box-shadow-4`: `0 1px 29px rgb(0 0 0 /40%)`

### D. Border-Radius Scale
- Small / pills / buttons: **16px – 20px**
- Skill cards: **10–15px**
- Primary cards: **30px**
- Client cards / hero CTA: **50px**
- Circular avatars / dots / social icons: **50%**

### E. Notable Components

| Component | Class(es) | Notes |
|---|---|---|
| **Preloader** | `.preloader`, `.loader-text`, `.loader-letter`, `.loader-progress`, `.loader-percentage` | Letter-by-letter reveal of "ayushSleeping", animated progress bar 0→100%, then slide-reveal panel transitions to main content |
| **Slide reveal panel** | `.slide-reveal-panel` | Gradient overlay used for the page-load transition |
| **Side Navigation** | `.navigation__menu` | Fixed, 280px wide, slides in from `-280px`, glassmorphic, custom 2px scrollbar, z-index 1001 |
| **Header / Top bar** | `.header`, `.navbar`, `.logo` | Logo "ayushSleeping" left, centered navbar, "Let's talk" button right (desktop), hamburger right (mobile). Becomes sticky with backdrop blur when scrolled |
| **Hamburger** | `.hamburger.hamburger--emphatic` | 3-line emphatic style, fixed top-right on mobile, z-index 1003 |
| **Primary card** | `.primary-card` | 50px 46px padding, 30px gap, 30px radius, glass surface, optional absolute background image at opacity 0.5 |
| **Marquee card** | `.primary-card2` + `@keyframes marquee` | Horizontally scrolling text carousel of role titles, 8s linear infinite |
| **Client / Stats card** | `.client-card` | 50px radius, animated gradient border (`@keyframes clientGradientBorder`), gradient-fill `h2` (48px), shimmer ::after pseudo |
| **Social card** | `.social-card` | 82×82 circle, glass bg, icon turns primary blue on hover, lifts `translateY(-8px)` |
| **Skill card** | `.skill-card` | Compact label + skill, hover lifts -2px |
| **Timeline** | `.timeline-item`, `.timeline-content` | Vertical gradient line via `::before`, animated dot via `::after`, 40px left padding |
| **Project card** | `.project-showcase-card` | 20px radius, 320px image area, image scales 1.02 on hover, always-visible Source/Demo links |
| **Service card** | (inside `.primary-card` blocks on services.html) | Large icon top, title, two feature rows with check-circle icons, hover lift |
| **Contact form** | `#contact-form` | Glass background, blue-accent submit button, inline feedback `#contact-message` |
| **FAQ accordion** | `.faq-question`, Bootstrap `.collapse` | Chevron rotates 180° on expand, single-open accordion behavior |
| **Modal** | Bootstrap modal with `batman.mp4` | "Why should we hire you?" dark glassmorphic backdrop |
| **Footer** | tech-stack icons w/ tooltips, nav links, copyright | Repeated identically on home/about/projects/services/contact (resume has a slimmer variant) |

### F. Interactive Effects

- **Spotlight cursor** — Cards with `[data-spotlight]` track the mouse and update CSS custom properties `--mouse-x` / `--mouse-y` to render a radial highlight that follows the cursor.
- **Card hover lift** — `translateY(-4px to -8px)` + scale + shadow swap.
- **Tooltip on tech icons** in the footer — pure CSS tooltips on hover.
- **GSAP + ScrollTrigger** — referenced in `main.js` for scale and border-radius morphing on scroll.

---

## 8. Animations & Keyframes

All keyframes defined in `style.css` (line numbers approximate):

| Keyframe | Line | What it does |
|---|---|---|
| `letterReveal` | 344 | Preloader letters fade up with `rotateX(90deg) → 0deg` |
| `progressGlow` | 356 | Loader progress bar pulsing glow (15px ↔ 25px box-shadow) |
| `shimmer` | 372, 1968 | Horizontal shimmer sweep across cards |
| `pulse-bg` | 382 | Background opacity pulse 0.3 → 0.6 → 0.3 (preloader bg) |
| `panelGlow` | 394 | Reveal panel breathing glow |
| `patternFloat` | 406 | Background pattern subtle float |
| `containerPulse` | 489 | Loader container scale 1 ↔ 1.02 |
| `glowPulse` | 516 | Generic glowing pulse for accent elements |
| `fadeInUp` | 957 | Menu items fade in moving up, staggered |
| `slideInLeft` | 1015 | Menu items slide from `translateX(-30px)` to `0`, staggered |
| `gradientBorder` | 1584 | Animated gradient border reposition |
| `clientGradientBorder` | 1806 | Same effect specifically tuned for client/stat cards (5s ease-in-out) |
| `marquee` | 2051 | `translateX(0%) → translateX(-33.33%)` infinite |

JS-driven motion (see §11):
- Preloader simulation → reveal sequence (4 phases over ~1200ms).
- Mobile scroll-into-center triggers `.scroll-animated` class for 800ms (debounced 2000ms per element).
- Mouse-tracked spotlight via JS class `Spotlight` writing CSS custom properties.

---

## 9. Responsive Breakpoints

The CSS uses a series of `@media (max-width: …)` queries. The full set in use:

| Breakpoint | Effect |
|---|---|
| `1200px` | Container max-width 960px; large-screen tweaks |
| `992px` / `991px` | Container max-width 720px; navigation font reduced ~75%; column rearrangement |
| `800px` | Specific service / projects card adjustments |
| `768px` | **Major mobile breakpoint** — hamburger appears, top navbar becomes hidden (replaced by slide-in side menu), social tooltips shrink, scroll animations enable |
| `720px` | Project tags / minor wraps |
| `600px` / `576px` | Form layout adjustments, FAQ stacking |
| `500px` / `480px` | Preloader text 1.5rem; loader bar 200px; smaller buttons |
| `450px` | Header padding tightens |
| `350px` | Body font shrinks to 0.875rem |

There is also one `@media (min-width: 769px)` for desktop-only layout rules.

---

## 10. Page-by-Page Documentation

All six pages share:
- Preloader + slide-reveal panel.
- Slide-in side `.navigation__menu` (Home / About / Projects / Services / Contact + Twitter/LinkedIn/GitHub/Email + © 2026 Ayush Mishra).
- Header (logo "ayushSleeping" + center navbar + hamburger).
- Footer with tech-stack tooltip icons (Laravel, JavaScript, ReactJS, MySQL, Tailwind, Bootstrap, HTML5, CSS3, PHP, Git, Python, Django, Next.js), brand "ayushSleeping", nav links, and copyright `© Copyright 2026 - Ayush Mishra`.

### 10.1 `index.html` — Home

**`<title>`:** `Ayush | FullStack Web Developer | Software Developer Portfolio`

**Body background:** inline `background-color: #0F0F0F !important;`

**Sections (in DOM order):**

1. **Preloader** — animated "ayushSleeping" letter reveal + progress bar + slide-reveal panel.
2. **Side Navigation** — see common.
3. **Header** — logo, navbar (Home active), hamburger.
4. **About / Hero Card Grid** (Bootstrap rows):
   - **Primary About card** (`col-lg-6`)
     - Background image (external URL).
     - Profile image: `assets/img/Home page Profile image.jpg`
     - **Name:** "Ayush Mishra"
     - **Tagline:** "FullStack Web Developer • Backend Specialist"
     - **Intro:** "I craft scalable web applications and APIs with Laravel and JavaScript, now building with Python, Django, and Next.js."
     - Star icon hover effect.
   - **Marquee card** (`col-lg-6`) — looping role list:
     - "Software Developer"
     - "Full Stack Web Developer"
     - "Backend Laravel Developer"
     - "Backend Developer"
   - **Credentials card** (`col-lg-6 mt-4`) — icon `ayush sign.png`, label "MORE ABOUT ME / Credentials" → `about.html`
   - **Projects card** (`col-lg-6 mt-4`) — icon `my works.png`, label "SHOWCASE / Projects" → `project.html`
   - **GitHub card** (`col-lg-3`) — icon `github3.png`, label "CODE SPEAKS LOUDER / GitHub" → external GitHub
   - **Services card** (`col-lg-6`) — 4 Font Awesome icons (`code`, `dev`, `code-branch`, `terminal`), label "SPECIALIZATION / Services Offering" → `services.html`
   - **Social Profiles card** (`col-lg-3`) — Twitter + LinkedIn circles, label "STAY WITH ME / Profiles"
   - **Stats card** (`col-lg-6`) — three stat boxes:
     - "02+ YEARS IN FULLSTACK WEB DEVELOPMENT"
     - "25+ PROJECTS WORKED ON"
     - "Laravel + Next.js + Django TECH STACK USED"
   - **CTA card** (`col-lg-6`) — "Let's Work Together." → `contact.html`
5. **Footer** (common).

**Page-level interactions:** spotlight effect on cards, marquee animation, hover lifts.

### 10.2 `about.html` — About

**`<title>`:** `About | Ayush`

**Sections:**

1. **Page heading:** "Get to Know Me Better"
2. **About Me card** (`col-lg-8` left column)
   - **Bio:** "A Fullstack Web Developer based in India, currently working as a Backend Developer at Leapswitch Networks. I have 2+ years of professional experience building dynamic, scalable web applications and REST APIs with Laravel, PHP, and MySQL, along with modern frontend work in JavaScript and React. I'm continually expanding my stack — currently focused on the Python, Django + Next.js tech stack — and I enjoy learning, building, and collaborating on real-world projects."
   - **Quick Info list:**
     - Interest — Software Engineering and Fullstack Web Development
     - Skilled — Laravel + PHP + MySQL + JavaScript + React
     - Focusing On — Python + Django + Next.js
     - Experience — 2+ YOE in Backend & Full Stack Web Development
     - Education — Bachelor of Science in Computer Science (2020 – 2023)
     - EMAIL — ayushbm84@gmail.com
     - ADDRESS — Mumbai, Maharashtra, India
3. **Experience Timeline** (5 entries, vertical timeline component)

   | # | Period | Title | Org | Mode |
   |---|---|---|---|---|
   | 1 | Oct 2025 – Present | Backend Developer | Leapswitch Networks | India, Onsite |
   | 2 | Jul 2025 – Oct 2025 | FullStack Web Application Developer | SkillLogic Technologies | Remote (3.5 months) |
   | 3 | Oct 2023 – Oct 2024 | Junior FullStack Web Developer | Technicul Cloud LLP | Mumbai, Onsite (1 yr) |
   | 4 | Jun 2023 – Sept 2024 | Trainee : Java Fullstack Development | Anudip Foundation | Mumbai, Hybrid (paid training) |
   | 5 | Aug 2022 – Sept 2022 | Trainee : Youth Employability Program | TNS India Foundation | Mumbai, Onsite |

   Each entry lists Tech Stack — Backend / Frontend / Others.

4. **Education Timeline** (2 entries)

   | Period | Detail |
   |---|---|
   | Jul 2020 – Jul 2023 | B.Sc. Computer Science, Shankar Narayan College of Arts & Commerce (Univ. of Mumbai) — Bhayander, MH — **CGPA 9.23/10** — courses: Data Structures, OS, DBMS, Algorithms, Networks, Software Engineering, AI, Cloud Computing |
   | Jun 2016 – Jul 2020 | Higher Secondary — Divine Providence High School & Jr. College, Mumbai — Maharashtra State Board (Science, Math & IT) |

5. **"Why should we hire you?" video modal** — Bootstrap modal with `assets/video/batman.mp4`, dark glassmorphic backdrop `rgba(20,22,34,0.95)`.

6. **Certifications** — Bootstrap carousel (max-width 820px, 850px image width, 12px radius). 10 certificates:
   1. Anudip Foundation JavaFullstack
   2. TNSFoundation
   3. collegeRank
   4. gwoc
   5. gwoc2
   6. jwoc
   7. crido_program
   8–10. Three Udemy certificates (external `udemy-certificate.s3.amazonaws.com` URLs)

7. **Skills & Technologies sidebar** (`col-lg-4` right):
   - **Established / Working With:** Laravel · PHP · MySQL · JavaScript · ReactJS · Bootstrap · HTML · CSS · REST APIs · Git · AWS · Core Java
   - **Currently Focusing On:** Python · Django · Next.js
   - **Profile card** — image `about me.png`, name, social links (Mail/GitHub/LinkedIn/Twitter via Remixicon), "Contact Me" button.
   - Credentials, Projects, GitHub, Social Profiles, CTA cards (same pattern as home).

8. **Footer** (common).

### 10.3 `project.html` — Projects

**`<title>`:** `Project | Ayush`

**Heading:** "My Projects"

**Layout:** 2-column responsive grid (`col-lg-6 col-12`), 7 cards.

| # | Project | Date | Type | Image | Stack | Links |
|---|---|---|---|---|---|---|
| 1 | **LaraBaseX** | Aug 2025 | Frontend + Backend | `larabasex.png` | Laravel 12, ReactJS (Vite + Axios), Shadcn UI, MySQL, Tailwind | GitHub |
| 2 | **WriteOn** | Jul 2025 | Frontend + Firebase | `write_on.png` | ReactJS, Vite, Firebase, JS, Tailwind, HTML | GitHub + Live |
| 3 | **DailyBuzz** | Jul 2025 | Frontend | `daily_buzz.png` | ReactJS, Vite, NewsAPI, JS, CSS, HTML | GitHub |
| 4 | **Personal Portfolio** | Jun 2025 | Frontend | `portfolio project.png` | JS, CSS, HTML, Bootstrap | GitHub + Live |
| 5 | **NFT Ecommerce** | Oct 2023 | Angular CRUD | `1.2 User homepage.png` | JS, Angular, Bootstrap, CSS, HTML | GitHub |
| 6 | **Brija Stream** | Sep 2023 | Frontend + Search API | `2 .png` | JS, CSS, HTML | GitHub + Live |
| 7 | **JaBri Travel** | Jun 2022 | Frontend | `jabritravelss.png` | JS, CSS, HTML | GitHub + Live (Netlify) |

Card features: glassmorphic, 320px image area, image zoom on hover, multi-colored tech tags, always-visible Source/Demo links.

A **Skills & Technologies** block appears below the grid (same content as the about page).

### 10.4 `services.html` — Services

**`<title>`:** `Services | Ayush`

**Heading:** "My Offerings"

**Layout:** 2-column grid of 4 service cards.

| # | Title | Icon | Features |
|---|---|---|---|
| 1 | Full Stack Web Development | `fa-code` | Complete Laravel + JavaScript Solutions • Production Experience (2+ yrs) |
| 2 | Backend Development | `fa-server` | Laravel, Python & Django (MVC, Eloquent, middleware; expanding into Python & Django) • RESTful API Development |
| 3 | Frontend Development | `fa-palette` | Responsive Design (mobile-first) • Interactive JavaScript & React (ES6+, now building with Next.js) |
| 4 | Production & Team Skills | `fa-tools` | Git Workflows & Collaboration • AWS Deployment & Debugging |

All icons in primary blue `#5B78F6`. Each feature row has a `fa-check-circle` icon.

**Bottom row:** Social Profiles card (`col-lg-3`) + main "Let's Work Together" CTA (`col-lg-6`) + Credentials card (`col-lg-3`).

### 10.5 `contact.html` — Contact & FAQ

**`<title>`:** `Contact | Ayush`

**Layout:** Sidebar (`col-lg-4`) + form (`col-lg-8`); FAQ section full-width below.

**Sidebar:**
- Heading: "Contact Me"
- Subheading: "Have any question? I'd love to hear from you..."
- "Get in touch_" label
- Email: `ayushbm84@gmail.com`
- Location: Mumbai, Maharashtra, India
- Social icons (Remixicon): GitHub, LinkedIn, Twitter

**Form (`#contact-form`):**
- Form heading: "Let's work together." — accent word "together." in `#5B78F6`.
- Fields:
  - `#contact-name` (name) — placeholder "Your name"
  - `#contact-email` (email) — placeholder "Your e-mail"
  - `#message` (textarea, cols=30 rows=10) — placeholder "type the message here ..."
  - Submit button "SEND" (`.button.contact__button`)
  - Feedback element `#contact-message`
- Validation: all required + email format, JS-side.
- Submission: **EmailJS** (see §13).

**FAQ section** — 6 Bootstrap-collapse items, single-open accordion, chevron rotates 180° via CSS:

1. "What technologies do you specialize in?" — Laravel (BE) + JS/ReactJS (FE) + MySQL + Git, AWS, Bootstrap.
2. "How long does a typical project take?" — Simple site: 1–2 weeks; complex app: 4–8 weeks.
3. "Do you work on both frontend and backend?" — Yes, full-stack with 2+ yrs production experience.
4. "What's your development process like?" — 1) Requirements 2) Planning & design 3) Development with updates 4) Testing & debugging 5) Deployment & support.
5. "Are you available for remote work?" — Yes, based in Mumbai, works globally.
6. "Do you provide ongoing support after project completion?" — Yes, post-deployment support + maintenance packages.

### 10.6 `resume.html` — Resume

**`<title>`:** `Resume | Ayush`

**Layout:** Sidebar (`col-lg-4`) + main content (`col-lg-8`).

**Sidebar:** profile image `about me.png`, name, Email/GitHub/LinkedIn/Twitter (Remixicon), "Contact Me" CTA.

**Main content:**
- **About** — same bio + quick info list as about.html.
- **Experience** (`col-lg-6`)
  - Oct 2025 – Present — Backend Developer @ Leapswitch Networks (India, Onsite) — Laravel + PHP + Python + Django + MySQL / JS, React, Next.js, Bootstrap, HTML, CSS / REST APIs, MVC, Git, AWS.
  - Jul 2025 – Oct 2025 — FullStack Web Application Developer @ SkillLogic Technologies (Remote, 3.5 months) — Laravel + MySQL / Reactjs, JS, HTML, CSS, Bootstrap / MVC, Git, AWS, API.
  - Oct 2023 – Oct 2024 — Junior FullStack Web Developer @ Technicul Cloud LLP — Laravel + MySQL / JS, HTML, CSS, Bootstrap / MVC, Git, AWS, API, basic UI/UX.
  - Jun 2023 – Sept 2024 — Trainee : Java Fullstack Development (paid training) @ Anudip Foundation — Core Java, Spring Boot, MySQL, Hibernate / Angular, HTML, CSS, JS, Bootstrap / Git, AWS.
- **Education** (`col-lg-6`)
  - Jul 2020 – Jul 2023 — B.Sc. CS, Shankar Narayan College (course codes USCS204…USCS602).
  - Jun 2016 – Jul 2020 — Schooling, Divine Providence High School & Jr. College.
- **Skills** (full width):
  - Established / Working With: Laravel · PHP · MySQL · JS · ReactJS · Bootstrap · HTML · CSS · REST APIs · Git · AWS · Core Java.
  - Currently Focusing On: Python · Django · Next.js.
- **Footer** — slimmer than other pages (nav links + copyright only, no tech-icon row).

Uses semantic `<dl>/<dt>/<dd>` for the info display. Print-friendly.

---

## 11. JavaScript Modules

Two layers. The four classic scripts below predate the CMS; `data.js` and
`render/*.js` are ES modules added with it (§2.1) and are listed at the end.

### `assets/js/main.js`
Core site behavior:
- Sticky header — adds `.active` class to `.header` past a scroll threshold and applies backdrop blur.
- Closes the slide-in nav on scroll and on the `#nav-close` click handler.
- Hamburger toggle — toggles `.is-active` on `.hamburger` and `.open` on `.navigation__menu`.
- **Spotlight** (custom JS class) — listens to `mousemove` on elements with `[data-spotlight]` and writes CSS custom properties `--mouse-x`, `--mouse-y` (relative to the element bounding rect) so the radial highlight follows the cursor.
- Integrates **GSAP + ScrollTrigger** to scale and morph border-radius on scroll for select sections.

### `assets/js/preloader.js`
Class **`LoaderAnimation`** with state:
- DOM refs: `.preloader`, `.slide-reveal-panel`, `.main-content`, `.loader-progress`, `.loader-percentage`.
- `currentProgress`, `targetProgress`, `animationId`.

Skipped entirely under `prefers-reduced-motion: reduce` — the page is simply
shown. All durations live in one `TIMING` object at the top of the file; the
matching CSS transition durations are in `style.css` and the two must be changed
together.

Behavior:
1. `simulateProgress()` — RAF-driven progress bar, ~700ms to ~95%, then waits for `window.load`.
2. `updateProgressBar()` / `animateProgressBar()` — smooth ease toward target, updates DOM `width` and percentage.
3. `completeLoading()` — jumps to 100%, holds 60ms, starts the reveal.
4. `startRevealAnimation()` — 4 phases:
   - +0ms: `.preloader.fade-out`.
   - +200ms: `.slide-reveal-panel.slide-up` **and** `.main-content.fade-in`.
   - +900ms: `.slide-reveal-panel.slide-away` (translateY -100%).
   - +1850ms: `display: none` cleanup.

**Why the content fades in at phase 2 rather than phase 3.** The panel covers
the screen at that moment, so the page is hidden behind it — but it is painted
and eligible for Largest Contentful Paint. Previously `.main-content` sat at
`opacity: 0` until the panel swept away, which meant the decorative animation
*gated* the content and put ~1.9s of it inside the LCP measurement.

Decoupling the two is the whole point: content is painted at ~260ms, and the
purple sweep is then free to take 900ms because nothing is waiting on it. Do
not "optimise" this by shortening the sweep — that was tried, it measurably
degraded the design, and it fixes nothing the decoupling has not already fixed.

### `assets/js/scroll-animations.js`
Class **`ScrollCardAnimations`** — **mobile only** (`window.innerWidth <= 768`),
and skipped entirely under `prefers-reduced-motion: reduce`.

Rewritten 2026-09. It previously ran `getBoundingClientRect()` over every card
on every scroll frame. It now uses an **IntersectionObserver** whose root is
collapsed to a zero-height line at the viewport centre
(`rootMargin: '-50% 0px -50% 0px'`), which reports the same crossings without
per-frame layout reads.

Observed selectors: `.primary-card`, `.primary-card2`, `.home__social-link`.
For `.primary-card` it also pulses nested `.client-card`, `.social-card`,
`.about-btn`, `.star-icon`. 800ms class, 2000ms cooldown per element.

Re-observes on the `content:rendered` event, because sheet-backed elements are
created after this script runs — previously those were never animated at all.
`destroy()` tears down observer and listeners; the resize handler uses it
instead of leaking a new instance per event.

The one remaining scroll listener writes `--scroll-progress` (0–100%), which
`body::before` draws as a progress bar and which needs a continuous value.
Exposed as `window.scrollAnimations` for debugging.

### `assets/js/contactform.js`
Two responsibilities:

**1) Contact form (EmailJS)**
- Selects `#contact-form`, `#contact-name`, `#contact-email`, `#message`, `#contact-message`.
- On submit: prevents default, validates non-empty, then `emailjs.sendForm("service_g3vv0sw", "template_wg7j2k6", "#contact-form", "0Vtn0gI9c1Ks3SZnC")`.
- On success → "Message successfully sent ✔" (green/`color-light`), clears fields, removes message after 5s.
- On error → console log + "Oops! Something went wrong. Please try again." (red/`color-dark`).

**2) FAQ accordion**
- 100ms delay to allow Bootstrap to load.
- Click on `.faq-question` → resolves `data-bs-target` collapse element.
- Prefers `bootstrap.Collapse` API (creates instance if missing); closes other open FAQs (single-open behavior).
- Fallback: manual `display`/`show` class toggling + `aria-expanded`.
- Chevron icon `.faq-icon` rotates 180° via CSS based on `aria-expanded="true"`.

### `assets/js/data.js` *(ES module)*
The content layer's shared code: `load()` / `loadAll()` fetch and cache the JSON
(memory + `localStorage`), `byOrder`, `splitList`, `splitPairs`, `isTrue`,
`esc()` for safe interpolation, `applyText()` for `data-text` / `data-html`, and
`pictureHtml()` which wraps local images in `<picture>` with AVIF/WebP sources.
`clearCache()` is available from the console while editing the sheet.

### `assets/js/render/*.js` *(ES modules)*
One renderer per area, each reading from `assets/data` and marking its container
`data-rendered="true"` (or `"failed"`) so problems are visible in the DOM:

| File | Renders |
|---|---|
| `site-render.js` | profile text, navigation, socials, footer tech row, per-page copy |
| `home-render.js` | home bento content |
| `project-render.js` | project grid + `CreativeWork`/`ItemList` JSON-LD |
| `about-render.js` | experience, education, certifications carousel, skills |
| `services-render.js` | service cards |
| `faq-render.js` | contact FAQ accordion + `FAQPage` JSON-LD |

Both JSON-LD blocks are built from the same rows their cards render, so they
cannot drift from the sheet. The trade-off is that they only exist after JS
runs — fine for Google, possibly invisible to simpler fetchers.

---

## 12. Assets Inventory

> **File sizes in this section and in §17 are pre-2026-09 and are no longer
> accurate.** Every referenced raster was resampled to 2× its CSS display size
> and now ships alongside `.avif` and `.webp` siblings of the same basename,
> which are what browsers actually download. `assets/img` went from 26 MB to
> 15 MB on disk; the certificate payload on `/about` went from 14,766 KB to
> **550 KB** and the project screenshots from 9,858 KB to **335 KB**. The
> largest generated file is 180 KB.
>
> **Invariant:** every local `image_url` in `assets/data` must have `.avif` and
> `.webp` siblings. A `<source>` the browser accepts but cannot fetch is *not*
> retried against the `<img>` fallback, so a missing sibling is a broken image,
> not a slow one. Remote URLs (the Udemy certificates) are passed through as a
> plain `<img>` by `pictureHtml()`.

### `assets/img/`

**Profile / brand**
- `Home page Profile image.jpg` (~187KB) — home hero portrait.
- `about me.png` (~208KB) — about/resume profile image, also OG/Twitter share image.
- `ayush sign.png` (~11KB) — signature graphic for Credentials card.
- `Ayush pic.jpeg`, `Ayush resume pic.jpeg` — earlier portrait images.

**Icons / category**
- `favicon-portfolio.svg` — favicon and Apple touch icon.
- `favicon.png` — fallback PNG favicon.
- `github.png`, `github2.png`, `github3.png` — GitHub card icons.
- `my works.png` — Projects card icon.
- `code.svg`, `api.svg`, `laptop.svg`, `mobile-dev.svg`, `Counter.svg` — service / feature icons.
- `mysql.png` — tech badge.

**Project screenshots**
- `larabasex.png`, `write_on.png`, `daily_buzz.png`, `portfolio project.png`, `1.2 User homepage.png`, `2 .png`, `jabritravelss.png`, `portfolioss.jpeg`, `A1.jpg`.

### `assets/img/certificate/`

| File | ~Size |
|---|---|
| `Anudip Foundation JavaFullstack.png` | 678 KB |
| `TNSFoundation.jpg` | 570 KB |
| `collegeRank.png` | 1.86 MB |
| `crido.jpeg` | 53 KB |
| `crido_program.jpeg` | 28 KB |
| `gwoc.png` | 5.58 MB |
| `gwoc2.png` | 3.24 MB |
| `jwoc.png` | 3.11 MB |

Plus 3 external Udemy certificates referenced from `udemy-certificate.s3.amazonaws.com`.

### `assets/video/`
- `batman.mp4` (~1 MB) — used inside the "Why should we hire you?" Bootstrap modal on the about page.

### `assets/css/`
- `style.css` — single stylesheet, ~3,300 lines, ~70 KB.

### `assets/js/`
- `main.js` (~5 KB) · `preloader.js` (~3.2 KB) · `scroll-animations.js` (~6.3 KB) · `contactform.js` (~5 KB).

---

## 13. Forms & Integrations (EmailJS)

The contact form is hosted statically and submits via the **EmailJS** browser SDK — no backend.

```js
emailjs.sendForm(
  "service_g3vv0sw",   // EmailJS service ID
  "template_wg7j2k6",  // template ID
  "#contact-form",     // form selector
  "0Vtn0gI9c1Ks3SZnC"  // EmailJS public key
);
```

Form fields submitted: `name` (`from_name`), `email` (`user_email`), `message`.

UI feedback:
- Success: "Message successfully sent ✔" (green), fields cleared, message removed after 5s.
- Error: "Oops! Something went wrong. Please try again." (red).

The keys above are public client-side keys (intended to be visible in the browser).

---

## 14. Performance Optimizations

- `preconnect` and `dns-prefetch` for fonts/CDNs.
- Google Fonts `display=swap`.
- Decoded async images: `<img decoding="async">`.
- `will-change: transform` and `backface-visibility: hidden` on animated cards.
- `requestAnimationFrame` batching on the one remaining scroll handler.
- 2000ms cooldown per element for the mobile scroll-trigger animation.
- Single CSS file — no build step required.
- **AVIF/WebP via `<picture>`** for every local raster (see §12).
- **Variable fonts** — one file per family instead of seven static weights (§5).
- **LCP hints**: `fetchpriority="high"` plus a *typed* AVIF `<link rel="preload">`
  on the two images that are genuinely the LCP element (home portrait,
  resume portrait). The `type="image/avif"` matters — browsers without AVIF skip
  the preload instead of fetching a format they cannot use. `about.html` reuses
  the same portrait but renders it below a full section, so there it is `lazy`.
- `loading="lazy"` on every non-LCP image; explicit `width`/`height` on static
  images to reserve space.
- **The reveal animation no longer gates the content** — see `preloader.js` in
  §11. Content paints at ~260ms instead of ~1.9s.
- `backdrop-filter` drops from 10px to 4px under 768px and off entirely on
  `.client-card`: it is the heaviest thing on a mobile GPU while scrolling.

**Known drag, not yet addressed:** Bootstrap 5.0.2 is loaded unminified-ish from
CDN for a small amount of grid/modal/collapse/carousel use, and every page
hotlinks its decorative card backgrounds and star icons from
`wpriverthemes.com` — a third-party theme site the deploy does not control.

---

## 15. Accessibility & SEO

**Accessibility**
- Semantic landmarks (`<nav>`, `<header>`, `<footer>`, `<main>`).
- Headings ordered (h1 → h6).
- Form fields use matching `id` / `name` and labels/placeholders.
- `aria-expanded` on FAQ triggers; `aria-hidden` on collapsed content.
- Sufficient color contrast (white on `#0F0F0F`, `var(--brand)` accent on dark).
- Touch targets sized for mobile (e.g. 82×82 social icons).
- **Global `:focus-visible` ring** (2px `var(--brand)`, 2px offset) for WCAG 2.2
  SC 2.4.13. The three former `outline: none` resets are narrowed to
  `:focus:not(:focus-visible)` so pointer focus stays quiet and keyboard focus
  does not.
- **`prefers-reduced-motion: reduce`** honoured in CSS (blanket near-zero
  durations) *and* in JS — the preloader, the mobile card pulses and the GSAP
  ScrollTrigger morph each bail out, because GSAP writes inline styles a media
  query cannot reach.
- **Footer tech tooltips are keyboard-reachable**: the triggers carry
  `tabindex="0"`, `role="img"` and `aria-label`, and the tooltip is mirrored onto
  `:focus-visible`. Previously the text existed only as CSS `::before` content,
  invisible to assistive tech.
- Icon-only links carry `aria-label`; their `<i>` glyphs are `aria-hidden`.

**SEO**
- Per-page `<title>`, `<meta name="description">`, `og:`/`twitter:` title and
  description — all six distinct.
- **Self-referencing `rel="canonical"`.** Until 2026-09 every page pointed its
  canonical at the homepage, which told search engines the other five were
  duplicates and should not be indexed.
- JSON-LD: `Person` on every page, `WebSite` on the home page,
  `BreadcrumbList` on the other five, plus runtime `FAQPage` (contact) and
  `CreativeWork`/`ItemList` (projects).
  `WebSite` deliberately carries **no** `potentialAction`/`SearchAction`: there
  is no search endpoint, and declaring one that 404s is a false claim.
- `robots.txt` — allows the AI crawlers (GPTBot, ClaudeBot, PerplexityBot,
  Google-Extended and friends) explicitly. Note that `Allow`/`Disallow` bind to
  the `User-agent` group above them and are **not** inherited, so the
  `/scripts/` exclusion is repeated per group.
- `llms.txt` — plain-markdown index of pages, experience and projects.
- `sitemap.xml` — six URLs, referenced from `robots.txt`.
- Internal cross-linking through the side nav, header navbar and footer.

---

## 16. Deployment

- **Platform:** GitHub Pages (static hosting).
- **Live URL:** https://ayush-sleeping.github.io/Personal-Portfolio/
- **Build step:** none — files served as-is.
- **HTTPS:** enabled by GitHub Pages.

---

## 17. Image-by-Image Visual Analysis

This section is the result of opening every file in `assets/img/` and `assets/img/certificate/` and describing what each image actually shows — composition, colors, and how it ties back to the site UI. It captures information that simply reading the HTML can't (e.g. that `portfolioss.jpeg` is a screenshot of a *previous design iteration* of this same portfolio).

### 17.1 Profile / brand imagery

#### `Home page Profile image.jpg` (~187 KB · roughly square)
The hero portrait used inside the **Primary About card** on `index.html`. Ayush is photographed at a podium speaking into a microphone. He wears a white shirt with a blue lanyard / ID card. Behind him is a banner with the words **"Shankar Narayan College of Arts &"**, **"& Self Finance Courses"**, and a large red title **"Research"** / **"Development"** — clearly a college research-and-development event banner. The wall is light purple, with a window covered by a sheer blue/white curtain. Vibe: confident, in-public, presenter mode. Crops nicely into a rounded card.

#### `about me.png` (~208 KB · 1:1 circular crop)
The image used as the **profile avatar on `about.html` and `resume.html`**, **and as the OG / Twitter share image** for the whole site. A side-profile shot of Ayush leaning against a textured grey concrete pillar / wall. White shirt, yellow lanyard reading "AYUSH BM" partially visible on chest. Soft daylight. Calm, contemplative posture — different mood from the home-page hero (presenter vs. portrait).

#### `ayush sign.png` (~11 KB · transparent PNG)
A hand-drawn cursive **signature reading "Aymishra"** in a thin silver-grey ink on transparent background. This is what shows inside the **"MORE ABOUT ME / Credentials"** card on the home page (and reused on `about.html`).

#### `Ayush pic.jpeg` (~252 KB · portrait passport-style)
A formal **passport / ID-style portrait** — younger Ayush against a near-white background, dark V-neck top, neutral expression. Higher contrast than the current site portraits. Likely a legacy asset; not currently referenced from any HTML page.

#### `Ayush resume pic.jpeg` (~27 KB · vertical crop)
Tall portrait crop of the same college-podium event as `Home page Profile image.jpg` but in a **vertical/portrait aspect ratio**, well-suited to a resume sidebar. Legacy asset; no longer referenced (the current resume page uses `about me.png`).

#### `A1.jpg` (~137 KB · landscape)
**Lifestyle / aesthetic photograph** — Ayush stands on a rocky shoreline with his back to the camera, wearing a dark t-shirt and shorts, looking out at the sea. Red-brown rocks foreground, calm grey-blue ocean, distant cliffs and trees on the left, soft overcast sky. Looks like coastal Maharashtra/Goa. Not currently referenced; appears to be a saved hero/decorative candidate.

#### `portfolioss.jpeg` (~75 KB · landscape)
**Screenshot of a previous iteration of this same portfolio.** Important historical context:
- Top nav links: `About` · `Resume` · `Projects` · `Contact` (no "Services" yet, no "Home", and a hamburger top-right).
- Background: very dark grey with subtle mountain/desert silhouette.
- Heading: **"Ayush B Mishra"** in a large white **monospace** font (Roboto Mono — same family the current site still uses for headings).
- Tagline in **bright green** `#86C232` (matches the still-existing `--bright-text-color`): **"Web Developer, Skilled in MERN-stack"**.
- Below, a definition list:
  - `Interest:` Software Development and Fullstack Web Development
  - `Undergraduate:` Bachelor of Science in Computer Science
  - `Experience:` Fresher
  - `EMAIL:` ayushbm84@gmail.com
  - `ADDRESS:` Mumbai, Maharashtra, India
- Three social icons in **green** (GitHub, LinkedIn, Mail) — Remixicon, no Twitter yet.
- Profile photo on the left = the same `Home page Profile image.jpg` (square frame).

This screenshot tells us:
1. The site has been **re-themed**. The earlier identity was *dark + green-monospace, hacker-ish*; the current identity is *dark + blue-glassmorphic, modern* (GridX-inspired) with `#5B78F6` as the new accent.
2. The earlier copy tagged Ayush as "MERN-stack / Fresher". The current copy tags him as "FullStack Web Developer • Backend Specialist" with "2+ years of experience" (now a Backend Developer at Leapswitch Networks) — confirming a real career step between the two iterations.
3. The green `--bright-text-color: #86C232` variable still in `:root` is a leftover of that earlier theme.

### 17.2 Brand / nav icons

#### `favicon-portfolio.svg` (~150 KB)
The active site favicon and Apple touch icon. The SVG is a **180×180 circle mask with an embedded base64 JPEG** (source size 720×1034) — i.e. it's a circular-cropped photographic favicon, not a vector logo. The embedded EXIF metadata says the source image was processed in **PicsArt on 2023-01-14**. So the favicon is a photo of Ayush masked into a circle.

#### `favicon.png` (~36 KB)
A **legacy / unused favicon**. Renders as a flat icon on a dark green background — yellow speech-bubble badge containing a green person silhouette and white horizontal lines (a "contact card / profile" pictogram). Style is unrelated to the current site theme; left over from an earlier design.

#### `my works.png` (~24 KB)
The icon for the **"SHOWCASE / Projects"** card on the home page. A stylised illustration of a **dark MacBook-shaped laptop opened to a code editor**, syntax highlighted in pinks/purples/teals against a navy/dark-blue editor background. The label **"MY WORKS"** appears in light grey above the laptop. Reads as "code, work in progress".

#### `github.png` (~23 KB)
**Solid black classic Octocat** silhouette on transparent background. Dark variant — used where the surrounding card is light.

#### `github2.png` (~14 KB)
Renders as effectively **blank / pure white** — likely a white-on-white version saved during iteration. Not visibly referenced and not visually useful as-is.

#### `github3.png` (~6 KB)
**White outline-only Octocat** on transparent background — the version used on the dark home-page **"CODE SPEAKS LOUDER / GitHub"** card. Matches the white-on-dark theme of the site.

#### `mysql.png` (~12 KB)
A flat black **MySQL logo** — the cylindrical 4-stack database icon with the bold word "MySQL" beneath. Likely used as a tech-stack badge.

### 17.3 Inline service / feature SVGs

These are tiny line-icon SVGs (≤1 KB each), all **24×24, stroke 1.5, white** (`#ffffff`). They're flat outline pictograms of the type popularised by Iconoir / Lucide — clean and modern. They sit inside the Specialization icon-box on the home page and as feature glyphs throughout.

| File | What it draws |
|---|---|
| `Counter.svg` | A tiny **8×8 grey dot** (`#C1C7D0`). Used as a list bullet. |
| `code.svg` | The **`< / >` "code" glyph** — left and right angle brackets with a slash between. |
| `api.svg` | A **horizontal "API node" diagram**: small circle in the middle, lines extending left and right ending at the edges of the box (a node with two endpoints). |
| `laptop.svg` | A **laptop / monitor with `< >` brackets** drawn on the screen — "develop on laptop". |
| `mobile-dev.svg` | A **phone / app frame with `< >` brackets** — "mobile dev". |

### 17.4 Project screenshots (used on `project.html`)

#### `larabasex.png` — LaraBaseX (Aug 2025)
Screenshot of an **admin dashboard** in dark mode.
- Left sidebar (`Platform`): Dashboard (active), Roles, Users, Employees, Enquiries, Analytics. Avatar "RU – Root User" pinned at the bottom.
- Main: **"Total Visitors / Total for the last 3 months"** with a tab pill (`Last 3 months` / `Last 30 days` / `Last 7 days`) and a wide **area chart** in blue/purple gradient spanning Apr 2 → Jun 30.
- Below: **"Users Management / Manage and view all platform users"** — search input (left), "Status: All" dropdown (right). Sortable table: **Name · Email · Role · Status · Join Date** with rows John Doe / Jane Smith / Bob Johnson / Alice Brown / Charlie Wilson. Status badges: **Active** (green), **Inactive** (red), **Pending** (yellow).
- Footer: "Showing 5 of 5 entries" + Previous / Next pagination.
This is the visual proof that LaraBaseX is a **starter kit / admin template**, matching the project description.

#### `write_on.png` — WriteOn (Jul 2025)
Screenshot of a Firebase-backed **blogging app** in dark mode (browser tabs visible at top of capture).
- Top bar: brand "WriteOn", search input, nav `Home / About / Contact / Create`, avatar at right.
- Heading: **"Recent Blog Posts"**.
- Grid of blog cards (3 columns visible):
  - "DEVELOPERS" (red typographic poster, dev-jobs theme), "Best Jazz Clubs..." (orange jazz-silhouette art), "How AI is..." (Matrix-style green code rain), plus a stadium photo, chess pieces, and an NVIDIA-style chip — six cards total visible.
- Each card has **"Delete"** and **"Update"** pill buttons in the top-right corner of the cover image, a title, an excerpt, hashtag tags (e.g. `#coding #ai #software`), and **"By: Ayush B Mishra"**.

#### `daily_buzz.png` — DailyBuzz (Jul 2025)
Screenshot of a **news aggregator** in light mode.
- Pill nav at top: `All News` (active) · `Technology` · `Sports` · `Business` · `Science` · `Health` · `Entertainment`.
- "Latest News" headline, then a row of 4 article cards: each card has a hero photo, headline, excerpt, source attribution (e.g. *Associated Press, Aug 14, 2025, 07:46 AM*), e.g. "Rabbits with 'horns' in Colorado", "Alaska's glacial flood hit Juneau", etc.
- Below: **"Editor's Favorite"** row of 10 round category icons (f1, cricket, chess, football, apple, openai, coding, siliconvalley, google, india).

#### `portfolio project.png` — Personal Portfolio (Jun 2025)
A **screenshot of this very portfolio's home page** (used self-referentially as the project tile).
- Header: brand "ayushSleeping", nav `Home / About / Resume / Projects / Contact`, "Let's talk" pill button.
- Left: profile-card with podium portrait and label **"Software Developer / Ayush Mishra / I am a passionate software developer with a focus on building high-quality web applications."**
- Right: marquee strip (`...veloper • Junior Frontend ReactJS Developer • Software Developer`).
- Card grid below: **Credentials** (with the `Aymishra` signature), **Showcase / Projects**, **Code Speaks Louder / GitHub** (white Octocat outline), **Specialization / Services Offering** (with `< />`, `DEV`, branch and terminal icons), **Stay With Me / Profiles** (Twitter + LinkedIn).

Note: the screenshot still has a "Resume" link in the nav, even though the *current* `index.html` nav now reads `Home / About / Projects / Services / Contact`. So this screenshot is a **slightly older snapshot** of the site, captured before the nav was reworked.

#### `1.2 User homepage.png` — NFT Ecommerce (Oct 2023)
Browser-window screenshot (Chrome, with `JSON Server` and `Ecommerceproject` tabs and a localhost address bar).
- Pink/red gradient hero: **"DISCOVER EXCLUSIVE NFTS / Trendy NFTs / Explore a world of unique digital assets..."**
- 4 NFT product cards on a navy/red background: cartoon NFT avatars labelled **MetaBillionaire #6837**, **Macaco #71000**, **Bunny Bear #569**, **Pandas #336**, each with `Price`, `Color` and a **"View Details"** button.
This is the Angular CRUD demo project; the JSON-Server tab confirms the stack.

#### `2 .png` — Brija Stream (Sep 2023)
Streaming-platform homepage in a dark green theme.
- Top nav: brand **"BRiJA STREAM"** in green/yellow, nav `HOME / MOVIES / TV SHOWS / SUBSCRIBE NOW`, search icon, **"Sign In"** yellow pill button.
- "TOP TRENDING THIS WEEK" section, "Dive into the latest cinematic sensations!" tagline.
- 3 movie cards visible: **"Stumblebums"** (KIDS+FAMILY, with `+iTV`), **"S/L/O"** (with the lettering "Solo", `+iTV`), **"Louis Armstrong's Black & Blues"** (DOCUMENTARY+MUSIC, `+iTV`). Each is a movie poster with a metadata badge.

#### `jabritravelss.png` — JaBri Travel (Jun 2022)
Travel-booking site, narrow/mobile capture.
- Top dark nav: brand **"JABRI | Travel"**, links `Home / Services / Packages / Offers / Explore / Reviews / Contact / About`.
- Hero: **"The India"** title in white over a green-tinted aerial photo of Indian countryside / farms with the side caption *"Come and explore The INDIA"* running vertically.
- Body copy: "India (all type of tourist destinations in one place) is one of the most vibrant, colorful, exciting places to visit in the world. The diversity of people, culture and cuisine make it a worthwhile destination for any traveller."
- Two CTAs: **"EXPLORE NOW"** (filled green) and **"BOOK NOW"** (outline).
- Right-edge vertical social rail.

### 17.5 Certificates (used on `about.html` carousel)

#### `Anudip Foundation JavaFullstack.png` (~679 KB)
- Co-branded **Anudip — Life Transformed** + **Mettl — Build Winning Teams**.
- "This award certifies / **AYUSH MISHRA** / has passed / **Advanced Program on Java Full Stack Development using Angular** / of **381 Hrs** duration in **Dec'23** with Grade **A**".
- Two signatures (Head Skills Business + CEO Anudip), date 30 January 2024.
- Blue **"METTL CERTIFIED"** seal at bottom-left.
- Decorative green/blue triangle accents.
- This is the formal credential behind the Anudip line on the about/resume pages.

#### `TNSFoundation.jpg` (~570 KB)
- Co-branded **"Funded by accenture"** + **"Implemented by TNS India Foundation"**.
- Title: **"Campus to Digital Careers Program / C2DC / Certificate of Completion"**.
- Awarded to **"Ayush Brijesh Kumar Mishra"** (full legal name — handwritten) for completing the C2DC Program covering **Personal Effectiveness, Professional Effectiveness, Professional English, Interview Skills, Corporate Readiness**.
- "In association with Shankar Narayan College / 2022-23".
- Signed by **Rupa Bohra, Managing Director, TNS India Foundation**.
- This certificate corresponds to the about-page "Aug 2022 – Sept 2022 · Youth Employability Program · TNS India Foundation" timeline entry.

#### `collegeRank.png` (~1.86 MB)
A **photographed** physical certificate (warm yellow tones, taken at an angle). Reads:
- "Shree Shankar Narayan Education / **SHANKAR NARAYAN COLLEGE OF ARTS** / Navghar, Mahavidyalaya Marg, Bhayandar (E), Thane - 401105 (Maharashtra)".
- **"Late Pravin Rohidas Patil Award / Certificate / 2021-2022"**.
- "This is to certify that Mr/Miss **Mishra Ayush Brijesh Kumar** (Class **S.Y.C.S.**) has Secured **2nd Rank** ... on the occasion of Foundation Day".
- Date: **19/09/2022**, Secretary + Principal signatures.
- A medal/lanyard ribbon labelled **"Felicitation of Meritorious Students / Late Pravin Patil Memorial Prize 2021-22"** with a small portrait photo lies on top of the certificate.
- Indian state emblem visible at top-left.
- Note the higher-confidence detail: **2nd rank in S.Y.C.S. (2nd-year Computer Science) — academic merit award**, which the current about-page bio and CGPA 9.23/10 don't explicitly call out. Worth surfacing in copy if desired.

#### `crido.jpeg` (~53 KB) — *Crio Winter of Doing 2021 — Skill Kudos*
- Light blue painterly background, **Crio.Do** logo top-left, **Winter of Doing** monogram top-right.
- "**Kudos / 11 Ayush B Mishra**".
- "We are proud of your achievements in Stage 1 of Crio Winter of Doing 2021. Congratulations on successfully completing and learning following skills:" — pill tags: **Git Basics · Linux Basics · AWS · Cloud Deployment · REST · HTTP**.
- "Awards Received": **Disciplined Rooster** ("Show Up Every Day") and **Relentless Bee** ("Never Give Up").
- Mountain/flag illustration motif.

#### `crido_program.jpeg` (~28 KB) — *Crio Winter of Doing 2021 — Stage 1 Completion*
- Dark navy certificate framed with pink/purple painterly bands.
- "11 Ayush B Mishra has completed **Stage 1 / Crio Winter of Doing 2021** / Program: **Web Developer Essentials** / Duration: **2 Weeks** / Date: **Jan 2021**".
- Signed **Sridher J., Co-founder, Crio.Do**.
- The flag illustration matches `crido.jpeg`.

#### `gwoc.png` (~5.58 MB) — *GWOC '21 Achievement*
- **GirlScript Foundation — Winter of Contributing 2021** "Certificate of **Achievement**".
- "AYUSH MISHRA … for being an **excellent Contributor** at Girlscript Winter of Contributing 2021 organized by Girlscript Foundation from 1st of September '21 to 30th of November '21. … hereby awards this certificate in recognition to their exceptional efforts towards showcasing their sincere dedication for GWOC '21."
- **Domain: ANDROID DEVELOPMENT WITH KOTLIN.**
- Signed by **Anubha Maneshwar (Founding Director)** and **Mohit Varu (Managing Director)**.
- Navy + gold trim, **GWOC '21** medal seal top-right, **MSME** Government of India logo bottom-left.
- This is the *higher-tier* (excellent contributor) certificate.

#### `gwoc2.png` (~3.24 MB) — *GWOC '21 Participation*
- Same GirlScript Winter of Contributing 2021, but **"Certificate of Participation"** version.
- "Ayush Mishra was an active participant … from September 2021 to November 2021. … in recognition of their dedication towards GWOC '21."
- **Domain(s)**: **Android Development with Kotlin** + **Front-end Web Development with HTML, CSS, JavaScript, Bootstrap, C/C++** — confirms multi-domain participation, broader than `gwoc.png` alone implies.
- Same Anubha Maneshwar / Mohit Varu signatories. MSME logo present.

#### `jwoc.png` (~3.11 MB) — *JWOC 2K22*
- **JGEC Winter of Code (JWOC)** — bright modern blue/purple geometric design.
- "Certificate of **Participation** / This certificate is proudly presented to / **Ayush Mishra** / For active participation in **JGEC WINTER OF CODE, 2K22** as a **MENTEE** by Contributing to Various Projects."
- Dates: **1 February 2022 – 9 March 2022**.
- Lead organisers: **Niloy Sikdar · Anubhab Sarkar · Niladri Mondal · Utpalendu Barman**.
- Sponsor logos (right block): axure · BADELOG · SASHIDO · REBOOTMARKETING · GR Beans · HACK CLUB · PrepBytes · .xyz.

#### Udemy certificates (3, external)
Referenced from `udemy-certificate.s3.amazonaws.com` (not stored locally) — slot 8/9/10 of the about-page carousel.

### 17.6 Video — `assets/video/batman.mp4` (~1 MB)
Used inside the **"Why should we hire you?"** Bootstrap modal on `about.html`. The modal backdrop is `rgba(20, 22, 34, 0.95)` and the video plays as a personal pitch / hire-me clip. Filename "batman" is a stylistic choice — the page itself just labels the trigger card "Why should we hire you?".

### 17.7 What the imagery says about the brand

Putting all the visuals together, the portfolio's image direction has three clear voices:

1. **Authority / professionalism** — the podium photo (`Home page Profile image.jpg`, also `Ayush resume pic.jpeg`) with the college Research & Development banner positions Ayush as someone who *presents* his work, not just writes code.
2. **Calm / craftsman** — the side-profile portrait (`about me.png`) is reflective and clean; appropriate for the OG share image.
3. **Modern product UI** — every project screenshot is a real product surface (admin dashboard, blog, news app, NFT store, streaming platform, travel site) with consistent dark / light theme choices that map back to current frontend trends.

Combined with the dark-blue glassmorphic UI and the Roboto Mono headings, the message is consistent: *modern, dark, product-minded, technical fullstack developer*. The earlier green-monospace-MERN identity (visible only in `portfolioss.jpeg`) has been intentionally retired in favour of the current GridX-inspired blue glassmorphic theme.

---

## Appendix A — Social & Contact links

| Platform | URL | Handle |
|---|---|---|
| Twitter | https://twitter.com/AyushBM1 | `@AyushBM1` |
| LinkedIn | https://www.linkedin.com/in/ayush-bm/ | `ayush-bm` |
| GitHub | https://github.com/ayush-sleeping | `ayush-sleeping` |
| Email | mailto:ayushbm84@gmail.com | `ayushbm84@gmail.com` |

## Appendix B — Notable Hex Reference Card

```
Primary Blue        #5B78F6   Buttons, accent text, theme color
Light Blue          #7B9BFF   Gradient end / hover glow
Deep Purple         #9333EA   Secondary gradients
Violet              #8B5CF6   Timeline accents
Green Highlight     #86C232   Bright text variable
Page Background     #0F0F0F   Body background, --background-color
Card BG (legacy)    #1a1a1a / #1c1c1c
Hover Surface       #2a2a2a / #2b2a2a / #323232
White Text          #ffffff
Light Gray Text     #E5E7EB / #BCBCBC
Muted Text          #9CA3AF / #999da0 / #a1a1a1 / #acafb3
Dividers            #cccccc
```

## Appendix C — Notable Class Reference

```
.preloader, .slide-reveal-panel, .main-content
.navigation__menu, .nav-categories, .nav-social, .nav-footer
.header, .navbar, .logo, .hamburger.hamburger--emphatic
.primary-card, .primary-card2, .client-card, .social-card
.skill-card, .timeline-item, .timeline-content
.project-showcase-card
.faq-question, .faq-icon
.contact__button, #contact-form, #contact-message
[data-spotlight]   /* spotlight cursor effect */
.scroll-animated   /* mobile scroll-into-center pulse */
```

---

_End of documentation. Last updated: 2026-05-01._
