/**
 * Public API of the content layer. Components, pages and the terminal import from "@/data"
 * only, never from the individual files (enforced by an ESLint rule), so the shape of the
 * stored data can change without touching the UI.
 */
import { certifications } from "./certifications";
import { experience } from "./experience";
import { profile } from "./profile";
import { projects } from "./projects";
import { skillGroups } from "./skills";
import type { Certification, Experience, Profile, Project, SkillGroup } from "./types";

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
