"use client";

// Certifications: the snap scroller with its prev/next buttons and the lightbox (design: certRef,
// certIdx, stepCert, the data-modal dialog with Escape / ← / → keys and body scroll lock).
import { useEffect, useRef, useState } from "react";

export interface CertItem {
  img: string;
  title: string;
  meta: string;
  href: string;
  alt: string;
}

export default function CertScroller({ certs }: Readonly<{ certs: CertItem[] }>) {
  const ref = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(-1);
  const n = certs.length;

  const setCert = (i: number) => {
    setIdx(i);
    document.body.style.overflow = i < 0 ? "" : "hidden";
  };
  const step = (d: number) => setCert((idx + d + n) % n);

  useEffect(() => {
    if (idx < 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCert(-1);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  useEffect(
    () => () => {
      document.body.style.overflow = "";
    },
    [],
  );

  const scrollBy = (dir: number) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  const cert = certs[idx];

  return (
    <>
      <div className="v4-cert-btns">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Previous"
          className="v4-sq-btn"
        >
          <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
        </button>
        <button type="button" onClick={() => scrollBy(1)} aria-label="Next" className="v4-sq-btn">
          <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
        </button>
      </div>
      <div ref={ref} data-scroller="" className="v4-scroller" data-cert-scroller="">
        {certs.map((c, i) => (
          <a
            key={c.img}
            href={c.href}
            onClick={(e) => {
              e.preventDefault();
              setCert(i);
            }}
            className="v4-cert"
          >
            <div className="v4-cert-img">
              <img src={c.img} alt={c.alt} loading="lazy" />
            </div>
            <div className="v4-cert-text">
              <h3 className="v4-cert-title">{c.title}</h3>
              <span className="v4-muted-13">{c.meta}</span>
            </div>
          </a>
        ))}
      </div>

      {cert && (
        <div
          data-modal=""
          role="dialog"
          aria-modal="true"
          aria-label={cert.title}
          onClick={() => setCert(-1)}
          className="v4-modal"
        >
          <div onClick={(e) => e.stopPropagation()} className="v4-modal-box">
            <div className="v4-modal-head">
              <div>
                <h3 className="v4-modal-title">{cert.title}</h3>
                <p className="v4-modal-meta">
                  {cert.meta} · {idx + 1} / {n}
                </p>
              </div>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous certificate"
                className="v4-sq-btn v4-sq-btn-ghost"
              >
                <i className="fa-solid fa-chevron-left" aria-hidden="true"></i>
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next certificate"
                className="v4-sq-btn v4-sq-btn-ghost"
              >
                <i className="fa-solid fa-chevron-right" aria-hidden="true"></i>
              </button>
              <button
                type="button"
                onClick={() => setCert(-1)}
                aria-label="Close"
                className="v4-sq-btn v4-sq-btn-ghost"
              >
                <i className="fa-solid fa-xmark" aria-hidden="true"></i>
              </button>
            </div>
            <div className="v4-modal-body">
              <img src={cert.img} alt={cert.alt} className="v4-modal-img" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
