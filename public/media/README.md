# Project media contract

Media for the case studies and the home cards. One folder per project slug
(`managerapp`, `tu-conjunto`). **Demo data only** (CLAUDE.md privacy rule): no real business names,
people, emails, phone numbers, tax IDs, addresses or internal URLs. Check every file before
committing it. Originals stay outside the repo; only the optimized files below are committed.

All files are referenced from `src/data/projects.ts` (`media`) and, for galleries, from the case
study MDX. Nothing is hardcoded in components.

| File                               | Spec                                                   |
| ---------------------------------- | ------------------------------------------------------ |
| `cover.webp`                       | 1600x1000 (16:10), <= 250 KB, no metadata              |
| `card-loop.mp4` + `card-loop.webm` | 1280x800, 10-20 s, no audio, <= 2 MB each              |
| `card-poster.webp`                 | 1280x800, poster frame for the loop                    |
| `gallery-NN-<name>.webp`           | Desktop: 1600x1000, <= 250 KB                          |
| `gallery-NN-<name>-mobile.webp`    | Mobile: 780 px wide, name ends in `-mobile`, <= 150 KB |

Rules:

- The card media slot is 16:10 (`ProjectMedia`); other ratios are cropped by `object-cover`, so
  keep the 16:10 ratio and never stretch.
- Never upscale. If a source is narrower than the target, keep its native width.
- Strip EXIF/GPS and other metadata.
- `NN` is a two-digit order (`01`, `02`, ...); `<name>` is a short kebab-case description.
- Every image needs meaningful alt text in the data or MDX; illustrations are labelled as
  illustrations, not screenshots.
