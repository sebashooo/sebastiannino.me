import type { ArchitectureDiagramProps } from "@/lib/diagram";

/**
 * DRAFT diagram (F3-02). Only facts from context/01 for Managerapp: installable PWA, Next.js 16,
 * TypeScript, React, Tailwind, PostgreSQL on Neon with Row Level Security through a dedicated
 * least-privilege runtime role, Prisma (45 models), Better Auth, Vercel deploys from CI.
 * To be reviewed and extended in F3-05.
 */
export const managerappDiagram = {
  id: "managerapp-architecture",
  title: "Managerapp architecture (draft)",
  description:
    "An installable PWA client talks over HTTPS to a Next.js 16 app on Vercel, which reads and writes a PostgreSQL database on Neon through Prisma, with Row Level Security isolating each tenant. A GitHub Actions pipeline runs the tests and deploys the app to Vercel.",
  nodes: [
    {
      id: "pwa",
      label: "PWA client",
      sublabel: "React · Tailwind",
      kind: "client",
      col: 0,
      row: 0,
    },
    { id: "app", label: "Next.js 16 app", sublabel: "Better Auth", kind: "app", col: 1, row: 0 },
    { id: "db", label: "PostgreSQL", sublabel: "Neon · RLS", kind: "db", col: 2, row: 0 },
    { id: "ci", label: "GitHub Actions", sublabel: "Vitest", kind: "ci", col: 1, row: 1 },
  ],
  edges: [
    { from: "pwa", to: "app", label: "HTTPS", detail: "Requests over HTTPS" },
    {
      from: "app",
      to: "db",
      label: "Prisma",
      detail:
        "Queries through Prisma as a dedicated least-privilege runtime role; Row Level Security isolates each tenant",
    },
    {
      from: "ci",
      to: "app",
      label: "deploy",
      detail: "Tests run on every push, then the app is deployed to Vercel",
      style: "dashed",
    },
  ],
  groups: [{ label: "Vercel", nodeIds: ["app"] }],
} satisfies ArchitectureDiagramProps;
