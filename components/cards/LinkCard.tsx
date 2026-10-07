// A whole-card link with an arrow button: Credentials, Projects, Services Offering, "Let's work
// together".
//
// v2 wrapped the card in an <a> and put the arrow's own <a> inside it. Nested links are invalid
// HTML, so the browser's parser split them: the card <div> ends up outside the link, and the
// media and the heading each get their own copy of the link next to the arrow's. React can't
// render the nested original without hydration errors, so this renders the DOM v2 visitors
// actually got: same elements, classes and clickable areas. The only thing left out is the empty,
// zero-height <a> the parser leaves in front of each card.
import type { CSSProperties, ReactNode } from "react";

import { ArrowIcon, CardBg } from "./CardParts";

interface LinkCardProps {
  href: string;
  /** The card's sheet title: the accessible name of the media and arrow links, which have no
   * text of their own. */
  label: string;
  /** Inline style on `.primary-card` (v2 sets the padding per card). */
  style: CSSProperties;
  /** Shown under the background, inside the first link copy. */
  media: ReactNode;
  /** The heading block left of the arrow. */
  heading: ReactNode;
}

export default function LinkCard({ href, label, style, media, heading }: Readonly<LinkCardProps>) {
  const linkProps = {
    href,
    className: "text-decoration-none text-reset",
    style: { display: "block" },
  };
  return (
    <div className="primary-card credentials-card" style={style}>
      <a {...linkProps} aria-label={label}>
        <CardBg />
        {media}
      </a>
      <div className="d-flex align-items-center justify-content-between">
        <a {...linkProps}>{heading}</a>
        <a href={href} className="about-btn" aria-label={label}>
          <ArrowIcon />
        </a>
      </div>
    </div>
  );
}
