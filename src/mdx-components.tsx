import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";

/**
 * Prose styling for the case studies (D-43): plain elements mapped to the design tokens.
 * Server Components only; no @tailwindcss/typography, no syntax highlighting.
 * Headings carry the id added by rehype-slug; scroll-mt keeps them clear of the sticky header.
 */
const components: MDXComponents = {
  // <ArchitectureDiagram {...diagram} /> inside the case studies (D-45)
  ArchitectureDiagram,
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2
      className="mt-12 mb-4 scroll-mt-24 font-display text-2xl leading-tight font-semibold text-text first:mt-0"
      {...props}
    />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3
      className="mt-8 mb-3 scroll-mt-24 font-display text-xl leading-snug font-semibold text-text"
      {...props}
    />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="my-4 leading-7 text-text-body" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a className="text-accent underline underline-offset-4 hover:text-accent-hover" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="my-4 list-disc space-y-2 pl-6 text-text-body marker:text-text-subtle"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol
      className="my-4 list-decimal space-y-2 pl-6 text-text-body marker:text-text-muted"
      {...props}
    />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => <li className="leading-7" {...props} />,
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      className="my-6 border-l-2 border-border-strong pl-4 text-text-muted italic"
      {...props}
    />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code
      className="rounded-button border border-border bg-surface-2 px-1.5 py-0.5 font-mono text-[0.9em] text-text"
      {...props}
    />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    // tabIndex makes the scrollable block keyboard-reachable (axe: scrollable-region-focusable)
    <pre
      tabIndex={0}
      className="my-6 overflow-x-auto rounded-card border border-border bg-surface p-4 font-mono text-sm leading-6 text-text-body [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0"
      {...props}
    />
  ),
  hr: (props: ComponentPropsWithoutRef<"hr">) => (
    <hr className="my-10 border-0 border-t border-border" {...props} />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="my-6 overflow-x-auto" tabIndex={0}>
      <table className="w-full border-collapse text-left text-sm" {...props} />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => (
    <th
      className="border-b border-border-strong px-3 py-2 font-mono text-xs font-medium text-text-muted"
      {...props}
    />
  ),
  td: (props: ComponentPropsWithoutRef<"td">) => (
    <td className="border-b border-border px-3 py-2 text-text-body" {...props} />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
