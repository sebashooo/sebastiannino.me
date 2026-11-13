import type { ArchitectureDiagramProps } from "@/lib/diagram";

/**
 * Tu Conjunto a la Mano architecture (F3-05), built from the diagram spec in the final case-study
 * draft. Isolation is application-level: each service filters by conjuntoId, which comes from the
 * authenticated session (D-46). It must never be drawn or described as a database-level mechanism
 * or as a separate tenant component; src/data/claims.test.ts enforces that for this file.
 */
export const tuConjuntoDiagram = {
  id: "tu-conjunto-architecture",
  title: "Tu Conjunto a la Mano architecture",
  description:
    "React clients call a NestJS API on Render. Three global guards decide who the user is and what they may do before the business logic runs. The logic is split into 28 feature modules that reach PostgreSQL on Neon through Prisma; each service filters by the complex id taken from the authenticated session. The modules call the Gemini API for the AI features.",
  nodes: [
    {
      id: "client",
      label: "React 19 + Vite",
      sublabel: "Vercel · frontend by teammate",
      kind: "client",
      col: 0,
      row: 0,
    },
    {
      id: "guards",
      label: "Global guards",
      sublabel: "JWT · roles · module",
      kind: "api",
      col: 1,
      row: 0,
    },
    { id: "modules", label: "28 feature modules", kind: "api", col: 2, row: 0 },
    { id: "prisma", label: "Prisma ORM", kind: "api", col: 3, row: 0 },
    { id: "gemini", label: "Gemini API", kind: "external", col: 2, row: 1 },
    {
      id: "db",
      label: "PostgreSQL",
      sublabel: "Neon · rows carry conjuntoId",
      kind: "db",
      col: 3,
      row: 1,
    },
  ],
  edges: [
    { from: "client", to: "guards", label: "HTTPS", detail: "Requests to the NestJS API" },
    {
      from: "guards",
      to: "modules",
      detail: "Requests that pass the guards reach the feature modules",
    },
    {
      from: "modules",
      to: "prisma",
      label: "filter",
      detail: "WHERE conjuntoId, taken from the session; each service filters by complex",
    },
    { from: "prisma", to: "db", detail: "Queries through Prisma" },
    { from: "modules", to: "gemini", label: "AI", detail: "AI features", style: "dashed" },
  ],
  groups: [{ label: "NestJS API · Render", nodeIds: ["guards", "modules", "prisma"] }],
} satisfies ArchitectureDiagramProps;
