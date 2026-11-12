import Link from "next/link";
import { SITE, formatLaunchDate } from "@/lib/site";

export default function Home() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      {/* Very subtle accent glow behind the hero (opacity <= 6%, per the design system) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(ellipse_at_top,var(--color-accent),transparent_70%)] opacity-[0.06]"
      />

      <header className="relative mx-auto w-full max-w-site px-4 py-6 sm:px-6">
        <Link
          href="/"
          className="inline-block rounded-button font-display text-xl font-bold tracking-tight text-text"
          aria-label="sn.me — home"
        >
          sn<span className="text-accent">.</span>me
        </Link>
      </header>

      <main className="relative mx-auto flex w-full max-w-site flex-1 flex-col justify-center px-4 pb-24 sm:px-6">
        <h1 className="max-w-3xl font-display text-[40px] leading-[1.05] font-bold tracking-[-1.5px] text-text md:text-[60px]">
          Backend-minded full-stack developer.
        </h1>
        <p className="mt-6 font-mono text-sm text-text-muted">
          Portfolio launching {formatLaunchDate(SITE.launchDate)}
        </p>
      </main>
    </div>
  );
}
