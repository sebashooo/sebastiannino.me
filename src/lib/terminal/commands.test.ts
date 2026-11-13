import { describe, expect, it } from "vitest";
import { getAllProjects, getExperience, getProfile, getSkillGroups } from "@/data";
import {
  completeCommand,
  getTerminalData,
  runCommand,
  visibleCommands,
  type CommandResult,
  type TerminalData,
} from "./commands";

const texts = (r: CommandResult) => r.lines.map((l) => l.text);
const joined = (r: CommandResult) => texts(r).join("\n");

describe("help", () => {
  it("lists every non-hidden command and nothing hidden", () => {
    const out = joined(runCommand("help"));
    for (const c of visibleCommands()) expect(out).toContain(c.name);
    for (const name of [
      "help",
      "whoami",
      "projects",
      "stack",
      "experience",
      "resume",
      "contact",
      "clear",
    ]) {
      expect(visibleCommands().map((c) => c.name)).toContain(name);
    }
    expect(out).not.toContain("sudo");
    expect(out).not.toContain("hire-me");
    expect(out).not.toContain("sebastian ");
  });

  it("describes one command, including its aliases, and rejects unknown or hidden ones", () => {
    expect(joined(runCommand("help resume"))).toMatch(/resume — .*also: cv/);
    expect(runCommand("help nope").lines[0]).toMatchObject({ tone: "error" });
    expect(joined(runCommand("help sudo"))).toContain("no help for 'sudo'");
    expect(joined(runCommand("help a b"))).toContain("at most one command");
  });
});

describe("input normalization", () => {
  it("treats case and extra whitespace as the same command", () => {
    const expected = runCommand("help");
    expect(runCommand("  HELP ")).toEqual(expected);
    expect(runCommand("\thelp\t")).toEqual(expected);
    expect(runCommand("Sudo   HIRE-me")).toEqual(runCommand("sudo hire-me"));
  });

  it("does nothing for empty or whitespace-only input", () => {
    expect(runCommand("")).toEqual({ lines: [] });
    expect(runCommand("   \t  ")).toEqual({ lines: [] });
  });

  it("resolves aliases to their command", () => {
    expect(runCommand("cv")).toEqual(runCommand("resume"));
    expect(runCommand("about")).toEqual(runCommand("whoami"));
    expect(runCommand("work")).toEqual(runCommand("projects"));
    expect(runCommand("skills")).toEqual(runCommand("stack"));
    expect(runCommand("exp")).toEqual(runCommand("experience"));
    expect(runCommand("email")).toEqual(runCommand("contact"));
    expect(runCommand("cls")).toEqual(runCommand("clear"));
    expect(runCommand("?")).toEqual(runCommand("help"));
  });
});

describe("unknown commands", () => {
  it("answers command not found with a hint to run help", () => {
    const r = runCommand("foo");
    expect(texts(r)).toEqual(["command not found: foo — try 'help'"]);
    expect(r.lines[0].tone).toBe("error");
    expect(r.clear).toBeUndefined();
    expect(r.link).toBeUndefined();
  });

  it("normalizes the echoed name and caps a very long one", () => {
    expect(joined(runCommand("  FOO bar"))).toBe("command not found: foo — try 'help'");
    const long = joined(runCommand("x".repeat(500)));
    expect(long.length).toBeLessThan(100);
    expect(long.endsWith("— try 'help'")).toBe(true);
  });

  it("never throws, whatever it is given", () => {
    for (const input of [
      "<script>alert(1)</script>",
      "\u0000",
      "💥",
      "a".repeat(10_000),
      "sudo",
      "-",
      "&&",
    ]) {
      expect(() => runCommand(input)).not.toThrow();
    }
  });
});

describe("arguments are handled predictably", () => {
  it("rejects extra arguments on commands that take none", () => {
    for (const cmd of ["whoami", "projects", "stack", "experience", "resume", "contact", "clear"]) {
      const r = runCommand(`${cmd} extra`);
      expect(texts(r)).toEqual([`${cmd}: takes no arguments — try 'help'`]);
      expect(r.clear).toBeUndefined();
      expect(r.link).toBeUndefined();
    }
  });

  it("supports the hero command: sebastian --stack and --help", () => {
    expect(runCommand("sebastian --stack")).toEqual(runCommand("stack"));
    expect(runCommand("sebastian --help")).toEqual(runCommand("help"));
    expect(joined(runCommand("sebastian"))).toContain("usage: sebastian");
    expect(joined(runCommand("sebastian --nope"))).toContain("usage: sebastian");
  });

  it("handles bare and unknown sudo", () => {
    expect(joined(runCommand("sudo"))).toBe("usage: sudo <command>");
    expect(joined(runCommand("sudo rm"))).toBe("sudo: rm: command not found");
    expect(joined(runCommand("sudo hire-me now"))).toContain("command not found");
  });
});

describe("commands read from src/data", () => {
  const data = getTerminalData();

  it("whoami shows the profile", () => {
    const out = joined(runCommand("whoami", data));
    expect(out).toContain(getProfile().name);
    expect(out).toContain(getProfile().headline);
    expect(out).toContain(getProfile().availability);
  });

  it("projects lists every project with its one-liner and links case studies", () => {
    const r = runCommand("projects", data);
    for (const p of getAllProjects()) {
      expect(texts(r)).toContain(p.name);
      expect(texts(r)).toContain(p.oneLiner);
    }
    const links = r.lines.filter((l) => l.href).map((l) => l.href);
    expect(links).toEqual(
      getAllProjects().flatMap((p) => (p.links.caseStudy ? [p.links.caseStudy] : [])),
    );
  });

  it("stack lists every skill group and item, in the shared static format", () => {
    const out = joined(runCommand("stack", data));
    for (const g of getSkillGroups()) {
      expect(out).toContain(g.name.toLowerCase());
      for (const item of g.items) expect(out).toContain(item);
    }
  });

  it("experience lists every entry with its period", () => {
    const out = joined(runCommand("experience", data));
    for (const e of getExperience()) {
      expect(out).toContain(`${e.role} — ${e.company}`);
      expect(out).toContain(e.period);
    }
  });

  it("changes when the data changes", () => {
    const changed: TerminalData = {
      ...data,
      profile: { ...data.profile, name: "Test Person", email: "test@example.test" },
      projects: [{ ...data.projects[0], name: "Renamed Project" }],
    };
    expect(joined(runCommand("whoami", changed))).toContain("Test Person");
    expect(joined(runCommand("projects", changed))).toContain("Renamed Project");
    expect(joined(runCommand("projects", changed))).not.toContain(data.projects[0].name);
    expect(joined(runCommand("contact", changed))).toContain("test@example.test");
  });
});

describe("resume and contact", () => {
  it("resume returns the résumé link from the data", () => {
    const r = runCommand("resume");
    expect(r.link).toEqual({ href: getProfile().resumeUrl, label: "Download résumé (PDF)" });
    expect(r.link?.auto).toBeUndefined(); // shown as a link, never followed automatically
    expect(r.lines[0].href).toBe("/resume.pdf");
  });

  it("contact returns the email, LinkedIn and GitHub from the data", () => {
    const p = getProfile();
    const hrefs = runCommand("contact").lines.map((l) => l.href);
    expect(hrefs).toEqual([`mailto:${p.email}`, p.socials.linkedin, p.socials.github]);
    expect(p.email).toBe("hello@sebastiannino.me");
  });
});

describe("clear and the easter egg", () => {
  it("clear returns a clear signal and no text", () => {
    expect(runCommand("clear")).toEqual({ lines: [], clear: true });
  });

  it("sudo hire-me grants permission and asks the UI to open the email", () => {
    const r = runCommand("sudo hire-me");
    expect(texts(r)).toContain("Permission granted. Opening email…");
    expect(r.link).toEqual({
      href: "mailto:hello@sebastiannino.me",
      label: "Email hello@sebastiannino.me",
      auto: true,
    });
    expect(r.clear).toBeUndefined();
  });
});

describe("purity and privacy", () => {
  it("is deterministic: the same input gives the same result", () => {
    for (const input of ["help", "projects", "nope", "sudo hire-me", ""]) {
      expect(runCommand(input)).toEqual(runCommand(input));
    }
  });

  it("does not mutate the data it reads", () => {
    const data = getTerminalData();
    const before = JSON.stringify(data);
    for (const c of [
      "help",
      "whoami",
      "projects",
      "stack",
      "experience",
      "resume",
      "contact",
      "clear",
    ]) {
      runCommand(c, data);
    }
    expect(JSON.stringify(data)).toBe(before);
  });

  it("never prints a phone number, another email, an unverified count or a banned claim", () => {
    const all = [
      "help",
      "whoami",
      "projects",
      "stack",
      "experience",
      "resume",
      "contact",
      "clear",
      "sudo hire-me",
      "nope",
    ]
      .map((c) => joined(runCommand(c)))
      .join("\n");
    expect(all).not.toMatch(/\+?\d[\d\s().-]{8,}\d/);
    expect(all).not.toMatch(/489/);
    expect(all).not.toMatch(/verified in production/i);
    const emails = all.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g) ?? [];
    expect(new Set(emails)).toEqual(new Set(["hello@sebastiannino.me"]));
  });

  it("only links to internal paths, https and mailto", () => {
    for (const c of ["projects", "contact", "resume", "sudo hire-me"]) {
      for (const l of runCommand(c).lines) {
        if (l.href) expect(l.href).toMatch(/^(\/|https:\/\/|mailto:)/);
      }
    }
  });
});

describe("completeCommand (Tab)", () => {
  it("completes a unique prefix of a visible command", () => {
    expect(completeCommand("pro")).toBe("projects");
    expect(completeCommand("HE")).toBe("help");
    expect(completeCommand("  w")).toBe("whoami");
  });

  it("returns null for ambiguous, unknown, hidden or multi-word input", () => {
    expect(completeCommand("")).toBeNull();
    expect(completeCommand("c")).toBeNull(); // contact, clear
    expect(completeCommand("zzz")).toBeNull();
    expect(completeCommand("su")).toBeNull(); // hidden easter egg
    expect(completeCommand("help me")).toBeNull();
  });
});
