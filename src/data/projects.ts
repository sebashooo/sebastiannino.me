import type { Project } from "./types";

const PRIVATE_NOTE = "Code private · walkthrough available on request";

// Managerapp and Tu Conjunto a la Mano are private and hold real client data:
// only demo data, no repo links, no client names (CLAUDE.md privacy rule).
export const projects: Project[] = [
  {
    slug: "managerapp",
    name: "Managerapp",
    role: "Founder & Full-Stack Developer",
    period: "Sep 2026 – Present",
    status: "in-production",
    oneLiner:
      "Multi-tenant SaaS for small businesses — in production with 2 real businesses. Found and fixed a silent RLS bypass.",
    stack: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Prisma",
      "Better Auth",
      "Tailwind CSS",
      "Vercel",
    ],
    featured: true,
    links: { caseStudy: "/work/managerapp" },
    privateNote: PRIVATE_NOTE,
    order: 1,
  },
  {
    slug: "tu-conjunto",
    name: "Tu Conjunto a la Mano",
    role: "Backend & Database Developer",
    period: "2026",
    status: "in-development",
    oneLiner:
      "Residential-complex platform. Led backend & data model; 489 E2E tests including tenant isolation.",
    stack: ["NestJS", "TypeScript", "PostgreSQL", "Prisma", "React", "Jest", "Supertest"],
    featured: true,
    links: { caseStudy: "/work/tu-conjunto" },
    privateNote: PRIVATE_NOTE,
    order: 2,
  },
  {
    slug: "parking-billing",
    name: "Parking & Billing System",
    role: "Lead Backend Developer",
    status: "academic",
    oneLiner:
      "Academic project: configurable rates (hourly, per-minute, flat), automatic billing and real-time capacity control.",
    stack: ["Python", "C++", "Data structures", "OOP"],
    featured: false,
    links: {},
    order: 3,
  },
  {
    slug: "portfolio",
    name: "sebastiannino.me",
    role: "Designer & Developer",
    period: "Nov 2026 – Present",
    status: "open-source",
    oneLiner:
      "This portfolio: Next.js, TypeScript and Tailwind with unit and end-to-end tests and CI. Public code.",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Vitest", "Playwright", "GitHub Actions"],
    featured: false,
    links: { repo: "https://github.com/sebashooo/sebastiannino.me" },
    order: 4,
  },
];
