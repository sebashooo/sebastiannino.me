"use client";

import Link from "next/link";
import { useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from "react";
import { RESUME_FILENAME } from "@/lib/site";
import type { LineTone, OutputLine } from "@/lib/terminal/commands";

/**
 * Interactive prompt of the hero terminal (F4-02). The only client part of the terminal: the
 * server-rendered figure around it already holds the static `sebastian --stack` output, so search
 * engines, screen readers and no-JS visitors get content; this adds typing on top.
 *
 * - The parser (src/lib/terminal/commands.ts) and the data it reads are loaded on first focus, in
 *   a separate chunk, so they cost nothing at initial load.
 * - Enter runs, ↑/↓ browse the history, Tab completes a unique command (and otherwise moves focus
 *   on, so the terminal is never a keyboard trap), Ctrl+L clears.
 * - Output goes in a polite live region (role="log"). Nothing animates, so reduced motion is
 *   respected by construction; new output appears instantly.
 * - Before hydration, and without JS, it renders the same static prompt glyph as before.
 */

type Commands = typeof import("@/lib/terminal/commands");
type Entry = { id: number; input: string; lines: OutputLine[] };

const MAX_HISTORY = 50;
const HINT_ID = "terminal-hint";

const TONE: Record<LineTone, string> = {
  default: "text-text-body",
  muted: "text-text-muted",
  success: "text-success",
  error: "text-text",
  accent: "text-accent",
};

// True on the client after hydration, false on the server and during hydration.
const subscribe = () => () => {};
const useHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

function Line({ line }: { line: OutputLine }) {
  const classes = `${TONE[line.tone ?? "default"]} ${line.indent ? "pl-4" : ""}`;
  const { href } = line;
  let content: ReactNode = line.text;
  if (href) {
    const internalPage = href.startsWith("/") && !/\.[a-z0-9]+$/i.test(href);
    content = internalPage ? (
      <Link href={href} className="underline underline-offset-4 hover:text-accent-hover">
        {line.text}
      </Link>
    ) : (
      <a
        href={href}
        {...(href.startsWith("https:") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...(/\.pdf$/i.test(href) ? { download: RESUME_FILENAME } : {})}
        className="underline underline-offset-4 hover:text-accent-hover"
      >
        {line.text}
      </a>
    );
  }
  return <p className={`m-0 break-words whitespace-pre-wrap ${classes}`}>{content}</p>;
}

export function TerminalPrompt() {
  const hydrated = useHydrated();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [value, setValue] = useState("");
  const history = useRef<string[]>([]);
  const cursor = useRef<number | null>(null); // position in history while browsing, null = typing
  const draft = useRef(""); // what was typed before browsing the history
  const commands = useRef<Commands | null>(null);
  const nextId = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // Static look until hydrated: same glyph and height as the interactive row (no layout shift)
  if (!hydrated) {
    return (
      <p aria-hidden="true" className="m-0 mt-1.5 flex min-h-7 items-center text-accent">
        ❯
      </p>
    );
  }

  const load = async (): Promise<Commands> => {
    commands.current ??= await import("@/lib/terminal/commands");
    return commands.current;
  };

  const submit = async () => {
    const raw = value;
    if (raw.trim() === "") return;
    const { runCommand } = await load();
    const result = runCommand(raw);

    if (history.current[history.current.length - 1] !== raw.trim()) {
      history.current = [...history.current, raw.trim()].slice(-MAX_HISTORY);
    }
    cursor.current = null;
    draft.current = "";
    setValue("");

    if (result.clear) {
      setEntries([]);
    } else {
      setEntries((prev) => [
        ...prev,
        { id: nextId.current++, input: raw.trim(), lines: result.lines },
      ]);
    }
    // Keep the newest output in view (instant, never animated)
    requestAnimationFrame(() => {
      const log = logRef.current;
      if (log) log.scrollTop = log.scrollHeight;
    });
    // The easter egg asks to open the mail client; a user pressed Enter, so this is a real gesture
    if (result.link?.auto) window.location.href = result.link.href;
  };

  const browse = (direction: -1 | 1) => {
    const list = history.current;
    if (list.length === 0) return false;
    if (cursor.current === null) {
      if (direction === 1) return false;
      draft.current = value;
      cursor.current = list.length - 1;
    } else {
      const next = cursor.current + direction;
      if (next >= list.length) {
        cursor.current = null;
        setValue(draft.current);
        return true;
      }
      cursor.current = Math.max(0, next);
    }
    setValue(list[cursor.current]);
    return true;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return; // IME composition: leave Enter and arrows alone
    if (e.key === "Enter") {
      e.preventDefault();
      void submit();
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      if (browse(e.key === "ArrowUp" ? -1 : 1)) e.preventDefault();
    } else if (e.key === "Tab" && !e.shiftKey && !e.altKey && !e.ctrlKey && !e.metaKey) {
      // Only swallow Tab when there is something to complete; otherwise focus moves on normally
      const completed = commands.current?.completeCommand(value) ?? null;
      if (completed) {
        e.preventDefault();
        setValue(completed);
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setEntries([]);
    }
  };

  return (
    <div
      className="mt-1.5 flex flex-col gap-1.5"
      onClick={() => {
        if (!window.getSelection()?.toString()) inputRef.current?.focus();
      }}
    >
      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Terminal output"
        // Scrollable regions must be keyboard-reachable
        tabIndex={entries.length > 0 ? 0 : undefined}
        className="flex max-h-72 flex-col gap-3 overflow-y-auto"
      >
        {entries.map((entry) => (
          <div key={entry.id} className="flex flex-col gap-0.5">
            <p className="m-0 break-words text-text-body">
              <span aria-hidden="true" className="text-accent">
                ❯
              </span>{" "}
              {entry.input}
            </p>
            {entry.lines.map((line, i) => (
              <Line key={i} line={line} />
            ))}
          </div>
        ))}
      </div>

      <div className="flex min-h-7 items-center gap-2">
        <span aria-hidden="true" className="text-accent">
          ❯
        </span>
        <label htmlFor="terminal-input" className="sr-only">
          Type a command, for example help
        </label>
        <input
          ref={inputRef}
          id="terminal-input"
          type="text"
          value={value}
          onChange={(e) => {
            cursor.current = null;
            setValue(e.target.value);
          }}
          onKeyDown={onKeyDown}
          // Loads the parser before the first Enter or Tab, in its own chunk
          onFocus={() => void load()}
          aria-describedby={HINT_ID}
          placeholder="try: help"
          maxLength={200}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          enterKeyHint="send"
          // 16px on phones stops iOS from zooming the page on focus; 13px from sm up like the rest
          className="min-w-0 flex-1 border-0 bg-transparent p-0 font-mono text-base text-text caret-accent placeholder:text-text-muted sm:text-[13px]"
        />
      </div>
      <p id={HINT_ID} className="sr-only">
        Interactive terminal. Press Enter to run a command. Up and down arrows browse your history.
        Tab completes a command.
      </p>
    </div>
  );
}
