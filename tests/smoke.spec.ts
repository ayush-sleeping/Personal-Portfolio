// Smoke test for the v3 core: the built site loads under basePath, shows content from the sheet
// data, has the shell stylesheet applied, loads public assets, and throws no page errors.
import { readFileSync } from "node:fs";

import { expect, test } from "@playwright/test";

const profile = JSON.parse(readFileSync("assets/data/site/profile.json", "utf8")) as {
  name: string;
  tagline: string;
};

test("home page renders sheet content with the v2 stylesheet", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));

  const response = await page.goto("./");
  expect(response?.status()).toBe(200);

  // Content comes from assets/data at build time.
  await expect(page.getByRole("heading", { level: 1, name: profile.name })).toBeVisible();
  await expect(page.getByText(profile.tagline)).toBeVisible();

  // style.css is applied: its --background-color token is #0F0F0F.
  const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(background).toBe("rgb(15, 15, 15)");

  // A public asset under basePath actually loaded (the portrait, via <picture>).
  const portrait = page.getByRole("img", { name: profile.name });
  await expect(portrait).toBeVisible();
  expect(await portrait.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);

  expect(errors, "uncaught page errors").toEqual([]);
});

test("content is in the HTML without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1, name: profile.name })).toBeVisible();
  await context.close();
});

test("unknown URLs get the 404 page", async ({ page }) => {
  const response = await page.goto("./this-page-does-not-exist/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});
