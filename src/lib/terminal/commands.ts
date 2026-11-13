import {
  getExperience,
  getAllProjects,
  getProfile,
  getSkillGroups,
  type Experience,
  type Profile,
  type Project,
  type SkillGroup,
  type TerminalCommand,
} from "@/data";
import { buildStackOutput, formatStackOutput } from "./static-output";

/**
 * Pure command parser for the interactive terminal (F4-01). No DOM, React, Date or randomness:
 * the same input and data always give the same result, and every fact in the output comes from
 * src/data (the single source of truth). The interactive widget (F4-02) only renders the result.
 *
 * Input rules (so behaviour is predictable):
 * - Whitespace is trimmed and collapsed, and the input is lowercased: "  HELP " is "help".
 * - Empty input does nothing.
 * - Aliases resolve to their command ("cv" is "resume").
 * - Commands take no arguments, except `help [command]`, `sudo <command>` and the hero's
 *   `sebastian --stack` / `sebastian --help`. An extra argument is an error, never ignored.
 * - An unknown command answers "command not found: <cmd> — try 'help'".
 */

export type LineTone = "default" | "muted" | "success" | "error" | "accent";

export type OutputLine = {
  text: string;
  tone?: LineTone;
  /** Renders the line as a link (an internal path, https: or mailto:). */
  href?: string;
  /** Indented continuation under the previous line. */
  indent?: boolean;
};

export type CommandResult = {
  lines: OutputLine[];
  /** Clear the screen instead of printing (the `clear` command). */
  clear?: boolean;
  /**
   * A link the command points at. `auto: true` asks the UI to follow it (the easter egg opens the
   * mail client); otherwise the UI only shows it as a clickable line.
   */
  link?: { href: string; label: string; auto?: boolean };
};

/** The slice of src/data the terminal reads. Injectable so tests can prove the output follows the data. */
export type TerminalData = {
  profile: Profile;
  projects: Project[];
  skillGroups: SkillGroup[];
  experience: Experience[];
};

export function getTerminalData(): TerminalData {
  return {
    profile: getProfile(),
    projects: getAllProjects(),
    skillGroups: getSkillGroups(),
    experience: getExperience(),
  };
}

type Handler = (args: string[], data: TerminalData) => CommandResult;
type Definition = TerminalCommand & { run: Handler };

const MAX_ECHO = 48;
const echo = (text: string) => (text.length > MAX_ECHO ? `${text.slice(0, MAX_ECHO)}…` : text);

const text = (t: string, tone?: LineTone): OutputLine => (tone ? { text: t, tone } : { text: t });
const error = (t: string): CommandResult => ({ lines: [text(t, "error")] });
const noArgs = (name: string): CommandResult => error(`${name}: takes no arguments — try 'help'`);

/** Order here is the order `help` lists them. */
const DEFINITIONS: Definition[] = [
  {
    name: "help",
    description: "List the available commands",
    aliases: ["h", "?"],
    run: (args) => helpFor(args),
  },
  {
    name: "whoami",
    description: "Who is Sebastián",
    aliases: ["about"],
    run: (args, { profile }) =>
      args.length > 0
        ? noArgs("whoami")
        : {
            lines: [
              text(profile.name, "accent"),
              text(profile.headline),
              text(`${profile.location} · ${profile.languages.join(", ")}`, "muted"),
              text(profile.availability, "success"),
            ],
          },
  },
  {
    name: "projects",
    description: "Selected and other projects",
    aliases: ["work"],
    run: (args, { projects }) =>
      args.length > 0
        ? noArgs("projects")
        : {
            lines: projects.flatMap((p): OutputLine[] => [
              p.links.caseStudy
                ? { text: p.name, tone: "accent", href: p.links.caseStudy }
                : text(p.name, "accent"),
              { text: p.oneLiner, tone: "muted", indent: true },
            ]),
          },
  },
  {
    name: "stack",
    description: "Technology stack by area",
    aliases: ["skills"],
    run: (args, { skillGroups }) =>
      args.length > 0
        ? noArgs("stack")
        : { lines: formatStackOutput(buildStackOutput(skillGroups)).map((l) => text(l)) },
  },
  {
    name: "experience",
    description: "Work and education",
    aliases: ["exp"],
    run: (args, { experience }) =>
      args.length > 0
        ? noArgs("experience")
        : {
            lines: experience.flatMap((e): OutputLine[] => [
              text(`${e.role} — ${e.company}`),
              { text: e.period, tone: "muted", indent: true },
            ]),
          },
  },
  {
    name: "resume",
    description: "Download the résumé (PDF)",
    aliases: ["cv"],
    run: (args, { profile }) =>
      args.length > 0
        ? noArgs("resume")
        : {
            lines: [{ text: "Download résumé (PDF)", tone: "accent", href: profile.resumeUrl }],
            link: { href: profile.resumeUrl, label: "Download résumé (PDF)" },
          },
  },
  {
    name: "contact",
    description: "Email and profiles",
    aliases: ["email"],
    run: (args, { profile }) =>
      args.length > 0
        ? noArgs("contact")
        : {
            lines: [
              { text: profile.email, tone: "accent", href: `mailto:${profile.email}` },
              { text: profile.socials.linkedin, tone: "accent", href: profile.socials.linkedin },
              { text: profile.socials.github, tone: "accent", href: profile.socials.github },
            ],
          },
  },
  {
    name: "clear",
    description: "Clear the screen",
    aliases: ["cls"],
    run: (args) => (args.length > 0 ? noArgs("clear") : { lines: [], clear: true }),
  },
  {
    // Easter egg: hidden from `help`
    name: "sudo",
    description: "Run a command with superpowers",
    hidden: true,
    run: (args, { profile }) => {
      if (args.length === 0) return error("usage: sudo <command>");
      if (args.join(" ") !== "hire-me")
        return error(`sudo: ${echo(args.join(" "))}: command not found`);
      const href = `mailto:${profile.email}`;
      return {
        lines: [
          text("[sudo] password for visitor: ********", "muted"),
          text("Permission granted. Opening email…", "success"),
          { text: profile.email, tone: "accent", href },
        ],
        link: { href, label: `Email ${profile.email}`, auto: true },
      };
    },
  },
  {
    // The command the hero terminal shows "typed" (`sebastian --stack`)
    name: "sebastian",
    description: "The hero command: sebastian --stack | --help",
    hidden: true,
    run: (args, data) => {
      if (args.length === 1 && args[0] === "--stack") return runCommand("stack", data);
      if (args.length === 1 && args[0] === "--help") return runCommand("help", data);
      return error("usage: sebastian --stack | --help");
    },
  },
];

const byName = new Map<string, Definition>();
for (const def of DEFINITIONS) {
  byName.set(def.name, def);
  for (const alias of def.aliases ?? []) byName.set(alias, def);
}

/** The commands `help` lists (everything not hidden), for the UI and tests. */
export function visibleCommands(): TerminalCommand[] {
  return DEFINITIONS.filter((d) => !d.hidden).map(({ name, description, aliases }) => ({
    name,
    description,
    aliases,
  }));
}

function helpFor(args: string[]): CommandResult {
  if (args.length > 1) return error("help: takes at most one command — try 'help'");
  if (args.length === 1) {
    const def = byName.get(args[0]);
    if (!def || def.hidden) return error(`help: no help for '${echo(args[0])}' — try 'help'`);
    const aliases = def.aliases?.length ? ` (also: ${def.aliases.join(", ")})` : "";
    return { lines: [text(`${def.name} — ${def.description}${aliases}`)] };
  }
  const commands = visibleCommands();
  const width = Math.max(...commands.map((c) => c.name.length));
  return {
    lines: [
      text("Available commands:", "muted"),
      ...commands.map((c) => text(`${c.name.padEnd(width)}  ${c.description}`)),
      text("Try one. ↑ and ↓ browse your history, Tab completes.", "muted"),
    ],
  };
}

/** Runs one line of input. Never throws; unknown input is an error line, not an exception. */
export function runCommand(input: string, data: TerminalData = getTerminalData()): CommandResult {
  const tokens = input.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return { lines: [] };

  const [name, ...args] = tokens;
  const def = byName.get(name);
  if (!def) return error(`command not found: ${echo(name)} — try 'help'`);
  return def.run(args, data);
}

/**
 * Tab completion for the first word: the one visible command (or alias) that starts with what was
 * typed, or null when there is none or more than one. Only completes a single bare word.
 */
export function completeCommand(input: string): string | null {
  const typed = input.trim().toLowerCase();
  if (typed === "" || /\s/.test(typed)) return null;
  const matches = DEFINITIONS.filter((d) => !d.hidden && d.name.startsWith(typed)).map(
    (d) => d.name,
  );
  return matches.length === 1 ? matches[0] : null;
}
