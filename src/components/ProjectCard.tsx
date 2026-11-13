import Link from "next/link";
import type { Project } from "@/data";
import { ProjectMedia } from "./ProjectMedia";
import { StackChips } from "./StackChips";

/**
 * Featured project card (Selected work).
 *
 * The card has exactly one interactive element: the case-study link. Its ::after stretches over
 * the whole card, so the entire card is clickable without nesting links. The focus ring is drawn
 * around the card (has-[a:focus-visible]) and the link's own outline is switched off through
 * data-stretched-link (globals.css), so keyboard users see one clear ring.
 */
export function ProjectCard({ project }: { project: Project }) {
  const titleId = `project-${project.slug}`;
  const meta = [project.role, project.period].filter(Boolean).join(" · ");

  return (
    <article
      aria-labelledby={titleId}
      className="group relative flex h-full flex-col overflow-hidden rounded-card border border-border bg-surface transition-[border-color] hover:border-border-strong has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent motion-reduce:transition-none"
    >
      <ProjectMedia media={project.media} />

      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-[22px]">
        <div className="flex flex-col gap-1">
          <h3
            id={titleId}
            className="m-0 font-display text-[22px] leading-tight font-semibold text-text"
          >
            {project.name}
          </h3>
          {meta ? <p className="m-0 font-mono text-xs text-text-muted">{meta}</p> : null}
        </div>

        <p className="m-0 text-text-muted">{project.oneLiner}</p>

        <StackChips items={project.stack} />

        <div className="mt-auto flex flex-col gap-3 pt-2">
          {project.privateNote ? (
            <p className="m-0 font-mono text-xs text-text-muted">{project.privateNote}</p>
          ) : null}

          {project.links.caseStudy ? (
            <Link
              href={project.links.caseStudy}
              data-stretched-link
              className="w-fit text-sm font-medium text-accent after:absolute after:inset-0 after:content-[''] hover:text-accent-hover"
            >
              Read case study
              <span className="sr-only"> of {project.name}</span>
              <span aria-hidden="true"> →</span>
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
