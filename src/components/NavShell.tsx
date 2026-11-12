"use client";

import { useEffect, useState, type ReactNode } from "react";
import { isScrolled } from "@/lib/nav";

/**
 * Sticky <header> landmark. Client Component only because of the scroll state:
 * after scrolling it gets a blurred background and a bottom border.
 * The nav content is passed as children, so it is still rendered on the server.
 */
export function NavShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(isScrolled(window.scrollY));
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-colors motion-reduce:transition-none ${
        scrolled ? "border-border bg-bg/80 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      {children}
    </header>
  );
}
