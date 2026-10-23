# components/client/

`'use client'` components for the v4 design's behaviour (task.md Phase 11), each a port of the
matching part of `documentation/design/v4-logic.js`: Shell (sidebar, drawer, top bar, active
section, search palette, progress bar, back-to-top, toast), Motion (typing, reveals, counters,
scramble, spotlight, copy-link), CertScroller (scroller + lightbox), FaqAccordion, ContactForm
(EmailJS). Never import `lib/data.ts` here; data arrives as props.
