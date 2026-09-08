// Data layer for the Sheet-backed content.
//
// Reads the static JSON that the "Refresh content from Google Sheet" Action
// commits into assets/data/. The browser never talks to Google — these are
// plain files on the Pages CDN.
//
// Strategy: in-memory Map -> localStorage (5 min TTL) -> network, with
// stale-while-revalidate so a warm visit renders instantly and refreshes
// in the background.

// Relative on purpose: this site is served from /Personal-Portfolio/ on
// GitHub Pages, so a root-absolute "/assets/data" would 404.
const DATA_BASE = new URL('data/', new URL('assets/', document.baseURI));
const TTL_MS = 5 * 60 * 1000;
const CACHE_PREFIX = 'pf:';

const memCache = new Map();
const inFlight = new Map();

// Names are paths under assets/data, without the extension:
//   'site/profile', 'pages/home', 'collections/projects'
function urlFor(name) {
  return new URL(`${name}.json`, DATA_BASE).href;
}

function readLocal(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { value, expiry } = JSON.parse(raw);
    if (!expiry || Date.now() > expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return value;
  } catch {
    return null;
  }
}

function writeLocal(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify({ value, expiry: Date.now() + TTL_MS }));
  } catch {
    /* private mode or quota exceeded — cache is an optimisation, not a requirement */
  }
}

async function fetchJson(name) {
  const res = await fetch(urlFor(name), { credentials: 'omit' });
  if (!res.ok) throw new Error(`load(${name}): HTTP ${res.status}`);
  return res.json();
}

function revalidate(name) {
  if (inFlight.has(name)) return inFlight.get(name);
  const p = fetchJson(name)
    .then((data) => {
      memCache.set(name, data);
      writeLocal(CACHE_PREFIX + name, data);
      return data;
    })
    .catch(() => null) // keep serving stale on failure
    .finally(() => inFlight.delete(name));
  inFlight.set(name, p);
  return p;
}

/**
 * Load one dataset by tab name, e.g. load('projects').
 * Resolves to an array of row objects. Rejects only on a cold miss + failure.
 */
export async function load(name) {
  if (memCache.has(name)) return memCache.get(name);

  const cached = readLocal(CACHE_PREFIX + name);
  if (cached) {
    memCache.set(name, cached);
    revalidate(name); // background refresh
    return cached;
  }

  if (inFlight.has(name)) {
    const data = await inFlight.get(name);
    if (data) return data;
  }
  return revalidate(name).then((data) => {
    if (!data) throw new Error(`load(${name}): unavailable`);
    return data;
  });
}

/**
 * Load several datasets at once. Resolves to an object keyed by the short
 * name (the last path segment), so:
 *   const { profile, navigation } = await loadAll(['site/profile', 'site/navigation']);
 * A dataset that fails to load comes back as null rather than rejecting the
 * whole batch — one missing file must not blank an entire page.
 */
export async function loadAll(names) {
  const settled = await Promise.all(
    names.map((n) => load(n).catch((err) => {
      console.error(err);
      return null;
    }))
  );
  return Object.fromEntries(
    names.map((n, i) => [n.split('/').pop().replace(/-/g, '_'), settled[i]])
  );
}

/** Rows sorted by their numeric `order` column. */
export function byOrder(rows) {
  return [...rows].sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
}

/** Split a comma-separated cell (tech_stack, bullet_points, tags) into a list. */
export function splitList(cell) {
  return String(cell ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Sheet booleans arrive as the literal strings TRUE / FALSE. */
export function isTrue(cell) {
  return String(cell ?? '').trim().toUpperCase() === 'TRUE';
}

/**
 * Write a value into every element marked with the given field name, e.g.
 *   <h1 data-text="heading"></h1>  <-  setText(root, 'heading', 'My Projects')
 * Skips silently when the value is empty so a half-filled sheet degrades to
 * whatever the HTML already says.
 */
export function setText(scope, field, value) {
  if (value === undefined || value === null || value === '') return;
  scope.querySelectorAll(`[data-text="${field}"]`).forEach((el) => {
    el.textContent = value;
  });
}

/**
 * Apply an entire key-value dataset to the document in one pass. Every key
 * becomes a data-text lookup; keys ending in _html are written as markup.
 */
export function applyText(map, scope = document) {
  if (!map) return;
  for (const [key, value] of Object.entries(map)) {
    if (key.endsWith('_html')) {
      scope.querySelectorAll(`[data-html="${key}"]`).forEach((el) => { el.innerHTML = value; });
    } else {
      setText(scope, key, value);
    }
  }
}

/** "a::1 | b::2" -> [{label:'a',value:'1'}, {label:'b',value:'2'}] */
export function splitPairs(cell) {
  return String(cell ?? '')
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => {
      const [label, ...rest] = s.split('::');
      return { label: label.trim(), value: rest.join('::').trim() };
    });
}

/** Escape a value for interpolation into an HTML template. */
export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Clear every cached dataset (useful from the console while editing the sheet). */
export function clearCache() {
  memCache.clear();
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(CACHE_PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch { /* ignore */ }
}
