import type { CertStatus } from "@/data";

export type ChipVariant = "certified" | "progress" | "neutral";

/**
 * Visible label and chip variant for every certification status.
 * The label is always shown as text, so status is never conveyed by color alone.
 * `Record<CertStatus, ...>` makes the compiler fail if a new status is added without a mapping.
 */
export const CERT_STATUS: Record<CertStatus, { label: string; variant: ChipVariant }> = {
  certified: { label: "Certified", variant: "certified" },
  "in-progress": { label: "In progress", variant: "progress" },
  "course-completed": { label: "Course completed", variant: "neutral" },
  planned: { label: "Planned", variant: "neutral" },
};

/**
 * Chip styling per variant: the Tailwind classes plus the design tokens behind them, so a unit
 * test can check AA contrast for every variant (including ones the current data does not use).
 * `fg`/`bg` are token names without the "--color-" prefix; `bgAlpha` is the chip background's
 * opacity over the card surface.
 */
export const CHIP_STYLES: Record<
  ChipVariant,
  { className: string; fg: string; bg: string; bgAlpha: number }
> = {
  certified: {
    className: "bg-success/15 text-success",
    fg: "success",
    bg: "success",
    bgAlpha: 0.15,
  },
  progress: { className: "bg-accent/15 text-accent", fg: "accent", bg: "accent", bgAlpha: 0.15 },
  neutral: {
    className: "border border-border bg-surface-2 text-text-muted",
    fg: "text-muted",
    bg: "surface-2",
    bgAlpha: 1,
  },
};

export function certStatusLabel(status: CertStatus): string {
  return CERT_STATUS[status].label;
}

export function certStatusVariant(status: CertStatus): ChipVariant {
  return CERT_STATUS[status].variant;
}
