import type { Metadata } from "next";
import { getCaseStudies, getProfile, type CaseStudy } from "@/data";
import { SITE } from "./site";

/** Pure SEO helpers (F4-03): JSON-LD and sitemap content, built from src/data. */

export const JOB_TITLE = "Full-Stack Developer";

export function absoluteUrl(path: string): string {
  return new URL(path, SITE.url).toString();
}

/**
 * schema.org Person for the home page. Only public facts: no phone, no address, no email.
 * `sameAs` points at the public profiles from the data.
 */
export function personJsonLd() {
  const profile = getProfile();
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: SITE.url,
    jobTitle: JOB_TITLE,
    description: SITE.description,
    sameAs: [profile.socials.github, profile.socials.linkedin],
  };
}

/** JSON for a <script type="application/ld+json">; `<` is escaped so the data can never close the tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export type SitemapEntry = { path: string; lastModified?: string };

/**
 * What the sitemap lists: the home page and every published case study. Drafts (draft: true) are
 * left out: they stay noindex until F5-01 flips the flag, and the sitemap follows the flag.
 */
export function sitemapEntries(studies: readonly CaseStudy[] = getCaseStudies()): SitemapEntry[] {
  return [
    { path: "/" },
    ...studies
      .filter((c) => !c.draft)
      .map((c) => ({ path: `/work/${c.slug}`, lastModified: c.updatedAt ?? c.publishedAt })),
  ];
}

/**
 * The robots metadata of a case-study page: drafts are noindex (follow stays on), published case
 * studies set nothing so they inherit the default, indexable behaviour. Kept pure so tests can check
 * the published branch without flipping any flag (F5-01 part b).
 */
export function caseStudyRobots(draft: boolean): Pick<Metadata, "robots"> {
  return draft ? { robots: { index: false, follow: true } } : {};
}
