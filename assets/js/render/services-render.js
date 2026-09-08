// Renders the four service cards on services.html from assets/data/services.json.
//
// bullet_points holds the feature list in one cell:
//   "Feature title::Feature description | Second title::Second description"
// Pipe separates features, "::" separates a feature's title from its body.
// Commas are common inside these sentences, so a plain comma split won't do.

import { load, byOrder, esc } from '../data.js';

const CONTAINER = '[data-render="services"]';
const BG_IMG = 'https://wpriverthemes.com/gridx/wp-content/themes/gridx/assets/images/bg1.png';

function features(cell) {
  return String(cell ?? '')
    .split('|')
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const [title, ...rest] = chunk.split('::');
      return { title: title.trim(), description: rest.join('::').trim() };
    });
}

function featureHtml(f, isLast) {
  return `
    <div class="feature-item${isLast ? '' : ' mb-3'}">
      <div class="d-flex align-items-start">
        <i class="fas fa-check-circle feature-check-icon me-2 mt-1"></i>
        <div>
          <h6 class="mb-1 feature-title">${esc(f.title)}</h6>
          <p class="mb-0 small feature-description">${esc(f.description)}</p>
        </div>
      </div>
    </div>`;
}

function card(s) {
  const list = features(s.bullet_points);
  const col = document.createElement('div');
  col.className = 'col-lg-6 col-md-6 col-12';
  col.innerHTML = `
    <div class="primary-card h-100 service-card">
      <img class="bg-img" src="${BG_IMG}" alt="BG" decoding="async">
      <div class="service-icon mb-3">
        <i class="${esc(s.icon_class)} service-icon-style"></i>
      </div>
      <h4 class="mb-3 service-title">${esc(s.title)}</h4>
      <div class="service-features">
        ${list.map((f, i) => featureHtml(f, i === list.length - 1)).join('')}
      </div>
    </div>`;
  return col;
}

export async function renderServices() {
  const container = document.querySelector(CONTAINER);
  if (!container) return;

  try {
    const rows = byOrder(await load('collections/services'));
    const frag = document.createDocumentFragment();
    rows.forEach((s) => frag.appendChild(card(s)));
    container.replaceChildren(frag);
    container.dataset.rendered = 'true';
    document.dispatchEvent(new CustomEvent('content:rendered', { detail: { name: 'services' } }));
  } catch (err) {
    console.error('[services] render failed:', err);
    container.dataset.rendered = 'failed';
  }
}

renderServices();
