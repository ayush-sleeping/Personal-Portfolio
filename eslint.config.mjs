import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Formatting is Prettier's job; turn off the ESLint rules that fight it.
  prettier,
  {
    rules: {
      // next/image can't optimise a static export (images.unoptimized), and parity with v2 needs
      // its plain <img>/<picture> markup. Local images already ship AVIF + WebP siblings.
      "@next/next/no-img-element": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // The v2 HTML site, kept locally as a read-only reference.
    "version2/**",
    "test-results/**",
    "playwright-report/**",
  ]),
]);

export default eslintConfig;
