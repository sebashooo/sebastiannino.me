import type { ComponentPropsWithoutRef } from "react";

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  /** Element to render. Defaults to a div. */
  as?: "div" | "section" | "header" | "footer";
};

/** Centered column: max 1160px, 24px side padding (16px on mobile). */
export function Container({ as: Tag = "div", className = "", ...props }: ContainerProps) {
  return <Tag className={`mx-auto w-full max-w-site px-4 sm:px-6 ${className}`} {...props} />;
}
