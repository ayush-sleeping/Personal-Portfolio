// Playwright runs against the built static site (out/), served under basePath exactly as GitHub
// Pages will serve it. Run `npm run build` first; `npm test` then starts the preview server itself.
//
// Three viewports match the widths the v2 → v3 UI comparison will use (planned in task.md).
import { existsSync } from "node:fs";

import { defineConfig, devices } from "@playwright/test";

// Its own port, so a running `npm run preview` (7301) or another project's server on 3000 is never
// reused by mistake.
const PORT = 7310;
const V2_PORT = 4000;
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
    // v2 for the parity suite (tests/parity.spec.ts). version2/ is a gitignored local copy, so CI
    // has no v2 server and the suite skips itself there.
    ...(existsSync("version2")
      ? [
          {
            command: `node scripts/serve.mjs --dir version2 --port ${V2_PORT}`,
            url: `http://localhost:${V2_PORT}/`,
            reuseExistingServer: !process.env.CI,
          },
        ]
      : []),
  ],
});
