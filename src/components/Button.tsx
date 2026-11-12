import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "secondary" | "pill";

type CommonProps = {
  variant?: Variant;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof CommonProps | "href"> & { href: string };

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & { href?: undefined };

export type ButtonProps = ButtonAsLink | ButtonAsButton;

const BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors motion-reduce:transition-none";

const VARIANTS: Record<Variant, string> = {
  primary: "rounded-button bg-accent text-bg hover:bg-accent-hover",
  secondary: "rounded-button border border-border-strong text-text hover:bg-surface-2",
  // Nav call to action: white pill (context/03)
  pill: "rounded-pill bg-text text-bg hover:bg-text-body",
};

/** Links that leave the app (or open another program) must be plain <a>, not next/link. */
const EXTERNAL = /^(mailto:|tel:|https?:)/;

function buttonClasses(variant: Variant, className: string) {
  return `${BASE} ${VARIANTS[variant]} ${className}`;
}

/** Primary / secondary / pill button. Renders an <a> when given `href`, otherwise a <button>. */
export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { href, variant = "primary", className = "", children, ...rest } = props;
    const classes = buttonClasses(variant, className);
    return EXTERNAL.test(href) ? (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    ) : (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const { variant = "primary", className = "", children, type = "button", ...rest } = props;
  return (
    <button type={type} className={buttonClasses(variant, className)} {...rest}>
      {children}
    </button>
  );
}
