"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "./Button";

type MobileMenuProps = {
  links: readonly { label: string; href: string }[];
  ctaLabel: string;
  ctaHref: string;
};

/**
 * Compact menu for < md screens. Button toggles a panel (aria-expanded / aria-controls);
 * Escape closes it and returns focus to the button; choosing a link closes it.
 * The closed panel uses `hidden`, so its links are out of the tab order.
 */
export function MobileMenu({ links, ctaLabel, ctaHref }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex size-11 items-center justify-center rounded-button border border-border-strong text-text"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          {open ? (
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M3 6h14M3 10h14M3 14h14"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-border bg-bg"
      >
        <ul className="mx-auto flex max-w-site flex-col gap-1 px-4 py-4 sm:px-6">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-button px-2 text-text-body hover:text-text"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="pt-2">
            <Button variant="pill" href={ctaHref} onClick={() => setOpen(false)} className="w-full">
              {ctaLabel}
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
}
