# 07 · Flujo de trabajo con Claude Code

```
 Claude Chat (proyecto)  ──prompt──▶  Sebastián  ──pega──▶  Claude Code (terminal Windows)
        ▲                                                          │
        └────────── explica + verifica ◀── pega el reporte ◀───────┘
```

## Cómo escribe Claude Chat cada prompt (plantilla)
Los prompts van en **inglés**, dentro de un bloque de código, con esta estructura:

```
## Context
Read CLAUDE.md and the relevant files in /context (list them). Current phase: <Phase N — name>. Tickets: <F#-## from context/09-backlog.md>.

## Goal
<one or two sentences: the outcome, not the steps>

## Requirements
- <concrete, checkable items>
- Follow the design tokens in context/03-diseno.md and the reference design/design-C-minimal-dark-terminal.html
- Keep content in src/data or src/content; components only render it

## Constraints
- Windows/PowerShell-compatible commands
- Do not add dependencies beyond: <list> without explaining why
- No real client data; demo data only
- Do not commit secrets

## Acceptance criteria
- [ ] pnpm lint && pnpm typecheck && pnpm test && pnpm build pass
- [ ] <feature-specific checks>
- [ ] Works at 375px and 1440px widths

## When done
Update context/09 (ticket status), context/10 (new decisions) and context/13 (log entry). Commit with a conventional commit message (do not push unless asked) and reply with the REPORT format from CLAUDE.md.
```

**Reglas para los prompts:**
- Un objetivo claro por prompt (el tamaño ideal es entre 20 y 60 minutos de trabajo de Claude Code).
- Siempre con criterios de aceptación verificables.
- Pedir que Claude Code **planee antes de ejecutar** en tareas grandes (que use el modo plan o liste su plan primero).
- Si una tarea depende de algo que Sebastián debe hacer (DNS, capturas), el prompt lo dice y usa placeholders mientras tanto.

## Formato de REPORTE que Claude Code devuelve (definido en CLAUDE.md)
```
REPORT — <phase/task>
1. Summary: what was built (2–4 lines)
2. Architecture: files/folders created or changed and how they connect
3. Decisions: key choices + alternatives rejected (and why)
4. Checks: lint / typecheck / test / build results (pass/fail, counts)
5. Screens/URLs: what to open to see it (localhost or preview URL)
6. Open issues / TODO for Sebastián
7. Suggested next step
```
Sebastián copia **todo el reporte** y lo pega en Claude Chat.

## Lo que Claude Chat hace con el reporte
1. **Explica la arquitectura en español:** qué piezas existen, cómo fluye la información, por qué se escogió así y cómo contarlo en una entrevista. Sin explicar código línea por línea.
2. **Verifica:** criterios de aceptación ✅/⚠️; si algo falla, da un prompt de corrección.
3. **Da el siguiente prompt** según `05-plan-fases.md`.

## Cuándo intervengo yo (Sebastián)
- Para pedir cambios de diseño o de contenido: se lo digo a Claude Chat en español y él lo convierte en un prompt.
- Para tareas manuales: DNS, el correo, capturas, CV, LinkedIn.
- Para revisar el sitio en el preview de Vercel (con 5 minutos al final de cada fase basta).

## Comandos útiles en Claude Code
- `/init` → genera o actualiza CLAUDE.md (ya lo damos hecho).
- Plan mode (Shift+Tab) → para que planee antes de editar en tareas grandes.
- `/clear` → contexto limpio entre fases (CLAUDE.md conserva lo importante).
- Pedir "run the dev server and tell me the URL" para ver en `localhost:3000`.
