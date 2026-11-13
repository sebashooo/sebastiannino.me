import type { CaseStudy } from "./types";

// Placeholder entries until the real drafts arrive in F3-05. Both stay drafts (noindex) until then.
// Summaries restate facts already shown on the home cards (src/data/projects.ts); nothing new is claimed.
export const caseStudies: CaseStudy[] = [
  {
    slug: "managerapp",
    summary:
      "Multi-tenant SaaS for small businesses, in production with 2 real businesses. Found and fixed a silent RLS bypass.",
    publishedAt: "2026-11-12",
    draft: true,
  },
  {
    slug: "tu-conjunto",
    summary:
      "Residential-complex platform. Led backend and data model; hundreds of end-to-end tests including tenant isolation.",
    publishedAt: "2026-11-12",
    draft: true,
  },
];
