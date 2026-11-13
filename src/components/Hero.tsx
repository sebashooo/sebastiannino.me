import { getProfile } from "@/data";
import { RESUME_FILENAME } from "@/lib/site";
import { Button } from "./Button";
import { Container } from "./Container";
import { TerminalWidget } from "./TerminalWidget";

/** Home hero: what kind of developer, the stack, and where to click first. Server Component. */
export function Hero() {
  const profile = getProfile();

  return (
    <section aria-labelledby="hero-heading" className="relative overflow-hidden">
      {/* Very subtle accent glow behind the hero (opacity <= 6%, per the design system) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_at_top,var(--color-accent),transparent_70%)] opacity-[0.06]"
      />

      <Container className="relative grid items-center gap-12 py-14 md:py-20 lg:grid-cols-2 lg:gap-14">
        <div className="flex min-w-0 flex-col gap-5">
          <p className="m-0 font-mono text-[13px] text-accent">
            <span aria-hidden="true">●</span> {profile.availability}
          </p>
          <h1
            id="hero-heading"
            className="m-0 font-display text-[40px] leading-[1.05] font-bold tracking-[-1.5px] text-text md:text-[60px]"
          >
            {profile.headline}
          </h1>
          <p className="m-0 max-w-[520px] text-lg text-text-muted">{profile.tagline}</p>
          <div className="flex flex-wrap gap-3">
            <Button href="#work">See my work</Button>
            <Button variant="secondary" href={profile.resumeUrl} download={RESUME_FILENAME}>
              Download résumé
            </Button>
          </div>
        </div>

        <TerminalWidget />
      </Container>
    </section>
  );
}
