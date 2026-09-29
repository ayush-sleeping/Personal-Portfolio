# components/client/

`'use client'` components that add **behaviour only** to server-rendered markup: Preloader
(the purple slide-reveal, kept as-is), Spotlight, GSAP scroll effect, scroll reveals, marquee,
mobile menu, active section, contact form. Each wraps the matching v2 script in `useEffect` with
cleanup. Never import `lib/data.ts` here. Reference scripts: `version2/assets/js/`.
