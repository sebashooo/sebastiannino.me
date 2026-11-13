# 11 · Modelo de contenido (tipos de datos)

El portafolio no tiene base de datos; su "modelo de datos" son **archivos TypeScript tipados** en `src/data/` y **MDX** en `src/content/work/`. Este es el contrato entre el contenido y la UI. La terminal y las páginas leen de aquí.

```ts
// src/data/types.ts — referencia; Claude Code puede ajustarlo y debe documentar el cambio en 10-decisiones

export type Link = { label: string; href: string; external?: boolean };

export type Profile = {
  name: string;                 // "Sebastián Niño"
  headline: string;             // "Backend-minded full-stack developer."
  tagline: string;              // hero subtitle
  availability: string;         // "Available for remote junior roles"
  location: string;             // "Bogotá, Colombia"
  email: string;                // "hello@sebastiannino.me"
  languages: string[];          // ["Spanish (native)", "English (C1)"]
  resumeUrl: string;            // "/resume.pdf"
  socials: { github: string; linkedin: string };
  about: string[];              // paragraphs
};

export type SkillGroup = {
  name: "Frontend" | "Backend" | "Data" | "Cloud & DevOps" | "Testing" | "AI";
  items: string[];
};

export type ProjectStatus = "in-production" | "in-development" | "academic" | "open-source";

export type Project = {
  slug: string;                 // "managerapp" → /work/managerapp
  name: string;
  role: string;                 // "Founder & Full-Stack Developer"
  period: string;               // "Sep 2026 – Present"
  status: ProjectStatus;
  oneLiner: string;             // impact line on the card (real facts only)
  stack: string[];
  featured: boolean;            // true → "Selected work"; false → "Other projects"
  media?: { type: "image" | "video"; src: string; poster?: string; alt: string };
  links: {
    caseStudy?: string;
    demo?: string;              // only if the public demo uses demo data
    repo?: string;              // only public repos
  };
  privateNote?: string;         // "Code private · walkthrough available on request"
  order: number;
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  current: boolean;
  bullets: string[];
  kind: "work" | "education";
};

export type CertStatus = "certified" | "in-progress" | "course-completed" | "planned";

export type Certification = {
  name: string;                 // "AWS Certified Cloud Practitioner"
  issuer: string;               // "Amazon Web Services"
  status: CertStatus;
  date?: string;                // when certified
  credentialUrl?: string;       // only when certified
};

export type TerminalCommand = {
  name: string;                 // "projects"
  description: string;          // shown in `help`
  aliases?: string[];
  hidden?: boolean;             // e.g., "sudo hire-me"
  // output is built from the data above, never hardcoded duplicates
};
```

## Case-study metadata (MDX)
**Superseded by D-40:** the MDX files carry no YAML frontmatter. Metadata is split so each fact lives once:

- From the `Project` (`src/data/projects.ts`): `name`, `role`, `period`, `stack`, `status`, `privateNote`, `media` (cover) and `links.caseStudy`.
- From `CaseStudy` (`src/data/case-studies.ts`):
```ts
export type CaseStudy = {
  slug: string;       // same as Project.slug; file is src/content/work/<slug>.mdx
  summary: string;    // meta description and header lead
  publishedAt: string; // ISO date
  updatedAt?: string;
  draft: boolean;     // true → robots noindex until the real text lands
};
```
- The slug → MDX module registry is `src/content/work/index.ts` (D-41).

## Reglas
- **Una sola fuente de verdad:** si un dato aparece en la home, en la terminal y en el caso de estudio, se define una sola vez.
- `oneLiner`, las métricas y los estados de certificación deben coincidir con `01-perfil-profesional.md`.
- Un test (Vitest) valida que: los slugs sean únicos, todo `featured` tenga `caseStudy`, ninguna certificación `certified` quede sin `credentialUrl` y ningún `repo` apunte a un repo privado (lista de permitidos).
