"use client";

// The FAQ list of the v4 design: one answer open at a time, the chevron turns, the answer HTML
// comes from the sheet (already filtered to simple inline tags by lib/site.ts inlineHtml()).
import { useState } from "react";

export interface FaqItem {
  id: string;
  question: string;
  answerHtml: string;
}

export default function FaqAccordion({ faqs }: Readonly<{ faqs: FaqItem[] }>) {
  const [open, setOpen] = useState(-1);
  return (
    <div className="v4-faq-list">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        return (
          <div className="v4-faq" key={f.id}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="v4-faq-q faq-question"
            >
              <span>{f.question}</span>
              <i
                className="fa-solid fa-chevron-down"
                data-faq-chev=""
                data-open={String(isOpen)}
                aria-hidden="true"
              ></i>
            </button>
            {isOpen && (
              <div data-faq-a="" className="v4-faq-a">
                <p dangerouslySetInnerHTML={{ __html: f.answerHtml }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
