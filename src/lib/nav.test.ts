import { describe, expect, it } from "vitest";
import { CONTACT_HREF, NAV_LINKS, SCROLL_THRESHOLD, isScrolled } from "./nav";

describe("NAV_LINKS", () => {
  it("points every link to a unique home-page anchor", () => {
    const hrefs = NAV_LINKS.map((l) => l.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const href of [...hrefs, CONTACT_HREF]) expect(href).toMatch(/^\/#[a-z-]+$/);
  });
});

describe("isScrolled", () => {
  it("is false at the top and up to the threshold", () => {
    expect(isScrolled(0)).toBe(false);
    expect(isScrolled(SCROLL_THRESHOLD)).toBe(false);
  });

  it("is true past the threshold", () => {
    expect(isScrolled(SCROLL_THRESHOLD + 1)).toBe(true);
  });
});
