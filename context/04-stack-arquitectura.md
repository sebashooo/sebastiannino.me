# 04 · Stack y arquitectura

## Decisión de stack (y por qué)
| Capa | Elección | Por qué |
|---|---|---|
| Framework | **Next.js 16 (App Router) + TypeScript** | Ya lo domina (Managerapp), así que publica en 7 días; además el portafolio demuestra el mismo stack del CV. La terminal interactiva necesita React. Astro sería más liviano para un sitio de contenido, pero la curva de aprendizaje y la coherencia con el CV pesan más aquí. |
| Estilos | **Tailwind CSS v4** (tokens en `@theme`) | Ya lo usa; los tokens de `03-diseno.md` van directo a CSS variables. |
| Contenido | **MDX** para casos de estudio (+ archivos de datos TS para proyectos, experiencia y certificaciones) | Escribir casos en Markdown con componentes (diagramas, galerías). **Nuevo para aprender.** |
| Animación | **Motion** (`motion/react`) | Fade-ups sutiles y el tipeo de la terminal. **Nuevo para aprender.** |
| Diagramas | Componente propio en SVG/JSX o Mermaid prerenderizado | Diagramas de arquitectura en los casos de estudio. Claude Code escoge el más liviano y lo justifica. |
| Fuentes | `next/font` (Space Grotesk, Inter, JetBrains Mono) | Self-hosted, sin layout shift. |
| Imágenes/video | `next/image`; videos MP4/WebM en `/public` con poster | Rendimiento. |
| Calidad | ESLint + Prettier + TypeScript strict; **Vitest** para la lógica de la terminal (parser de comandos); **Playwright** para un smoke test E2E | Coherente con su CV (Vitest, CI). |
| CI/CD | **GitHub Actions** (lint + typecheck + test + build) en cada PR · **Vercel** despliega `main` | Igual que Managerapp. |
| Analítica | Vercel Analytics (free) | Saber si los reclutadores visitan el sitio. |
| Hosting | **Vercel (Hobby, free)** | Integración nativa con Next.js. |
| Dominio | **sebastiannino.me** en Namecheap (Student Pack, 1 año gratis) → DNS apuntando a Vercel | Ver abajo. |

> Regla: Claude Code debe **verificar las versiones actuales** (Next.js, Tailwind, Motion, MDX) al iniciar y usar las APIs vigentes. Si algo de este archivo quedó desactualizado, que lo diga y proponga el cambio.

## Estructura de carpetas (objetivo)
```
sebastiannino-me/
├─ CLAUDE.md                  # Memoria del proyecto para Claude Code
├─ context/                   # Estos documentos (no se despliegan)
├─ design/                    # Mockup de referencia
├─ docs/                      # Guías (MongoDB, etc.)
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx           # Fuentes, metadata, nav, footer
│  │  ├─ page.tsx             # Home (one-page)
│  │  ├─ work/[slug]/page.tsx # Casos de estudio (MDX)
│  │  ├─ not-found.tsx        # 404 tipo terminal
│  │  ├─ opengraph-image.tsx  # OG dinámica
│  │  ├─ sitemap.ts · robots.ts
│  │  └─ globals.css          # Tokens Tailwind v4 (@theme)
│  ├─ components/             # Nav, Hero, TerminalWidget, ProjectCard, Timeline, CertCard, ...
│  ├─ content/work/*.mdx      # managerapp.mdx, tu-conjunto.mdx
│  ├─ data/                   # profile.ts, projects.ts, experience.ts, certifications.ts
│  └─ lib/terminal/           # commands.ts (parser puro + tests)
├─ public/                    # resume.pdf, media/ (capturas y videos demo), favicon
├─ tests/                     # e2e (Playwright)
└─ .github/workflows/ci.yml
```
**Principio de arquitectura:** el **contenido vive en datos** (`src/data`, `src/content`) y los componentes solo lo presentan. Así, actualizar una certificación o agregar un proyecto es editar un archivo, no tocar la UI. Además, la terminal lee de los mismos datos (una sola fuente de verdad).

## Renderizado
- Todo el sitio es **estático (SSG)**: carga instantánea y costo cero.
- Solo el `TerminalWidget` y el botón de copiar correo son Client Components. El resto son Server Components.

## Repositorio
- Repo **público** en GitHub: `sebashooo/sebastiannino.me`. Es el único repo público que muestra su código; debe quedar impecable (README con captura, stack, scripts y decisiones).
- Rama `main` protegida por CI; commits convencionales en inglés (`feat:`, `fix:`, `docs:`...).
- **Nunca** subir secretos; `.env.local` en `.gitignore`.
- Entorno: **Windows + Claude Code en la terminal**. Comandos compatibles con PowerShell; usar `npm` (ver D-17: el antivirus bloquea el store de pnpm en esta máquina).

## Dominio (Namecheap → Vercel) — tarea de Sebastián con guía
1. Vercel → Project → Settings → Domains → agregar `sebastiannino.me` y `www.sebastiannino.me` (redirigir `www` → apex).
2. Namecheap → Domain List → Manage → **Advanced DNS**: crear los registros que muestre Vercel (normalmente un registro **A** para `@` y un **CNAME** para `www`). Usar los valores exactos que indique Vercel en ese momento.
3. Esperar la propagación (minutos a horas). Vercel emite el SSL automáticamente (el SSL del Student Pack no hace falta).
4. **Ojo:** la renovación del .me después del primer año es paga. Poner un recordatorio para noviembre de 2027.

## Correo hello@sebastiannino.me
- **Recibir (gratis):** Namecheap → Domain → **Redirect Email / Email Forwarding**: `hello` → su Gmail personal. Esto requiere usar los DNS de Namecheap (BasicDNS), que es compatible con apuntar los registros A/CNAME a Vercel.
- **Enviar como hello@ (opcional):** necesita un servidor SMTP. Opciones a investigar en el momento: Gmail "Send mail as" con un SMTP de terceros, Zoho Mail (plan gratis, si sigue disponible) o Namecheap Private Email (pago). Claude Chat investiga la opción vigente y gratuita antes de recomendar.
- Configurar **SPF/DKIM/DMARC** según el proveedor que se escoja para que los correos no lleguen a spam.

## Rendimiento y calidad (metas)
- Lighthouse ≥ 95 en todo (móvil). JS del cliente mínimo.
- CI en verde obligatorio antes de hacer merge.

## Notas de la Fase 0 (2026-11-12)
Cambios frente a lo planeado en este archivo, verificados al hacer el scaffold (ver D-14 y D-17 en `10`):
- **Gestor de paquetes:** npm en vez de pnpm (D-17). El CI usa `npm ci`.
- **Tailwind v4 en Next 16.4:** se integra con `@tailwindcss/turbopack` (loader declarado en `next.config.ts`), no con PostCSS.
- **Versiones:** Next.js 16.4.6, React 19.3.1, Tailwind 4.3.5, ESLint 9 y TypeScript 5 (existen ESLint 10 y TS 7, pero no son los que usa el template de Next 16.4), Vitest 5.1, Playwright 1.65.
- **Estructura:** además de lo previsto, existen `tests/e2e/`, `src/lib/site.ts` (constantes del sitio) y la carpeta `prompts/` (material de planeación, excluido igual que `context/`, `design/` y `docs/`).
