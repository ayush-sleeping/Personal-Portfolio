// Phase 9: parity proof. Each v2 block (served from version2/ by `npm run v2`) is screenshotted next
// to the matching v3 block at the three project widths, and the two images are compared pixel by
// pixel. The differences we chose (task.md T1–T12 and the intentional-differences list) are named in
// KNOWN below; anything else that differs fails.
//
// version2/ is a gitignored local copy of the v2-html-final tag. Locally the suite skips itself when
// it's missing. CI recreates it from the tag (ci.yml), and there a missing version2/ fails the suite
// instead of skipping, so parity can't silently stop being checked.
import { existsSync, readFileSync, writeFileSync } from "node:fs";

import { expect, test, type Page, type TestInfo } from "@playwright/test";

const V2 = "http://localhost:4000/";

const HAS_V2 = existsSync("version2");

test.skip(!HAS_V2 && !process.env.CI, "version2/ is not checked out (local reference only)");

test.beforeAll(() => {
  if (!HAS_V2) {
    throw new Error(
      "version2/ is missing in CI: the parity suite needs it. ci.yml recreates it from the " +
        "v2-html-final tag before `npm test`.",
    );
  }
});

/** Share of pixels allowed to differ: anti-aliasing noise, nothing a person would notice. */
const MAX_DIFF_RATIO = 0.002;
/** Pixels of shift and size rounding tolerated between the two layouts. */
const SLACK = 2;

/**
 * Card decorations v2 hotlinks. v3 draws its own (task.md T8); serving those to v2 during the test
 * keeps that one chosen difference out of every card's comparison.
 */
const DECOR: Record<string, string> = {
  "bg1.png": "card-texture.png",
  "icon.svg": "arrow.svg",
  "icon2.png": "hanging-star.svg",
  "star1.svg": "marquee-star.svg",
};

/**
 * One v2 page and its v3 section. `blocks` is how many top-level blocks to compare, in DOM order:
 * the blocks after that on the v2 page are the link cards T3 shows only once, on Home.
 */
const SECTIONS = [
  { id: "home", v2: "index.html", blocks: 9 },
  { id: "about", v2: "about.html", blocks: 9 },
  { id: "projects", v2: "project.html", blocks: 8 },
  { id: "services", v2: "services.html", blocks: 7 },
  { id: "contact", v2: "contact.html", blocks: 9 },
] as const;

/** Chosen differences, by section and block index. The block is still compared, just not failed. */
const KNOWN: Record<string, string> = {
  "about:1":
    "Bio: v2 hardcoded a paragraph break the sheet's bio doesn't have yet (T12, TODO(sheet)).",
  "about:4":
    "Education: carries resume.html's facts too, the course list and subjects (T1, task.md 3b).",
  "about:5": 'Why-hire card: the sheet text "Why should we hire you?" (v2 HTML: "… you ?", T12).',
  "about:7": 'Profile card: resume.html\'s "Download PDF" button next to "Contact Me" (T1, 3b).',
  "contact:1": "Form card: the sheet's straight apostrophe in \"Let's work together.\" (Phase 6).",
};

/** Top-level content blocks of a v2 page or v3 section, in DOM order (same rule on both). */
const BLOCKS = `[class*="card"], .section-heading`;

async function prepare(page: Page, url: string, rootSelector: string) {
  await page.route(/wpriverthemes\.com\/.*\/([^/]+)$/, (route) => {
    const name = route.request().url().split("/").pop()!;
    const local = DECOR[name];
    if (!local) return route.abort();
    return route.fulfill({
      body: readFileSync(`public/assets/img/decor/${local}`),
      contentType: local.endsWith(".svg") ? "image/svg+xml" : "image/png",
    });
  });
  await page.goto(url, { waitUntil: "networkidle" });
  await expect(page.locator(".preloader")).toBeHidden({ timeout: 15_000 });

  // Freeze everything that moves: animations, transitions, the marquee, the carousel (pinned to
  // its first slide), and hide the sticky header so it can't sit on top of a screenshot.
  await page.addStyleTag({
    content: `*, *::before, *::after { animation: none !important; transition: none !important;
      caret-color: transparent !important; } .header { visibility: hidden !important; }
      .marquee { will-change: auto !important; }`,
  });
  await page.mouse.move(0, 0);
  // Let a carousel slide that was already under way finish before the carousel is stopped.
  await page.waitForTimeout(800);
  return page.evaluate(
    ({ rootSelector, blocks }) => {
      const w = window as unknown as {
        bootstrap?: { Carousel: { getInstance(el: Element): { dispose(): void } | null } };
      };
      // Stop every timer the page set (v2's carousel keeps cycling even after dispose()).
      const last = window.setTimeout(() => {}, 0);
      for (let id = 0; id <= last; id++) {
        window.clearTimeout(id);
        window.clearInterval(id);
      }
      document.querySelectorAll(".carousel").forEach((c) => {
        w.bootstrap?.Carousel.getInstance(c)?.dispose();
        c.removeAttribute("data-bs-ride");
        c.querySelectorAll(".carousel-item").forEach((item, i) => {
          item.className = i === 0 ? "carousel-item active" : "carousel-item";
        });
      });
      const root = document.querySelector(rootSelector)!;
      const found = [...root.querySelectorAll(blocks)]
        .filter((el) => !el.closest("header, footer, .footer, .navigation__menu"))
        .filter((el) => !el.parentElement!.closest('[class*="card"]'));
      found.forEach((el, i) => el.setAttribute("data-parity", String(i)));
      return found.length;
    },
    { rootSelector, blocks: BLOCKS },
  );
}

async function shoot(page: Page, index: number): Promise<Buffer> {
  const block = page.locator(`[data-parity="${index}"]`);
  await block.scrollIntoViewIfNeeded();
  // Let the scroll-reveal observer mark the card, as it does for a visitor, and lazy images load.
  await page.waitForTimeout(300);
  await block.evaluate((el) =>
    Promise.all(
      [...el.querySelectorAll("img")]
        .filter((img) => img.offsetParent && !img.complete)
        .map((img) => new Promise((done) => img.addEventListener("load", done, { once: true }))),
    ),
  );
  return block.screenshot();
}

/**
 * Compares two PNGs in a blank page's canvas. The two pages lay the same block out at different
 * fractional offsets, so content can land a pixel apart and sizes can round differently: the best
 * of every shift up to SLACK pixels is taken, and the SLACK-wide edge band (the card's border and
 * rounded corners, identical CSS on both) is left out. Returns the differing share and a diff image.
 */
async function compare(page: Page, a: Buffer, b: Buffer) {
  return page.evaluate(
    async ({ a64, b64, slack }) => {
      const load = (src: string) =>
        new Promise<HTMLImageElement>((ok, fail) => {
          const img = new Image();
          img.onload = () => ok(img);
          img.onerror = fail;
          img.src = `data:image/png;base64,${src}`;
        });
      const [ia, ib] = await Promise.all([load(a64), load(b64)]);
      const pixels = (img: HTMLImageElement) => {
        const c = new OffscreenCanvas(img.width, img.height);
        const ctx = c.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0, 0, img.width, img.height).data;
      };
      const pa = pixels(ia);
      const pb = pixels(ib);
      const w = Math.min(ia.width, ib.width);
      const h = Math.min(ia.height, ib.height);
      // A pixel differs only if no pixel within 1px of its place in the other image matches it:
      // glyph edges anti-alias differently at different sub-pixel offsets, real changes don't.
      const close = (i: number, j: number) =>
        Math.abs(pa[i] - pb[j]) <= 40 &&
        Math.abs(pa[i + 1] - pb[j + 1]) <= 40 &&
        Math.abs(pa[i + 2] - pb[j + 2]) <= 40;
      const differs = (x: number, y: number, dx: number, dy: number) => {
        const i = (y * ia.width + x) * 4;
        for (let oy = -1; oy <= 1; oy++) {
          const by = y + dy + oy;
          if (by < 0 || by >= ib.height) continue;
          for (let ox = -1; ox <= 1; ox++) {
            const bx = x + dx + ox;
            if (bx >= 0 && bx < ib.width && close(i, (by * ib.width + bx) * 4)) return false;
          }
        }
        return true;
      };
      const inner = (dx: number, dy: number) => ({
        x0: Math.max(slack, slack - dx),
        y0: Math.max(slack, slack - dy),
        x1: Math.min(w - slack, w - slack - dx),
        y1: Math.min(h - slack, h - slack - dy),
      });

      let best = { dx: 0, dy: 0, count: Infinity, area: 1 };
      for (let dy = -slack; dy <= slack; dy++) {
        for (let dx = -slack; dx <= slack; dx++) {
          const { x0, y0, x1, y1 } = inner(dx, dy);
          let count = 0;
          for (let y = y0; y < y1 && count < best.count; y++)
            for (let x = x0; x < x1; x++) if (differs(x, y, dx, dy)) count++;
          if (count < best.count)
            best = { dx, dy, count, area: Math.max(1, (x1 - x0) * (y1 - y0)) };
        }
      }

      // Differences in red over a faded copy of v3, at the best shift.
      const out = new OffscreenCanvas(w, h);
      const octx = out.getContext("2d")!;
      const diff = octx.createImageData(w, h);
      const { x0, y0, x1, y1 } = inner(best.dx, best.dy);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const o = (y * w + x) * 4;
          const j = (y * ib.width + x) * 4;
          const hit = x >= x0 && x < x1 && y >= y0 && y < y1 && differs(x, y, best.dx, best.dy);
          diff.data.set(
            hit ? [255, 0, 60, 255] : [pb[j] / 3, pb[j + 1] / 3, pb[j + 2] / 3, 255],
            o,
          );
        }
      }
      octx.putImageData(diff, 0, 0);
      const bytes = new Uint8Array(
        await (await out.convertToBlob({ type: "image/png" })).arrayBuffer(),
      );
      let bin = "";
      for (const byte of bytes) bin += String.fromCharCode(byte);
      return {
        ratio: best.count / best.area,
        sizeOk: Math.abs(ia.width - ib.width) <= slack && Math.abs(ia.height - ib.height) <= slack,
        sizes: `${ia.width}x${ia.height} vs ${ib.width}x${ib.height}`,
        diff: btoa(bin),
      };
    },
    { a64: a.toString("base64"), b64: b.toString("base64"), slack: SLACK },
  );
}

/** Saves the pair and the diff in the test's output folder (test-results/) and the report. */
async function attach(info: TestInfo, name: string, v2: Buffer, v3: Buffer, diff: string) {
  const files: [string, Buffer][] = [
    ["v2", v2],
    ["v3", v3],
    ["diff", Buffer.from(diff, "base64")],
  ];
  for (const [kind, body] of files) {
    const path = info.outputPath(`${name.replace(":", "-")}-${kind}.png`);
    writeFileSync(path, body);
    await info.attach(`${name} ${kind}`, { path, contentType: "image/png" });
  }
}

for (const section of SECTIONS) {
  test(`#${section.id} matches v2's ${section.v2}`, async ({ context }, info) => {
    test.setTimeout(120_000);
    const v2 = await context.newPage();
    const v3 = await context.newPage();
    const scratch = await context.newPage();

    const v2Count = await prepare(v2, `${V2}${section.v2}`, ".main-content");
    const v3Count = await prepare(v3, "./", `#${section.id}`);
    expect(v2Count, "v2 blocks").toBeGreaterThanOrEqual(section.blocks);
    expect(v3Count, "v3 blocks (T3: link cards appear once, on Home)").toBe(section.blocks);

    for (let i = 0; i < section.blocks; i++) {
      const key = `${section.id}:${i}`;
      const [a, b] = [await shoot(v2, i), await shoot(v3, i)];
      const result = await compare(scratch, a, b);
      const pass = result.sizeOk && result.ratio <= MAX_DIFF_RATIO;
      const summary = `${key} ${result.sizes}, ${(result.ratio * 100).toFixed(2)}% differs`;
      if (KNOWN[key]) {
        info.annotations.push({
          type: "known difference",
          description: `${summary}: ${KNOWN[key]}`,
        });
        continue;
      }
      if (!pass) await attach(info, key, a, b, result.diff);
      expect.soft(pass, summary).toBe(true);
    }
  });
}
