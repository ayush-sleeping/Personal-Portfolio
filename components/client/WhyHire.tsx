"use client";

// Opens the "Why should we hire you?" video modal from the About card, ported from the inline
// script at the end of v2's about.html: a click on the card shows the Bootstrap modal and plays
// the video from the start; closing the modal pauses it.
import { useEffect } from "react";

interface BootstrapModal {
  show(): void;
}
interface BootstrapGlobal {
  Modal: { new (el: Element): BootstrapModal; getInstance(el: Element): BootstrapModal | null };
}

export default function WhyHire() {
  useEffect(() => {
    const card = document.getElementById("whyHireCard");
    const modal = document.getElementById("whyHireModal");
    const video = document.getElementById("whyHireVideo") as HTMLVideoElement | null;
    if (!card || !modal || !video) return;

    const open = (event: MouseEvent) => {
      event.preventDefault();
      // Bootstrap's bundle is a deferred CDN script (app/layout.tsx), as in v2.
      const bootstrap = (window as unknown as { bootstrap?: BootstrapGlobal }).bootstrap;
      if (!bootstrap) return;
      (bootstrap.Modal.getInstance(modal) ?? new bootstrap.Modal(modal)).show();
      video.currentTime = 0;
      void video.play().catch(() => {});
    };
    const pause = () => video.pause();

    card.addEventListener("click", open);
    modal.addEventListener("hidden.bs.modal", pause);
    return () => {
      card.removeEventListener("click", open);
      modal.removeEventListener("hidden.bs.modal", pause);
    };
  }, []);

  return null;
}
