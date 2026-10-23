// Smoke test for the v4 site (task.md Phase 11): the built site loads under basePath, renders
// the sheet content in the design's shell, the shell behaviour works, and old URLs still land.
import { readFileSync } from "node:fs";

import { expect, test, type Page } from "@playwright/test";

const readJson = <T>(file: string) => JSON.parse(readFileSync(file, "utf8")) as T;

const profile = readJson<{ brand: string; copyright: string; name: string; tagline: string }>(
  "assets/data/site/profile.json",
);
const count = (name: string) => readJson<unknown[]>(`assets/data/collections/${name}.json`).length;

const SECTION_IDS = [
  "home",
  "about",
  "experience",
  "education",
  "certifications",
  "skills",
  "projects",
  "services",
  "contact",
  "faq",
];

// The prefix the build was made with: "/Personal-Portfolio" by default, "" for a root build.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "/Personal-Portfolio";

const noErrors = (page: Page) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));
  return errors;
};

test.use({ reducedMotion: "reduce" });

test("the page renders every section from the sheet, without errors", async ({ page }) => {
  const errors = noErrors(page);
  const response = await page.goto("./");
  expect(response?.status()).toBe(200);

  const ids = await page.locator("main > section[id]").evaluateAll((els) => els.map((e) => e.id));
  expect(ids).toEqual(SECTION_IDS);

  await expect(page.locator("#home h1")).toHaveText(profile.name);
  await expect(page.locator("#home [data-type]")).toHaveText(profile.tagline);
  await expect(page.locator("aside .v4-brand-text")).toHaveText(profile.brand);
  await expect(page.locator("footer")).toContainText(profile.copyright);
  expect(await page.locator("#projects article[id^='project-']").count()).toBe(count("projects"));
  expect(await page.locator("#services .v4-panel").count()).toBe(count("services"));
  expect(await page.locator("#faq .v4-faq").count()).toBe(count("faqs"));
  expect(await page.locator("#certifications .v4-cert").count()).toBe(count("certifications"));
  expect(await page.locator("#experience [data-exp-row]").count()).toBe(count("experience"));

  const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(background).toBe("rgb(15, 15, 15)");
  const favicon = await page.locator('link[rel="icon"]').first().getAttribute("href");
  expect(favicon).toMatch(new RegExp(`^${BASE_PATH}/assets/`));
  expect((await page.request.get(favicon!)).status()).toBe(200);
  expect(errors).toEqual([]);
});

test("the sidebar lists the sections and the projects, and follows the scroll", async ({
  page,
}) => {
  await page.goto("./");
  const aside = page.locator("aside[data-i~='side']");
  for (const id of [
    "about",
    "experience",
    "education",
    "certifications",
    "skills",
    "services",
    "contact",
    "faq",
  ]) {
    expect(await aside.locator(`a[href="#${id}"]`).count()).toBeGreaterThan(0);
  }
  expect(await aside.locator("a[href^='#project-']").count()).toBe(count("projects"));
  await expect(aside.locator('[data-row][data-active="true"]')).toHaveAttribute("href", "#home");

  await page.locator("#services").scrollIntoViewIfNeeded();
  await expect(aside.locator('[data-row][data-active="true"]')).toHaveAttribute(
    "href",
    "#services",
  );
});

test("the search palette opens with the keyboard and jumps to a section", async ({ page }) => {
  await page.goto("./");
  await page.keyboard.press("Control+k");
  const dialog = page.getByRole("dialog", { name: "Search" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("textbox").fill("services");
  await page.keyboard.press("Enter");
  await expect(dialog).toBeHidden();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
});

test("the certificate lightbox opens, steps and closes", async ({ page }) => {
  await page.goto("./");
  await page.locator("#certifications .v4-cert").first().click();
  const dialog = page.locator("[data-modal]");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText(`1 / ${count("certifications")}`);
  await page.keyboard.press("ArrowRight");
  await expect(dialog).toContainText(`2 / ${count("certifications")}`);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("the FAQ accordion opens one answer at a time", async ({ page }) => {
  await page.goto("./");
  const questions = page.locator("#faq .v4-faq-q");
  await questions.nth(0).click();
  await expect(page.locator("#faq [data-faq-a]")).toHaveCount(1);
  await questions.nth(1).click();
  await expect(page.locator("#faq [data-faq-a]")).toHaveCount(1);
  await expect(questions.nth(1)).toHaveAttribute("aria-expanded", "true");
  await expect(questions.nth(0)).toHaveAttribute("aria-expanded", "false");
});

test("the contact form validates, then sends through EmailJS", async ({ page }) => {
  await page.goto("./");
  const form = page.locator("#contact-form");
  await form.getByRole("button").click();
  await expect(page.locator("#contact-message")).toHaveText(/fill in all fields/i);

  // Stub EmailJS: no real email leaves the test.
  await page.evaluate(() => {
    (window as unknown as { emailjs: unknown }).emailjs = {
      sendForm: () => Promise.resolve({ status: 200 }),
    };
  });
  await form.locator("[name=name]").fill("Test");
  await form.locator("[name=email]").fill("test@example.com");
  await form.locator("[name=message]").fill("Hello");
  await form.getByRole("button").click();
  await expect(page.locator("#contact-message")).toHaveText(/sent/i);
});

test("the mobile drawer opens and a link closes it", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./");
  const aside = page.locator("aside[data-i~='side']");
  await expect(aside).toHaveAttribute("data-open", "false");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(aside).toHaveAttribute("data-open", "true");
  await aside.locator('a[href="#services"]').click();
  await expect(aside).toHaveAttribute("data-open", "false");
});

test("the web app manifest is linked and served under basePath", async ({ page }) => {
  await page.goto("./");
  const href = await page.locator('link[rel="manifest"]').getAttribute("href");
  expect(href).toMatch(new RegExp(`^${BASE_PATH}/manifest\\.webmanifest$`));
  const manifest = await (await page.request.get(href!)).json();
  expect(manifest.name).toContain(profile.name);
});

test("content is in the HTML, and visible, without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("./");
  await expect(page.locator(".main-content")).toHaveCSS("opacity", "1");
  await expect(page.locator("#home h1")).toHaveText(profile.name);
  await expect(page.locator("#projects article").first()).toBeVisible();
  await context.close();
});

test("unknown URLs get the 404 page", async ({ page }) => {
  const response = await page.goto("./this-page-does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  await expect(page).toHaveURL(/\/this-page-does-not-exist\/$/);
});

// Root build only: old /Personal-Portfolio/ links reach the 404 page, which forwards them to the
// same path at the root, keeping the query and hash (app/not-found.tsx). The .html stubs then
// take old page URLs to their section.
test.describe("old /Personal-Portfolio/ links after the rename", () => {
  test.skip(BASE_PATH !== "", 'only a root build (NEXT_PUBLIC_BASE_PATH="") forwards old links');

  const cases: [from: string, to: RegExp][] = [
    ["/Personal-Portfolio/", /^\/$/],
    ["/Personal-Portfolio", /^\/$/],
    ["/Personal-Portfolio/#contact", /^\/#contact$/],
    ["/Personal-Portfolio/about.html", /^\/#about$/],
    ["/Personal-Portfolio/project.html", /^\/#projects$/],
    ["/Personal-Portfolio/services.html", /^\/#services$/],
    ["/Personal-Portfolio/contact.html", /^\/#contact$/],
    ["/Personal-Portfolio/resume.html", /^\/#experience$/],
    ["/Personal-Portfolio/nope?a=1#b", /^\/nope\?a=1#b$/],
  ];
  for (const [from, to] of cases) {
    test(`${from} lands on ${to.source.replace(/\\/g, "")}`, async ({ page }) => {
      await page.goto(from);
      await expect
        .poll(() => new URL(page.url()).href.replace(new URL(page.url()).origin, ""))
        .toMatch(to);
    });
  }

  test("an unknown path that only shares the prefix's letters stays on the 404", async ({
    page,
  }) => {
    await page.goto("/Personal-PortfolioX/");
    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
    await expect(page).toHaveURL(/\/Personal-PortfolioX\/$/);
  });

  test("an unknown old path is forwarded once, then stays on the 404", async ({ page }) => {
    await page.goto("/Personal-Portfolio/nope");
    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
    await expect(page).toHaveURL(/\/nope$/);
  });
});
