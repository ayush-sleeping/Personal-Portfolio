// The one-page portfolio (task.md). The v2 shell — preloader, slide-out menu, header, footer —
// around the five sections in T2 order. Sections are filled phase by phase.
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import NavigationMenu from "@/components/layout/NavigationMenu";
import MobileMenu from "@/components/client/MobileMenu";
import Preloader from "@/components/client/Preloader";
import StickyHeader from "@/components/client/StickyHeader";
import { getFooterTech, getNavigation, getProfile, getSocials } from "@/lib/data";
import { SECTION_IDS } from "@/lib/site";

export default function Home() {
  const profile = getProfile();
  const nav = getNavigation();
  // v2's menu footer reads "© 2026 Ayush Mishra"; the year comes from the sheet's copyright line.
  const year = profile.copyright?.match(/\d{4}/)?.[0];
  const menuCopyright = `© ${year ? `${year} ` : ""}${profile.name}`;
  // Until the scroll highlighter (Phase 7), Home is marked active, as on v2's index.html.
  const activeId = "home";

  return (
    <>
      <Preloader brand={profile.brand} />

      <NavigationMenu
        brand={profile.brand}
        role={profile.role}
        copyright={menuCopyright}
        nav={nav}
        socials={getSocials()}
        activeId={activeId}
      />

      <div className="main-content">
        <Header brand={profile.brand} ctaLabel={profile.cta_label} nav={nav} activeId={activeId} />

        <main>
          {SECTION_IDS.map((id) => (
            <section key={id} id={id}></section>
          ))}
        </main>

        <Footer
          brand={profile.brand}
          copyright={profile.copyright}
          nav={nav}
          tech={getFooterTech()}
        />
      </div>

      <MobileMenu />
      <StickyHeader />
    </>
  );
}
