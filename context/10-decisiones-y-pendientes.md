# 10 · Decisiones y pendientes

Registro de decisiones (estilo ADR liviano). **Nunca se borra una decisión:** si cambia, se marca como "Reemplazada por D-xx".
Claude Chat propone el texto de cada decisión nueva; Claude Code la agrega aquí cuando la implementa.

## Alcance
**Dentro:** portafolio en inglés en sebastiannino.me, 2 casos de estudio, terminal interactiva, SEO, correo hello@, LinkedIn y GitHub optimizados, guía de certificaciones.
**Fuera (por ahora):** blog con contenido (Fase 6), versión en español, formulario de contacto, CMS, panel de admin, autenticación, base de datos.

## Decisiones
| ID | Fecha | Decisión | Por qué | Alternativas descartadas |
|---|---|---|---|---|
| D-01 | 2026-11-12 | Dominio **sebastiannino.me** | Los reclutadores buscan por nombre; es memorable y no envejece | Algo como `sebasdev.me` o `snino.me` |
| D-02 | 2026-11-12 | Correo **hello@sebastiannino.me** | Profesional y sin repetir el nombre | `sebastian@`, `contact@` |
| D-03 | 2026-11-12 | Posicionamiento **"Backend-minded full-stack developer"** | El CV es más fuerte en backend y datos; deja abiertas data y cloud | "Frontend developer", un genérico "software developer" |
| D-04 | 2026-11-12 | Diseño **C · Minimal dark + terminal**, acento `#67e8f9` | Moderno y sobrio; la terminal es un guiño, no un disfraz | A (todo terminal) y B (estilo IDE) |
| D-05 | 2026-11-12 | **Next.js 16 + TS + Tailwind v4 + MDX + Motion** en Vercel | Lo domina, sale en 7 días y es coherente con el CV | Astro (más liviano, pero con curva de aprendizaje) |
| D-06 | 2026-11-12 | El sitio en **inglés** | El objetivo son roles remotos (EE. UU./LATAM) | Bilingüe desde el día 1 (más trabajo) |
| D-07 | 2026-11-12 | **Sin foto** en el sitio | Preferencia de Sebastián | — |
| D-08 | 2026-11-12 | Proyectos privados mostrados **solo con datos demo + diagramas**, sin links a los repos | Privacidad de clientes reales y de pilotos (H8) | Hacer públicos los repos |
| D-09 | 2026-11-12 | **Sin formulario de contacto** al lanzar; mailto + botón de copiar | Menos spam y cero backend; evita manejar datos personales | Formspree, Resend |
| D-10 | 2026-11-12 | Analítica con **Vercel Analytics** (sin cookies) | Gratis, sin banner de cookies | Google Analytics |
| D-11 | 2026-11-12 | Sitio **100% estático (SSG)**; solo la terminal y el botón de copiar son Client Components | Rendimiento y costo cero | SSR |
| D-12 | 2026-11-12 | El contenido vive en **`src/data` y MDX**; los componentes solo lo presentan | Actualizar es editar datos; la terminal usa la misma fuente | Texto escrito directamente en los componentes |
| D-13 | 2026-11-12 | **Flujo de Claude Code:** el REPORT tiene un 8.º punto ("Project state": tickets hechos/pendientes, decisiones nuevas y la última entrada de la bitácora); y Git cambia a: commit al terminar una tarea, **push a `origin` tras cada ticket completado** (cuando exista el remoto), nunca force-push, nunca commitear secretos | Sebastián recibe el estado del proyecto en cada reporte sin tener que pedirlo; el push por ticket mantiene GitHub y el CI al día | Seguir con "no hacer push salvo que se pida" (más fricción); push solo al final de cada fase |
| D-14 | 2026-11-12 | **Versiones verificadas al hacer el scaffold (F0-01):** Next.js 16.4.6, React 19.3.1, Tailwind 4.3.5 integrado con `@tailwindcss/turbopack` (no PostCSS), ESLint 9 y TypeScript 5, Vitest 5.1, Playwright 1.65, Prettier 3.10, npm 11, Node ≥ 22 | Son las versiones estables y las que `create-next-app 16.4.6` usa; ESLint 10 y TypeScript 7 ya existen pero no son el objetivo del template de Next 16.4 | Subir a ESLint 10 / TypeScript 7 ahora (riesgo de incompatibilidad con `eslint-config-next`); `@tailwindcss/postcss` |
| D-15 | 2026-11-12 | **Prettier sin plugin de Tailwind** por ahora y sin dependencias fuera del stack (solo las herramientas de calidad ya listadas) | Respeta la regla de no agregar dependencias no listadas; se puede añadir `prettier-plugin-tailwindcss` más adelante si Sebastián lo aprueba | Instalar el plugin desde ya |
| D-16 | 2026-11-12 | **Claude Code cierra siempre con un REPORT** listo para pegar en Claude Chat: al terminar cada tarea y también al final de cualquier mensaje donde se haya finalizado algo (ticket, fix, cambio de config o de docs) | Claude Chat lleva la gestión del proyecto y necesita el estado actualizado sin que Sebastián lo pida | Reporte solo al cerrar un ticket |
| D-17 | 2026-11-12 | **Gestor de paquetes: npm en lugar de pnpm** (supersede la preferencia por pnpm de `CLAUDE.md`/`04`). `package.json` fija `packageManager: npm@11.20.0`, el CI usa `npm ci` y se versiona `package-lock.json` | El antivirus **360 Total Security** bloqueó la importación del store de pnpm (`Acceso denegado`, os error 5) en 4 intentos, incluso después de agregar a la lista blanca la carpeta del proyecto y `AppData\Local\pnpm`; `npm install` funcionó a la primera (390 paquetes, ~2,5 min) | Seguir reintentando pnpm; `node-linker=hoisted` o `package-import-method=copy` (probados/descartados por tiempo); desactivar el antivirus |
| D-18 | 2026-11-12 | **`prettier-plugin-tailwindcss` aprobado** como dependencia de desarrollo, configurado en `.prettierrc.json` con `tailwindStylesheet` apuntando a `globals.css` | Ordena las clases de Tailwind de forma automática y consistente; es solo formato, no entra al bundle | Ordenar a mano; no usar plugin (D-15) |
| D-19 | 2026-11-12 | **Shell de layout:** los links de la nav usan `/#work`, `/#about`, `/#experience`, `/#contact` (no `#work`) para que funcionen también desde los casos de estudio; el correo sale de una sola constante (`SITE.email` en `src/lib/site.ts`); `Button` tiene una 3.ª variante `pill` (blanca) para el CTA de la nav; solo `NavShell` (blur al hacer scroll) y `MobileMenu` son Client Components | Cumple D-11/D-12 con el mínimo de JS de cliente; evita correos duplicados; el diseño pide una píldora blanca distinta de primary/secondary | Anchors `#work` simples (se rompen fuera de la home); nav entera como Client Component; librería de iconos/menú (dependencia extra) |
| D-20 | 2026-11-12 | **El menú móvil no atrapa el foco** (no es modal): Escape lo cierra y devuelve el foco al botón; el panel cerrado usa `hidden` para sacar sus links del orden de tabulación | Es un panel inline bajo la cabecera, no un diálogo; atrapar el foco sería más complejo y menos esperado | Convertirlo en `<dialog>` modal con focus trap |

## Privacidad y normativa (Colombia, Ley 1581 de 2012)
- El sitio **no recolecta datos personales** al lanzar (no hay formulario, cuentas ni cookies de seguimiento) → no necesita aviso de privacidad ni banner de cookies.
- Si en el futuro se agrega un formulario (F6-09): agregar un **aviso de privacidad / política de tratamiento de datos** antes de publicarlo. Claude Chat investiga los requisitos vigentes en ese momento.
- Las capturas de los proyectos **nunca** muestran datos personales reales (clientes, residentes, visitantes).

## Pendientes / preguntas abiertas
| ID | Pendiente | Responsable | Para cuándo |
|---|---|---|---|
| Q-01 | ¿Qué proveedor para **enviar** como hello@? (investigar la opción gratis vigente) | 💬 | Fase 6 |
| Q-02 | ¿Dónde alojar los videos completos de las demos? (`/public` vs. YouTube no listado; el peso afecta Lighthouse) | 💬 decide en la Fase 3 | Día 4 |
| Q-03 | ¿Foto profesional en LinkedIn? | 🧑 | Fase 5 |
| Q-04 | Recordatorio de renovación del .me (es paga después del primer año) | 🧑 | nov 2027 |
| Q-05 | ¿Qué proyecto público de backend construir en la Fase 6? | 💬 propone 2–3 opciones | Fase 6 |
| Q-06 | Fecha del examen AWS CLF-C02 | 🧑 | Fase 6 |
