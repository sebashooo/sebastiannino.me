import Link from "next/link";
import type { CaseStudy, Project } from "@/data";
import { Button } from "./Button";
import { Container } from "./Container";

type Side = { caseStudy: CaseStudy; project: Project } | undefined;

function NavLink({ side, direction }: { side: Side; direction: "previous" | "next" }) {
  if (!side) return <div aria-hidden="true" className="hidden sm:block" />;
  const isNext = direction === "next";
  return (
    <Link
      href={`/work/${side.caseStudy.slug}`}
      rel={isNext ? "next" : "prev"}
      className={`flex flex-col gap-1 rounded-card border border-border bg-surface p-5 hover:border-border-strong ${isNext ? "sm:text-right" : ""}`}
    >
      <span className="font-mono text-xs text-text-muted">
        {isNext ? "Next case study →" : "← Previous case study"}
      </span>
      <span className="font-display text-lg font-semibold text-text">{side.project.name}</span>
      <span className="text-sm text-text-muted">{side.project.oneLiner}</span>
    </Link>
  );
}

/** Previous/next case study (no wrap-around) plus a small call to action back to contact. */
export function CaseStudyNav({ previous, next }: { previous: Side; next: Side }) {
  return (
    <footer className="border-t border-border py-10 md:py-14">
      <Container className="flex flex-col gap-10">
        {previous || next ? (
          <nav aria-label="More case studies" className="grid gap-4 sm:grid-cols-2">
            <NavLink side={previous} direction="previous" />
            <NavLink side={next} direction="next" />
          </nav>
        ) : null}
        <div className="flex flex-col items-start gap-3">
          <p className="m-0 text-text-body">Want to talk about this work?</p>
          <Button href="/#contact" variant="secondary">
            Get in touch
          </Button>
        </div>
      </Container>
    </footer>
  );
}
