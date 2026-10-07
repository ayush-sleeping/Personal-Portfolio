// The one-page portfolio (task.md). The v2 shell — preloader, slide-out menu, header, footer —
// around the five sections in T2 order (ids from SECTION_IDS in lib/site.ts). Sections are
// filled phase by phase.
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import NavigationMenu from "@/components/layout/NavigationMenu";
import MobileMenu from "@/components/client/MobileMenu";
import Preloader from "@/components/client/Preloader";
import ActiveSection from "@/components/client/ActiveSection";
import ScrollCardAnimations from "@/components/client/ScrollCardAnimations";
import StickyHeader from "@/components/client/StickyHeader";
import WhyHire from "@/components/client/WhyHire";
import WhyHireModal from "@/components/layout/WhyHireModal";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import ContactSection from "@/components/sections/ContactSection";
import HomeSection from "@/components/sections/HomeSection";
import { getFooterTech, getNavigation, getPageCopy, getProfile, getSocials } from "@/lib/data";

export default function Home() {
  const profile = getProfile();
  const nav = getNavigation();
  // v2's menu footer reads "© 2026 Ayush Mishra"; the year comes from the sheet's copyright line.
  const year = profile.copyright?.match(/\d{4}/)?.[0];
  const menuCopyright = `© ${year ? `${year} ` : ""}${profile.name}`;
  // The initial state, as on v2's index.html; ActiveSection then follows the scroll.
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
          <HomeSection />
          <AboutSection />
          <ProjectsSection />
          <ServicesSection />
          <ContactSection />
        </main>

        <Footer
          brand={profile.brand}
          copyright={profile.copyright}
          nav={nav}
          tech={getFooterTech()}
        />
      </div>

      {/* Outside .main-content, as in v2: its transform would trap a fixed-position modal. */}
      <WhyHireModal copy={getPageCopy("about")} />

      <MobileMenu />
      <StickyHeader />
      <WhyHire />
      <ScrollCardAnimations />
      <ActiveSection />
    </>
  );
}
