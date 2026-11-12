# sebastiannino.me

Personal portfolio of Sebastián Niño, a backend-minded full-stack developer. It is a fast, fully static Next.js site with a "minimal dark + terminal" design, case studies written in MDX and an interactive terminal widget. The same stack is the one used in the work it showcases. Launching Nov 19, 2026.

> **Status: work in progress.** A complete README (screenshot, architecture and design decisions) lands with ticket F5-02.

## Stack

Next.js 16 (App Router) · TypeScript (strict) · Tailwind CSS v4 (design tokens in `@theme`) · `next/font` · Vitest · Playwright · ESLint + Prettier · GitHub Actions · Vercel.
MDX and Motion arrive in later phases.

## Prerequisites

- Node.js 22 or newer
- npm (bundled with Node.js)

## Getting started

```bash
npm install
npm run dev         # http://localhost:3000
```

| Command                                   | What it does                                                                                       |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `npm run dev`                             | Development server                                                                                 |
| `npm run lint`                            | ESLint                                                                                             |
| `npm run typecheck`                       | TypeScript, no emit                                                                                |
| `npm test`                                | Unit tests (Vitest)                                                                                |
| `npm run test:e2e`                        | Playwright smoke tests against the production build (first run: `npx playwright install chromium`) |
| `npm run build` · `npm start`             | Production build and server                                                                        |
| `npm run format` · `npm run format:check` | Prettier                                                                                           |

The quality gate is `npm run lint && npm run typecheck && npm test && npm run build`.

## Project structure

```
src/app/          Routes, layout, global styles and design tokens (globals.css)
src/components/   Shared layout components (nav, footer, button, ...)
src/data/         Typed content (profile, projects, experience, certifications, skills) and its getters
src/lib/terminal/  Pure terminal logic (stack output builder)
src/lib/          Pure helpers and site constants, with unit tests next to them
tests/e2e/        Playwright specs
.github/workflows CI
context/ design/ docs/ prompts/   Planning material (not part of the app)
```

`src/content` (MDX case studies) is added as the site grows.

## Content lives in data

Content (projects, experience, certifications) lives in typed data files (`src/data/*.ts`, read through the getters in `@/data`) and case studies will live in MDX (`src/content/work/*.mdx`). Components only render it, and the terminal widget reads from the same source, so updating the site means editing data, not UI.

## CI

GitHub Actions runs on every push and pull request:

1. **quality**: lint, typecheck, unit tests and build.
2. **e2e**: Playwright smoke tests against the production build.

Vercel deploys `main`.

## Privacy

The case studies are based on private client work and use demo data only. No real client data is published here.

## Contact

hello@sebastiannino.me
