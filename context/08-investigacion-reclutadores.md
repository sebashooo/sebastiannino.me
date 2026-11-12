# 08 · Investigación: qué buscan reclutadores y hiring managers

Investigación hecha el 12 de noviembre de 2026 (artículos de 2025–2026; ver las fuentes al final). Es el equivalente a los "hallazgos de entrevistas" de otros proyectos: **cada hallazgo termina en una decisión para este proyecto.**

## Hallazgos y lo que hacemos con ellos

| # | Hallazgo | Implicación para nosotros |
|---|---|---|
| H1 | Las decisiones iniciales se toman en segundos. Un visitante en frío debería saber en ~30 s qué construyes, con qué stack y qué abrir primero. | El hero responde las tres cosas sin hacer scroll: titular, stack y "See my work". Las tarjetas muestran el impacto en una línea. |
| H2 | El CV se escanea en ~7 s y muchas veces pasa primero por un **ATS** que descarta gran parte de los CV antes de que un humano los vea. | El CV público debe ser **compatible con ATS**: una columna, sin tablas ni íconos, palabras clave de las vacantes (TypeScript, Node.js, NestJS, PostgreSQL, REST APIs, CI/CD, AWS). Tarea de Sebastián en la Fase 4, con ayuda de Claude Chat. |
| H3 | Muchos reclutadores **no abren el portafolio**: miran GitHub y LinkedIn. El portafolio es "la cereza, no el pastel": un hub que enlaza todo. | LinkedIn y GitHub van en el plan (Fase 5–6), no son opcionales. El sitio enlaza a ambos de forma visible. |
| H4 | Una guía de reclutamiento citada estima que el **82% de las contribuciones están en repos privados**; tus repos públicos pueden ser la única muestra visible de tu código. | Managerapp y Tu Conjunto son privados → el repo del portafolio debe quedar **impecable** (README, tests, CI). En la Fase 6, **un proyecto público de backend** es prioridad alta. |
| H5 | En GitHub se valoran las **señales operativas**: tests, un workflow de GitHub Actions, docs de setup / `.env.example`, manejo de errores, commits claros y acotados. | CI desde el día 1, `.env.example`, commits convencionales, tests de la terminal y E2E. |
| H6 | En la era de la IA, el código generado vale menos como señal; pesan más **las decisiones de arquitectura, los trade-offs, el debugging y el code review**. | Los casos de estudio priorizan "Key decisions & trade-offs" y "Hardest problem" (bypass de RLS). Mencionar que usa Claude Code **revisando y probando** todo. |
| H7 | Para backend: **resultados medibles**, **prueba de la API** (Swagger/Postman), **diagramas de arquitectura simples**, write-ups técnicos y un **formato consistente** por proyecto. | Plantilla única de caso de estudio (ver `02`). Mostrar capturas del Swagger de Tu Conjunto con datos demo. El blog técnico va en la Fase 6. |
| H8 | Para trabajo confidencial: usar métricas de impacto y **walkthroughs de arquitectura sin detalles privados**. | Valida el enfoque de "solo datos demo + diagramas" para los dos proyectos privados. |
| H9 | Para backend, una UI bonita pesa poco; molestan las listas de buzzwords sin prueba. | El diseño es sobrio. Los skills se agrupan y cada uno está respaldado por un proyecto (nada de barras de "nivel 80%"). |
| H10 | Pocos proyectos pulidos valen más que muchos al azar (4 pinned bien hechos > 6 random). | Dos proyectos destacados + "Other projects" compacto. En GitHub: fijar solo repos terminados. |
| H11 | LinkedIn se usa para cruzar datos: recomendaciones y actividad reciente. | Fase 6: pedir **2–3 recomendaciones** (por ejemplo, un compañero de Tu Conjunto o un supervisor de Amazon/Foundever) y publicar de vez en cuando. |
| H12 | Las contribuciones a open source (aunque sean PRs pequeños) demuestran colaboración. | Fase 6 (opcional): 1–2 PRs pequeños a proyectos que ya usa (docs, bugs pequeños). |

## Cómo usamos esto
- Claude Chat cita el hallazgo (H#) cuando una decisión se basa en él.
- Si en entrevistas reales Sebastián recibe feedback, se agrega aquí como `H13+ (feedback real)`. Eso vale más que cualquier artículo.

## Fuentes
- Underdog.io — *What Hiring Managers Look for on GitHub* (2026): https://underdog.io/blog/what-hiring-managers-look-for-on-github
- Fueler — *What Recruiters Actually Want to See in a Backend Developer Portfolio*: https://fueler.io/blog/what-recruiters-actually-want-to-see-in-a-backend-developer-portfolio
- DEV Community — *Recruiters aren't clicking your portfolio, they're looking here instead*: https://dev.to/dev_tips/recruiters-arent-clicking-your-portfoliotheyre-looking-here-instead-2jah (algunas cifras son de segunda mano)
- Scrimba — *How to Build a Web Developer Portfolio That Gets You Hired*: https://scrimba.com/articles/how-to-build-a-web-developer-portfolio-that-gets-you-hired
