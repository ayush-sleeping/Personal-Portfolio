// Placeholder for v3: proves the core works end to end (config, shell CSS, public assets under
// basePath, and build-time sheet data). Replaced by the one-page portfolio planned in task.md.
import { getNavigation, getProfile } from "@/lib/data";
import { pictureSources } from "@/lib/site";

export default function Home() {
  const profile = getProfile();
  const nav = getNavigation();
  const portrait = pictureSources(profile.hero_image);

  return (
    <main className="container py-5" data-v3-placeholder>
      <div className="d-flex align-items-center gap-4 flex-wrap">
        <div className="img-box">
          <picture>
            {portrait.avif && <source type="image/avif" srcSet={portrait.avif} />}
            {portrait.webp && <source type="image/webp" srcSet={portrait.webp} />}
            <img
              src={portrait.src}
              className="home__img"
              alt={profile.name}
              width={509}
              height={679}
            />
          </picture>
        </div>
        <div>
          <p className="text-secondary mb-1">{profile.tagline}</p>
          <h1 className="home__name">{profile.name}</h1>
          <p style={{ maxWidth: 520 }}>{profile.intro}</p>
          <p className="text-secondary small mb-0">
            v3 core is ready. Sections from the sheet: {nav.map((n) => n.label).join(" · ")}
          </p>
        </div>
      </div>
    </main>
  );
}
