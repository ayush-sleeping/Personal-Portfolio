// FAQ (design: #faq): heading, intro and the accordion from the faqs sheet tab.
import FaqAccordion from "@/components/client/FaqAccordion";
import { getFaqs, getPageCopy } from "@/lib/data";
import { inlineHtml } from "@/lib/site";

export default function FaqSection() {
  const copy = getPageCopy("contact");
  const faqs = getFaqs().map((f) => ({
    id: f.id,
    question: f.question,
    answerHtml: inlineHtml(f.answer),
  }));
  return (
    <section id="faq" data-screen-label="FAQ">
      <div data-doc="" className="v4-doc">
        <div className="v4-sec">
          <div data-sec-head="" className="v4-sec-head">
            <div>
              <h2 data-h2="" className="v4-sec-title">
                {copy.faq_heading}
              </h2>
              <p className="v4-sec-intro">{copy.faq_intro}</p>
            </div>
          </div>
          <FaqAccordion faqs={faqs} />
        </div>
      </div>
    </section>
  );
}
