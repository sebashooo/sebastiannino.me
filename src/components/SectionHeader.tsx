type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  /** id of the H2, so a section can be labelled with aria-labelledby. */
  id?: string;
};

/** H2 plus a muted subtitle: to the right on desktop, below the title on mobile. */
export function SectionHeader({ title, subtitle, id }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between md:gap-8">
      <h2
        id={id}
        className="font-display text-3xl leading-tight font-bold tracking-tight text-text md:text-4xl"
      >
        {title}
      </h2>
      {subtitle ? <p className="max-w-md text-text-muted md:text-right">{subtitle}</p> : null}
    </div>
  );
}
