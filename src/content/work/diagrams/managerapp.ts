import type { ArchitectureDiagramProps } from "@/lib/diagram";

/**
 * Managerapp architecture (F3-05), built from the diagram spec in the final case-study draft.
 * Only facts from that draft. Nothing here mentions a production check or the legacy role (D-48).
 */
export const managerappDiagram = {
  id: "managerapp-architecture",
  title: "Managerapp architecture",
  description:
    "An installable PWA talks over HTTPS to a Next.js 16 app on Vercel. The app signs users in with Google and reaches PostgreSQL on Neon through Prisma, setting the tenant context in each transaction so the Row-Level Security policies apply. The running app uses a runtime role that cannot bypass Row-Level Security; migrations use a separate owner role. GitHub Actions runs the tests and a bypass guard against an ephemeral Neon branch.",
  nodes: [
    { id: "browser", label: "Browser / installed PWA", kind: "client", col: 0, row: 0 },
    { id: "app", label: "Next.js 16", sublabel: "Vercel", kind: "app", col: 1, row: 0 },
    {
      id: "tenant",
      label: "Prisma + tenant context",
      sublabel: "set per transaction",
      kind: "api",
      col: 2,
      row: 0,
    },
    { id: "ci", label: "GitHub Actions", kind: "ci", col: 3, row: 0 },
    { id: "google", label: "Google sign-in", kind: "external", col: 1, row: 1 },
    {
      id: "db",
      label: "PostgreSQL",
      sublabel: "Neon · RLS tenant_isolation",
      kind: "db",
      col: 2,
      row: 1,
    },
    {
      id: "ephemeral",
      label: "Ephemeral Neon branch",
      sublabel: "tests + BYPASSRLS guard",
      kind: "db",
      col: 3,
      row: 1,
    },
  ],
  edges: [
    { from: "browser", to: "app", label: "HTTPS", detail: "Requests over HTTPS" },
    {
      from: "app",
      to: "google",
      label: "OAuth",
      detail: "Google sign-in (OAuth)",
      style: "dashed",
    },
    {
      from: "app",
      to: "tenant",
      detail:
        "Every request that touches tenant data runs in a transaction that first sets the tenant context",
    },
    {
      from: "tenant",
      to: "db",
      label: "role",
      detail: "Runtime role · NOBYPASSRLS",
    },
    {
      from: "app",
      to: "db",
      label: "migrate",
      detail: "Migrations · owner role",
      style: "dashed",
    },
    { from: "ci", to: "ephemeral", label: "tests", detail: "Tests + guard", style: "dashed" },
  ],
} satisfies ArchitectureDiagramProps;
