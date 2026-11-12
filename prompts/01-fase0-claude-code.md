# Prompt 01 · Fase 0 → Claude Code

> Abre la terminal en `C:\Users\Janus\Proyectos\sebastiannino-me`, ejecuta `claude` y pega todo lo que está dentro del bloque.

```
## Context
You are building my personal portfolio, sebastiannino.me. Before anything else, read CLAUDE.md and every file in /context, then open design/design-C-minimal-dark-terminal.html and look at design/design-C-preview.png. Current phase: Phase 0 — Setup & foundations (context/05-plan-fases.md). Tickets: F0-01 and F0-02 (context/09-backlog.md).

This folder already contains planning material (CLAUDE.md, context/, design/, docs/, prompts/) but no code and no git repo yet. I'm on Windows using PowerShell.

## Goal
Scaffold a production-ready Next.js project in THIS folder with the agreed stack, tooling and CI, showing a styled placeholder page, so I can push it to GitHub and deploy it on Vercel today.

## Requirements
1. Plan first: list the steps and the exact current versions you will use (check Next.js, Tailwind CSS, Motion, MDX packages, Vitest, Playwright). If anything in context/04-stack-arquitectura.md is outdated, tell me and propose the fix before continuing.
2. Scaffold Next.js (App Router, TypeScript strict, Tailwind CSS v4, ESLint, src/ dir, import alias @/*) with pnpm (fall back to npm if pnpm is missing and tell me). create-next-app may refuse a non-empty folder: if so, scaffold into a temporary subfolder and move the files up, keeping CLAUDE.md, context/, design/, docs/ and prompts/ untouched.
3. Add Prettier (with the Tailwind plugin) and scripts: dev, build, start, lint, typecheck, format, test (Vitest), test:e2e (Playwright).
4. Configure design tokens from context/03-diseno.md in src/app/globals.css using Tailwind v4 @theme (colors, fonts, radii). Load Space Grotesk, Inter and JetBrains Mono with next/font.
5. Placeholder home page in the design style: dark background, "sn.me" logo with an accent dot, the line "Backend-minded full-stack developer." in Space Grotesk, a small static terminal box in JetBrains Mono showing "❯ sebastian --status" → "building… launching Nov 19, 2026", and the text "hello@sebastiannino.me". Responsive at 375px and 1440px.
6. Base metadata in layout.tsx (title, description from context/02), lang="en".
7. Vitest: a sample unit test (e.g., a tiny util in src/lib). Playwright: one smoke test that the home page loads and shows the headline. Do not download browsers if they are already installed; tell me the command if I need to run it.
8. GitHub Actions workflow .github/workflows/ci.yml: on push and pull_request to main, install with pnpm and run lint, typecheck, unit tests and build (E2E can be a separate optional job).
9. Exclude context/, design/, docs/ and prompts/ from ESLint, the TypeScript build and the Next.js build. Keep them in the repo.
10. .gitignore that covers .env*.local, node_modules, .next, test reports. Add a short .env.example (empty for now).
11. Update CLAUDE.md "Commands" with the real commands. Write a first README.md (project name, stack, scripts, "work in progress").
12. Mark F0-01 and F0-02 as done in context/09-backlog.md, add any new decision to context/10, and add an entry to context/13-bitacora.md.
13. Initialize git on branch main and make the first commit(s) with conventional messages. Do NOT push and do NOT create the GitHub repo; I will do that.

## Constraints
- PowerShell-compatible commands only.
- Do not add dependencies beyond the stack in CLAUDE.md without asking.
- No real client data anywhere.

## Acceptance criteria
- [ ] pnpm lint, pnpm typecheck, pnpm test and pnpm build all pass
- [ ] pnpm dev shows the placeholder at http://localhost:3000 matching the design tokens
- [ ] Playwright smoke test passes (or you tell me the one command I must run to install browsers)
- [ ] ci.yml present and valid
- [ ] Planning folders untouched and excluded from the build
- [ ] Git initialized on main with clean conventional commits, nothing pushed

## When done
Reply with the REPORT format from CLAUDE.md. In "Open issues / TODO for Sebastián", include the exact commands to create the public GitHub repo sebashooo/sebastiannino.me and push (both with the gh CLI and with the website), and the steps to import it in Vercel.
```
