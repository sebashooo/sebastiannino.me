import Image from "next/image";
import type { Project } from "@/data";

/**
 * 16:10 media area for a project card.
 * - image: next/image (alt from the data)
 * - video: muted, looping, no autoplay, no sound; autoplay is decided in F2-06/F2-07
 * - missing: a neutral placeholder that says so, so it never passes for real product data
 */
export function ProjectMedia({ media }: { media: Project["media"] }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-surface-2">
      {/* Zoom on hover only when motion is allowed */}
      <div className="absolute inset-0 transition-transform duration-300 motion-safe:group-hover:scale-[1.02] motion-reduce:transition-none">
        {media?.type === "image" ? (
          <Image
            src={media.src}
            alt={media.alt}
            fill
            sizes="(min-width: 1160px) 560px, (min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        ) : media?.type === "video" ? (
          <video
            muted
            playsInline
            loop
            preload="none"
            poster={media.poster}
            src={media.src}
            aria-label={media.alt}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center p-4 text-center">
            <span className="font-mono text-sm text-text-muted">demo screenshot · coming soon</span>
          </div>
        )}
      </div>
    </div>
  );
}
