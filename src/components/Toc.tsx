import type { TocItem } from "@/lib/toc";

function List({ items }: { items: TocItem[] }) {
  return (
    <ol className="m-0 flex list-none flex-col gap-1 p-0 text-sm">
      {items.map((item) => (
        <li key={item.id} className={item.level === 3 ? "pl-4" : undefined}>
          <a href={`#${item.id}`} className="block py-1 text-text-muted hover:text-accent">
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

/**
 * Table of contents (Server Component, zero JS). Below lg it is a collapsible <details> above the
 * article; at lg+ a sticky aside. Both exist in the HTML and CSS shows the right one, so only one
 * "On this page" nav is exposed at a time (the other is display:none).
 */
export function Toc({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;
  return (
    <>
      <details className="mb-8 rounded-card border border-border bg-surface px-4 py-3 lg:hidden">
        <summary className="cursor-pointer font-mono text-sm text-text">On this page</summary>
        <nav aria-label="On this page" className="mt-3">
          <List items={items} />
        </nav>
      </details>
      <aside className="hidden lg:block">
        <nav aria-label="On this page" className="sticky top-24 flex flex-col gap-3">
          <p className="m-0 font-mono text-xs tracking-wider text-text-subtle uppercase">
            On this page
          </p>
          <List items={items} />
        </nav>
      </aside>
    </>
  );
}
