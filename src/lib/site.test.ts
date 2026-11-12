import { describe, expect, it } from "vitest";
import { SITE, formatLaunchDate } from "./site";

describe("formatLaunchDate", () => {
  it("formats an ISO date as 'Mon D, YYYY'", () => {
    expect(formatLaunchDate("2026-11-19")).toBe("Nov 19, 2026");
  });

  it("formats the configured launch date", () => {
    expect(formatLaunchDate(SITE.launchDate)).toBe("Nov 19, 2026");
  });
});
