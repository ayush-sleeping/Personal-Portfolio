// Home-page renderer: the stat counters and the role marquee.
// Everything else on index.html is plain copy handled by site-render.js.

import { load, byOrder, esc } from '../data.js';

const STAR = 'https://wpriverthemes.com/gridx/wp-content/uploads/2023/04/star1.svg';

// `value` and `label` are our own copy and may carry a <br> for line breaks.
// Escape first, then let only <br> back through.
function withBreaks(value) {
  return esc(value).replace(/&lt;br\s*\/?&gt;/gi, '<br>');
}

async function renderStats() {
  const box = document.querySelector('[data-render="stats"]');
  if (!box) return;
  try {
    const rows = byOrder(await load('collections/stats'));
    const frag = document.createDocumentFragment();
    rows.forEach((s) => {
      const col = document.createElement('div');
      col.className = 'col-lg-4 col-12 mt-lg-0 mt-4';
      const style = s.value_style ? ` style="${esc(s.value_style)}"` : '';
      col.innerHTML = `
        <div class="client-card">
          <h2${style}>${withBreaks(s.value)}</h2>
          <p class="mb-0">${withBreaks(s.label)}</p>
        </div>`;
      frag.appendChild(col);
    });
    box.replaceChildren(frag);
    box.dataset.rendered = 'true';
  } catch (err) {
    console.error('[stats] render failed:', err);
    box.dataset.rendered = 'failed';
  }
}

async function renderMarquee() {
  const box = document.querySelector('[data-render="marquee"]');
  if (!box) return;
  try {
    const home = await load('pages/home');
    const items = String(home.marquee_items ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!items.length) return;

    const span = (text, withStar = true) => `
      <span>
        <img decoding="async" src="${withStar ? STAR : ''}" alt=""> &nbsp;
        <b>${esc(text)}</b>
      </span>`;

    // Mirrors the existing DOM exactly: one empty leading span, then the list
    // twice, which is what the -33.33% marquee keyframe was tuned against.
    const once = items.map((t) => span(t)).join('');
    box.innerHTML = span('', false) + once + once;
    box.dataset.rendered = 'true';
  } catch (err) {
    console.error('[marquee] render failed:', err);
    box.dataset.rendered = 'failed';
  }
}

await Promise.all([renderStats(), renderMarquee()]);
document.dispatchEvent(new CustomEvent('content:rendered', { detail: { name: 'home' } }));
