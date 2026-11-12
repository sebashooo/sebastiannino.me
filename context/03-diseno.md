# 03 · Sistema de diseño — "Minimal dark + terminal"

Referencia visual: `design/design-C-minimal-dark-terminal.html` (abrir en el navegador) y `design/design-C-preview.png`.
**Es un mockup de referencia, no código final:** se reconstruye como componentes de Next.js/Tailwind. Los textos `[...]` son espacios para capturas.

## Principios
1. **Oscuro, sobrio y con aire.** Mucho espacio negativo; el contenido manda.
2. **La terminal es el guiño, no el disfraz.** Solo el widget del hero, las etiquetas en mono y la página 404 hablan "terminal". El resto es UI moderna y limpia.
3. **Un solo acento (cian).** Se usa para CTAs, el punto del logo, prompts `❯`, la etiqueta "available" y estados de foco.
4. **Rápido y accesible.** Contraste AA mínimo, foco visible y `prefers-reduced-motion` respetado.

## Tokens
### Color (Tailwind v4 `@theme`)
| Token | Hex | Uso |
|---|---|---|
| `--color-bg` | `#09090b` | Fondo de página |
| `--color-surface` | `#111113` | Tarjetas, terminal |
| `--color-surface-2` | `#18181b` | Placeholders de media, hover |
| `--color-border` | `#27272a` | Bordes de tarjetas y separadores |
| `--color-border-strong` | `#3f3f46` | Botón secundario |
| `--color-text` | `#fafafa` | Títulos |
| `--color-text-body` | `#d4d4d8` | Texto base |
| `--color-text-muted` | `#a1a1aa` | Subtítulos, descripciones |
| `--color-text-subtle` | `#71717a` | Metadatos, chips de stack (≥ 14 px) |
| `--color-accent` | `#67e8f9` | Acento (cian) |
| `--color-accent-hover` | `#a5f3fc` | Hover del acento |
| `--color-success` | `#4ade80` | Salidas "✓" en la terminal |

Texto sobre el acento: `#09090b`. Selección de texto: fondo del acento al 30%.

### Tipografía (next/font, self-hosted)
- **Display:** Space Grotesk 600/700 (H1–H3). H1: 60/1.05, tracking −1.5 px (móvil: 40 px).
- **Body:** Inter 400/500, 16–18 px, interlineado 1.6.
- **Mono:** JetBrains Mono 400/500 (terminal, etiquetas, chips de stack), 12–14 px.

### Espaciado y forma
- Contenedor máximo de 1160 px; padding lateral de 24 px (16 px en móvil).
- Separación entre secciones: 72–96 px en desktop, 56 px en móvil.
- Radios: tarjetas y terminal 12 px · botones 8 px · botón de nav: píldora (999 px).
- Bordes de 1 px; **sin sombras pesadas ni gradientes llamativos**. Como mucho, un brillo radial muy sutil del acento detrás del hero (opacidad ≤ 6%).

## Componentes
- **Nav:** logo `sn.me` · links · botón píldora blanco "Get in touch". En scroll: fondo con blur y borde inferior.
- **Button:** `primary` (fondo de acento, texto oscuro) y `secondary` (borde `--color-border-strong`, texto claro). Alto mínimo de 44 px.
- **TerminalWidget (hero):**
  - Barra superior: `terminal` · `zsh`, en mono y color subtle.
  - Al cargar, "escribe" `sebastian --stack` (efecto de tipeo rápido, ~25 ms por carácter; **sin animación** si hay `prefers-reduced-motion`).
  - Input real (`<input>` con label oculto) con prompt `❯`. Comandos: `help`, `whoami`, `projects`, `stack`, `experience`, `resume` (descarga el CV), `contact`, `clear`, `sudo hire-me` → "Permission granted. Opening email…".
  - Historial con flechas ↑/↓; Tab autocompleta.
  - Comando desconocido: `command not found: x — try 'help'`.
  - El contenido por defecto se renderiza en el servidor (SEO y lectores de pantalla); la interactividad es progresiva. `aria-live="polite"` en la salida.
- **ProjectCard:** media 16:10 arriba (imagen o video en loop silenciado con poster), título en Space Grotesk, una línea de impacto, chips de stack en mono, link "Read case study →". Hover: el borde pasa a `--color-border-strong` y la media hace un zoom de 1.02.
- **SectionHeader:** H2 + subtítulo muted a la derecha (debajo en móvil).
- **Timeline (Experience):** línea vertical de 1 px, punto de acento para el rol actual.
- **CertCard:** nombre, emisor, chip de estado (`Certified` en verde suave · `In progress` con el acento al 15%).
- **ArchitectureDiagram (casos de estudio):** cajas con borde, etiquetas en mono y flechas; en SVG generado o Mermaid con un tema oscuro que coincida con los tokens.
- **404:** pantalla tipo terminal: `❯ cd /that-page` → `bash: cd: no such file or directory` + link "← back home".

## Movimiento
- Fade-up sutil al entrar las secciones (Motion; 300 ms; un desplazamiento de 8 px). Sin parallax ni animaciones llamativas.
- Todo se desactiva con `prefers-reduced-motion: reduce`.

## Accesibilidad
- Contraste: el texto subtle (`#71717a`) se usa solo en ≥ 14 px y para información no esencial; el body usa `#a1a1aa` o más claro.
- Foco visible: outline de 2 px con el acento y offset de 2 px.
- Landmarks (`header`, `main`, `footer`) y un link "Skip to content".
- Videos sin autoplay con sonido; `muted playsinline loop` y poster.
