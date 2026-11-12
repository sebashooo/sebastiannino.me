import { describe, expect, it } from "vitest";
import { SITE, SOCIALS, formatLaunchDate, mailtoHref } from "./site";

describe("formatLaunchDate", () => {
  it("formats an ISO date as 'Mon D, YYYY'", () => {
    expect(formatLaunchDate("2026-11-19")).toBe("Nov 19, 2026");
  });

  it("formats the configured launch date", () => {
    expect(formatLaunchDate(SITE.launchDate)).toBe("Nov 19, 2026");
  });
});

describe("mailtoHref", () => {
  it("builds a mailto link from the single email constant", () => {
    expect(mailtoHref()).toBe("mailto:hello@sebastiannino.me");
    expect(mailtoHref()).toBe(`mailto:${SITE.email}`);
  });
});

describe("SOCIALS", () => {
  it("only lists absolute https URLs", () => {
    for (const { href } of SOCIALS) expect(href).toMatch(/^https:\/\//);
  });
});
