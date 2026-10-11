// Phase 3b: the resume merged into About. "Download PDF" prints, and print shows only the resume
// blocks of About, in v2 resume.html's order, with the school links and course list in Education.
import { expect, test } from "@playwright/test";

test("About carries the resume's facts and the Download PDF button", async ({ page }) => {
  await page.goto("./");
  const about = page.locator("#about");
  await expect(about.locator("[data-print-resume]")).toHaveText(/Download PDF/);
  await expect(about.locator(".timeline-company a[href^='https://']")).toHaveCount(2);
  await expect(about).toContainText("USCS204: Data Structures");
});

test("Download PDF opens the print dialog", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator(".preloader")).toBeHidden();
  await page.evaluate(() => {
    (window as unknown as { printed: boolean }).printed = false;
    window.print = () => {
      (window as unknown as { printed: boolean }).printed = true;
    };
  });
  await page.locator("[data-print-resume]").click();
  expect(await page.evaluate(() => (window as unknown as { printed: boolean }).printed)).toBe(true);
});

test("print shows only the resume, in resume order", async ({ page }) => {
  await page.goto("./");
  await page.emulateMedia({ media: "print" });

  for (const id of ["home", "projects", "services", "contact"]) {
    await expect(page.locator(`#${id}`)).toBeHidden();
  }
  await expect(page.locator("header.header")).toBeHidden();
  for (const skipped of await page.locator('#about [data-resume="skip"]').all()) {
    await expect(skipped).toBeHidden();
  }

  const order = await page
    .locator("#about [data-resume]:not([data-resume='skip'])")
    .evaluateAll((els) =>
      els
        .map((el) => ({ name: el.getAttribute("data-resume"), top: el.getBoundingClientRect().top }))
        .sort((a, b) => a.top - b.top)
        .map((e) => e.name),
    );
  expect(order).toEqual(["name", "bio", "info", "experience", "education", "skills"]);
});
