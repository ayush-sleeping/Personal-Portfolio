"use client";
// "Download PDF", from v2's resume.html: no PDF is stored, the browser's print-to-PDF renders the
// resume print layout (style.css's print rules plus the one-page ones in v3.css), so the file is
// never stale.
export default function PrintResumeButton({ label }: Readonly<{ label: string }>) {
  return (
    <button
      type="button"
      className="contact-card-btn"
      data-print-resume
      onClick={() => window.print()}
    >
      <i className="fas fa-download" aria-hidden="true"></i> {label}
    </button>
  );
}
