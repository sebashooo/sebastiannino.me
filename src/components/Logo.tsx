import Link from "next/link";

/** Text logo: "sn.me" with an accent dot. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="sn.me — home"
      className={`rounded-button font-display text-lg font-bold tracking-tight text-text ${className}`}
    >
      sn<span className="text-accent">.</span>me
    </Link>
  );
}
