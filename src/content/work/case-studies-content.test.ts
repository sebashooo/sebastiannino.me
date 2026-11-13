import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { extractToc } from "@/lib/toc";
import { getCaseStudy, getProjectBySlug } from "@/data";
import { managerappDiagram } from "./diagrams/managerapp";
import { tuConjuntoDiagram } from "./diagrams/tu-conjunto";

const read = (slug: string) =>
  readFileSync(join(process.cwd(), "src/content/work", `${slug}.mdx`), "utf8");

const SECTIONS = [
  "TL;DR",
  "Context & problem",
  "My role & stack",
  "Architecture",
  "Key decisions & trade-offs",
  "Hardest problem",
  "Testing & delivery",
  "Results",
  "What I'd do next",
];

const PAGES = [
  {
    slug: "managerapp",
    diagram: managerappDiagram,
    tag: "<ArchitectureDiagram {...managerappDiagram} />",
    sentences: [
      "PostgreSQL Row-Level Security was silently doing nothing",
      "In September 2026 I ran my RLS smoke test against the real Neon database for the first time.",
      "### 3. Two roles, two connections",
      "a security control is not real until you test that it fails closed",
      "about 843 test cases across 141 test files",
    ],
  },
  {
    slug: "tu-conjunto",
    diagram: tuConjuntoDiagram,
    tag: "<ArchitectureDiagram {...tuConjuntoDiagram} />",
    sentences: [
      "many complexes share one database and the data is personal",
      "**Proving isolation across the whole API.**",
      "### 1. Tenant identity comes from the session, never from the request",
      "when a guarantee depends on discipline, turn it into a test",
      "Five roles and 28 feature modules working behind one API.",
    ],
  },
];

describe.each(PAGES)("case study: $slug", ({ slug, diagram, tag, sentences }) => {
  const source = read(slug);

  it("contains distinctive sentences and headings from the final draft", () => {
    for (const s of sentences) expect(source, s).toContain(s);
  });

  it("has no notes or status lines from the draft file", () => {
    expect(source).not.toMatch(/^> /m);
    expect(source).not.toMatch(/Notes for F3-05|Do not publish|READY for F3-05/);
    expect(source).not.toMatch(/^---$/m);
  });

  it("has exactly the nine template sections as H2, each in the TOC", () => {
    const h2 = [...source.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
    expect(h2).toEqual(SECTIONS);
    const toc = extractToc(source);
    expect(toc.filter((t) => t.level === 2).map((t) => t.text)).toEqual(SECTIONS);
    expect(toc.length).toBeGreaterThan(SECTIONS.length); // plus the H3 decisions
  });

  it("has no H1 in the body: the page title (H1) comes from the layout", () => {
    expect(source).not.toMatch(/^# /m);
  });

  it("renders its architecture diagram once, in the Architecture section", () => {
    expect(source.split(tag).length - 1).toBe(1);
    const architecture = source.slice(
      source.indexOf("## Architecture"),
      source.indexOf("## Key decisions"),
    );
    expect(architecture).toContain(tag);
  });

  it("gives the diagram an accessible name and a text description", () => {
    expect(diagram.title.trim().length).toBeGreaterThan(5);
    expect(diagram.description.trim().length).toBeGreaterThan(40);
    expect(diagram.edges.every((e) => e.label || e.detail)).toBe(true);
    expect(diagram.title).not.toMatch(/draft/i); // the page is still draft: true; the diagram is final
  });

  it("holds no unresolved markers, unverified claims, exact test totals, contacts or URLs", () => {
    expect(source).not.toContain("[[CONFIRM");
    expect(source).not.toContain("[[PENDING");
    expect(source).not.toMatch(/verified in production/i);
    expect(source).not.toContain("489");
    expect(source).not.toMatch(/\blegacy\b/i);
    expect(source).not.toMatch(/\S+@\S+/); // no email at all
    expect(source).not.toMatch(/https?:\/\//); // no URLs (and so no admin URLs)
    expect(source).not.toMatch(/\+?\d[\d\s().-]{8,}\d/); // no phone numbers
  });
});

describe("page-specific rules", () => {
  it("Tu Conjunto says hundreds of end-to-end tests", () => {
    expect(read("tu-conjunto")).toContain("hundreds of end-to-end tests");
  });

  it("the Managerapp bypass is dated only as September 2026", () => {
    const source = read("managerapp");
    const dates = source.match(
      /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b \d{4}/g,
    );
    expect(dates).not.toBeNull();
    expect(new Set(dates)).toEqual(new Set(["September 2026"]));
    expect(source).not.toMatch(/\b2026-\d{2}/);
  });

  it("both case studies stay drafts: draft is flipped to false in F5-01, not before", () => {
    expect(getCaseStudy("managerapp")!.draft).toBe(true);
    expect(getCaseStudy("tu-conjunto")!.draft).toBe(true);
  });

  it("the covers carry the D-44 captions that the case-study header renders", () => {
    expect(getProjectBySlug("managerapp")!.media?.caption).toBe("Screenshot · demo data");
    expect(getProjectBySlug("tu-conjunto")!.media?.caption).toBe(
      "Architecture overview · illustration",
    );
  });
});
