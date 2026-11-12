import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    // Build output and tool reports
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
    // Planning material: kept in the repo but it is not application code,
    // so it is never linted (and tsconfig.json excludes it from typecheck/build too).
    "context/**",
    "design/**",
    "docs/**",
    "prompts/**",
  ]),
]);
