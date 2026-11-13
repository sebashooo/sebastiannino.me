/**
 * Content model (context/11-modelo-de-contenido.md).
 * Deviations from the reference model are recorded in context/10 (D-21).
 */

export type Link = { label: string; href: string; external?: boolean };

export type Profile = {
  name: string; // "Sebastián Niño"
  headline: string; // "Backend-minded full-stack developer."
  tagline: string; // hero subtitle
  availability: string; // "Available for remote junior roles"
  location: string; // "Bogotá, Colombia"
  email: string; // "hello@sebastiannino.me"
  languages: string[]; // ["Spanish (native)", "English (C1)"]
  resumeUrl: string; // "/resume.pdf"
  socials: { github: string; linkedin: string };
  about: string[]; // paragraphs
};

export type SkillGroup = {
  name: "Languages" | "Frontend" | "Backend" | "Data" | "Cloud & DevOps" | "Testing" | "AI";
  items: string[];
};

export type ProjectStatus = "in-production" | "in-development" | "academic" | "open-source";

export type Project = {
  slug: string; // "managerapp" → /work/managerapp
  name: string;
  role: string; // "Founder & Full-Stack Developer"
  period?: string; // "Sep 2026 – Present"; omitted when the source gives no dates
  status: ProjectStatus;
  oneLiner: string; // impact line on the card (real facts only)
  stack: string[];
  featured: boolean; // true → "Selected work"; false → "Other projects"
  media?: {
    type: "image" | "video";
    src: string;
    poster?: string;
    alt: string;
    /** Short caption shown under the cover on the case-study page (D-44), e.g. "Screenshot · demo data". */
    caption?: string;
  };
  links: {
    caseStudy?: string;
    demo?: string; // only if the public demo uses demo data
    repo?: string; // only public repos
  };
  privateNote?: string; // "Code private · walkthrough available on request"
  order: number;
};

/**
 * Case-study entry (D-40). Role, period, stack, status and privateNote are NOT stored here:
 * they come from the Project with the same slug, so each fact lives in one place.
 */
export type CaseStudy = {
  slug: string; // same as Project.slug; the MDX file is src/content/work/<slug>.mdx
  summary: string; // meta description and header lead
  publishedAt: string; // ISO date, "2026-11-16"
  updatedAt?: string;
  draft: boolean; // true → noindex until the real text lands (F3-05)
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
  name: string; // "AWS Certified Cloud Practitioner"
  issuer: string; // "Amazon Web Services"
  status: CertStatus;
  detail?: string; // short factual note shown with the status chip, e.g. "Course completed on DataCamp"
  date?: string; // when certified
  credentialUrl?: string; // only when certified
};

export type TerminalCommand = {
  name: string; // "projects"
  description: string; // shown in `help`
  aliases?: string[];
  hidden?: boolean; // e.g., "sudo hire-me"
  // output is built from the data above, never hardcoded duplicates
};
