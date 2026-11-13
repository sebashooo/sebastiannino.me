# 05 · Plan por fases (lanzamiento en 7 días)

**Inicio:** jueves 12 nov 2026 · **Lanzamiento:** jueves 19 nov 2026 en sebastiannino.me
Cada fase termina con: build en verde, deploy de preview en Vercel y un reporte de Claude Code que Sebastián le pega a Claude Chat.

Leyenda: 🤖 = Claude Code · 🧑 = Sebastián · 💬 = Claude Chat

---

## Fase 0 · Setup y cimientos — Día 1 (jue 12)
**Meta:** repo vivo, desplegado y con dominio en camino.
- 🤖 Leer `context/` y `design/`, verificar versiones actuales y crear el proyecto Next.js 16 + TS + Tailwind v4 + ESLint/Prettier en la carpeta de trabajo.
- 🤖 Crear/actualizar `CLAUDE.md` con reglas, comandos y la estructura.
- 🤖 Página placeholder con los tokens de color y fuentes ya configurados.
- 🤖 GitHub Actions (lint, typecheck, test, build) + Vitest y Playwright configurados con un test de ejemplo.
- 🧑 Crear el repo público `sebashooo/sebastiannino.me`, hacer push, importar en Vercel, agregar el dominio y configurar el DNS en Namecheap (guía en `04`).
- 🧑 Configurar el reenvío de `hello@sebastiannino.me` → Gmail.
- 💬 Explicar: App Router, Server vs Client Components, cómo funciona el pipeline de CI/CD.
**Hecho cuando:** `sebastiannino.me` (o el preview de Vercel) muestra el placeholder con estilos, y el CI está en verde.

## Fase 1 · Sistema de diseño y layout — Día 2 (vie 13)
- 🤖 Tokens de `03-diseno.md` en `globals.css` (`@theme`), fuentes con `next/font`.
- 🤖 Componentes base: Nav (con blur en scroll), Footer, Button, SectionHeader, Container, el link "Skip to content".
- 🤖 Archivos de datos tipados en `src/data/` (profile, projects, experience, certifications) con el contenido de `01`.
- 💬 Explicar: design tokens, por qué el contenido vive en datos.
**Hecho cuando:** el layout es responsive (375 → 1440) y el contraste es AA.

## Fase 2 · Home completa — Día 3 (sáb 14)
- 🤖 Hero (sin interactividad todavía; terminal estática), Selected work, Other projects, About + skills, Experience timeline, Certifications, Contact (copiar correo + mailto).
- 🤖 Fade-ups con Motion respetando reduced-motion.
- 🧑 Entregar capturas y clips **con datos demo** (checklist en `02`); mientras tanto se usan placeholders.
**Hecho cuando:** la home tiene todo el contenido real y se ve como el mockup.

## Fase 3 · Casos de estudio — Días 4–5 (dom 15 – lun 16)
- 🤖 Configurar MDX + layout de caso de estudio (TOC, metadatos, navegación anterior/siguiente).
- 💬 Redactar el **borrador en inglés** de cada caso (plantilla de `02`) a partir de `01`. 🧑 lo revisa y corrige los datos.
- 🤖 Implementar `managerapp.mdx` y `tu-conjunto.mdx` con diagramas de arquitectura y galerías.
- 🤖 Componente ArchitectureDiagram.
- 💬 Explicar: cómo contar en una entrevista la historia del bypass de RLS (formato STAR).
**Hecho cuando:** los dos casos están publicados en el preview, sin datos reales.

## Fase 4 · Terminal interactiva, SEO y pulido — Día 6 (mar 17)
- 🤖 `TerminalWidget` interactivo: parser puro en `lib/terminal` **con tests en Vitest**, historial, autocompletado, `aria-live`, SSR del contenido por defecto.
- 🤖 404 tipo terminal.
- 🤖 SEO: metadata, OG image dinámica, JSON-LD Person, sitemap, robots, favicon.
- 🤖 Vercel Analytics.
- 🤖 Smoke test E2E con Playwright (home carga, terminal responde a `help`, links principales).
- 🧑 Entregar `resume.pdf` público (en inglés, sin teléfono) → `/public`.
**Hecho cuando:** Lighthouse móvil ≥ 95 en las 4 categorías y todos los tests pasan.

## Fase 5 · QA y lanzamiento — Día 7 (mié 18 – jue 19)
- 🤖 Pasada de QA: links, responsive, teclado, contraste, peso de imágenes y una revisión de privacidad (buscar nombres reales y datos sensibles en el contenido y las imágenes).
- 🤖 README del repo con captura, stack, decisiones y scripts.
- 🧑 Confirmar el dominio con HTTPS, que `www` redirige y que el correo recibe mensajes de prueba.
- 🧑 **LinkedIn día de lanzamiento:** aplicar los cambios de `06` y publicar un post anunciando el portafolio.
- 💬 Checklist final y un mini resumen de todo lo que se aprendió (sirve para entrevistas).
**Hecho cuando:** `https://sebastiannino.me` está en vivo. 🚀

---

## Fase 6 · Post-lanzamiento (semanas 2–6, a ritmo propio)
1. **LinkedIn completo** (`06`): Featured, experiencia reescrita, skills, "Open to work" para reclutadores.
2. **README del perfil de GitHub** (`sebashooo/sebashooo`) + pinned repos.
3. **Certificaciones:** presentar el examen AWS CLF-C02 → GitHub Foundations (si hay voucher) → ruta MongoDB Associate Developer (guía en `docs/`). Actualizar `certifications.ts` con cada logro.
4. **Proyecto público pequeño de backend/data** (para tener código visible): por ejemplo, una API en NestJS + MongoDB Atlas (M0) o un pipeline de datos en AWS Free Tier, con tests y CI. Se agrega a "Other projects".
5. **Blog técnico:** 1 post cada 2 semanas (ideas: "How a database role silently bypassed my RLS", "Testing tenant isolation with hundreds of E2E tests", "What I learned studying for AWS Cloud Practitioner").
6. Versión en español (opcional), un formulario de contacto (opcional) y `cv.sebastiannino.me` (opcional).
7. Correo: configurar el envío como hello@ con SPF/DKIM.
