#!/usr/bin/env node
// Schema gate for assets/data/*.json. Exits non-zero on any problem so a bad
// sheet edit fails the Action instead of shipping to Pages.
//
//   node scripts/validate-data.mjs            # validate, exit 1 on error
//   node scripts/validate-data.mjs --dry-run  # report only, always exit 0

import { readFileSync, existsSync } from 'node:fs';
import { CONTENT, DATA_DIR } from './content-map.mjs';

const DRY_RUN = process.argv.includes('--dry-run');


// required: must be present and non-empty on every row
// optional: may be absent; listed so unknown columns can be reported
const errors = [];
const warnings = [];

for (const spec of CONTENT) {
  const file = `${DATA_DIR}/${spec.file}`;

  if (!existsSync(file)) {
    (spec.allowEmpty ? warnings : errors).push(`${file}: missing`);
    continue;
  }

  let parsed;
  try {
    parsed = JSON.parse(readFileSync(file, 'utf8'));
  } catch (err) {
    errors.push(`${file}: invalid JSON — ${err.message}`);
    continue;
  }

  // ---------------------------------------------------------- key/value tab
  if (spec.kind === 'keyvalue') {
    if (Array.isArray(parsed) || typeof parsed !== 'object' || parsed === null) {
      errors.push(`${file}: expected a JSON object (key/value tab)`);
      continue;
    }
    for (const field of spec.required ?? []) {
      if (!parsed[field] || String(parsed[field]).trim() === '') {
        errors.push(`${file}: missing required key "${field}"`);
      }
    }
    console.log(`  ok  ${file} — ${Object.keys(parsed).length} key(s)`);
    continue;
  }

  // --------------------------------------------------------------- rows tab
  if (!Array.isArray(parsed)) {
    errors.push(`${file}: expected a top-level array`);
    continue;
  }
  if (parsed.length === 0 && !spec.allowEmpty) {
    errors.push(`${file}: no rows`);
    continue;
  }

  const required = spec.required ?? [];
  const known = new Set([...required, ...(spec.optional ?? [])]);
  const keyField = required.includes('id') ? 'id' : required[0];
  const seen = new Map();

  parsed.forEach((item, i) => {
    const where = `${file}: row ${i + 1}`;

    for (const field of required) {
      if (!item[field] || String(item[field]).trim() === '') {
        errors.push(`${where}: missing required "${field}"`);
      }
    }
    for (const field of Object.keys(item)) {
      if (!known.has(field)) warnings.push(`${where}: unknown column "${field}"`);
    }

    const key = item[keyField];
    if (key) {
      if (seen.has(key)) {
        errors.push(`${where}: duplicate ${keyField} "${key}" (also row ${seen.get(key) + 1})`);
      } else {
        seen.set(key, i);
      }
    }

    if ('order' in item && item.order !== '' && !Number.isFinite(Number(item.order))) {
      errors.push(`${where}: "order" must be a number, got "${item.order}"`);
    }

    for (const [field, allowed] of Object.entries(spec.enums ?? {})) {
      const v = item[field];
      if (v && !allowed.includes(String(v).toLowerCase())) {
        errors.push(`${where}: "${field}" must be one of ${allowed.join('|')}, got "${v}"`);
      }
    }

    if ('featured' in item && item.featured !== '' &&
        !['TRUE', 'FALSE'].includes(String(item.featured).toUpperCase())) {
      errors.push(`${where}: "featured" must be TRUE or FALSE, got "${item.featured}"`);
    }
  });

  console.log(`  ok  ${file} — ${parsed.length} row(s)`);
}

for (const w of warnings) console.warn(`warn  ${w}`);
for (const e of errors) console.error(` ERR  ${e}`);

if (errors.length) {
  console.error(`\nvalidate-data: ${errors.length} error(s).`);
  process.exit(DRY_RUN ? 0 : 1);
}
console.log(`\nvalidate-data: all good${warnings.length ? ` (${warnings.length} warning(s))` : ''}.`);
