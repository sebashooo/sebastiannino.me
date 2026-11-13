# 01 · Perfil profesional (fuente de verdad)

## Datos básicos
- **Nombre en el sitio:** Sebastián Niño (nombre completo: Sebastián Felipe Niño Vargas)
- **Ubicación:** Madrid, Cundinamarca, cerca de Bogotá, Colombia (en el sitio: "Bogotá, Colombia")
- **Disponibilidad:** remoto (desde Colombia) o híbrido/presencial en Bogotá
- **Idiomas:** español nativo · inglés avanzado (C1)
- **Correo público:** hello@sebastiannino.me
- **GitHub:** github.com/sebashooo
- **LinkedIn:** linkedin.com/in/sebastian-felipe-niño-vargas (recomendado cambiarlo a `linkedin.com/in/sebastiannino`; ver `06`)
- **Dominio:** sebastiannino.me (Namecheap, GitHub Student Developer Pack)
- **Sin foto** en el sitio.

## Posicionamiento
**Titular del sitio:** "Backend-minded full-stack developer."
**Rol objetivo:** Junior Full-Stack Developer (backend focus) · también Backend, Data y Cloud junior.
**Historia en una línea:** estudiante de Ingeniería de Sistemas que construye productos SaaS reales de punta a punta, con enfoque en modelado de datos, seguridad multi-tenant, testing y CI/CD, y que se comunica con fluidez en inglés con equipos de EE. UU.

**Diferenciadores a destacar:**
1. **Productos reales, no tutoriales:** Managerapp lo usan 2 negocios reales.
2. **Seguridad de datos:** aislamiento multi-tenant con PostgreSQL RLS; detectó que el rol creado por el proveedor se saltaba RLS en silencio y lo corrigió con un rol de runtime de mínimo privilegio. Esta es la historia estrella para entrevistas.
3. **Calidad:** Managerapp con unos 843 casos de prueba en 141 archivos (conteo estático; Vitest y CI en GitHub Actions) y Tu Conjunto con cientos de tests E2E (incluye tests de aislamiento entre tenants); despliegue continuo.
4. **Comunicación:** más de 2 años de soporte bilingüe a clientes de EE. UU. (Amazon, Foundever/Affirm).
5. **Desarrollo asistido por IA, con criterio:** usa Claude Code y revisa y prueba todo lo que produce.

## Habilidades técnicas
- **Lenguajes:** TypeScript, JavaScript, Python, SQL (también Java y C++ en lo académico)
- **Frontend:** React, Next.js, Tailwind CSS, diseño responsive, PWA
- **Backend:** Node.js, NestJS, REST APIs, autenticación (OAuth, 2FA, sesiones con cookies), RBAC
- **Datos:** PostgreSQL (Neon), Prisma, RLS, migraciones versionadas, modelado relacional
- **DevOps/Cloud:** Git, GitHub Actions (CI/CD), Vercel, Render, Neon, fundamentos de AWS
- **Testing:** Vitest, Jest, Supertest, tests E2E
- **IA:** integración con Gemini API; Claude Code en el flujo de desarrollo

## Proyectos

### Managerapp — SaaS multi-tenant de gestión de negocios (sep 2026 – presente)
Next.js 16 · TypeScript · React · Tailwind · PostgreSQL (Neon) · Prisma · Better Auth · Vercel
- PWA instalable para pequeños negocios colombianos: ventas/POS, catálogo, inventario multi-sede y cotizaciones en PDF. **La usan 2 negocios reales.**
- Aislamiento de datos por tenant con **PostgreSQL Row Level Security** a nivel de base de datos. Detectó que el rol de base de datos creado por el proveedor se saltaba RLS en silencio y lo corrigió con un **rol de runtime dedicado de mínimo privilegio**.
- Esquema relacional de **45 modelos** con Prisma (decimales exactos para dinero, log de inventario auditable). Autenticación con Google OAuth y 2FA, con acceso por rol y por sede.
- Flujo mobile-first de códigos de barras: generación EAN-13 y escaneo con cámara, con fallback para Safari/iOS.
- CI/CD: unos 843 casos de prueba en 141 archivos (conteo estático, Vitest) que corren en GitHub Actions; cada push a master despliega automáticamente en Vercel.
- **Visibilidad:** repo privado; se usa en el negocio de Sebastián. En el portafolio, **solo demo con datos ficticios**. Tiene demo grabada.
- **Rol (confirmado por Sebastián el 2026-11-12):** "Founder & Full-Stack Developer" (producto propio, en uso en su negocio).

### Tu Conjunto a la Mano — Plataforma modular para conjuntos residenciales (2026 · proyecto en equipo)
Rol: **desarrollador de backend y base de datos** · NestJS · TypeScript · PostgreSQL · Prisma · React · Claude Code
- Diseñó y construyó el backend y el modelo de datos PostgreSQL (migraciones versionadas). Reemplaza el libro de papel de portería y da a los administradores un dashboard en tiempo real.
- Arquitectura multi-tenant: los datos de cada conjunto están aislados y toda consulta se filtra por la identidad de la sesión, nunca por datos enviados por el cliente.
- Autenticación y control de acceso de 5 roles (superadmin, admin, recepcion, residente, contador), con sesiones en cookies seguras, bloqueo por intentos de login y contraseñas hasheadas, alineado con la Ley 1581 (protección de datos en Colombia).
- 28 módulos funcionales, entre ellos: aprobación de visitantes desde el celular, paquetes, reservas, pagos con comprobantes, documentos, seguridad con QR y notificaciones en tiempo real.
- IA (Gemini) para redactar comunicados, clasificar quejas y responder preguntas sobre el reglamento, con límites de uso y datos anonimizados.
- **Cientos de tests E2E automatizados** (Jest, Supertest), incluidos tests de aislamiento entre tenants (el número exacto está pendiente de verificación). Desplegado en Render, Neon y Vercel. API documentada con Swagger.
- **Visibilidad:** repo privado; en desarrollo, buscando conjuntos piloto. **Solo demo con datos ficticios.** Tiene demo grabada.

### Sistema de parqueadero y facturación — Lead Backend Developer (proyecto académico)
Python · C++ · estructuras de datos · POO. Tarifas configurables (por hora, por minuto, tarifa plana), facturación automática y control de capacidad en tiempo real. Proyecto **secundario** en el sitio (sección "Other projects").

## Experiencia laboral
- **Bilingual Customer Service Representative — Foundever (cuenta Affirm)** · ago 2026 – presente. Soporte en inglés a clientes de EE. UU. de una fintech de buy-now-pay-later; casos de cuentas y pagos con base de conocimiento en Salesforce y lineamientos de cumplimiento.
- **Customer Service Associate — Amazon** · jun 2024 – jun 2026. Soporte en inglés (teléfono y chat) a clientes corporativos y retail; troubleshooting de cuentas y pedidos; escalamiento de incidentes; metas de desempeño en un entorno de alto volumen.

## Educación
- **B.S. Systems Engineering — UNIMINUTO** · 8.º semestre, programa nocturno · graduación esperada en dic 2027.
- **SENA** · programa técnico en ciberseguridad (en curso, complementario).
- Bachiller — IED Tecnológico de Madrid (2021).

## Certificaciones y cursos (estado real; actualizar al avanzar)
| Item | Estado | Cómo mostrarlo |
|---|---|---|
| AWS Certified Cloud Practitioner (CLF-C02) | Curso terminado, falta el examen | "In progress — exam scheduled" (no poner "Certified" hasta aprobar) |
| GitHub Foundations (curso en DataCamp) | Curso terminado | "GitHub Foundations — course (DataCamp)". Si presenta el examen: "GitHub Foundations Certified" |
| MongoDB Associate Developer (Node.js) | En curso (empezó la ruta de aprendizaje; voucher del Student Pack) | "In progress" (no poner "Certified" hasta aprobar) |
| Técnico en ciberseguridad SENA | En curso | En Educación |

## Qué NO decir
- No llamarlo "senior", no exagerar años de experiencia en desarrollo (la experiencia profesional es de soporte; la de desarrollo son proyectos).
- No mencionar nombres de los negocios clientes de Managerapp ni datos de conjuntos reales.
- No publicar teléfono ni correo personal de Gmail.
