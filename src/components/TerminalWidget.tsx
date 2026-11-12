import { getSkillGroups } from "@/data";
import { STACK_COMMAND, buildStackOutput } from "@/lib/terminal/static-output";

/**
 * Static hero terminal (Server Component, no JS shipped): shows `sebastian --stack` as if it
 * had been typed, with the output built from the skill data. It is real text in the DOM, so
 * search engines and screen readers get it. The interactive version arrives in F4-02.
 */
export function TerminalWidget() {
  const rows = buildStackOutput(getSkillGroups());

  return (
    <figure
      aria-label="Terminal output of the command sebastian --stack, listing Sebastián's technology stack"
      className="m-0 min-w-0 overflow-hidden rounded-card border border-border bg-surface font-mono text-[13px]"
    >
      {/* Window bar: decoration only, the figure's label already names the widget */}
      <div
        aria-hidden="true"
        className="flex justify-between border-b border-border px-3.5 py-2.5 text-text-muted"
      >
        <span>terminal</span>
        <span>zsh</span>
      </div>

      <div className="flex flex-col gap-1.5 p-4 sm:p-[18px]">
        <p className="m-0 break-words text-text-body">
          <span aria-hidden="true" className="text-accent">
            ❯
          </span>{" "}
          {STACK_COMMAND}
        </p>

        <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-text-muted">
          {rows.map((row) => (
            <div key={row.label} className="col-span-2 grid grid-cols-subgrid">
              <dt className="text-text-muted">{row.label}</dt>
              <dd className="m-0 min-w-0 break-words">{row.text}</dd>
            </div>
          ))}
        </dl>

        {/* Prompt waiting for input: visual only until the interactive terminal (F4-02) */}
        <p aria-hidden="true" className="m-0 mt-1.5 text-accent">
          ❯
        </p>
      </div>
    </figure>
  );
}
