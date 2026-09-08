#!/usr/bin/env node
// Reads a Google Sheets API v4 `values` response on stdin, writes an
// array-of-objects JSON to stdout.
//
//   curl ".../values/projects?key=..." | node scripts/sheet-to-json.mjs
//
// Row 1 of every tab is the header row. Columns are matched by exact header
// name (trimmed). Rows whose cells are all blank are dropped, as are rows with
// an empty first column — Sheets pads ranges with trailing empties.

import { readFileSync } from 'node:fs';

// A key/value tab (--kind=keyvalue) collapses to a single object keyed by the
// `key` column; anything else becomes an array of row objects.
const KIND = (process.argv.find((a) => a.startsWith('--kind=')) ?? '').split('=')[1] || 'rows';

let raw;
try {
  raw = JSON.parse(readFileSync(0, 'utf8'));
} catch (err) {
  console.error(`sheet-to-json: stdin is not valid JSON — ${err.message}`);
  process.exit(1);
}

if (raw.error) {
  console.error(`sheet-to-json: Sheets API error ${raw.error.code}: ${raw.error.message}`);
  process.exit(1);
}

const values = raw.values;
if (!Array.isArray(values) || values.length === 0) {
  console.error('sheet-to-json: no `values` in response (empty tab, or wrong tab name?)');
  process.exit(1);
}

const [headerRow, ...rows] = values;
const headers = headerRow.map((h) => String(h ?? '').trim());

if (headers.some((h) => h === '')) {
  console.error(`sheet-to-json: blank column header in [${headers.join(', ')}]`);
  process.exit(1);
}

const out = rows
  .filter((r) => Array.isArray(r) && r.some((c) => String(c ?? '').trim() !== ''))
  .filter((r) => String(r[0] ?? '').trim() !== '')
  .map((r) =>
    Object.fromEntries(
      headers.map((h, i) => {
        const cell = r[i];
        return [h, cell === undefined || cell === null ? '' : String(cell).trim()];
      })
    )
  );

if (KIND === 'keyvalue') {
  const obj = {};
  for (const row of out) {
    const key = String(row.key ?? '').trim();
    if (key) obj[key] = row.value ?? '';
  }
  process.stdout.write(JSON.stringify(obj, null, 2) + '\n');
} else {
  process.stdout.write(JSON.stringify(out, null, 2) + '\n');
}
