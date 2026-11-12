import { getExperience } from "@/data";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

/**
 * Experience timeline: a 1px vertical line with one dot per entry (work and education, in data
 * order). Only the current *role* (a current work entry) gets the accent dot and a visually
 * hidden "Current role" label, so it is not conveyed by color alone. An ongoing degree is not a
 * role: its period text already says it is in progress.
 */
export function ExperienceSection() {
  const entries = getExperience();

  return (
    <section id="experience" aria-labelledby="experience-heading" className="py-14 md:py-20">
      <Reveal>
        <Container className="flex flex-col gap-8">
          <SectionHeader id="experience-heading" title="Experience" />
          <ol
            aria-label="Experience and education"
            className="m-0 ml-1.5 flex max-w-3xl list-none flex-col gap-10 border-l border-border p-0 pl-7 sm:pl-8"
          >
            {entries.map((entry) => {
              const isCurrentRole = entry.current && entry.kind === "work";
              return (
                <li
                  key={`${entry.company}-${entry.role}`}
                  data-current={isCurrentRole ? "true" : undefined}
                  className="relative flex flex-col gap-2"
                >
                  {/* Dot centered on the line: accent only for the current role */}
                  <span
                    aria-hidden="true"
                    className={`absolute top-2 -left-[34px] size-[11px] rounded-full ring-4 ring-bg sm:-left-[38px] ${
                      isCurrentRole ? "bg-accent" : "bg-border-strong"
                    }`}
                  />
                  <div className="flex flex-col gap-0.5">
                    <h3 className="m-0 font-display text-xl leading-tight font-semibold text-text">
                      {entry.company}
                    </h3>
                    <p className="m-0 text-text-body">{entry.role}</p>
                    <p className="m-0 font-mono text-xs text-text-muted">
                      {isCurrentRole ? <span className="sr-only">Current role. </span> : null}
                      {entry.period}
                    </p>
                  </div>
                  <ul className="m-0 flex list-disc flex-col gap-1.5 pl-5 text-text-muted marker:text-text-subtle">
                    {entry.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        </Container>
      </Reveal>
    </section>
  );
}
