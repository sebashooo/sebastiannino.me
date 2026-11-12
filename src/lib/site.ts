/** Site-wide constants. Copy comes from context/02-brief-portafolio.md. */
export const SITE = {
  name: "Sebastián Niño",
  title: "Sebastián Niño — Backend-minded Full-Stack Developer",
  description:
    "Junior full-stack developer from Colombia focused on backend, data and cloud. Next.js, NestJS, PostgreSQL, AWS. Open to remote roles.",
  launchDate: "2026-11-19",
} as const;

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
