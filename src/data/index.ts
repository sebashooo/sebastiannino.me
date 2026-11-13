/**
 * Public API of the content layer. Components, pages and the terminal import from "@/data"
 * only, never from the individual files (enforced by an ESLint rule), so the shape of the
 * stored data can change without touching the UI.
 */
import { caseStudies } from "./case-studies";
import { certifications } from "./certifications";
import { experience } from "./experience";
import { profile } from "./profile";
import { projects } from "./projects";
import { skillGroups } from "./skills";
import type { CaseStudy, Certification, Experience, Profile, Project, SkillGroup } from "./types";

export type * from "./types";

const byOrder = (a: Project, b: Project) => a.order - b.order;

export function getProfile(): Profile {
  return profile;
}

export function getSkillGroups(): SkillGroup[] {
  return [...skillGroups];
}

export function getAllProjects(): Project[] {
  return [...projects].sort(byOrder);
}

/** "Selected work" projects, in display order. */
export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured);
}

/** "Other projects", in display order. */
export function getOtherProjects(): Project[] {
  return getAllProjects().filter((p) => !p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

/** Experience entries; pass a kind to get only work or only education. */
export function getExperience(kind?: Experience["kind"]): Experience[] {
  return experience.filter((e) => (kind ? e.kind === kind : true));
}

export function getCertifications(): Certification[] {
  return [...certifications];
}

export function getCaseStudies(): CaseStudy[] {
  return [...caseStudies];
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

/**
 * Previous/next case study around `slug`, ordered by Project.order. No wrap-around: the first
 * has no previous and the last has no next. Each side carries the project (name, one-liner).
 */
export function getAdjacentCaseStudies(slug: string): {
  previous?: { caseStudy: CaseStudy; project: Project };
  next?: { caseStudy: CaseStudy; project: Project };
} {
  const entries = caseStudies
    .map((caseStudy) => ({ caseStudy, project: getProjectBySlug(caseStudy.slug) }))
    .filter((e): e is { caseStudy: CaseStudy; project: Project } => e.project !== undefined)
    .sort((a, b) => a.project.order - b.project.order);
  const i = entries.findIndex((e) => e.caseStudy.slug === slug);
  if (i === -1) return {};
  return { previous: entries[i - 1], next: entries[i + 1] };
}
