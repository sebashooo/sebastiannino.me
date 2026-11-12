import { SITE, SOCIALS, mailtoHref } from "@/lib/site";
import { Container } from "./Container";

/**
 * Placeholder contact footer (context/02, section 7). No form at launch (D-09).
 * The copy-email button arrives with F2-05.
 */
export function Footer() {
  return (
    <footer id="contact" className="scroll-mt-20 border-t border-border">
      <Container className="flex flex-col gap-8 py-14 md:py-16">
        <div className="flex flex-col gap-3">
          <p className="font-display text-3xl font-bold tracking-tight text-text">
            Let&apos;s build something.
          </p>
          <a
            href={mailtoHref()}
            className="w-fit rounded-button font-mono text-sm text-accent hover:text-accent-hover"
          >
            {SITE.email}
          </a>
        </div>

        <div className="flex flex-col gap-4 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex gap-6">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-button hover:text-text"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <p>{SITE.location} · English C1 · Open to remote</p>
        </div>
      </Container>
    </footer>
  );
}
