import Link from "next/link";
import { NAV_LINKS } from "@/lib/nav";
import { mailtoHref } from "@/lib/site";
import { Button } from "./Button";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { NavShell } from "./NavShell";

/**
 * Site header. Server Component: logo and desktop links are static HTML.
 * Only NavShell (scroll blur) and MobileMenu (open/close state) ship client JS.
 */
export function Nav() {
  return (
    <NavShell>
      <Container className="flex h-16 items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-button text-sm text-text-muted transition-[color,background-color,border-color] hover:text-text motion-reduce:transition-none"
            >
              {link.label}
            </Link>
          ))}
          <Button variant="pill" href={mailtoHref()}>
            Get in touch
          </Button>
        </nav>

        <MobileMenu links={NAV_LINKS} ctaLabel="Get in touch" ctaHref={mailtoHref()} />
      </Container>
    </NavShell>
  );
}
