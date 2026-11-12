import type { SkillGroup } from "./types";

export const skillGroups: SkillGroup[] = [
  {
    name: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "SQL", "Java (academic)", "C++ (academic)"],
  },
  {
    name: "Frontend",
    items: ["React", "Next.js", "Tailwind CSS", "Responsive design", "PWA"],
  },
  {
    name: "Backend",
    items: [
      "Node.js",
      "NestJS",
      "REST APIs",
      "Authentication (OAuth, 2FA, cookie sessions)",
      "RBAC",
    ],
  },
  {
    name: "Data",
    items: [
      "PostgreSQL (Neon)",
      "Prisma",
      "Row Level Security",
      "Versioned migrations",
      "Relational modeling",
    ],
  },
  {
    name: "Cloud & DevOps",
    items: ["Git", "GitHub Actions (CI/CD)", "Vercel", "Render", "Neon", "AWS fundamentals"],
  },
  {
    name: "Testing",
    items: ["Vitest", "Jest", "Supertest", "End-to-end testing"],
  },
  {
    name: "AI",
    items: ["Gemini API integration", "Claude Code in the development workflow"],
  },
];
