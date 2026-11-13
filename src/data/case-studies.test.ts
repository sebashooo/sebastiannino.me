import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CASE_STUDY_DIR, caseStudyModules } from "@/content/work";
import {
  getAdjacentCaseStudies,
  getAllProjects,
  getCaseStudies,
  getCaseStudy,
  getProjectBySlug,
} from "@/data";

describe("case studies: data integrity", () => {
  it("has unique slugs", () => {
    const slugs = getCaseStudies().map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("gives every project with links.caseStudy a case-study entry and a registry entry", () => {
    for (const project of getAllProjects().filter((p) => p.links.caseStudy)) {
      expect(getCaseStudy(project.slug), `data entry for ${project.slug}`).toBeDefined();
      expect(caseStudyModules[project.slug], `registry entry for ${project.slug}`).toBeDefined();
    }
  });

  it("links to /work/<slug> and nothing else", () => {
    for (const project of getAllProjects().filter((p) => p.links.caseStudy)) {
      expect(project.links.caseStudy).toBe(`/work/${project.slug}`);
    }
  });

  it("has a project, a registry entry and an MDX file for every case-study entry", () => {
    for (const { slug } of getCaseStudies()) {
      expect(getProjectBySlug(slug), `project ${slug}`).toBeDefined();
      expect(caseStudyModules[slug], `registry ${slug}`).toBeDefined();
      expect(existsSync(join(process.cwd(), CASE_STUDY_DIR, `${slug}.mdx`))).toBe(true);
    }
  });

  it("has no registry entry without a data entry", () => {
    const slugs = new Set(getCaseStudies().map((c) => c.slug));
    for (const slug of Object.keys(caseStudyModules)) {
      expect(slugs.has(slug), `data entry for registry slug ${slug}`).toBe(true);
    }
  });

  it("has a summary and a valid publishedAt on every entry", () => {
    for (const c of getCaseStudies()) {
      expect(c.summary.trim().length).toBeGreaterThan(0);
      expect(c.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});

describe("getAdjacentCaseStudies", () => {
  it("orders by Project.order without wrapping around", () => {
    const [first, second] = getCaseStudies()
      .map((c) => ({ slug: c.slug, order: getProjectBySlug(c.slug)!.order }))
      .sort((a, b) => a.order - b.order);

    const a = getAdjacentCaseStudies(first.slug);
    expect(a.previous).toBeUndefined();
    expect(a.next?.caseStudy.slug).toBe(second.slug);
    expect(a.next?.project.name).toBe(getProjectBySlug(second.slug)!.name);

    const b = getAdjacentCaseStudies(second.slug);
    expect(b.previous?.caseStudy.slug).toBe(first.slug);
    expect(b.next).toBeUndefined();
  });

  it("returns nothing for an unknown slug", () => {
    expect(getAdjacentCaseStudies("nope")).toEqual({});
  });
});
