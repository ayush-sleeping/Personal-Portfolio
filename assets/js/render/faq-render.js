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

export async function renderFaqs() {
  const container = document.querySelector(CONTAINER);
  if (!container) return;

  try {
    const rows = byOrder(await load('collections/faqs'));
    const frag = document.createDocumentFragment();
    rows.forEach((f, i) => frag.appendChild(item(f, i)));
    container.replaceChildren(frag);
    container.dataset.rendered = 'true';
    // contactform.js binds the accordion on DOMContentLoaded; these items
    // arrive later, so tell it to bind again.
    document.dispatchEvent(new CustomEvent('content:rendered', { detail: { name: 'faqs' } }));
  } catch (err) {
    console.error('[faqs] render failed:', err);
    container.dataset.rendered = 'failed';
  }
}

renderFaqs();
