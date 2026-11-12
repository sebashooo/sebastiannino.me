import { SITE } from "@/lib/site";
import { Container } from "./Container";

/**
 * Slim site footer (contentinfo landmark). The contact content lives in ContactSection, so
 * nothing is duplicated here.
 */
export function Footer() {
  return (
    <footer className="border-t border-border">
      <Container className="py-8 text-sm text-text-muted">
        © {new Date().getFullYear()} {SITE.name}
      </Container>
    </footer>
  );
}
