# CLAUDE.md — sebastiannino.me

Personal portfolio of Sebastián Niño, a backend-minded full-stack developer. Goal: land a junior full-stack/backend/data/cloud role. Launch deadline: **Nov 19, 2026**.

## Read first

- `context/01-perfil-profesional.md`: the only source of truth for facts (never invent metrics, clients or certifications)
- `context/02-brief-portafolio.md`: site map, sections, copy
- `context/03-diseno.md` + `design/design-C-minimal-dark-terminal.html`: design system ("Minimal dark + terminal"). The HTML is a **reference mockup**; rebuild it as components, do not copy it into the app.
- `context/04-stack-arquitectura.md`: stack, folder structure, deploy
- `context/05-plan-fases.md`: the phase you are working on
- `context/09-backlog.md`: tickets (F0-01…) with acceptance criteria. Prompts reference ticket IDs.
- `context/10-decisiones-y-pendientes.md`: scope, decisions (D-xx), privacy rules
- `context/11-modelo-de-contenido.md`: TypeScript content model for `src/data`
- `context/12-estrategia-pruebas.md`: testing strategy, privacy audit, launch checklist
- `context/08` (recruiter research), `00`, `06`, `07`: context for the human/Claude Chat side (read `07` for the prompt/report contract)

## Keep the project memory updated (every task)

1. Mark finished tickets `[x]` in `context/09-backlog.md`.
2. Add any new decision as a D-xx row in `context/10-decisiones-y-pendientes.md` (never delete old ones; mark them "Superseded by D-yy").
3. Add an entry at the top of `context/13-bitacora.md` using its format.
   Write context/09, 10 and 13 in English; code, commits and site content also stay in English.

## Stack

Next.js 16 (App Router) · TypeScript strict · Tailwind CSS v4 (`@theme` tokens) · MDX · Motion · next/font · Vitest · Playwright · GitHub Actions · Vercel. Verify current versions and APIs before using them.

## Rules

- **Environment:** Windows. Use PowerShell-compatible commands. Package manager: **npm** (pnpm was the plan but its store import is blocked by the antivirus on this machine, see D-17; do not switch back without asking).
- **Content lives in data:** `src/data/*.ts` and `src/content/work/*.mdx`. Components only render it. The terminal reads from the same data.
- **Privacy:** Managerapp and Tu Conjunto a la Mano repos are private and the products hold real client data. Use **demo data only**. Never add real business names, people, emails, phone numbers, tax IDs, addresses or internal URLs. The public résumé has no phone number.
- **Honesty:** certification status must match `context/01` exactly (e.g., AWS = "In progress" until passed).
- **Server Components by default.** A component is a Client Component only if it needs interactivity (terminal, copy button).
- **Accessibility:** AA contrast, visible focus (2px accent outline), keyboard-usable terminal, `prefers-reduced-motion` respected, landmarks, and a skip link.
- **Performance:** static generation, minimal client JS, `next/image`, Lighthouse ≥ 95 on mobile.
- **Quality gate before every commit:** `npm run lint && npm run typecheck && npm test && npm run build` must pass.
- **Git:** conventional commits in English. Commit when a task is done; push to `origin` after each completed ticket once a remote exists; never force-push; never commit secrets (`.env*.local` ignored).
- **Out-of-repo folders:** `context/`, `design/`, `docs/` are planning material. Keep them in the repo but exclude them from the build and lint.
- Ask before adding a dependency that is not listed in the stack, and explain why it is needed.

## Commands

Package manager: npm (Node ≥ 22). The remote is `github.com/sebashooo/sebastiannino.me`.

- `npm run dev`: local server at http://localhost:3000
- `npm run build` · `npm start`: production build and server (`npm start` needs a prior build)
- `npm run lint`: ESLint (ignores `context/`, `design/`, `docs/`, `prompts/`)
- `npm run typecheck`: `tsc --noEmit`
- `npm test`: Vitest, unit tests in `src/**/*.test.ts`
- `npm run test:e2e`: Playwright smoke tests in `tests/e2e`; it builds and starts the app on port 3100 by itself. First time only: `npx playwright install chromium`
- `npm run format` · `npm run format:check`: Prettier (not part of the quality gate)

## Folder structure (current)

```
src/app/        layout.tsx (fonts, metadata) · page.tsx (placeholder home) · globals.css (@theme tokens)
src/components/ Container · Button · SectionHeader · Logo · SkipLink · Nav (+ NavShell, MobileMenu: the only client components) · Footer
                Hero · TerminalWidget · WorkSection · ProjectCard · ProjectMedia · OtherProjects · StackChips
src/data/       Typed content + getters (index.ts); import only from "@/data" (ESLint-enforced) · data.test.ts validates it
src/lib/terminal/ static-output.ts (pure builder for the terminal's stack output; reused by the interactive terminal)
src/lib/        site.ts (site constants, email, socials) · nav.ts (nav links) · *.test.ts (Vitest, next to the code)
tests/e2e/      Playwright specs
.github/workflows/ci.yml   job 1: lint+typecheck+test+build · job 2: Playwright
context/ design/ docs/ prompts/   planning material, excluded from lint, typecheck and build
```

Planned folders (`src/content`, `src/lib/terminal`) are in `context/04`; create them in the phase that needs them.

## REPORT format (end every task with this)

Always close with a REPORT, in English, ready to paste into Claude Chat (the chat that manages the project with Sebastián): at the end of every task **and** at the end of any message where something was finalized (a ticket, a fix, a config change, a doc update). If a message finalizes nothing, a short status line is enough. Never skip it, even for small changes.

```
REPORT — <phase/task>
1. Summary: what was built (2–4 lines)
2. Architecture: files/folders created or changed and how they connect
3. Decisions: key choices + alternatives rejected (and why)
4. Checks: lint / typecheck / test / build results (pass/fail, counts)
5. Screens/URLs: what to open to see it
6. Open issues / TODO for Sebastián
7. Suggested next step
8. Project state: tickets done and pending (IDs), new decisions (D-xx), and the latest entry from context/13-bitacora.md
```

Explain the architecture at the level of "what pieces exist and how they connect", not line-by-line code. Sebastián pastes this report into Claude Chat, which explains it to him in Spanish.
