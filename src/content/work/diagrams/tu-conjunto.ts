import type { ArchitectureDiagramProps } from "@/lib/diagram";

/**
 * DRAFT, deliberately generic (F3-02). Only facts from context/01 for Tu Conjunto a la Mano:
 * NestJS + TypeScript API documented with Swagger, PostgreSQL with versioned migrations through
 * Prisma, React clients, Gemini for AI features with anonymised data.
 *
 * NOT included on purpose, until Q-07 is resolved against the real backend: the number of roles,
 * how tenant scoping works, "React + Vite", the module names, and the cross-tenant test claim made
 * by the cover illustration. Sebastián corrects this diagram in F3-05.
 */
export const tuConjuntoDiagram = {
  id: "tu-conjunto-architecture",
  title: "Tu Conjunto a la Mano architecture (draft)",
  description:
    "A React web client calls a NestJS API documented with Swagger. The API reads and writes a PostgreSQL database through Prisma and calls Gemini for AI features using anonymised data.",
  nodes: [
    { id: "web", label: "Web client", sublabel: "React", kind: "client", col: 0, row: 0 },
    { id: "api", label: "NestJS API", sublabel: "Swagger docs", kind: "api", col: 1, row: 0 },
    { id: "db", label: "PostgreSQL", sublabel: "Migrations", kind: "db", col: 2, row: 0 },
    { id: "ai", label: "Gemini", sublabel: "Anonymised data", kind: "external", col: 1, row: 1 },
  ],
  edges: [
    { from: "web", to: "api", label: "HTTPS", detail: "Requests to the API" },
    { from: "api", to: "db", label: "Prisma", detail: "Queries through Prisma" },
    {
      from: "api",
      to: "ai",
      label: "AI",
      detail: "AI features, with usage limits and anonymised data",
      style: "dashed",
    },
  ],
} satisfies ArchitectureDiagramProps;
