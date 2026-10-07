// One experience or education entry, as v2's about-render.js built it (timelineItem()).
import { splitPairs } from "@/lib/data";
import type { TimelineEntry } from "@/lib/types";

export default function TimelineItem({ entry }: Readonly<{ entry: TimelineEntry }>) {
  const details = splitPairs(entry.details);
  return (
    <div className="timeline-item">
      <div className="timeline-marker">
        <div className="timeline-dot"></div>
      </div>
      <div className="timeline-content">
        <div className="timeline-date">{entry.date_label}</div>
        <h3 className="timeline-title">{entry.title}</h3>
        <p className="timeline-company">{entry.company}</p>
        <p className="timeline-location">{entry.location}</p>
        <div className="timeline-duration">{entry.duration_label}</div>
        {entry.description && (
          <p
            className="timeline-description"
            style={{ color: "#9CA3AF", fontSize: 14, marginTop: 10, marginBottom: 10 }}
          >
            {entry.description}
          </p>
        )}
        {details.length > 0 && (
          <div className="timeline-tech-stack" style={{ marginTop: 10 }}>
            {details.map((d, i) => (
              <p
                key={d.label}
                style={{
                  color: "#E5E7EB",
                  fontSize: 13,
                  marginBottom: i === details.length - 1 ? 0 : 3,
                }}
              >
                <strong>{d.label}:</strong> {d.value}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
