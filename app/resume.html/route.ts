// v2's resume.html, now the #experience section (lib/redirect.ts).
import { redirectPage } from "@/lib/redirect";

export const dynamic = "force-static";

export const GET = () => redirectPage("experience", "Resume");
