// Renders the project grid on project.html from assets/data/projects.json.
// The DOM produced is identical to the markup it replaced, so style.css,
// the spotlight effect and scroll-animations.js keep working untouched.

import { load, byOrder, splitList, isTrue, esc, pictureHtml } from '../data.js';

const GRID_SELECTOR = '[data-render="projects"]';

// summary is authored by us in the sheet, so a literal <br> is allowed through
// after escaping. Nothing else is.
function summaryHtml(value) {
  return esc(value).replace(/&lt;br\s*\/?&gt;/gi, '<br>');
}

function card(p) {
  const col = document.createElement('div');
  col.className = 'col-lg-6 col-12 mt-4';

  const tags = splitList(p.tech_stack)
    .map((t) => `<span class="tag">${esc(t)}</span>`)
    .join('\n');

  const links = [
    p.github_url &&
      `<a href="${esc(p.github_url)}" target="_blank" rel="noopener" class="project-link-btn source-btn">
         <i class="fab fa-github"></i><span>Source</span>
       </a>`,
    p.live_url &&
      `<a href="${esc(p.live_url)}" target="_blank" rel="noopener" class="project-link-btn live-btn">
         <i class="fas fa-external-link-alt"></i><span>Live Demo</span>
       </a>`,
  ]
    .filter(Boolean)
    .join('\n');

  col.innerHTML = `
    <div class="project-showcase-card h-100">
      <div class="project-image-wrapper">
        ${pictureHtml(p.image_url, `class="project-image" alt="${esc(p.title)}" loading="lazy" decoding="async"`)}
      </div>
      <div class="project-content">
        <h3 class="project-title">${esc(p.title)}</h3>
        <div class="project-meta">
          <span class="project-type">${esc(p.category)}</span>
          <span class="project-date">${esc(p.year)}</span>
        </div>
        <p class="project-description">${summaryHtml(p.summary)}</p>
        <div class="project-tags">${tags}</div>
        <div class="project-links-visible">${links}</div>
      </div>
    </div>`;

  return col;
}

// M9 - CreativeWork structured data for the project grid, built from the
// same rows the cards render. Same trade-off as the FAQ block: it only
// exists after JS runs, but it can never drift from the sheet.
function injectProjectSchema(rows) {
  const previous = document.getElementById('projects-schema');
  if (previous) previous.remove();
  if (!rows.length) return;

  const abs = (u) =>
    !u ? undefined : /^https?:/i.test(u) ? u : new URL(u, document.baseURI).href;

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'projects-schema';
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Projects by Ayush Mishra',
    itemListElement: rows.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'CreativeWork',
        name: String(p.title ?? '').trim(),
        // summary carries authored <br> for the card; schema wants plain text
        description: String(p.summary || p.description || '')
          .replace(/<br\s*\/?>/gi, ' ')
          .replace(/\s+/g, ' ')
          .trim(),
        image: abs(p.image_url),
        url: p.live_url || p.github_url || undefined,
        codeRepository: p.github_url || undefined,
        genre: p.category || undefined,
        dateCreated: p.year || undefined,
        keywords: splitList(p.tech_stack).join(', ') || undefined,
        author: { '@type': 'Person', name: 'Ayush Mishra' },
      },
    })),
  });
  document.head.appendChild(script);
}

export async function renderProjects() {
  const grid = document.querySelector(GRID_SELECTOR);
  if (!grid) return;

  try {
    const rows = await load('collections/projects');
    const visible = byOrder(rows.filter((p) => p.featured === '' || isTrue(p.featured)));

    const frag = document.createDocumentFragment();
    visible.forEach((p) => frag.appendChild(card(p)));

    grid.replaceChildren(frag);
    grid.dataset.rendered = 'true';
    injectProjectSchema(visible);
    document.dispatchEvent(new CustomEvent('content:rendered', { detail: { name: 'projects' } }));
  } catch (err) {
    // Leave whatever is already in the grid rather than blanking the page.
    console.error('[projects] render failed:', err);
    grid.dataset.rendered = 'failed';
  }
}

renderProjects();
