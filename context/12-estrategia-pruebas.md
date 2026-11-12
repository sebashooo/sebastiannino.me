# 12 · Estrategia de pruebas y QA

Objetivo: que el repo público **demuestre** la calidad que el CV promete (H5) y que el día del lanzamiento no haya sorpresas.

## Pirámide
| Nivel | Herramienta | Qué cubre | Cuándo corre |
|---|---|---|---|
| Estático | ESLint, TypeScript strict, Prettier | Errores de tipos, estilo, imports | Pre-commit (Claude Code) y CI |
| Unitario | **Vitest** | Parser de comandos de la terminal; validación de los datos (`11`); utilidades | CI en cada push/PR |
| E2E (smoke) | **Playwright** | La home carga; la terminal responde a `help`, `projects` y a un comando desconocido; navegación a los dos casos; `resume.pdf` responde 200; la 404 funciona | CI (job separado) y antes de lanzar |
| Accesibilidad | `@axe-core/playwright` en el E2E + revisión manual con teclado | Cero violaciones serias o críticas de axe; todo navegable con Tab; foco visible | Fase 4 y 5 |
| Rendimiento/SEO | Lighthouse (Chrome DevTools o `npx lighthouse`) en móvil | ≥ 95 en Performance, Accessibility, Best Practices y SEO | Fin de las Fases 2, 4 y 5 |
| Visual/responsive | Revisión manual en 375, 768 y 1440 px + un celular real | Nada roto, sin scroll horizontal | Fin de cada fase |

## Casos mínimos del parser de la terminal (Vitest)
- `help` lista todos los comandos no ocultos.
- `projects` y `stack` leen de `src/data` (si cambia un dato, cambia la salida).
- Comando desconocido → `command not found: <x> — try 'help'`.
- Entrada vacía o con espacios → no hace nada.
- Mayúsculas y espacios extra se normalizan (`  HELP ` = `help`).
- `clear` devuelve una señal de limpiar (no texto).
- Los alias funcionan; `sudo hire-me` (oculto) no aparece en `help`.

## Auditoría de privacidad (obligatoria antes de lanzar — F5-01)
Claude Code busca en `src/`, `public/` y el contenido MDX, y reporta cualquier coincidencia:
- [ ] Teléfonos (patrones `+57`, 10 dígitos), correos que no sean `hello@sebastiannino.me`, NIT/cédulas.
- [ ] Nombres reales de negocios clientes o de conjuntos (Sebastián da la lista en privado al momento; **no se guarda en el repo**).
- [ ] URLs internas (paneles admin, dashboards de Vercel/Neon/Render, `.env`).
- [ ] Revisión **visual** de cada captura: Claude Code lista las imágenes y Sebastián confirma que solo hay datos demo.
- [ ] Metadatos EXIF de las imágenes eliminados (ubicación GPS de capturas tomadas con el celular).

## Gate de CI (bloquea el merge a `main`)
`lint` → `typecheck` → `test` → `build`. E2E como job separado (requerido antes de lanzar).

## Checklist de lanzamiento (F5-03)
- [ ] https://sebastiannino.me con candado; `www` redirige al apex.
- [ ] La OG image se ve bien al pegar el link en LinkedIn/WhatsApp (probar con el Post Inspector de LinkedIn).
- [ ] El correo a hello@ llega a Gmail.
- [ ] El CV descarga y es la versión sin teléfono.
- [ ] Lighthouse móvil ≥ 95 ×4.
- [ ] Probado en Chrome, Edge y un celular real (Android/iOS).
