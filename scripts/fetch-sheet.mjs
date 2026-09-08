#!/usr/bin/env node
// Pulls every tab listed in scripts/content-map.mjs out of the Google Sheet
// and writes assets/data/. Used both locally and by the GitHub Action.
//
//   node scripts/fetch-sheet.mjs                 fetch + validate + write
//   node scripts/fetch-sheet.mjs --dry-run       fetch + validate, write nothing
//   node scripts/fetch-sheet.mjs --staging-only  fetch into .staging, stop
//   node scripts/fetch-sheet.mjs --promote       validate .staging, then write
//
// Credentials come from the environment, or from a local .env when present.
// Nothing under assets/data is touched until every tab has been fetched AND
// the complete set validates, so a partial failure leaves last-good in place.

import {
  readFileSync, writeFileSync, existsSync, mkdirSync, rmSync, cpSync,
} from 'node:fs';
import { dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { CONTENT, DATA_DIR } from './content-map.mjs';

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');
const STAGING_ONLY = args.has('--staging-only');
const PROMOTE = args.has('--promote');

const STAGING = '.staging';
const BACKUP = '.staging.backup';

function loadEnv(file = '.env') {
  if (!existsSync(file)) return {};
  const out = {};
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    out[t.slice(0, eq).trim()] = v;
  }
  return out;
}

function validate() {
  try {
    execFileSync('node', ['scripts/validate-data.mjs'], { stdio: 'inherit' });
    return true;
  } catch {
    return false;
  }
}

/* ------------------------------------------------------------- promote only */

if (PROMOTE) {
  if (!existsSync(STAGING)) {
    console.error('fetch-sheet: nothing staged. Run with --staging-only first.');
    process.exit(1);
  }
  rmSync(BACKUP, { recursive: true, force: true });
  cpSync(DATA_DIR, BACKUP, { recursive: true });
  cpSync(STAGING, DATA_DIR, { recursive: true });

  if (!validate()) {
    cpSync(BACKUP, DATA_DIR, { recursive: true });
    rmSync(BACKUP, { recursive: true, force: true });
    rmSync(STAGING, { recursive: true, force: true });
    console.error('\nfetch-sheet: validation failed, assets/data rolled back.');
    process.exit(1);
  }
  rmSync(BACKUP, { recursive: true, force: true });
  rmSync(STAGING, { recursive: true, force: true });
  console.log('\nfetch-sheet: assets/data promoted.');
  process.exit(0);
}

/* ------------------------------------------------------------------- fetch */

const env = { ...loadEnv(), ...process.env };
const { SHEET_ID, GOOGLE_API_KEY } = env;

if (!SHEET_ID || !GOOGLE_API_KEY) {
  console.error('fetch-sheet: SHEET_ID and GOOGLE_API_KEY must be set.');
  console.error('             Locally: cp .env.example .env and fill both in.');
  process.exit(1);
}

function tabUrl(tab) {
  const p = new URLSearchParams({
    valueRenderOption: 'UNFORMATTED_VALUE',
    dateTimeRenderOption: 'FORMATTED_STRING',
    key: GOOGLE_API_KEY,
  });
  return `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${tab}?${p}`;
}

rmSync(STAGING, { recursive: true, force: true });
mkdirSync(STAGING, { recursive: true });

let failed = false;

for (const spec of CONTENT) {
  process.stdout.write(`  ${spec.tab.padEnd(20)}`);
  try {
    const res = await fetch(tabUrl(spec.tab));
    const payload = await res.json();
    if (!res.ok) throw new Error(payload?.error?.message ?? `HTTP ${res.status}`);

    // Reuse the same transform the rest of the pipeline uses.
    const json = execFileSync('node', ['scripts/sheet-to-json.mjs', `--kind=${spec.kind}`], {
      input: JSON.stringify(payload),
      encoding: 'utf8',
    });

    const dest = `${STAGING}/${spec.file}`;
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, json);

    const parsed = JSON.parse(json);
    console.log(spec.kind === 'keyvalue'
      ? `${Object.keys(parsed).length} key(s)`
      : `${parsed.length} row(s)`);
  } catch (err) {
    console.log(`FAILED — ${String(err.message).trim().split('\n')[0]}`);
    failed = true;
  }
}

if (failed) {
  rmSync(STAGING, { recursive: true, force: true });
  console.error('\nfetch-sheet: one or more tabs failed. assets/data left untouched.');
  process.exit(1);
}

if (STAGING_ONLY) {
  console.log(`\nfetch-sheet: staged in ${STAGING}/. Promote with --promote.`);
  process.exit(0);
}

rmSync(BACKUP, { recursive: true, force: true });
cpSync(DATA_DIR, BACKUP, { recursive: true });
cpSync(STAGING, DATA_DIR, { recursive: true });

const ok = validate();
if (!ok || DRY_RUN) {
  cpSync(BACKUP, DATA_DIR, { recursive: true });
  console.log(ok ? '\nfetch-sheet: --dry-run, assets/data rolled back.'
                 : '\nfetch-sheet: validation failed, assets/data rolled back.');
}

rmSync(STAGING, { recursive: true, force: true });
rmSync(BACKUP, { recursive: true, force: true });

if (!ok) process.exit(1);
if (!DRY_RUN) console.log('\nfetch-sheet: assets/data updated. Review with `git diff assets/data`.');
