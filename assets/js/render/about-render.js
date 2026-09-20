// Renders the sheet-backed sections of about.html:
//   experience timeline, education timeline, certifications carousel, skills.
//
// Experience and education share the same timeline markup, so they share a
// row shape and one builder. Skills are grouped cards; the project page reuses
// the same skills block, so renderSkills() targets every matching container.

import { load, byOrder, esc, pictureHtml } from '../data.js';

// "Backend::Laravel + PHP | Frontend::React"  ->  [{label, value}, ...]
function pairs(cell) {
  return String(cell ?? '')
    .split('|')
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => {
      const [label, ...rest] = c.split('::');
      return { label: label.trim(), value: rest.join('::').trim() };
    });
}

/* ---------------------------------------------------------------- timeline */

function timelineItem(r) {
  const details = pairs(r.details);
  const el = document.createElement('div');
  el.className = 'timeline-item';

  const detailHtml = details.length
    ? `<div class="timeline-tech-stack" style="margin-top: 10px;">
         ${details
           .map(
             (d, i) =>
               `<p style="color: #E5E7EB; font-size: 13px; margin-bottom: ${
                 i === details.length - 1 ? '0' : '3px'
               };"><strong>${esc(d.label)}:</strong> ${esc(d.value)}</p>`
           )
           .join('')}
       </div>`
    : '';

  const descHtml = r.description
    ? `<p class="timeline-description"
          style="color: #9CA3AF; font-size: 14px; margin-top: 10px; margin-bottom: 10px;">${esc(
            r.description
          )}</p>`
    : '';

  el.innerHTML = `
    <div class="timeline-marker">
      <div class="timeline-dot"></div>
    </div>
    <div class="timeline-content">
      <div class="timeline-date">${esc(r.date_label)}</div>
      <h3 class="timeline-title">${esc(r.title)}</h3>
      <p class="timeline-company">${esc(r.company)}</p>
      <p class="timeline-location">${esc(r.location)}</p>
      <div class="timeline-duration">${esc(r.duration_label)}</div>
      ${descHtml}
      ${detailHtml}
    </div>`;
  return el;
}

async function renderTimeline(name) {
  const container = document.querySelector(`[data-render="${name}"]`);
  if (!container) return;
  try {
    const rows = byOrder(await load(`collections/${name}`));
    const frag = document.createDocumentFragment();
    rows.forEach((r) => frag.appendChild(timelineItem(r)));
    container.replaceChildren(frag);
    container.dataset.rendered = 'true';
  } catch (err) {
    console.error(`[${name}] render failed:`, err);
    container.dataset.rendered = 'failed';
  }
}

/* ---------------------------------------------------------- certifications */

async function renderCertifications() {
  const container = document.querySelector('[data-render="certifications"]');
  if (!container) return;
  try {
    const rows = byOrder(await load('collections/certifications'));
    const frag = document.createDocumentFragment();

    rows.forEach((cert, i) => {
      const item = document.createElement('div');
      item.className = `carousel-item${i === 0 ? ' active' : ''}`;
      const href = cert.credential_url || '';
      item.innerHTML = `
        <div class="certification-card">
          ${pictureHtml(cert.image_url, `class="certification-img" alt="${esc(cert.alt_text || cert.title)}" loading="lazy" decoding="async"`)}
          <div class="certification-info mt-2">
            <a href="${esc(href)}"${href ? ' target="_blank" rel="noopener"' : ''} class="certification-link">
              <i class="fas fa-external-link-alt"></i> View Certificate
            </a>
          </div>
        </div>`;
      frag.appendChild(item);
    });

    container.replaceChildren(frag);
    container.dataset.rendered = 'true';
  } catch (err) {
    console.error('[certifications] render failed:', err);
    container.dataset.rendered = 'failed';
  }
}

/* ------------------------------------------------------------------ skills */

function skillsSection(group, rows, extraClass) {
  const section = document.createElement('div');
  section.className = extraClass;
  const label = rows[0]?.group_label ?? group;
  const cards = rows
    .map(
      (s) => `
      <div class="col-lg-6 col-md-6 col-12 mb-3">
        <div class="skill-card${group === 'focusing' ? ' secondary' : ''}">
          <p class="skill-category">${esc(s.category)}</p>
          <h6 class="skill-name">${esc(s.name)}</h6>
        </div>
      </div>`
    )
    .join('');

  section.innerHTML = `
    <h5 style="margin-bottom: 20px;">${esc(label)}</h5>
    <div class="row">${cards}</div>`;
  return section;
}

async function renderSkills() {
  const containers = document.querySelectorAll('[data-render="skills"]');
  if (!containers.length) return;
  try {
    const rows = byOrder(await load('collections/skills'));
    const established = rows.filter((s) => s.group === 'established');
    const focusing = rows.filter((s) => s.group === 'focusing');

    containers.forEach((container) => {
      const frag = document.createDocumentFragment();
      if (established.length) frag.appendChild(skillsSection('established', established, 'skills-section mb-4'));
      if (focusing.length) frag.appendChild(skillsSection('focusing', focusing, 'skills-section'));
      container.replaceChildren(frag);
      container.dataset.rendered = 'true';
    });
  } catch (err) {
    console.error('[skills] render failed:', err);
    containers.forEach((c) => { c.dataset.rendered = 'failed'; });
  }
}

await Promise.all([
  renderTimeline('experience'),
  renderTimeline('education'),
  renderCertifications(),
  renderSkills(),
]);

document.dispatchEvent(new CustomEvent('content:rendered', { detail: { name: 'about' } }));
