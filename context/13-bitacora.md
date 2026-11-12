# 13 · Bitácora de desarrollo

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
