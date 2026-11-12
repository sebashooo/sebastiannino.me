import type { SkillGroup } from "@/data";

/** The command shown "typed" in the hero terminal. */
export const STACK_COMMAND = "sebastian --stack";

export type StackRow = {
  /** Group name in the terminal's lowercase style, e.g. "cloud & devops". */
  label: string;
  /** Skill items exactly as stored in the data. */
  items: string[];
  /** The items as one line, e.g. "Next.js · React · Tailwind CSS". */
  text: string;
};

const SEPARATOR = " · ";

/**
 * Builds the output of `sebastian --stack` from the skill groups.
 * Pure and data-driven: nothing is hardcoded here, so changing the data changes the output.
 * Reused by the interactive terminal (F4-01/F4-02).
 */
export function buildStackOutput(groups: readonly SkillGroup[]): StackRow[] {
  return groups.map((group) => ({
    label: group.name.toLowerCase(),
    items: [...group.items],
    text: group.items.join(SEPARATOR),
  }));
}

/** Plain-text version with aligned columns, for contexts without layout (e.g. a text-only terminal). */
export function formatStackOutput(rows: readonly StackRow[]): string[] {
  const width = Math.max(0, ...rows.map((row) => row.label.length));
  return rows.map((row) => `${row.label.padEnd(width)}  ${row.text}`);
}
