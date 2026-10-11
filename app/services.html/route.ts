// v2's services.html, now the #services section (lib/redirect.ts).
import { redirectPage } from "@/lib/redirect";

export const dynamic = "force-static";

export const GET = () => redirectPage("services", "Services");
