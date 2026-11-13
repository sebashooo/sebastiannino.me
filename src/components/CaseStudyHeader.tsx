import Link from "next/link";
import type { CaseStudy, Project } from "@/data";
import { PROJECT_STATUS_LABEL } from "@/lib/project-status";
import { Container } from "./Container";
import { ProjectMedia } from "./ProjectMedia";
import { StackChips } from "./StackChips";

/** Case-study header: back link, eyebrow, H1, summary, metadata grid, private note and cover slot. */
export function CaseStudyHeader({
  project,
  caseStudy,
}: {
  project: Project;
  caseStudy: CaseStudy;
}) {
  const meta: { label: string; value: string }[] = [
    { label: "Role", value: project.role },
    ...(project.period ? [{ label: "Period", value: project.period }] : []),
    { label: "Status", value: PROJECT_STATUS_LABEL[project.status] },
  ];

  return (
    <header className="border-b border-border py-10 md:py-14">
      <Container className="flex flex-col gap-6">
        <Link href="/#work" className="w-fit font-mono text-sm text-text-muted hover:text-accent">
          <span aria-hidden="true">← </span>All work
        </Link>

        <div className="flex flex-col gap-3">
          <p className="m-0 font-mono text-sm text-accent">Case study</p>
          <h1 className="m-0 font-display text-4xl leading-tight font-bold tracking-tight text-text md:text-5xl">
            {project.name}
          </h1>
          <p className="m-0 max-w-2xl text-lg text-text-body">{caseStudy.summary}</p>
        </div>

        <dl className="m-0 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {meta.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <dt className="font-mono text-xs tracking-wider text-text-subtle uppercase">
                {label}
              </dt>
              <dd className="m-0 text-text">{value}</dd>
            </div>
          ))}
          <div className="flex flex-col gap-2 sm:col-span-2 lg:col-span-3">
            <dt className="font-mono text-xs tracking-wider text-text-subtle uppercase">Stack</dt>
            <dd className="m-0">
              <StackChips items={project.stack} />
            </dd>
          </div>
        </dl>

        {project.privateNote ? (
          <p className="m-0 font-mono text-xs text-text-muted">{project.privateNote}</p>
        ) : null}

        <div className="overflow-hidden rounded-card border border-border">
          <ProjectMedia media={project.media} />
        </div>
      </Container>
    </header>
  );
}
