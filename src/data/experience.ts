import type { Experience } from "./types";

// Real facts only (context/01). No metrics are invented: none are given for these roles.
export const experience: Experience[] = [
  {
    company: "Foundever (Affirm account)",
    role: "Bilingual Customer Service Representative",
    period: "Aug 2026 – Present",
    current: true,
    kind: "work",
    bullets: [
      "Support US customers of a buy-now-pay-later fintech in English, handling account and payment cases.",
      "Resolve cases using a Salesforce knowledge base while following compliance guidelines.",
    ],
  },
  {
    company: "Amazon",
    role: "Customer Service Associate",
    period: "Jun 2024 – Jun 2026",
    current: false,
    kind: "work",
    bullets: [
      "Supported corporate and retail customers in English by phone and chat.",
      "Troubleshot account and order issues and escalated incidents to the right teams.",
      "Worked against performance targets in a high-volume environment.",
    ],
  },
  {
    company: "UNIMINUTO",
    role: "B.S. in Systems Engineering",
    period: "Expected graduation Dec 2027",
    current: true,
    kind: "education",
    bullets: ["Eighth semester, evening program."],
  },
];
