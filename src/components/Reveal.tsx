"use client";

import { animate } from "motion/mini";
import { useEffect, useRef, type ReactNode } from "react";

const DURATION_S = 0.3;
const OFFSET_PX = 8;

/**
 * Subtle fade-up (300 ms, 8 px) when a below-the-fold block enters the viewport. Opacity and
 * transform only, so nothing shifts the layout.
 *
 * Visibility rules:
 * - The server-rendered HTML is fully visible (no opacity:0 in SSR): no-JS users, SEO and LCP are
 *   unaffected. The hidden starting state is applied on the client, and only to blocks that are
 *   still below the viewport when the page mounts.
 * - prefers-reduced-motion: reduce => nothing is hidden and nothing animates.
 * - Blocks scrolled past (anchor jumps) are revealed too, via the scroll check, not only by
 *   intersection, so skipped sections never stay hidden.
 *
 * `data-reveal` is "hidden" while waiting and "shown" afterwards (used by the e2e tests).
 * Uses `motion/mini` (WAAPI), the lightest Motion entry point.
 */
export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Above the fold or already scrolled past: leave it visible
    if (el.getBoundingClientRect().top <= window.innerHeight) return;

    el.dataset.reveal = "hidden";
    el.style.opacity = "0";
    el.style.transform = `translateY(${OFFSET_PX}px)`;

    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      const finish = () => {
        el.style.opacity = "";
        el.style.transform = "";
        el.dataset.reveal = "shown";
      };
      animate(
        el,
        { opacity: [0, 1], transform: [`translateY(${OFFSET_PX}px)`, "translateY(0px)"] },
        { duration: DURATION_S, ease: "easeOut" },
      ).finished.then(finish, finish);
    };
    // Reveal once the block's top is inside the viewport (or has been scrolled past)
    const check = () => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) reveal();
    };

    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    check();

    return () => {
      done = true;
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      // Never leave the block hidden if the effect is torn down (e.g. React Strict Mode in dev)
      el.style.opacity = "";
      el.style.transform = "";
      delete el.dataset.reveal;
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}
