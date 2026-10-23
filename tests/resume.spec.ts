// The resume in the v4 design: "Download resume" / "Download PDF" print the page, and print shows
// only About, Experience, Education and Skills.
import { expect, test } from "@playwright/test";

test.use({ reducedMotion: "reduce" });

test("the page carries the resume's facts and the download links", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator("[data-print]")).toHaveCount(2);
  await expect(page.locator("#education a[href^='https://']")).toHaveCount(2);
  await expect(page.locator("#education")).toContainText("Data Structures");
});

test("Download resume opens the print dialog", async ({ page }) => {
  await page.goto("./");
  await page.evaluate(() => {
    (window as unknown as { printed: boolean }).printed = false;
    window.print = () => {
      (window as unknown as { printed: boolean }).printed = true;
    };
  });
  await page.locator("#home [data-print]").click();
  expect(await page.evaluate(() => (window as unknown as { printed: boolean }).printed)).toBe(true);
});

test("print shows only the resume sections", async ({ page }) => {
  await page.goto("./");
  await page.emulateMedia({ media: "print" });
  for (const id of ["home", "certifications", "projects", "services", "contact", "faq"]) {
    await expect(page.locator(`#${id}`)).toBeHidden();
  }
  await expect(page.locator("aside[data-i~='side']")).toBeHidden();
  for (const id of ["about", "experience", "education", "skills"]) {
    await expect(page.locator(`#${id}`)).toBeVisible();
  }
});
