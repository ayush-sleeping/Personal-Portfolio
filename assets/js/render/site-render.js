// Site-wide renderer — runs on every page.
//
// Fills in everything that is shared or is plain page copy:
//   * profile fields (name, tagline, intro, bio, email, location, brand)
//   * per-page copy from pages/<page>.json
//   * the side navigation and the header navbar
//   * social links
//   * the footer tech-icon row
//
// Text targets are marked up in the HTML as data-text="<key>", so adding a new
// string is a sheet edit plus one attribute — no renderer change.

import { load, loadAll, byOrder, esc, applyText, splitPairs } from '../data.js';

// Which pages/*.json belongs to this document.
const PAGE = document.body.dataset.page || 'home';

/* -------------------------------------------------------------- navigation */

function renderNavigation(items) {
  if (!items) return;
  const ordered = byOrder(items);

  // Side menu: <li><a href target="_parent" class="active"><span>Label</span></a></li>
  document.querySelectorAll('[data-render="nav-categories"]').forEach((ul) => {
    ul.replaceChildren();
    ordered.forEach((n) => {
      const li = document.createElement('li');
      const cls = n.id === PAGE ? ' class="active"' : '';
      li.innerHTML = `<a href="${esc(n.href)}" target="_parent"${cls}><span>${esc(n.label)}</span></a>`;
      ul.appendChild(li);
    });
  });

  // Header navbar: a flat run of <a> after the #nav-close handle, which
  // main.js binds to — so preserve it rather than rebuilding the whole nav.
  document.querySelectorAll('[data-render="navbar"]').forEach((nav) => {
    nav.querySelectorAll(':scope > a').forEach((a) => a.remove());
    ordered.forEach((n) => {
      const a = document.createElement('a');
      a.href = n.href;
      a.textContent = n.label;
      if (n.id === 'home') a.target = '_parent';
      if (n.id === PAGE) a.classList.add('active');
      nav.appendChild(a);
    });
  });

  // Footer link list
  document.querySelectorAll('[data-render="nav-footer-links"]').forEach((ul) => {
    ul.replaceChildren();
    ordered.forEach((n) => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${esc(n.href)}" target="_parent">${esc(n.label)}</a>`;
      ul.appendChild(li);
    });
  });
}

/* ----------------------------------------------------------------- socials */

function renderSocials(items) {
  if (!items) return;
  const ordered = byOrder(items);

  document.querySelectorAll('[data-render="socials"]').forEach((box) => {
    box.replaceChildren();
    ordered.forEach((s) => {
      const a = document.createElement('a');
      a.href = s.href;
      a.className = 'social-link';
      if (s.href.startsWith('http')) {
        a.target = '_blank';
        a.rel = 'noopener';
      }
      a.innerHTML = `<span>${esc(s.label)}</span>`;
      box.appendChild(a);
    });
  });

  document.querySelectorAll('[data-render="social-icons"]').forEach((box) => {
    box.replaceChildren();
    ordered.forEach((s) => {
      const a = document.createElement('a');
      a.href = s.href;
      // home__social-link, not social-icon-link: the latter has no rules in
      // style.css, so rendering replaced the styled static markup with
      // unstyled icons the moment this ran.
      a.className = 'home__social-link';
      // title alone is an unreliable accessible name and never reaches
      // keyboard users; these are icon-only links, so name them explicitly.
      a.title = s.label;
      a.setAttribute('aria-label', s.label || '');
      if (s.href.startsWith('http')) {
        a.target = '_blank';
        a.rel = 'noopener';
      }
      a.innerHTML = `<i class="${esc(s.icon_class)}" aria-hidden="true"></i>`;
      box.appendChild(a);
    });
  });
}

/* ------------------------------------------------------------- footer tech */

function renderFooterTech(items) {
  if (!items) return;
  document.querySelectorAll('[data-render="footer-tech"]').forEach((box) => {
    box.replaceChildren();
    byOrder(items).forEach((t) => {
      const el = document.createElement('div');
      el.className = 'home__social-link';
      el.dataset.tooltip = t.tooltip;
      // The tooltip text lives in a CSS ::before, which assistive tech cannot
      // see. Expose it as the element's own name and make it focusable so the
      // tooltip is reachable without a pointer (Q10).
      el.tabIndex = 0;
      el.setAttribute('role', 'img');
      el.setAttribute('aria-label', t.tooltip || '');
      // icon_html carries inline SVG for the logos Font Awesome lacks
      // (Django, Next.js). It is our own content, not visitor input.
      el.innerHTML = t.icon_class ? `<i class="${esc(t.icon_class)}"></i>` : (t.icon_html || '');
      box.appendChild(el);
    });
  });
}

/* -------------------------------------------------------------- info table */

function renderInfoRows(profile) {
  if (!profile?.info_rows) return;
  document.querySelectorAll('[data-render="info-rows"]').forEach((dl) => {
    dl.replaceChildren();
    splitPairs(profile.info_rows).forEach(({ label, value }) => {
      const dt = document.createElement('dt');
      dt.textContent = `${label}:`;
      const dd = document.createElement('dd');
      dd.textContent = value;
      dl.append(dt, dd);
    });
  });
}

/* -------------------------------------------------------------------- boot */

const { profile, navigation, socials, footer_tech } = await loadAll([
  'site/profile',
  'site/navigation',
  'site/socials',
  'site/footer-tech',
]);

applyText(profile);
renderNavigation(navigation);
renderSocials(socials);
renderFooterTech(footer_tech);
renderInfoRows(profile);

try {
  const pageCopy = await load(`pages/${PAGE}`);
  applyText(pageCopy);
  if (pageCopy?.title) document.title = pageCopy.title;
} catch (err) {
  console.error(`[site] page copy for "${PAGE}" failed:`, err);
}

document.documentElement.dataset.siteRendered = 'true';
document.dispatchEvent(new CustomEvent('content:rendered', { detail: { name: 'site' } }));
