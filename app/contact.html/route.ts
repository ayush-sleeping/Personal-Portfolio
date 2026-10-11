// v2's contact.html, now the #contact section (lib/redirect.ts).
import { redirectPage } from "@/lib/redirect";

export const dynamic = "force-static";

export const GET = () => redirectPage("contact", "Contact");
