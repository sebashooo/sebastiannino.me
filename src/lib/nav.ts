/**
 * Navigation data. Hrefs use "/#id" so the links also work from other pages (e.g. case studies).
 * The blog link stays out until there is content (context/02).
 */
export const NAV_LINKS = [
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
] as const;

/** Anchor of the footer/contact section. */
export const CONTACT_HREF = "/#contact";

/** Pixels scrolled before the nav gets its blur and bottom border. */
export const SCROLL_THRESHOLD = 8;

export function isScrolled(scrollY: number, threshold: number = SCROLL_THRESHOLD): boolean {
  return scrollY > threshold;
}
