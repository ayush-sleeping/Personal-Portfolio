"use client";

// The FAQ accordion, ported from the FAQ half of v2's contactform.js: a click on a question
// closes any other open answer and toggles its own, through Bootstrap's Collapse. Without
// Bootstrap it falls back to a plain show/hide, as v2 did.
//
// The questions also keep v2's data-bs-toggle="collapse". As in v2, Bootstrap's own delegated
// handler then reaches the same Collapse instance mid-transition and ignores the second toggle.
import { useEffect } from "react";

interface Collapse {
  hide(): void;
  toggle(): void;
}
interface BootstrapGlobal {
  Collapse: {
    new (el: Element, config: { toggle: boolean }): Collapse;
    getInstance(el: Element): Collapse | null;
  };
}

export default function FaqAccordion() {
  useEffect(() => {
    const questions = [...document.querySelectorAll<HTMLElement>(".faq-question")];
    const answerOf = (q: Element) => {
      const target = q.getAttribute("data-bs-target");
      return target ? document.querySelector<HTMLElement>(target) : null;
    };

    const onClick = (event: MouseEvent) => {
      event.preventDefault();
      const question = event.currentTarget as HTMLElement;
      const answer = answerOf(question);
      if (!answer) return;

      const bootstrap = (window as unknown as { bootstrap?: BootstrapGlobal }).bootstrap;
      if (!bootstrap) {
        const open = answer.style.display === "none" || answer.style.display === "";
        answer.style.display = open ? "block" : "none";
        answer.classList.toggle("show", open);
        question.setAttribute("aria-expanded", String(open));
        return;
      }

      for (const other of questions) {
        if (other === question) continue;
        const otherAnswer = answerOf(other);
        if (otherAnswer?.classList.contains("show")) {
          bootstrap.Collapse.getInstance(otherAnswer)?.hide();
        }
      }
      (
        bootstrap.Collapse.getInstance(answer) ?? new bootstrap.Collapse(answer, { toggle: false })
      ).toggle();
    };

    questions.forEach((q) => q.addEventListener("click", onClick));
    return () => questions.forEach((q) => q.removeEventListener("click", onClick));
  }, []);

  return null;
}
