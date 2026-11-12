import { getProfile, getSkillGroups } from "@/data";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { StackChips } from "./StackChips";

/** About: short first-person text on one side, grouped skills (chips, no levels) on the other. */
export function AboutSection() {
  const { about } = getProfile();
  const groups = getSkillGroups();

  return (
    <section id="about" aria-labelledby="about-heading" className="py-14 md:py-20">
      <Reveal>
        <Container className="flex flex-col gap-8">
          <SectionHeader id="about-heading" title="About" />

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="flex max-w-[560px] flex-col gap-4 text-lg text-text-body">
              {about.map((paragraph) => (
                <p key={paragraph} className="m-0">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex min-w-0 flex-col gap-5">
              <h3 className="m-0 font-display text-xl font-semibold text-text">Skills</h3>
              <dl className="m-0 flex flex-col gap-5">
                {groups.map((group) => (
                  <div key={group.name} className="flex flex-col gap-2">
                    <dt className="font-mono text-xs text-text-muted">{group.name}</dt>
                    <dd className="m-0">
                      <StackChips items={group.items} label={`${group.name} skills`} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </Reveal>
    </section>
  );
}
