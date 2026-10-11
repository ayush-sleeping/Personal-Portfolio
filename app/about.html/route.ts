// v2's about.html, now the #about section (lib/redirect.ts).
import { redirectPage } from "@/lib/redirect";

export const dynamic = "force-static";

export const GET = () => redirectPage("about", "About");
