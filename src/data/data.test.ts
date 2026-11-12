import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SITE, SOCIAL_URLS } from "@/lib/site";
import {
  getAllProjects,
  getCertifications,
  getExperience,
  getFeaturedProjects,
  getOtherProjects,
  getProfile,
  getProjectBySlug,
  getSkillGroups,
} from "./index";

// Rules from context/11 and context/12: these tests protect the content layer.

const PUBLIC_EMAIL = "hello@sebastiannino.me";
/** Only public repos may be linked (privacy rule, D-08). */
const REPO_ALLOW_LIST = ["https://github.com/sebashooo/sebastiannino.me"];

const EMAIL_PATTERN = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
// +country-code numbers, 10 consecutive digits, 3-3-4 groups, and (123) 456-7890
const PHONE_PATTERN =
  /\+\d[\d\s().-]{7,}\d|\b\d{10}\b|\b\d{3}[\s.-]\d{3}[\s.-]\d{4}\b|\(\d{3}\)\s?\d{3}[\s.-]\d{4}/;

/** Every string the content layer exposes, as one blob. */
function allContentText(): string {
  return JSON.stringify([
    getProfile(),
    getSkillGroups(),
    getAllProjects(),
    getExperience(),
    getCertifications(),
  ]);
}

/** Source of the data files (tests excluded, so the patterns above are not matched by themselves). */
function dataSources(): { file: string; text: string }[] {
  const dir = __dirname;
  return readdirSync(dir)
    .filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"))
    .map((file) => ({ file, text: readFileSync(join(dir, file), "utf8") }));
}

describe("projects", () => {
  it("have unique slugs and unique order values", () => {
    const projects = getAllProjects();
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
    expect(new Set(projects.map((p) => p.order)).size).toBe(projects.length);
  });

  it("splits into featured (Selected work) and other projects without losing any", () => {
    expect(getFeaturedProjects().map((p) => p.slug)).toEqual(["managerapp", "tu-conjunto"]);
    expect(getFeaturedProjects().length + getOtherProjects().length).toBe(getAllProjects().length);
  });

  it("gives every featured project a case-study link that matches its slug", () => {
    for (const p of getFeaturedProjects()) {
      expect(p.links.caseStudy, p.slug).toBe(`/work/${p.slug}`);
    }
  });

  it("keeps private projects private: note present, no repo, no demo link", () => {
    for (const p of getFeaturedProjects()) {
      expect(p.privateNote, p.slug).toBe("Code private · walkthrough available on request");
      expect(p.links.repo, p.slug).toBeUndefined();
      expect(p.links.demo, p.slug).toBeUndefined();
    }
  });

  it("only links to allow-listed public repos", () => {
    for (const p of getAllProjects()) {
      if (p.links.repo) expect(REPO_ALLOW_LIST, p.slug).toContain(p.links.repo);
    }
    expect(getProjectBySlug("portfolio")?.links.repo).toBe(REPO_ALLOW_LIST[0]);
  });

  it("looks projects up by slug", () => {
    expect(getProjectBySlug("managerapp")?.name).toBe("Managerapp");
    expect(getProjectBySlug("nope")).toBeUndefined();
  });
});

describe("certifications", () => {
  it("never marks something certified without a credential URL", () => {
    for (const c of getCertifications()) {
      if (c.status === "certified") {
        expect(c.credentialUrl, c.name).toMatch(/^https:\/\//);
        expect(c.date, c.name).toBeTruthy();
      }
    }
  });

  it("matches the real statuses in context/01", () => {
    const status = Object.fromEntries(getCertifications().map((c) => [c.name, c.status]));
    expect(status).toEqual({
      "AWS Certified Cloud Practitioner (CLF-C02)": "in-progress",
      "GitHub Foundations": "course-completed",
      "MongoDB Associate Developer (Node.js)": "in-progress",
      "Cybersecurity Technician": "in-progress",
    });
    // Update this expectation only after an exam is actually passed.
    expect(getCertifications().some((c) => c.status === "certified")).toBe(false);
  });
});

describe("experience", () => {
  it("lists work (Foundever, Amazon) and education (UNIMINUTO)", () => {
    expect(getExperience("work").map((e) => e.company)).toEqual([
      "Foundever (Affirm account)",
      "Amazon",
    ]);
    expect(getExperience("education").map((e) => e.company)).toEqual(["UNIMINUTO"]);
  });

  it("has exactly one current job and every entry has bullets", () => {
    expect(getExperience("work").filter((e) => e.current)).toHaveLength(1);
    for (const e of getExperience()) expect(e.bullets.length, e.company).toBeGreaterThan(0);
  });
});

describe("profile", () => {
  it("reuses the single definitions in src/lib/site.ts", () => {
    const profile = getProfile();
    expect(profile.email).toBe(SITE.email);
    expect(profile.location).toBe(SITE.location);
    expect(profile.socials).toEqual(SOCIAL_URLS);
  });

  it("uses the site headline and a root-relative résumé path", () => {
    expect(getProfile().headline).toBe("Backend-minded full-stack developer.");
    expect(getProfile().resumeUrl).toMatch(/^\/[^/]/);
  });

  it("has the skill groups the About section needs, none empty", () => {
    const groups = getSkillGroups();
    expect(groups.map((g) => g.name)).toEqual(
      expect.arrayContaining(["Frontend", "Backend", "Data", "Cloud & DevOps", "Testing"]),
    );
    for (const g of groups) expect(g.items.length, g.name).toBeGreaterThan(0);
  });
});

describe("privacy", () => {
  it("contains no email other than hello@sebastiannino.me", () => {
    const found = [
      ...(allContentText().match(EMAIL_PATTERN) ?? []),
      ...dataSources().flatMap(({ text }) => text.match(EMAIL_PATTERN) ?? []),
    ];
    expect(found.length).toBeGreaterThan(0); // profile.email is in the content
    for (const email of found) expect(email.toLowerCase()).toBe(PUBLIC_EMAIL);
  });

  it("contains no phone numbers in the content or in src/data", () => {
    expect(allContentText()).not.toMatch(PHONE_PATTERN);
    for (const { file, text } of dataSources()) expect(text, file).not.toMatch(PHONE_PATTERN);
  });

  it("phone pattern catches typical formats (so the check above is not vacuous)", () => {
    for (const sample of ["+57 300 123 4567", "3001234567", "300-123-4567", "(300) 123-4567"]) {
      expect(sample).toMatch(PHONE_PATTERN);
    }
    // Facts that look numeric but are not phone numbers
    for (const ok of ["489 E2E tests", "Jun 2024 – Jun 2026", "Expected graduation Dec 2027"]) {
      expect(ok).not.toMatch(PHONE_PATTERN);
    }
  });
});
