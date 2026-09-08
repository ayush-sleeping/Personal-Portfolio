#!/usr/bin/env node
// Bootstrap helper: turn assets/data into CSVs importable into the sheet.
// One CSV per tab in scripts/content-map.mjs, named after the tab so the
// import target is unambiguous.
//
//   node scripts/json-to-csv.mjs

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { CONTENT, DATA_DIR } from './content-map.mjs';

const OUT = 'sheets/seed-csv';
mkdirSync(OUT, { recursive: true });

function cell(v) {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

for (const spec of CONTENT) {
  const src = `${DATA_DIR}/${spec.file}`;
  if (!existsSync(src)) { console.log(`  skip ${spec.tab} (no file)`); continue; }

  const parsed = JSON.parse(readFileSync(src, 'utf8'));
  let csv;
  let count;

  if (spec.kind === 'keyvalue') {
    const entries = Object.entries(parsed);
    if (!entries.length) { console.log(`  skip ${spec.tab} (empty)`); continue; }
    csv = ['key,value', ...entries.map(([k, v]) => `${cell(k)},${cell(v)}`)].join('\n');
    count = `${entries.length} keys`;
  } else {
    if (!parsed.length) { console.log(`  skip ${spec.tab} (no rows)`); continue; }
    const headers = [...new Set(parsed.flatMap((r) => Object.keys(r)))];
    csv = [
      headers.map(cell).join(','),
      ...parsed.map((r) => headers.map((h) => cell(r[h])).join(',')),
    ].join('\n');
    count = `${parsed.length} rows, ${headers.length} cols`;
  }

  writeFileSync(`${OUT}/${spec.tab}.csv`, csv + '\n');
  console.log(`  ${OUT}/${spec.tab}.csv — ${count}`);
}
