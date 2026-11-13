import type { ComponentType } from "react";

/**
 * Explicit slug → MDX module registry (D-41). Typed, statically analysable imports instead of a
 * template-string dynamic import. Each slug needs an entry in src/data/case-studies.ts and a Project;
 * data.test.ts keeps the three in sync.
 */
export const caseStudyModules: Record<string, () => Promise<{ default: ComponentType }>> = {
  managerapp: () => import("./managerapp.mdx"),
  "tu-conjunto": () => import("./tu-conjunto.mdx"),
};

/** Source of each module, relative to this folder; read at build time to build the TOC. */
export const CASE_STUDY_DIR = "src/content/work";
