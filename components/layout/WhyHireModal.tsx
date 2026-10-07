// The "Why should we hire you?" video modal from v2's about.html. Rendered outside .main-content,
// as in v2: .main-content keeps a transform, which would trap a position:fixed modal inside it.
// The About section's why-hire card opens it (components/client/WhyHire.tsx).
// All text and the video come from pages/about (task.md T12), and each part renders once the
// sheet has it:
// TODO(sheet): page_about.video_modal_subtitle, video_url, modal_close_label, video_fallback
import type { PageCopy } from "@/lib/types";
import { assetOrUrl } from "@/lib/site";

export default function WhyHireModal({ copy }: Readonly<{ copy: PageCopy }>) {
  return (
    <div
      className="modal fade"
      id="whyHireModal"
      tabIndex={-1}
      aria-labelledby="whyHireModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-md">
        <div
          className="modal-content"
          style={{
            background: "rgba(20,22,34,0.95)",
            borderRadius: 18,
            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.37)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <div className="modal-header border-0" style={{ borderRadius: "18px 18px 0 0" }}>
            <div>
              <h5
                className="modal-title text-white"
                id="whyHireModalLabel"
                style={{ fontWeight: 700 }}
              >
                {copy.video_modal_title}
              </h5>
              {copy.video_modal_subtitle && (
                <div style={{ fontSize: "0.95rem", color: "#b3b3b3", marginTop: 2 }}>
                  {copy.video_modal_subtitle}
                </div>
              )}
            </div>
            <button
              type="button"
              className="btn-close custom-close-btn"
              data-bs-dismiss="modal"
              aria-label={copy.modal_close_label}
            ></button>
          </div>
          <div
            className="modal-body p-3 d-flex justify-content-center align-items-center"
            style={{ background: "transparent" }}
          >
            <video
              id="whyHireVideo"
              style={{
                borderRadius: 12,
                border: "1.5px solid #222",
                boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
              }}
              width="100%"
              height="auto"
              controls
            >
              {copy.video_url && <source src={assetOrUrl(copy.video_url)} type="video/mp4" />}
              {copy.video_fallback}
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}
