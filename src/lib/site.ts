/** Site-wide constants. Copy comes from context/02-brief-portafolio.md. */
export const SITE = {
  name: "Sebastián Niño",
  title: "Sebastián Niño — Backend-minded Full-Stack Developer",
  description:
    "Junior full-stack developer from Colombia focused on backend, data and cloud. Next.js, NestJS, PostgreSQL, AWS. Open to remote roles.",
  /**
   * Canonical origin for metadata, the sitemap and JSON-LD. The domain is connected in Phase 5
   * (F0-04); until then these URLs point at the intended address.
   */
  url: "https://sebastiannino.me",
  launchDate: "2026-11-19",
  /** The only public email address. Every mailto link and visible address must come from here. */
  email: "hello@sebastiannino.me",
  location: "Bogotá, Colombia",
} as const;

/**
 * Public profile URLs (context/01). The LinkedIn URL will change to /in/sebastiannino
 * once the custom URL is set (see context/06); update it here only.
 */
export const SOCIAL_URLS = {
  github: "https://github.com/sebashooo",
  linkedin: "https://www.linkedin.com/in/sebastian-felipe-ni%C3%B1o-vargas",
} as const;

/** Same URLs as a list, for rendering links (footer). */
export const SOCIALS = [
  { label: "LinkedIn", href: SOCIAL_URLS.linkedin },
  { label: "GitHub", href: SOCIAL_URLS.github },
] as const;

/** `mailto:` link for the site's email address. */
export function mailtoHref(email: string = SITE.email): string {
  return `mailto:${email}`;
}

/**
 * Formats an ISO date (YYYY-MM-DD) as "Nov 19, 2026".
 * Pinned to UTC so the result never shifts with the machine's timezone.
 */
export function formatLaunchDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}
