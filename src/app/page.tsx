import { Container } from "@/components/Container";
import { Hero } from "@/components/Hero";
import { SectionHeader } from "@/components/SectionHeader";

export default function Home() {
  return (
    <>
      <Hero />

      {/* TEMPORARY (F2-01): minimal anchor so the "See my work" CTA scrolls somewhere valid.
          Replaced by the real Selected work section in F2-02. */}
      <section id="work" aria-labelledby="work-heading" className="pb-24">
        <Container>
          <SectionHeader
            id="work-heading"
            title="Selected work"
            subtitle="Case studies with architecture diagrams"
          />
          <p className="mt-6 text-text-muted">Coming soon.</p>
        </Container>
      </section>
    </>
  );
}
