// Small pieces every v2 bento card repeats: the textured background, the arrow button image,
// the label + title heading, and sheet text that carries <br> line breaks. The decorative images
// have alt="" (v2: "BG" / "star", which screen readers read out; task.md T12).
import { Fragment, type CSSProperties } from "react";

import { GRIDX, important } from "@/lib/site";

/** The textured card background (`.primary-card .bg-img`). */
export function CardBg() {
  return <img className="bg-img" src={GRIDX.cardBg} alt="" decoding="async" />;
}

/** The circled arrow inside `.about-btn`. */
export function ArrowIcon() {
  return <img decoding="async" src={GRIDX.arrow} alt="" />;
}

/** Small uppercase label over a card title, at v2's inline 14px / 20px sizes. */
export function CardHeading({
  label,
  title,
  className,
  labelStyle,
}: Readonly<{ label: string; title: string; className: string; labelStyle?: CSSProperties }>) {
  return (
    <div className={`infos ${className}`}>
      <h5 style={{ ...important({ fontSize: "14px" }), ...labelStyle }}>{label}</h5>
      <h2 style={important({ fontSize: "20px" })}>{title}</h2>
    </div>
  );
}

/** Sheet copy may carry `<br>` for line breaks (v2's withBreaks). Everything else stays text. */
export function Breaks({ text }: Readonly<{ text: string }>) {
  return text.split(/<br\s*\/?>/i).map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {part}
    </Fragment>
  ));
}
