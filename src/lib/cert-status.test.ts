import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { CertStatus } from "@/data";
import {
  CERT_STATUS,
  CHIP_STYLES,
  certStatusLabel,
  certStatusVariant,
  type ChipVariant,
} from "./cert-status";

// Every CertStatus value. `satisfies` + the Record in cert-status.ts keep this list honest:
// adding a status to the type without updating both fails typecheck or these tests.
const ALL_STATUSES = [
  "certified",
  "in-progress",
  "course-completed",
  "planned",
] as const satisfies readonly CertStatus[];

describe("certification status mapping", () => {
  it("covers every CertStatus value", () => {
    expect(Object.keys(CERT_STATUS).sort()).toEqual([...ALL_STATUSES].sort());
  });

  it("maps each status to its visible label", () => {
    expect(certStatusLabel("certified")).toBe("Certified");
    expect(certStatusLabel("in-progress")).toBe("In progress");
    expect(certStatusLabel("course-completed")).toBe("Course completed");
    expect(certStatusLabel("planned")).toBe("Planned");
  });

  it("maps each status to its chip variant", () => {
    expect(certStatusVariant("certified")).toBe("certified");
    expect(certStatusVariant("in-progress")).toBe("progress");
    expect(certStatusVariant("course-completed")).toBe("neutral");
    expect(certStatusVariant("planned")).toBe("neutral");
  });

  it("only the 'certified' status can ever read 'Certified'", () => {
    for (const status of ALL_STATUSES) {
      if (status === "certified") expect(certStatusLabel(status)).toBe("Certified");
      else expect(certStatusLabel(status), status).not.toMatch(/certified/i);
    }
  });

  it("has a distinct label for every status, so status never depends on color", () => {
    const labels = ALL_STATUSES.map(certStatusLabel);
    expect(new Set(labels).size).toBe(labels.length);
  });
});

// --- AA contrast for every chip variant, computed from the real design tokens ---

const css = readFileSync(join(__dirname, "../app/globals.css"), "utf8");

function token(name: string): [number, number, number] {
  const match = css.match(new RegExp(`--color-${name}:\\s*#([0-9a-f]{6})`, "i"));
  if (!match) throw new Error(`Token --color-${name} not found in globals.css`);
  const hex = match[1];
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number];
}

function luminance([r, g, b]: number[]): number {
  const [R, G, B] = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrast(a: number[], b: number[]): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function blend(fg: number[], bg: number[], alpha: number): number[] {
  return fg.map((c, i) => c * alpha + bg[i] * (1 - alpha));
}

describe("chip contrast (WCAG AA, 4.5:1 for small text)", () => {
  const cardSurface = token("surface");

  for (const variant of Object.keys(CHIP_STYLES) as ChipVariant[]) {
    it(`${variant} chip text is readable on its background`, () => {
      const style = CHIP_STYLES[variant];
      const background = blend(token(style.bg), cardSurface, style.bgAlpha);
      expect(contrast(token(style.fg), background)).toBeGreaterThanOrEqual(4.5);
    });

    it(`${variant} chip classes use the tokens the contrast check assumes`, () => {
      const { className, fg, bg } = CHIP_STYLES[variant];
      expect(className).toContain(`text-${fg}`);
      expect(className).toContain(`bg-${bg}`);
    });
  }
});
