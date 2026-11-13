# 09 · Backlog (tickets por fase)

Cada ticket es una unidad de trabajo para **un** prompt de Claude Code (o una tarea de Sebastián).
Estado: `[ ]` pendiente · `[~]` en curso · `[x]` hecho. **Claude Code marca el estado al terminar un ticket.**
Prioridad: **P1** = necesario para lanzar el día 7 · **P2** = deseable antes de lanzar · **P3** = post-lanzamiento.

## Fase 0 · Setup (Día 1)
- [x] **F0-01 (P1) 🤖 Scaffold del proyecto.** Next.js 16 + TS strict + Tailwind v4 + ESLint/Prettier, tokens y fuentes, placeholder. *AC: build/lint/typecheck en verde; placeholder con estilos.*
- [x] **F0-02 (P1) 🤖 Testing y CI.** Vitest + Playwright (smoke) + `.github/workflows/ci.yml`. *AC: CI en verde en el primer push.* (workflow creado; su primera corrida en verde ocurre después del push, pendiente de confirmar)
- [ ] **F0-03 (P1) 🧑 Repo y Vercel.** Repo público `sebashooo/sebastiannino.me`, push, import en Vercel. *AC: URL de preview funcionando.*
- [ ] **F0-04 (P1) 🧑 Dominio.** DNS de Namecheap → Vercel, `www` → apex. *AC: https://sebastiannino.me muestra el placeholder.*
- [ ] **F0-06 (P1) 🧑 Conectar el repo al proyecto de Claude.** Conocimiento del proyecto → "+" → GitHub → `sebashooo/sebastiannino.me` → seleccionar la carpeta `context/` y `design/`. Luego borrar del proyecto las copias subidas a mano de esos archivos (para no tener duplicados). *AC: el conocimiento muestra los archivos desde GitHub y "Sync now" funciona.*
- [ ] **F0-05 (P1) 🧑 Correo.** Reenvío hello@ → Gmail. *AC: llega un correo de prueba.*

## Fase 1 · Diseño y layout (Día 2)
- [x] **F1-01 (P1) 🤖 Componentes base.** Container, Button, SectionHeader, Nav (blur en scroll, menú móvil), Footer, skip link. *AC: AA, foco visible, 375–1440 px.*
- [x] **F1-02 (P1) 🤖 Capa de datos.** `src/data/*` con los tipos de `11-modelo-de-contenido.md` y el contenido real de `01`. *AC: tipos estrictos, sin `any`; test de que los datos cumplen el schema.*

## Fase 2 · Home (Día 3)
- [x] **F2-01 (P1) 🤖 Hero** con TerminalWidget en modo estático (renderizado en servidor).
- [x] **F2-02 (P1) 🤖 Selected work** (ProjectCard con media/placeholder) + Other projects.
- [x] **F2-03 (P1) 🤖 About + skills agrupados.**
- [x] **F2-04 (P1) 🤖 Experience timeline + Certifications** (los chips de estado leen de los datos).
- [x] **F2-05 (P1) 🤖 Contact/footer** (copiar correo + mailto).
- [x] **F2-06 (P2) 🤖 Animaciones con Motion** (fade-up, reduced-motion).
- [~] **F2-07 (P1) 🧑 Media demo.** *Partial 2026-11-12: the two card covers are done (D-44); clips, posters and galleries pending.* Capturas y clips con datos ficticios → `public/media/` (checklist en `02`). *Note: carried over from Phase 2; needed by F3-05 (galleries) and F5-01 (privacy audit).*

## Fase 3 · Casos de estudio (Días 4–5)
- [x] **F3-01 (P1) 🤖 Infraestructura MDX** + layout del caso (TOC, metadata, anterior/siguiente) + `generateStaticParams`. *Done 2026-11-12 (D-39 to D-43). Placeholder MDX for both slugs, both `draft: true`.*
- [ ] **F3-02 (P1) 🤖 ArchitectureDiagram** (SVG/JSX con los tokens).
- [ ] **F3-03 (P1) 💬→🧑 Borrador del caso Managerapp** (Claude Chat redacta y Sebastián corrige los datos).
- [ ] **F3-04 (P1) 💬→🧑 Borrador del caso Tu Conjunto.**
- [ ] **F3-05 (P1) 🤖 Implementar los dos MDX** con diagramas y galerías. *Captions required (D-44): "Screenshot · demo data" (managerapp) and "Architecture overview · illustration" (tu-conjunto).*

## Fase 4 · Interactividad, SEO, calidad (Día 6)
- [ ] **F4-01 (P1) 🤖 Parser de comandos** puro en `lib/terminal` con tests en Vitest (todos los comandos + desconocido + vacío).
- [ ] **F4-02 (P1) 🤖 TerminalWidget interactivo** (historial ↑/↓, Tab, `aria-live`, reduced-motion).
- [ ] **F4-03 (P1) 🤖 SEO:** metadata, OG dinámica, JSON-LD Person, sitemap, robots, favicon. *Note: bring the favicon forward: /favicon.ico returns 404 and costs Best Practices.*
- [ ] **F4-04 (P2) 🤖 404 tipo terminal.**
- [ ] **F4-05 (P2) 🤖 Vercel Analytics.**
- [ ] **F4-06 (P1) 🤖 E2E:** home, `help` en la terminal, navegación a los casos, descarga del CV.
- [ ] **F4-07 (P1) 🧑 CV público** en inglés, compatible con ATS (H2), sin teléfono → `public/resume.pdf`.
- [ ] **F4-08 (P1) 🤖 Performance pass:** Lighthouse mobile >= 95 on the Vercel preview. Investigate TBT (framework chunk, render-blocking CSS, `Reveal` and nav client code) and re-measure after F2-07 media lands.

## Fase 5 · QA y lanzamiento (Día 7)
- [ ] **F5-01 (P1) 🤖 QA completo** según `12-estrategia-pruebas.md` (incluye la auditoría de privacidad). Also: no "coming soon" placeholders left on the home at launch. Verify the Tu Conjunto diagram claims and its alt text against the real backend (Q-07) before launch. Set `draft: false` on both case studies in `src/data/case-studies.ts` and verify they are indexable (no noindex robots meta, present in the sitemap once F4-03 exists).
- [ ] **F5-02 (P1) 🤖 README del repo** (captura, stack, decisiones, scripts).
- [ ] **F5-03 (P1) 🧑 Verificación en producción:** HTTPS, redirección de `www`, correo, móvil real.
- [ ] **F5-04 (P1) 🧑 LinkedIn: básicos + post de lanzamiento** (`06`).

## Fase 6 · Post-lanzamiento (P3)
- [ ] **F6-01 🧑 LinkedIn completo** (Featured, experiencia, skills, Open to work, 2–3 recomendaciones — H11).
- [ ] **F6-02 🤖 README del perfil de GitHub** + banner de LinkedIn.
- [ ] **F6-03 🧑 Examen AWS CLF-C02** → actualizar `certifications.ts`.
- [ ] **F6-04 🧑 GitHub Foundations** (si hay voucher vigente).
- [ ] **F6-05 🧑 Ruta MongoDB Associate Developer** (guía en `docs/`; activar el beneficio ANTES de empezar).
- [ ] **F6-06 🤖 Proyecto público de backend** con tests, CI y Swagger en vivo (H4, H7).
- [ ] **F6-07 🤖 Blog con MDX** + primer post ("How a database role silently bypassed my RLS").
- [ ] **F6-08 🧑 Envío como hello@** (SMTP + SPF/DKIM/DMARC).
- [ ] **F6-09 (opcional)** Versión en español · formulario de contacto (requiere aviso de privacidad, ver `10`) · 1–2 PRs a open source (H12).
- [ ] **F6-10 (P3) 🤖 Case-study scroll-spy:** highlight the current section in the table of contents while scrolling (needs a small client component; skipped in F3-01 to keep zero client JS, D-42).
