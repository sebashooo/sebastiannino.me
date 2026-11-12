/** Tech stack as a row of mono chips. Muted text (not subtle) keeps AA contrast at 12px. */
export function StackChips({ items, label = "Tech stack" }: { items: string[]; label?: string }) {
  return (
    <ul aria-label={label} className="m-0 flex list-none flex-wrap gap-1.5 p-0">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-button border border-border px-2 py-0.5 font-mono text-xs text-text-muted"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
