# Studio Lab BH visual direction

User direction, September 24, 2026:

- Extend the existing identity: stark black, white text, fine white rules, minimal composition.
- Preserve the minimal, geometric identity. Use the image scale, composition, and sequencing of an editorial photographic spread; the user specifically referenced Vogue and GQ.
- Make project pages more graphical by giving actual project imagery and diagrams more space.
- Keep the existing Orbitron wordmark, Inter text, and Plex Mono readouts.
- No eyebrow labels. No micro text. Use 16px body text and a 14px floor for captions and compact navigation.
- Use spacing in multiples of 4px: 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, etc. One-pixel rules are intentional.
- Interface colors remain achromatic. Color belongs to the project images, not a new interface palette.
- No line boxes, frames, padding containers, hover expand icons, lightboxes, carousels, or gallery filters around project images. Make the photographs large enough to see directly.
- Curate the images into a story with an opening, progression, and ending. Pair images meaningfully, vary their scale and placement, and connect them with short narrative passages.
- Preserve meaningful photographic content; avoid unnecessary cropping.
- Keep the existing expandable Project Details section. The user specifically liked this structure.

The Essay direction is implemented on all eight project routes under `/projects/`. Each project uses an authored image sequence and retains its full research content in expandable Project Details. Production components live in `src/components/projects/essay/`.

Chroma product links go to `https://chroma.studiolabbh.xyz/`. The former `/work/chroma` and `/chroma` routes permanently redirect there. The Chroma workshop remains a project page. The unlisted sequence-making utility is preserved at `/tools/chroma`; the existing privacy and terms documents retain their URLs.

The mockup routes, comparison toolbar, and files in `src/app/designs/` have been deleted at the user’s request. The production pages do not depend on them.
