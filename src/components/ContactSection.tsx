import { getProfile } from "@/data";
import { buildContactLine } from "@/lib/contact";
import { mailtoHref } from "@/lib/site";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { CopyEmailButton } from "./CopyEmailButton";
import { SectionHeader } from "./SectionHeader";

const EMAIL_ID = "contact-email";

/**
 * Contact (id="contact", the target of the nav "Get in touch" button). Server Component; only the
 * copy button is a Client Component. No form at launch (D-09): mailto link, copy button, profiles.
 */
export function ContactSection() {
  const profile = getProfile();
  const socials = [
    { label: "LinkedIn", href: profile.socials.linkedin },
    { label: "GitHub", href: profile.socials.github },
  ];

  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-14 md:py-20">
      <Reveal>
        <Container className="flex flex-col gap-6">
          <SectionHeader id="contact-heading" title="Let's build something." />

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              id={EMAIL_ID}
              href={mailtoHref(profile.email)}
              className="rounded-button font-mono text-base text-accent hover:text-accent-hover"
            >
              {profile.email}
            </a>
            <CopyEmailButton email={profile.email} targetId={EMAIL_ID} />
          </div>

          <ul aria-label="Profiles" className="m-0 flex list-none gap-6 p-0 text-sm">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-button font-medium text-text-body hover:text-text"
                >
                  {s.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                  <span aria-hidden="true"> ↗</span>
                </a>
              </li>
            ))}
          </ul>

          <p className="m-0 font-mono text-xs text-text-muted">{buildContactLine(profile)}</p>
        </Container>
      </Reveal>
    </section>
  );
}
