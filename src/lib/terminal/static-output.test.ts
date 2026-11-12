import { describe, expect, it } from "vitest";
import { getSkillGroups, type SkillGroup } from "@/data";
import { STACK_COMMAND, buildStackOutput, formatStackOutput } from "./static-output";

describe("buildStackOutput", () => {
  it("shows every skill group from the real data, in order", () => {
    const groups = getSkillGroups();
    const rows = buildStackOutput(groups);
    expect(rows.map((r) => r.label)).toEqual(groups.map((g) => g.name.toLowerCase()));
  });

  it("keeps every skill item exactly as stored in the data", () => {
    const groups = getSkillGroups();
    const rows = buildStackOutput(groups);
    groups.forEach((group, i) => {
      expect(rows[i].items).toEqual(group.items);
      for (const item of group.items) expect(rows[i].text).toContain(item);
    });
  });

  it("is driven by its input: different data gives different output (nothing hardcoded)", () => {
    const fake: SkillGroup[] = [
      { name: "Backend", items: ["Zig", "Elixir"] },
      { name: "Cloud & DevOps", items: ["Nomad"] },
    ];
    const rows = buildStackOutput(fake);
    expect(rows).toEqual([
      { label: "backend", items: ["Zig", "Elixir"], text: "Zig · Elixir" },
      { label: "cloud & devops", items: ["Nomad"], text: "Nomad" },
    ]);
    const output = JSON.stringify(rows);
    for (const real of getSkillGroups().flatMap((g) => g.items)) expect(output).not.toContain(real);
  });

  it("does not mutate the input", () => {
    const groups = getSkillGroups();
    const snapshot = JSON.stringify(groups);
    buildStackOutput(groups)[0].items.push("extra");
    expect(JSON.stringify(groups)).toBe(snapshot);
  });

  it("handles no groups", () => {
    expect(buildStackOutput([])).toEqual([]);
    expect(formatStackOutput([])).toEqual([]);
  });
});

describe("formatStackOutput", () => {
  it("aligns the columns on the longest label", () => {
    const lines = formatStackOutput(
      buildStackOutput([
        { name: "Data", items: ["PostgreSQL"] },
        { name: "Cloud & DevOps", items: ["Vercel"] },
      ]),
    );
    expect(lines).toEqual(["data            PostgreSQL", "cloud & devops  Vercel"]);
  });
});

describe("STACK_COMMAND", () => {
  it("is the command from the design", () => {
    expect(STACK_COMMAND).toBe("sebastian --stack");
  });
});
