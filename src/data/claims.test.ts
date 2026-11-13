import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getCaseStudy, getProjectBySlug } from "@/data";

/**
 * Guards against claims nobody verified (D-46, D-47, D-48). They scan the published content:
 * src/data and src/content, excluding test files (which may quote the forbidden text).
 */
const ROOTS = ["src/data", "src/content"];
const CONTENT_FILE = /\.(ts|tsx|mdx)$/;
const TEST_FILE = /\.test\.(ts|tsx)$/;

function contentFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return contentFiles(path);
    return CONTENT_FILE.test(entry.name) && !TEST_FILE.test(entry.name) ? [path] : [];
  });
}

const files = ROOTS.flatMap((root) => contentFiles(join(process.cwd(), root)));

function offenders(pattern: RegExp): string[] {
  return files.filter((f) => pattern.test(readFileSync(f, "utf8")));
}

describe("unverified claims stay out of the content", () => {
  it("scans real files (so the guards below are not vacuous)", () => {
    expect(files.length).toBeGreaterThan(5);
    expect(files.some((f) => f.endsWith("projects.ts"))).toBe(true);
    expect(files.some((f) => f.endsWith("tu-conjunto.mdx"))).toBe(true);
  });

  it('never says "489 E2E" or "489 end-to-end" (historical figure, D-47)', () => {
    expect(offenders(/489\s+(E2E|end-to-end)/i)).toEqual([]);
    // The pattern does catch the old wording
    expect("489 E2E tests").toMatch(/489\s+(E2E|end-to-end)/i);
    expect("489 end-to-end tests").toMatch(/489\s+(E2E|end-to-end)/i);
  });

  it('never says "verified in production" (the production check was not run, D-48)', () => {
    expect(offenders(/verified in production/i)).toEqual([]);
  });

  it("describes the Tu Conjunto test suite as hundreds of end-to-end tests", () => {
    expect(getProjectBySlug("tu-conjunto")!.oneLiner).toContain("hundreds of end-to-end tests");
    expect(getCaseStudy("tu-conjunto")!.summary).toContain("hundreds of end-to-end tests");
  });

  describe("Tu Conjunto isolation is application-level, never RLS or a tenant layer (D-46)", () => {
    const rls = /\bRLS\b|row[- ]level security|tenant layer/i;
    // Scoped by file and by slug, never by a shared file as a whole: Managerapp legitimately
    // discusses RLS, and projects.ts / case-studies.ts hold both projects.
    const tuConjuntoFiles = files.filter((f) => /[\\/]tu-conjunto(\.mdx|\.ts)$/.test(f));

    it("covers the case-study MDX and its diagram, and only Tu Conjunto's own files", () => {
      expect(tuConjuntoFiles.some((f) => f.endsWith("tu-conjunto.mdx"))).toBe(true);
      expect(tuConjuntoFiles.some((f) => /diagrams[\\/]tu-conjunto\.ts$/.test(f))).toBe(true);
      expect(tuConjuntoFiles.some((f) => /managerapp|projects\.ts|case-studies\.ts/.test(f))).toBe(
        false,
      );
    });

    it("finds no RLS or tenant-layer wording in those files or in the Tu Conjunto data", () => {
      for (const f of tuConjuntoFiles) {
        expect(readFileSync(f, "utf8"), f).not.toMatch(rls);
      }
      expect(JSON.stringify(getProjectBySlug("tu-conjunto"))).not.toMatch(rls);
      expect(getCaseStudy("tu-conjunto")!.summary).not.toMatch(rls);
    });

    it("does not touch Managerapp, whose RLS story is real (so the guard is not too broad)", () => {
      expect(JSON.stringify(getProjectBySlug("managerapp"))).toMatch(rls);
      expect("Tenant data is isolated with Row Level Security").toMatch(rls); // the pattern works
    });
  });
});
