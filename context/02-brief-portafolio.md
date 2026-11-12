# 02 · Brief del portafolio (contenido y estructura)

## Objetivo del sitio
Que un reclutador o tech lead, en **menos de 30 segundos**, entienda: *qué tipo de desarrollador es Sebastián, qué ha construido de verdad y cómo contactarlo*. Y que en 3–5 minutos de casos de estudio vea que **piensa como ingeniero** (arquitectura, seguridad, testing, trade-offs).

**Público:** reclutadores técnicos y no técnicos (EE. UU., LATAM, Colombia), hiring managers, tech leads.
**Idioma:** inglés (español opcional después, Fase 6).
**Conversión principal:** contactarlo (email/LinkedIn) o descargar el CV.

## Mapa del sitio
```
/                      Home (one-page: hero, work, about, experience, certifications, contact)
/work/managerapp       Case study (MDX)
/work/tu-conjunto      Case study (MDX)
/resume                Redirect/serve public résumé PDF (no phone number)
/blog                  (Phase 6 — hidden/"coming soon" at launch, or omitted from nav)
/404                   Terminal-style "command not found"
```

## Home — secciones en orden

### 1. Nav
`sn.me` (logo de texto, el punto en color de acento) · Work · About · Experience · **Get in touch** (botón tipo píldora). En móvil: menú compacto. El link al blog se oculta hasta que exista contenido.

### 2. Hero
- Etiqueta en mono: `● Available for remote junior roles`
- H1: **Backend-minded full-stack developer.**
- Subtítulo: *I'm Sebastián — I design data models, secure multi-tenant APIs and ship them with tests and CI/CD. Next.js, NestJS, PostgreSQL, AWS.*
- CTAs: **See my work** (primario) · **Download résumé** (secundario)
- A la derecha: **widget de terminal interactivo** (ver `03-diseno.md`). Por defecto muestra la salida de `sebastian --stack` y `--help`. El usuario puede escribir comandos: `help`, `whoami`, `projects`, `stack`, `experience`, `resume`, `contact`, `clear`, `sudo hire-me` (easter egg).

### 3. Selected work (2 tarjetas grandes)
Cada tarjeta lleva: captura de la demo (o video corto en loop, sin audio), nombre, una línea de impacto, chips de stack y "Read case study →". **Sin link a repos** (son privados); en su lugar: "Code private · walkthrough available on request".
- **Managerapp:** *Multi-tenant SaaS for small businesses — in production with 2 real businesses. Found and fixed a silent RLS bypass.*
- **Tu Conjunto a la Mano:** *Residential-complex platform. Led backend & data model; 489 E2E tests including tenant isolation.*

Debajo, "Other projects" (lista compacta): Parking & Billing System (Python/C++); el mismo portafolio (código **público** en GitHub: así hay un repo visible).

### 4. About
Párrafo breve en primera persona (3–4 frases): estudiante de 8.º semestre de Ingeniería de Sistemas, construye productos reales, le interesan el backend, los datos y la nube, más de 2 años trabajando con clientes de EE. UU. en inglés, usa IA (Claude Code) con criterio. Al lado: grid de skills agrupadas (Frontend / Backend / Data / Cloud & DevOps / Testing).

### 5. Experience (timeline)
Foundever (Affirm) · Amazon · UNIMINUTO (educación). Enmarcar el soporte como **comunicación con equipos de EE. UU., resolución de problemas bajo métricas y criterio de cumplimiento**.

### 6. Certifications & learning
Tarjetas con estado: AWS Cloud Practitioner (*In progress*), GitHub Foundations (*Course completed — DataCamp*), MongoDB Associate Developer (*In progress*), SENA Cybersecurity (*In progress*). Que sea fácil actualizar el estado (archivo de datos).

### 7. Contact / footer
"Let's build something." · `hello@sebastiannino.me` (botón de copiar + mailto) · LinkedIn · GitHub · "Bogotá, Colombia · English C1 · Open to remote". **Sin formulario al lanzamiento** (menos spam, menos backend); se puede evaluar en la Fase 6.

## Casos de estudio (MDX) — plantilla
Cada uno en inglés, de 800 a 1.200 palabras, con esta estructura:
1. **TL;DR:** 3 bullets (qué es, mi rol, resultado).
2. **Context & problem:** para quién es y qué dolor resuelve.
3. **My role & stack**
4. **Architecture:** diagrama (cajas y flechas: cliente → app → API → DB con RLS → servicios externos) + explicación.
5. **Key decisions & trade-offs:** 3 decisiones, con alternativa descartada y por qué.
6. **Hardest problem:** Managerapp → el bypass silencioso de RLS (cómo lo detectó, por qué pasaba, el fix con un rol de mínimo privilegio y cómo lo verificó con tests). Tu Conjunto → aislamiento multi-tenant + 489 tests.
7. **Testing & delivery:** CI/CD, tipo de tests.
8. **Results:** solo métricas reales.
9. **What I'd do next / learned**
10. Galería de capturas con **datos demo** + video del demo.

**Reglas de privacidad del contenido:** ningún nombre real de cliente ni de conjunto; capturas con datos ficticios (negocios como "Tienda Demo", "Conjunto Los Pinos Demo"); revisar antes de publicar que no se vean correos, NITs, direcciones o URLs de admin.

## Assets que Sebastián debe preparar (tareas suyas)
- [ ] Capturas de Managerapp con datos demo (escritorio + móvil): dashboard, POS, inventario, cotización PDF, escaneo.
- [ ] Capturas de Tu Conjunto con datos demo: dashboard del admin, aprobación de visitante en el celular, paquetes, Swagger.
- [ ] Videos de demo (ya existen): exportar clips cortos de 10–20 s en MP4/WebM sin audio para las tarjetas, más el video completo para el caso de estudio (o subirlo a YouTube como "no listado").
- [ ] CV público en PDF, en inglés, **sin teléfono**, con el correo hello@ y el link al portafolio.

## SEO y metadatos
- Title: `Sebastián Niño — Backend-minded Full-Stack Developer`
- Description: `Junior full-stack developer from Colombia focused on backend, data and cloud. Next.js, NestJS, PostgreSQL, AWS. Open to remote roles.`
- OG image generada dinámicamente con el estilo del sitio (nombre + titular + mini terminal).
- JSON-LD `Person` (name, jobTitle, url, sameAs: GitHub, LinkedIn).
- sitemap.xml y robots.txt.

## Criterios de "listo para lanzar"
- Lighthouse ≥ 95 en Performance, Accessibility, Best Practices y SEO (móvil).
- Funciona a 375 px sin scroll horizontal; la terminal es usable con teclado y tiene contenido estático para lectores de pantalla y SEO.
- Todos los links funcionan, el CV descarga y el correo recibe mensajes.
- Cero datos reales de clientes en capturas y textos.
