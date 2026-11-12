import { SITE, SOCIAL_URLS } from "@/lib/site";
import type { Profile } from "./types";

// Email, location and social URLs are defined once in src/lib/site.ts and reused here.
export const profile: Profile = {
  name: SITE.name,
  headline: "Backend-minded full-stack developer.",
  tagline:
    "I'm Sebastián — I design data models, secure multi-tenant APIs and ship them with tests and CI/CD. Next.js, NestJS, PostgreSQL, AWS.",
  availability: "Available for remote junior roles",
  location: SITE.location,
  email: SITE.email,
  languages: ["Spanish (native)", "English (C1)"],
  resumeUrl: "/resume.pdf",
  socials: { github: SOCIAL_URLS.github, linkedin: SOCIAL_URLS.linkedin },
  about: [
    "I'm an eighth-semester Systems Engineering student who builds real products end to end, with a focus on data modeling, multi-tenant security, testing and CI/CD. I'm drawn to backend, data and cloud work.",
    "I have more than two years of experience supporting US customers in English, and I use AI tools like Claude Code in my workflow while reviewing and testing everything they produce.",
  ],
};
