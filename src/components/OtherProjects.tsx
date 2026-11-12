import type { Project } from "@/data";
import { StackChips } from "./StackChips";

/** Compact list of the non-featured projects. A repo link appears only if the data has one (public repos only). */
export function OtherProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <div className="mt-14 flex flex-col gap-5">
      <h3 className="m-0 font-display text-xl font-semibold text-text">Other projects</h3>
      <ul aria-label="Other projects" className="m-0 flex list-none flex-col p-0">
        {projects.map((project) => {
          const meta = [project.role, project.period].filter(Boolean).join(" · ");
          return (
            <li
              key={project.slug}
              className="flex flex-col gap-2 border-t border-border py-5 first:border-t-0 first:pt-0"
            >
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <h4 className="m-0 font-display text-lg font-semibold text-text">{project.name}</h4>
                {meta ? <p className="m-0 font-mono text-xs text-text-muted">{meta}</p> : null}
              </div>
              <p className="m-0 text-text-muted">{project.oneLiner}</p>
              <StackChips items={project.stack} />
              {project.links.repo ? (
                <a
                  href={project.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit rounded-button text-sm font-medium text-accent hover:text-accent-hover"
                >
                  View source on GitHub
                  <span className="sr-only"> ({project.name}, opens in a new tab)</span>
                  <span aria-hidden="true"> ↗</span>
                </a>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
