"use client";

// Every "Download resume" / "Download PDF" link (data-print) prints the page, which the print
// stylesheet turns into the resume. Server-rendered links, one delegated handler.
import { useEffect } from "react";

export default function PrintLinks() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.("[data-print]");
      if (!a) return;
      e.preventDefault();
      window.print();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
