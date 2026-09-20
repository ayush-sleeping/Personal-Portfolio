// Renders the contact-page FAQ accordion from assets/data/faqs.json.
// Emits the same Bootstrap-collapse markup contactform.js already binds to.

import { load, byOrder, esc } from '../data.js';

const CONTAINER = '[data-render="faqs"]';

// Answers are authored by us in the sheet; allow simple inline emphasis
// through after escaping, nothing else.
const INLINE = /&lt;(\/?)(strong|em|b|i|br)\s*\/?&gt;/gi;
function answerHtml(value) {
  return esc(value).replace(INLINE, (_, slash, tag) => `<${slash}${tag.toLowerCase()}>`);
}

function item(f, i) {
  const id = `faq${i + 1}`;
  const el = document.createElement('div');
  el.className = 'primary-card faq-item mb-3';
  el.innerHTML = `
    <div class="faq-question" data-bs-toggle="collapse" data-bs-target="#${id}" aria-expanded="false">
      <h5 class="mb-0 faq-question-text">
        ${esc(f.question)}
        <i class="fas fa-chevron-down faq-icon"></i>
      </h5>
    </div>
    <div id="${id}" class="collapse faq-answer">
      <div class="faq-answer-content">
        <p>${answerHtml(f.answer)}</p>
      </div>
    </div>`;
  return el;
}

// FAQPage structured data (Q11). Built from the same rows the accordion
// renders, so it cannot drift from the sheet the way a hand-written block in
// contact.html would. Trade-off: this is injected by JS, so it is only seen
// by crawlers that execute scripts. Google does; simpler AI fetchers may not.
function injectFaqSchema(rows) {
  const previous = document.getElementById('faq-schema');
  if (previous) previous.remove();
  if (!rows.length) return;

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'faq-schema';
  script.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: rows.map((f) => ({
      '@type': 'Question',
      name: String(f.question ?? '').trim(),
      acceptedAnswer: {
        '@type': 'Answer',
        // Schema.org wants the answer as text; the sheet allows <strong>/<em>
        // for the visible accordion, so strip those tags back out here.
        text: String(f.answer ?? '')
          .replace(/<\/?(strong|em|b|i)>/gi, '')
          .replace(/<br\s*\/?>/gi, ' ')
          .trim(),
      },
    })),
  });
  document.head.appendChild(script);
}

export async function renderFaqs() {
  const container = document.querySelector(CONTAINER);
  if (!container) return;

  try {
    const rows = byOrder(await load('collections/faqs'));
    const frag = document.createDocumentFragment();
    rows.forEach((f, i) => frag.appendChild(item(f, i)));
    container.replaceChildren(frag);
    container.dataset.rendered = 'true';
    injectFaqSchema(rows);
    // contactform.js binds the accordion on DOMContentLoaded; these items
    // arrive later, so tell it to bind again.
    document.dispatchEvent(new CustomEvent('content:rendered', { detail: { name: 'faqs' } }));
  } catch (err) {
    console.error('[faqs] render failed:', err);
    container.dataset.rendered = 'failed';
  }
}

renderFaqs();
