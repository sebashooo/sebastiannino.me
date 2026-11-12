import { SITE, formatLaunchDate } from "@/lib/site";

export default function Home() {
  return (
    <div className="relative flex min-h-[70dvh] flex-col justify-center overflow-hidden">
      {/* Very subtle accent glow behind the hero (opacity <= 6%, per the design system) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_at_top,var(--color-accent),transparent_70%)] opacity-[0.06]"
      />

      <div className="relative mx-auto w-full max-w-site px-4 py-24 sm:px-6">
        <h1 className="max-w-3xl font-display text-[40px] leading-[1.05] font-bold tracking-[-1.5px] text-text md:text-[60px]">
          Backend-minded full-stack developer.
        </h1>
        <p className="mt-6 font-mono text-sm text-text-muted">
          Portfolio launching {formatLaunchDate(SITE.launchDate)}
        </p>
      </div>
    </div>
  );
}
