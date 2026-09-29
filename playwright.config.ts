// Playwright runs against the built static site (out/), served under basePath exactly as GitHub
// Pages will serve it. Run `npm run build` first; `npm test` then starts the preview server itself.
//
// Three viewports match the widths the v2 → v3 UI comparison will use (planned in task.md).
import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
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
  webServer: {
    command: `node scripts/serve.mjs --dir out --base ${BASE_PATH} --port ${PORT}`,
    url: `http://localhost:${PORT}${BASE_PATH}/`,
    reuseExistingServer: !process.env.CI,
  },
});
