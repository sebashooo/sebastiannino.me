# sebastiannino.me — Empieza aquí

Carpeta de trabajo del portafolio. Aquí vive el código (lo crea Claude Code) y todo el contexto del proyecto.

## Qué hay en esta carpeta
```
sebastiannino-me/
├─ README-EMPIEZA-AQUI.md          ← este archivo
├─ CLAUDE.md                       ← memoria/reglas para Claude Code (lo lee automáticamente)
├─ context/                        ← documentos para el PROYECTO en Claude
│  ├─ 00-INSTRUCCIONES-PROYECTO-CLAUDE.md   (pegar en "Instrucciones del proyecto")
│  ├─ 01-perfil-profesional.md
│  ├─ 02-brief-portafolio.md
│  ├─ 03-diseno.md
│  ├─ 04-stack-arquitectura.md
│  ├─ 05-plan-fases.md
│  ├─ 06-linkedin-github.md
│  ├─ 07-flujo-claude-code.md
│  ├─ 08-investigacion-reclutadores.md
│  ├─ 09-backlog.md
│  ├─ 10-decisiones-y-pendientes.md
│  ├─ 11-modelo-de-contenido.md
│  ├─ 12-estrategia-pruebas.md
│  └─ 13-bitacora.md
├─ design/
│  ├─ design-C-minimal-dark-terminal.html   (mockup escogido; ábrelo en el navegador)
│  └─ design-C-preview.png
├─ docs/
│  └─ Guia_MongoDB_Student_Pack.pdf          (certificación gratis + créditos Atlas)
└─ prompts/
   ├─ 00-mensaje-primer-chat.md              (primer mensaje para Claude Chat)
   └─ 01-fase0-claude-code.md                (primer prompt para Claude Code)
```

## Cómo arrancar (10 minutos)
1. **Crea el proyecto en Claude** (claude.ai → Projects → New project) con el nombre "sebastiannino.me — Portafolio".
2. **Instrucciones del proyecto:** copia todo el contenido de `context/00-INSTRUCCIONES-PROYECTO-CLAUDE.md`.
3. **Conocimiento del proyecto:** sube `context/01` a `13`, `design/design-C-minimal-dark-terminal.html` y `design/design-C-preview.png`.
4. **Abre un chat en el proyecto** y pega el contenido de `prompts/00-mensaje-primer-chat.md`.
5. **Abre la terminal de Windows** en esta carpeta → `claude` → pega el bloque de `prompts/01-fase0-claude-code.md`.
6. Cuando Claude Code termine, copia su **REPORT** y pégalo en el chat del proyecto. Claude te explica qué hizo y te da el siguiente prompt. Repite el ciclo.

7. **Cuando el repo esté en GitHub (Fase 0, F0-06):** en el conocimiento del proyecto da clic en "+" → **GitHub** → escoge `sebashooo/sebastiannino.me` y selecciona `context/` y `design/`. Después borra las copias que subiste a mano. Desde ahí, Claude Code actualiza los archivos y hace push solo; tú solo das clic en **Sync now** al final de cada fase (Claude Chat te lo recuerda).

## Fechas
- Hoy, jue 12 nov: Fase 0 · Lanzamiento: **jue 19 nov 2026**.
- Renovación del dominio .me: **nov 2027** (es paga; pon un recordatorio).

## Decisiones tomadas
| Tema | Decisión |
|---|---|
| Dominio | sebastiannino.me |
| Correo | hello@sebastiannino.me |
| Diseño | C · Minimal dark + terminal, acento cian #67e8f9 |
| Idioma del sitio | Inglés |
| Stack | Next.js 16 + TS + Tailwind v4 + MDX + Motion · Vercel |
| Posicionamiento | Backend-minded full-stack developer (backend · data · cloud) |
| Proyectos | Managerapp y Tu Conjunto a la Mano, solo con datos demo (repos privados) |
| Foto | No |
