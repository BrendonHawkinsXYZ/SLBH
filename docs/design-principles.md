# Studio Lab BH visual direction

User direction, September 24, 2026:

- Extend the existing identity: stark black, white text, fine white rules, minimal composition.
- Preserve the minimal, geometric identity. Use the image scale, composition, and sequencing of an editorial photographic spread; the user specifically referenced Vogue and GQ.
- Make project pages more graphical by giving actual project imagery and diagrams more space.
- Keep the existing Orbitron wordmark, Inter text, and Plex Mono readouts.
- No eyebrow labels. No micro text. Use 16px body text and a 14px floor for captions and compact navigation.
- Use spacing in multiples of 4px: 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, etc. One-pixel rules are intentional.
- Keep interface colors restrained. The shared near-black backgrounds described below are the approved exception to the original achromatic direction.
- No line boxes, frames, padding containers, hover expand icons, lightboxes, carousels, or gallery filters around project images. Make the photographs large enough to see directly.
- Curate the images into a story with an opening, progression, and ending. Pair images meaningfully, vary their scale and placement, and connect them with short narrative passages.
- Preserve meaningful photographic content; avoid unnecessary cropping.
- Keep the existing expandable Project Details section. The user specifically liked this structure.

The Essay direction is implemented on all nine project routes under `/projects/`. Each project uses an authored image sequence and retains its full research content in expandable Project Details. Production components live in `src/components/projects/essay/`.

## Shared background — October 14, 2026

All current and future pages share one site background. A new route under `src/app/` inherits it automatically through the root layout; it does not need background configuration or its own atmosphere component.

- `src/lib/siteAtmosphere.ts` owns the six approved near-blacks and their four-hour local-time blocks. The root layout selects the initial color before paint; `SiteAtmosphere` keeps it current while the site is open.
- `--paper` is the current background color. `--paper-grain`, `--paper-grain-size`, and `--paper-grain-blend` in `src/app/globals.css` own the static grain treatment. Change these shared definitions to change the background everywhere.
- The document background is painted by `html` and `body`. Keep page wrappers, project articles, and content sections transparent so the same color and grain continue through navigation and the footer. Do not hardcode a page background or add route selectors to the background rule.
- An opaque interface surface, such as the sticky navigation or hero, uses the shared `site-surface` class. It includes both the current color and grain. Do not recreate that treatment with a separate `background: var(--paper)` declaration, which would omit the grain.
- Artwork, diagrams, and tool canvases may retain their intentional colors. The site texture stays behind imagery and text; it is not an overlay on the content.
- Location-driven visual changes remain deferred. The approved behavior uses the visitor's local clock only.

For a new project, use the shared `ProjectEssay` component and author its content and imagery. Its page wrapper already follows this background contract.

Chroma product links go to `https://chroma.studiolabbh.xyz/`. The former `/work/chroma` and `/chroma` routes permanently redirect there. The Chroma workshop remains a project page. The unlisted sequence-making utility is preserved at `/tools/chroma`; the existing privacy and terms documents retain their URLs.

The mockup routes, comparison toolbar, and files in `src/app/designs/` have been deleted at the user’s request. The production pages do not depend on them.
