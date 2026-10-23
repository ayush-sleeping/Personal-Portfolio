// Playwright runs against the built static site (out/), served under basePath exactly as GitHub
// Pages will serve it. Run `npm run build` first; `npm test` then starts the preview server itself.
//
// Three viewports: phone, tablet, desktop.

import { defineConfig, devices } from "@playwright/test";

// Its own ports, so a running `npm run preview` (7301) is never reused by mistake. Locally servers
// are reused when already up, so two people (or sessions) testing different builds at once must
// each pick their own: PW_PORT.
const PORT = Number(process.env.PW_PORT ?? 7310);
// The same variable the build reads: "/Personal-Portfolio" by default, "" for a root build
// (after the rename to ayush-sleeping.github.io, task.md T9).
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "/Personal-Portfolio";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}${BASE_PATH}/`,
    trace: "retain-on-failure",
  },
  projects: [
    { name: "phone", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 } } },
    {
      name: "tablet",
      use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 } },
    },
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: [
    {
      // Quoted, so a root build (NEXT_PUBLIC_BASE_PATH="") is served at /.
      command: `node scripts/serve.mjs --dir out --base "${BASE_PATH}" --port ${PORT}`,
      url: `http://localhost:${PORT}${BASE_PATH}/`,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
