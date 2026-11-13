import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";

// Next sends the 404 status and a noindex tag for this page; the title is the only metadata needed.
export const metadata: Metadata = { title: "Page not found" };

/**
 * Terminal-style 404 (the one other place that speaks "terminal", per the design system).
 * Server Component, no JS. The terminal is decoration: the H1 and the links carry the meaning.
 */
export default function NotFound() {
  return (
    <section aria-labelledby="not-found-heading" className="py-14 md:py-24">
      <Container className="flex max-w-3xl flex-col gap-8">
        <div className="flex flex-col gap-3">
          <p className="m-0 font-mono text-sm text-accent">404</p>
          <h1
            id="not-found-heading"
            className="m-0 font-display text-4xl leading-tight font-bold tracking-tight text-text md:text-5xl"
          >
            Page not found
          </h1>
          <p className="m-0 max-w-xl text-lg text-text-muted">
            That address does not exist, or the page has moved. Head back to the home page or the
            work.
          </p>
        </div>

        <div
          aria-hidden="true"
          className="overflow-hidden rounded-card border border-border bg-surface font-mono text-[13px]"
        >
          <div className="flex justify-between border-b border-border px-3.5 py-2.5 text-text-muted">
            <span>terminal</span>
            <span>zsh</span>
          </div>
          <div className="flex flex-col gap-1.5 p-4 sm:p-[18px]">
            <p className="m-0 break-words text-text-body">
              <span className="text-accent">❯</span> cd /that-page
            </p>
            <p className="m-0 text-text-muted">bash: cd: no such file or directory</p>
            <p className="m-0 mt-1.5 text-accent">❯</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button href="/">
            <span aria-hidden="true">←</span> Back home
          </Button>
          <Button variant="secondary" href="/#work">
            See my work
          </Button>
        </div>
      </Container>
    </section>
  );
}
