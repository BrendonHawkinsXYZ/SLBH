# Image strategy

The site uses `next/image` for the diagrams, posters, home gallery, and shared Essay imagery. Keep responsive `sizes`, intrinsic dimensions, and lazy loading. Eager loading is reserved for the opening image. The home gallery's color index uses precomputed colors rather than downloading every image.

Next.js optimizes delivery on demand, but the source assets still occupy Git history and deployment storage. Source size and visitor download size are separate measurements. See the [Next.js Image reference](https://nextjs.org/docs/app/api-reference/components/image).

## Audit

Run `npm run media:audit` before adding a large collection. It reports public asset size, images by format and folder, and the largest files. It is advisory and does not alter files.

Before the October 29, 2026 additions, `public/` held 131 files totaling 141.30 MiB. PNGs accounted for 131.90 MiB across 84 files. Project assets accounted for 111.58 MiB; the diagrams accounted for 6.54 MiB. The largest individual PNG was 8.43 MiB.

The four new diagrams total 132.16 KiB as lossless WebP, compared with 276.07 KiB in the supplied PNGs: about 52% smaller with identical decoded pixels. Their original 800 × 1000 dimensions are preserved.

## New assets

- Keep archival masters in the studio's backed-up source archive, outside `public/` and Git. Commit only exports needed by the site. Retain existing public original links until a deliberate migration preserves them.
- Export photographs as WebP, starting around quality 82 and a 2400px longest edge. Increase resolution for full-width work when visible detail requires it; never upscale a smaller source. Aim below 500 KiB, with visual review taking precedence over that target.
- Use lossless WebP for supplied raster diagrams and text-heavy graphics when it saves space. Aim below 200 KiB for simple diagrams. Preserve the artwork's colors, proportions, and fine rules. Keep larger exports for dense diagrams when needed for reading. Use SVG when an authored vector source exists.
- Store each image once and reuse its content record. Add dimensions and descriptive alt text. Diagrams registered in `src/lib/diagrams.ts` also enter the home gallery; add their average color in `src/lib/artworkColors.ts` so the color index remains accurate.
- Use `next/image` with `sizes` matched to the actual layout. Leave offscreen images lazy. Do not preload an entire collection. The existing GIF/still handling remains separate because animation needs different delivery.

## Existing collection

On October 29, 2026, 26 PNG photographs and portrait studies in ACG, Affective Sculptural Sketches, Convergent Grammar, This Is How I’m Feeling: NYC, and the studio portraits were replaced with WebP. Together they fell from 81.36 MiB to 6.53 MiB (92% smaller). Dimensions and alpha channels were preserved. Standard photographs use quality 86; Convergent Grammar uses quality 90 to retain its fine geometric traces. Existing WebP photographs were not recompressed. Illustrations, diagrams, product screenshots, icons, and the animation retain their current formats.

`src/lib/photographs.json` records each old/new path, dimensions, quality, byte counts, original SHA-256, and the new average color. Next.js uses the path pairs for permanent redirects, so existing image URLs continue to work. Authored stories, shared image records, home-gallery ordering, and average colors reference the new files directly; cover and thumbnail discovery already prefers WebP.

Recoverable originals are retained locally under `.media-originals/`, outside `public/` and excluded from Git. They are also available from the existing Git history. The local recovery folder is not a substitute for the studio's backed-up source archive.

The diagrams gallery displays artwork directly, with titles and alt text. Diagram images have no links or separate “Open image” control. Keep three columns at widths of 768px and up, two from 681–767px, and one at 680px and below.

Keep the current Next.js delivery setup. Reassess object storage and a media CDN when publishing frequency, deployment weight, or measured image transformation costs justify it. That storage migration should preserve existing public image URLs; it is not part of this update.
