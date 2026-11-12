import { getFeaturedProjects, getOtherProjects } from "@/data";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { OtherProjects } from "./OtherProjects";
import { ProjectCard } from "./ProjectCard";
import { SectionHeader } from "./SectionHeader";

/** Selected work (featured cards) plus the compact Other projects list. id="work" is the Hero CTA target. */
export function WorkSection() {
  const featured = getFeaturedProjects();
  const others = getOtherProjects();

  return (
    <section id="work" aria-labelledby="work-heading" className="py-14 md:py-20">
      <Reveal>
        <Container className="flex flex-col gap-8">
          <SectionHeader
            id="work-heading"
            title="Selected work"
            subtitle="Case studies with architecture diagrams"
          />
          <ul
            aria-label="Selected projects"
            className="m-0 grid list-none gap-5 p-0 md:grid-cols-2"
          >
            {featured.map((project) => (
              <li key={project.slug}>
                <ProjectCard project={project} />
              </li>
            ))}
          </ul>
          <OtherProjects projects={others} />
        </Container>
      </Reveal>
    </section>
  );
}
