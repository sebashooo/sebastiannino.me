# 13 · Bitácora de desarrollo

> Entries before 2026-11-12 are in Spanish; newer ones are in English.

Historial corto de lo que pasó en cada sesión. **Claude Code agrega una entrada al terminar cada ticket** (las más recientes arriba).
Sebastián vuelve a subir este archivo (y `09`, `10`) al proyecto de Claude **al final de cada fase**, para que Claude Chat tenga el estado actualizado.

## Formato de entrada
```
### YYYY-MM-DD · <Ticket IDs> · <título corto>
- Hecho: <1–3 líneas>
- Decisiones: <D-xx nuevas o "ninguna">
- Checks: lint ✅ typecheck ✅ test ✅ (n) build ✅ e2e ✅/—
- Pendiente/bloqueos: <o "ninguno">
```

---

### 2026-11-12 · Housekeeping · Close Phase 2
- Done: `context/01` records that Sebastián confirmed on 2026-11-12 his Managerapp role is "Founder & Full-Stack Developer" (his own product, in use in his business); `src/data/projects.ts` already uses exactly that role, so no code changed. `context/09`: added F4-08 (performance pass, Lighthouse mobile >= 95 on the Vercel preview), a favicon note on F4-03 and a carried-over note on F2-07. Pushed 8f9a285 and this commit.
- Decisions: none.
- Checks: lint ✅ typecheck ✅ test ✅ (47) build ✅ (docs-only change; last full e2e run: 82 ✅).
- Where to resume: Phase 2 code is done (F2-01 to F2-06). Still open: F2-07 (Sebastián: demo screenshots and clips with fictional data into `public/media/`), F0-03 to F0-06 (Sebastián: Vercel import, domain, email forwarding, Claude project link). Next code ticket: F3-01 (MDX infrastructure and `/work/[slug]` pages; the case-study links on the home return 404 until then). Also pending: favicon (F4-03), performance pass (F4-08), `/resume.pdf` (F4-07), Dependabot `minimatch` PR failing, tagline/About tone review. Local state: `main` is in sync with `origin/main` after the push; node_modules installed with npm; run `npm install` if missing, then `npm run dev`.

### 2026-11-12 · F2-06 · Scroll fade-ups with Motion + Lighthouse measurement
- Done: `Reveal` (client wrapper using `motion/mini`) around the five below-the-fold sections; Hero untouched. SSR HTML stays fully visible; hidden start state only on the client for blocks below the viewport; none under reduced motion. Added the `motion` package (14.13.0). Pushed 72eff7e, 6d474fd and 5b59e55 first (CI for 5b59e55 was running when last checked).
- Client JS (home): 582.6 → 591.5 kB raw, 180.6 → 183.7 kB gzip (+3.1 kB gzip, target was about +8).
- Lighthouse (mobile, simulated throttling, production build served locally, Lighthouse 13.6.0, 3 runs): Performance 87 / 80 / 83, Accessibility 96 → 100 after the contrast fix (D-38), Best Practices 96, SEO 100. LCP 0.8 s, CLS 0, TBT 530–840 ms (the weak spot; the Performance target is 95). Findings: (1) `/favicon.ico` 404 logged as a console error (Best Practices); (2) TBT is dominated by the React/Next framework chunk (about 70 kB gzip, roughly 500 ms scripting under 4x CPU throttling, 30 KiB reported unused and 14 KiB legacy JS inside it); (3) render-blocking CSS (about 160 ms). Placeholders and the missing /resume.pdf do not affect these numbers. Local numbers are indicative; re-measure on the Vercel preview.
- Suggested tickets (not created): favicon and icons (bring F4-03's favicon forward, fixes the console error); investigate TBT/Performance on the Vercel preview (framework chunk, inline critical CSS, check whether `Reveal` or the client nav components matter); re-run Lighthouse after F2-07 media lands.
- Decisions: D-37 (Motion setup and the no-JS visibility rule), D-38 (terminal bar contrast).
- Checks: lint ✅ typecheck ✅ test ✅ (47) build ✅ e2e ✅ (82). Screenshots at 375px and 1440px checked after scrolling the whole page (0 blocks left hidden).
- Pending/blockers: Performance below 95 until the TBT investigation; favicon missing.

### 2026-11-12 · F2-05 · Contact section and copy-email button (+ bullet correction)
- Done: Part A (72eff7e): experience bullets aligned with `context/01`. `ContactSection` with the mailto link, `CopyEmailButton` (clipboard with fallback and live region), profile links and a contact line built from the data; footer slimmed to a copyright line; nav "Get in touch" now lands on `#contact`. Pushed 762716d (F2-04); its CI finished green.
- Client JS (home): baseline 581.5 kB raw / 180.1 kB gzip (8 scripts); after 582.6 kB raw / 180.6 kB gzip, so the copy button added about +1.1 kB raw / +0.5 kB gzip. Still minimal (D-11).
- Decisions: D-34 (bullets), D-35 (Contact replaces footer content), D-36 (clipboard fallback, nav CTA to #contact).
- Checks: lint ✅ typecheck ✅ test ✅ (47) build ✅ e2e ✅ (70). Screenshots at 375px and 1440px checked.
- Pending/blockers: none for this ticket.

### 2026-11-12 · F2-04 · Experience timeline and Certifications
- Done: `ExperienceSection` (`<ol>` timeline with a 1px line, entries and bullets from `getExperience()`, accent dot and a hidden "Current role." label only on the current work entry) and `CertificationsSection` with `CertCard`s from `getCertifications()` (name, issuer, text status chip, optional factual note). Order on the home: Hero, Selected work, About, Experience, Certifications. New `src/lib/cert-status.ts` with 11 unit tests (every status covered, AA contrast for all chip variants). Checked visually at 1440px and 375px.
- Housekeeping: pushed 670ef8f (F2-03); CI for 4c868a4 was green (51s).
- Proof: temporarily marking GitHub Foundations as `certified` made 2 unit tests and 2 e2e tests fail; reverted.
- Content review: bullets match `context/01`. One small embellishment to review: "escalated incidents to the right teams" (the source only says incident escalation). Not edited.
- Decisions: D-32 (current role = current work entry; the data has two `current: true`), D-33 (certification status map and chips).
- Checks: lint ✅ typecheck ✅ test ✅ (44) build ✅ e2e ✅ (53).
- Pending/blockers: none for this ticket.

### 2026-11-12 · F2-03 · About and grouped skills
- Done: `AboutSection` after Selected work (Hero → Selected work → About): paragraphs from `getProfile().about` on the left, "Skills" with the 7 groups from `getSkillGroups()` as chips on the right; stacked on mobile. The nav "About" link (desktop and mobile menu) lands on `#about`. Checked visually at 1440px and 375px.
- Housekeeping: committed the 5 renormalized files as `chore: normalize line endings` (4c868a4; `git diff --ignore-cr-at-eol` showed zero content changes) and pushed 1ed65f1, d71ea23 and 4c868a4.
- Content review: every skill matches `context/01` (Java and C++ are marked academic, AWS is "fundamentals"); nothing overstated. The About text is short next to the skills column, so the left side has empty space on desktop; left as is (content is not edited here).
- Decisions: D-31 (About structure).
- Checks: lint ✅ typecheck ✅ test ✅ (33) build ✅ e2e ✅ (40).
- Pending/blockers: none for this ticket.

### 2026-11-12 · F2-02 · Selected work and Other projects
- Done: `WorkSection` replaces the temporary block (keeps `id="work"`): two featured `ProjectCard`s from `getFeaturedProjects()` and a compact `OtherProjects` list from `getOtherProjects()`, with `ProjectMedia` (image / video / labeled placeholder) and `StackChips`. Every card shows name, role · period, one-liner, stack chips, the private note and a "Read case study" link; no repo links on featured cards, and a repo link in Other projects only for the public portfolio repo. Checked visually at 1440px and 375px.
- Housekeeping: pushed 066c07f and b65e618 (CI for b65e618: green, 1m). Added `.gitattributes` (1ed65f1).
- Decisions: D-28 (stretched card link, ring around the card), D-29 (placeholder rule), D-30 (`.gitattributes`, renormalize left uncommitted).
- Checks: lint ✅ typecheck ✅ test ✅ (33) build ✅ e2e ✅ (32).
- Pending/blockers: `/work/managerapp` and `/work/tu-conjunto` do not exist until F3-01, so the case-study links lead to 404 for now (no stub pages were created). Demo media is still missing (F2-07). Added to F5-01: no "coming soon" placeholders on the home at launch.

### 2026-11-12 · F2-01 · Hero with static terminal
- Done: `Hero` (availability label, the only H1, tagline, CTAs "See my work" and "Download résumé") and a static `TerminalWidget` showing `sebastian --stack`, both Server Components reading `@/data`. The output builder is a pure function in `src/lib/terminal/static-output.ts` with 7 Vitest tests. Home has a temporary `#work` section ("Coming soon") so the CTA scrolls somewhere valid; F2-02 replaces it. The old "Portfolio launching" line was removed from the home. Layout: two columns on desktop, terminal below the CTAs on mobile. Checked visually at 1440px and 375px.
- Decisions: D-26 (static builder and widget), D-27 (file links as plain anchors; no outline-color transition).
- Checks: lint ✅ typecheck ✅ test ✅ (30) build ✅ e2e ✅ (20). CI on aa3b468 (F1-02): ✅ green (59s). Housekeeping commit 066c07f and this ticket are local, not pushed.
- Pending/blockers: `/resume.pdf` does not exist yet (F4-07), so "Download résumé" is a dead link until then. The tagline and About tone are waiting for Sebastián's review now that they render.

### 2026-11-12 · Housekeeping · MongoDB in progress, docs in English
- Done: MongoDB Associate Developer is `in-progress` everywhere (`src/data` already had it; `context/01` now says so). `CLAUDE.md` now says `context/09`, `10` and `13` are written in English. Added a language note at the top of `context/10` and `13`. Old Spanish entries untouched.
- Decisions: D-24 (MongoDB in progress, amends D-23), D-25 (docs in English).
- Checks: lint ✅ typecheck ✅ test ✅ build ✅ (see the report for counts)
- Pending/blockers: none. Not pushed.

### 2026-11-12 · F1-02 · Capa de datos tipada
- Hecho: `src/data` con `types.ts`, `profile.ts`, `skills.ts`, `projects.ts` (Managerapp y Tu Conjunto destacados, sin links a repos; Parking y este portafolio en "Other projects"), `experience.ts`, `certifications.ts` e `index.ts` con getters (`getFeaturedProjects`, `getOtherProjects`, `getCertifications`…). Correo, ubicación y redes se definen una vez en `src/lib/site.ts`. Una regla de ESLint impide importar los archivos crudos desde fuera de `src/data`. 16 tests nuevos validan el contenido (slugs únicos, `featured` con `caseStudy`, certificaciones sin `certified` sin credencial, solo repos permitidos, único correo permitido, sin teléfonos). Se comprobó que fallan al romper las reglas y que vuelven a pasar al revertir.
- Decisiones: D-21 (ajustes a los tipos), D-22 (getters + ESLint + sin zod), D-23 (estados de certificaciones; ver nota sobre MongoDB).
- Checks: lint ✅ typecheck ✅ test ✅ (23) build ✅ e2e ✅ (11). Sin push (a petición de Sebastián).
- Pendiente/bloqueos: confirmar si la ruta de MongoDB ya empezó (si no, cambiar a `planned`, D-23). El último run de CI en `main` pasó en verde; hay un run fallido de Dependabot (`minimatch`) por revisar.

### 2026-11-12 · F1-01 · Componentes base y shell de layout
- Hecho: `src/components` con Container, Button (primary/secondary/pill, enlace o botón, alto mínimo 44 px), SectionHeader, Logo, SkipLink, Nav (blur y borde al hacer scroll) con MobileMenu (aria-expanded, Escape, teclado) y Footer placeholder (sin formulario). El layout ahora envuelve cada página en skip link → header → `<main id="main">` → footer. `src/lib/nav.ts` y `site.ts` concentran links, correo y redes. Plugin de Prettier para Tailwind instalado y repo formateado.
- Decisiones: D-18 (prettier-plugin-tailwindcss), D-19 (anchors `/#id`, correo único, variante `pill`, solo 2 Client Components), D-20 (menú móvil sin focus trap).
- Checks: lint ✅ typecheck ✅ test ✅ (7) build ✅ e2e ✅ (11). Contraste calculado: todo el texto usado ≥ 7,8:1 (muted sobre fondo 7,8; acento 13,7; texto sobre acento 13,7).
- Pendiente/bloqueos: los anchors `#work`, `#about`, `#experience` aún no existen en la home (llegan en la Fase 2); el link de LinkedIn usa la URL actual y debe actualizarse en `src/lib/site.ts` cuando se cambie a `/in/sebastiannino`.

### 2026-11-12 · F0-01, F0-02 · Scaffold, tokens, tests y CI
- Hecho: proyecto Next.js 16.4.6 + TS strict + Tailwind v4 creado en la raíz con tokens de `03` en `globals.css`, las 3 fuentes con `next/font` y una página placeholder (logo `sn.me`, H1, línea "launching Nov 19, 2026", foco visible). Vitest (2 tests), Playwright (5 tests: carga, sin scroll horizontal a 375/1440 px, foco, fuentes) y `ci.yml` con 2 jobs. README, `.env.example` y CLAUDE.md actualizados. `context/`, `design/`, `docs/`, `prompts/` excluidos de lint, typecheck y build.
- Incidente: el antivirus **360 Total Security** bloqueó la importación del store de pnpm (`Acceso denegado`, os error 5) en varios intentos, incluso con la carpeta del proyecto y la de pnpm en la lista blanca. Se cambió a **npm** (D-17), que instaló sin problemas. La lista blanca queda aplicada por si se quiere volver a pnpm.
- Decisiones: D-13 (REPORT con 8.º punto y push por ticket), D-14 (versiones), D-15 (Prettier sin plugin de Tailwind), D-16 (REPORT al final de cada mensaje que finalice algo), D-17 (npm en lugar de pnpm).
- Checks: lint ✅ typecheck ✅ test ✅ (2) build ✅ e2e ✅ (5)
- Pendiente/bloqueos: F0-02 queda marcado `[x]` porque el workflow existe, pero su primera corrida en verde ocurre tras el primer push (F0-03). `npm audit` reporta 0 vulnerabilidades en producción y 7 moderadas solo en dependencias de desarrollo. ESLint 9 muestra aviso de "sin soporte": evaluar ESLint 10 cuando `eslint-config-next` lo soporte oficialmente.

### 2026-11-12 · Planeación · Proyecto creado
- Hecho: se definieron el dominio, el correo, el diseño C, el stack y el plan de 7 días. Se creó la carpeta de trabajo con el contexto, el diseño de referencia, la guía de MongoDB y los prompts iniciales.
- Decisiones: D-01 a D-12.
- Checks: —
- Pendiente/bloqueos: ejecutar F0-01 (prompt `prompts/01-fase0-claude-code.md`).
