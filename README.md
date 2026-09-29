# Personal Portfolio — Next.js (v3)

[**➥ Live site**](https://ayush-sleeping.github.io/Personal-Portfolio/) ·
Portfolio of **Ayush Mishra**, Backend Developer (Laravel, PHP, MySQL; Python, Django, Next.js).

> **You are on the `v3-nextjs` branch.** This is the new Next.js version, under construction.
> **The live site is still the v2 plain-HTML version**, served from `main`. Nothing on this branch is deployed.

<br>

## Table of Contents

- [Status](#status)
- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Commands](#commands)
- [The `version2/` reference copy](#the-version2-reference-copy)
- [How content works](#how-content-works)
- [Folder structure](#folder-structure)
- [Docs](#docs)

<br>

## Status

| Version | What | Where |
|---|---|---|
| **v2** | Plain HTML/CSS/JS site, content from a Google Sheet | **Live**, on `main` · reference copy in `version2/` |
| **v3** | Next.js project foundation: config, shared shell, data layer, tooling, CI | This branch · plan: [`documentation/version3.md`](documentation/version3.md) |
| next | The one-page portfolio, with the same UI/UX as v2, built on the v3 foundation | Planned in `task.md` after v3 |

<br>

## Requirements

- **Node.js 22** (see `.nvmrc`; Next.js 16 needs ≥ 20.9)
- **npm** (comes with Node)
- Git, with access to the `v2-html-final` tag (only needed to recreate `version2/`)

Everything used is free. Zero-budget rule: see [`documentation/version2.md`](documentation/version2.md).

<br>

## Getting started

```bash
git clone git@github.com:ayush-sleeping/Personal-Portfolio.git
cd Personal-Portfolio
git switch v3-nextjs

npm install          # install dependencies
npm run dev          # http://localhost:3000/Personal-Portfolio
```

To also get the v2 reference copy (optional, local only):

```bash
mkdir version2 && git archive v2-html-final | tar -x -C version2
npm run v2           # http://localhost:4000
```

<br>

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Validates the content JSON, then builds the static site into `out/` |
| `npm run preview` | Serves `out/` at `http://localhost:3000/Personal-Portfolio/`, like GitHub Pages will |
| `npm run v2` | Serves the `version2/` reference copy at `http://localhost:4000` |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no output |
| `npm run format` / `format:check` | Prettier: fix / check |
| `npm run validate-data` | Checks `assets/data/*.json` against the sheet schema and image siblings |
| `npm test` | Playwright smoke test against the built site (run `npm run build` first) |

CI (`.github/workflows/ci.yml`) runs lint, typecheck, validate-data, build and test on every push to this
branch. It does not deploy.

<br>

## The `version2/` reference copy

`version2/` is the **complete v2 HTML site, exactly as it was at the `v2-html-final` tag**. It's there so the
old UI/UX can be opened locally at any time, to compare against while building v3.

- **Local only.** It's gitignored and never committed, on any branch.
- **Read-only.** Don't edit it. It's a reference, not source code.
- **Frozen.** Its content is a snapshot and doesn't update when the sheet changes.
- **Lost it, or on a new machine?** Recreate it with the command in [Getting started](#getting-started).

<br>

## How content works

Content is edited in a Google Sheet, not in code:

```text
Google Sheet ──(GitHub Action, every 6 h)──▶ assets/data/*.json ──(next build)──▶ static HTML
```

1. Edit the sheet (`portfolio-cms`).
2. The **Refresh content** workflow (on `main`) fetches it, validates it and commits `assets/data/*.json`.
3. `next build` reads that JSON **at build time** and writes the content into the HTML. The browser never
   calls Google, and crawlers see all content without running JavaScript.

Sheet setup: [`sheets/SETUP.md`](sheets/SETUP.md). How the build uses the data:
[`documentation/architecture.md`](documentation/architecture.md).

<br>

## Folder structure

```text
├── app/                    Next.js App Router: layout.tsx (shared shell), page.tsx, not-found.tsx
├── components/             sections/, layout/, cards/, client/ (built after v3; see each folder's README)
├── lib/                    data.ts (build-time JSON reads), types.ts (one type per sheet tab), site.ts
├── public/                 served as-is: assets/{img,css,video}, robots.txt, llms.txt, sitemap.xml
├── assets/data/            content JSON, written by the sheet pipeline (never hand-edit)
├── scripts/                sheet pipeline, validator, local static server
├── sheets/                 sheet setup guide, seed CSVs, Apps Script
├── tests/                  Playwright smoke test
├── documentation/          docx.md (v2 reference), version2.md, version3.md, architecture.md
├── .github/workflows/      ci.yml, refresh-content.yml, liveness.yml
└── version2/               gitignored: the v2 site, local reference only
```

<br>

## Docs

| Doc | For |
|---|---|
| [`documentation/architecture.md`](documentation/architecture.md) | How this Next.js project works |
| [`documentation/version3.md`](documentation/version3.md) | The v3 plan and its progress |
| [`documentation/version2.md`](documentation/version2.md) | The v2 roadmap and its closing status |
| [`documentation/docx.md`](documentation/docx.md) | Full reference of the v2 HTML site |
| [`sheets/SETUP.md`](sheets/SETUP.md) | Setting up the Google Sheet |

<br>

> _Designed & developed by Ayush Mishra_
