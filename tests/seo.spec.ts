// Phase 8: SEO and crawler files. One title, one canonical, one set of OG tags, valid JSON-LD with
// the four node types, a one-URL sitemap, and every v2 .html URL landing on its section.
import { readFileSync } from "node:fs";

import { expect, test } from "@playwright/test";

const readJson = <T>(file: string) => JSON.parse(readFileSync(file, "utf8")) as T;
const faqs = readJson<unknown[]>("assets/data/collections/faqs.json");
const projects = readJson<unknown[]>("assets/data/collections/projects.json");

test("the head has one title, canonical and set of share tags", async ({ page }) => {
  await page.goto("./");
  await expect(page).toHaveTitle(/Mishra/);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  for (const tag of ["og:title", "og:description", "og:image", "og:url"]) {
    await expect(page.locator(`meta[property="${tag}"]`)).toHaveCount(1);
  }
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /\S/);
});

test("JSON-LD parses and describes the person, site, FAQ and projects", async ({ page }) => {
  await page.goto("./");
  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((els) => els.map((el) => el.textContent ?? ""));
  expect(blocks).toHaveLength(1);

  const graph = JSON.parse(blocks[0])["@graph"] as { "@type": string; [k: string]: unknown }[];
  const ofType = (type: string) => graph.filter((n) => n["@type"] === type);
  expect(ofType("Person")).toHaveLength(1);
  expect(ofType("WebSite")).toHaveLength(1);
  expect(ofType("FAQPage")).toHaveLength(1);
  expect(ofType("FAQPage")[0].mainEntity).toHaveLength(faqs.length);
  expect(ofType("CreativeWork")).toHaveLength(projects.length);
  // Plain text only: no sheet HTML leaks into the structured data.
  expect(blocks[0]).not.toMatch(/<\/?(strong|br|em|b|i)\b/);
});

test("the sitemap lists the one page", async ({ request, baseURL }) => {
  const xml = await (await request.get("sitemap.xml")).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  expect(locs).toHaveLength(1);
  expect(locs[0]).toMatch(/\/$/);
  expect((await request.get("robots.txt")).status()).toBe(200);
  expect(await (await request.get("llms.txt")).text()).toContain(`#projects`);
  expect(baseURL).toBeTruthy();
});

const OLD_PAGES: [string, string][] = [
  ["about.html", "about"],
  ["resume.html", "about"],
  ["project.html", "projects"],
  ["services.html", "services"],
  ["contact.html", "contact"],
];

for (const [file, section] of OLD_PAGES) {
  test(`v2's ${file} lands on #${section}`, async ({ page, baseURL }) => {
    await page.goto(file);
    await page.waitForURL(`${baseURL}#${section}`);
    await expect(page.locator(`main > section#${section}`)).toBeAttached();
  });
}
