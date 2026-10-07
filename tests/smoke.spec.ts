// Smoke test for the one-page site: the built site loads under basePath, renders the v2 shell
// from the sheet data, has the shell stylesheet applied, loads public assets, and throws no page
// errors.
import { readFileSync } from "node:fs";

import { expect, test } from "@playwright/test";

const readJson = <T>(file: string) => JSON.parse(readFileSync(file, "utf8")) as T;

const profile = readJson<{ brand: string; copyright: string; name: string }>(
  "assets/data/site/profile.json",
);
const nav = readJson<{ id: string; label: string }[]>("assets/data/site/navigation.json");
const home = readJson<{ marquee_items: string }>("assets/data/pages/home.json");
const stats = readJson<unknown[]>("assets/data/collections/stats.json");
const count = (name: string) => readJson<unknown[]>(`assets/data/collections/${name}.json`).length;

const SECTION_IDS = ["home", "about", "projects", "services", "contact"];

test("the shell renders sheet content with the v2 stylesheet", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));

  const response = await page.goto("./");
  expect(response?.status()).toBe(200);

  // Content comes from assets/data at build time.
  await expect(page.locator(".header .logo-text")).toHaveText(profile.brand);
  await expect(page.locator("footer")).toContainText(profile.copyright);

  // Every section exists, in order, and every header nav link points at one of them.
  const ids = await page.locator("main > section").evaluateAll((els) => els.map((el) => el.id));
  expect(ids).toEqual(SECTION_IDS);
  for (const item of nav) {
    await expect(page.locator(`.header .navbar a[href="#${item.id}"]`)).toHaveText(item.label);
  }

  // style.css is applied: its --background-color token is #0F0F0F.
  const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(background).toBe("rgb(15, 15, 15)");

  // The preloader hands over: the content fades in and the preloader leaves the layer tree.
  await expect(page.locator(".main-content")).toHaveClass(/\bfade-in\b/);
  await expect(page.locator(".preloader")).toBeHidden();

  // A public asset under basePath resolves (the favicon the <head> links).
  const icon = await page.locator('link[rel="icon"]').first().getAttribute("href");
  expect(icon).toBeTruthy();
  const iconResponse = await page.request.get(icon!);
  expect(iconResponse.status()).toBe(200);

  expect(errors, "uncaught page errors").toEqual([]);
});

test("the hamburger opens and closes the menu, and a menu link closes it", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator(".preloader")).toBeHidden();

  const hamburger = page.locator(".hamburger");
  const menu = page.locator(".navigation__menu");
  test.skip(
    !(await hamburger.isVisible()),
    "style.css shows the hamburger at 768px and below only",
  );

  await hamburger.click();
  await expect(menu).toHaveClass(/\bopen\b/);
  await hamburger.click();
  await expect(menu).not.toHaveClass(/\bopen\b/);

  await hamburger.click();
  await menu.locator('a[href="#contact"]').click();
  await expect(menu).not.toHaveClass(/\bopen\b/);
  await expect(page).toHaveURL(/#contact$/);
});

test("the home bento renders the sheet content and links within the page", async ({ page }) => {
  await page.goto("./");
  const section = page.locator("#home");

  await expect(section.locator(".infos h2").first()).toHaveText(profile.name);
  await expect(section.locator(".client-card")).toHaveCount(stats.length);
  // One empty leading item, then the list twice (what the marquee keyframe is tuned against).
  const items = home.marquee_items.split(",").filter((s) => s.trim());
  await expect(section.locator(".marquee > span")).toHaveCount(1 + 2 * items.length);

  // Cards link to sections, not to v2's .html pages, and no link is nested in another.
  await expect(section.locator('a[href$=".html"]')).toHaveCount(0);
  await expect(section.locator("a a")).toHaveCount(0);
  for (const id of ["about", "projects", "services", "contact"]) {
    await expect(section.locator(`a[href="#${id}"]`).first()).toBeAttached();
  }
});

test("the about section renders every sheet entry once, without the home link cards", async ({
  page,
}) => {
  await page.goto("./");
  const section = page.locator("#about");

  await expect(section.locator(".timeline-item")).toHaveCount(
    count("experience") + count("education"),
  );
  await expect(section.locator(".carousel-item")).toHaveCount(count("certifications"));
  await expect(section.locator(".skill-card")).toHaveCount(count("skills"));
  await expect(section.locator(".home__name")).toHaveText(profile.name);

  // T3: the link cards appear once on the page, in Home.
  await expect(section.locator(".proj-img, .inner-profile-icons, .last-infos h2")).toHaveCount(0);
  await expect(page.locator(".proj-img")).toHaveCount(3);
});

test("the why-hire card opens the video modal, and closing it pauses the video", async ({
  page,
}) => {
  await page.goto("./");
  await expect(page.locator(".preloader")).toBeHidden();

  await page.locator("#whyHireCard").click();
  const modal = page.locator("#whyHireModal");
  await expect(modal).toBeVisible();
  await modal.locator(".btn-close").click();
  await expect(modal).toBeHidden();
  // Bootstrap fires hidden.bs.modal (which pauses the video) after the backdrop fades out.
  await expect
    .poll(() => page.locator("#whyHireVideo").evaluate((v: HTMLVideoElement) => v.paused))
    .toBe(true);
});

test("the projects section renders every shown project, without a second skills block", async ({
  page,
}) => {
  await page.goto("./");
  const projects = readJson<{ featured?: string }[]>("assets/data/collections/projects.json");
  const shown = projects.filter((p) => !p.featured || p.featured.trim().toUpperCase() === "TRUE");

  await expect(page.locator("#projects .project-showcase-card")).toHaveCount(shown.length);
  await expect(page.locator("#projects .skill-card")).toHaveCount(0);
  await expect(page.locator(".skills-section").first()).toBeAttached();
});

test("content is in the HTML without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("./");
  await expect(page.locator(".header .logo-text")).toHaveText(profile.brand);
  await expect(page.locator("#home .infos h2").first()).toHaveText(profile.name);
  await context.close();
});

test("unknown URLs get the 404 page", async ({ page }) => {
  const response = await page.goto("./this-page-does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});
