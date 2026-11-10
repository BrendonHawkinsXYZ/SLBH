# Studio Lab BH visual direction

User direction, September 24, 2026:

- Extend the existing identity: minimal composition, fine rules, and strongly contrasted text. The November background direction below supersedes the original black background and white text.
- Preserve the minimal, geometric identity. Use the image scale, composition, and sequencing of an editorial photographic spread; the user specifically referenced Vogue and GQ.
- Make project pages more graphical by giving actual project imagery and diagrams more space.
- Keep the existing Orbitron wordmark, Inter text, and Plex Mono readouts.
- No eyebrow labels. No micro text. Use 16px body text and a 14px floor for captions and compact navigation.
- Use spacing in multiples of 4px: 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, etc. One-pixel rules are intentional.
- Keep interface colors restrained. The shared hourly gradient described below supplies the atmospheric color.
- No line boxes, frames, padding containers, hover expand icons, lightboxes, carousels, or gallery filters around project images. Make the photographs large enough to see directly.
- Curate the images into a story with an opening, progression, and ending. Pair images meaningfully, vary their scale and placement, and connect them with short narrative passages.
- Preserve meaningful photographic content; avoid unnecessary cropping.
- Keep the existing expandable Project Details section. The user specifically liked this structure.

The Essay direction is implemented on all nine project routes under `/projects/`. Each project uses an authored image sequence and retains its full research content in expandable Project Details. Production components live in `src/components/projects/essay/`.

## Shared background — November 9, 2026

User direction: warm white fading into a broader color palette reflective of the time of day, with one color for each of the 24 hours. Preserve the existing grain. Use the approved palette study's lighter endpoints so charcoal text remains readable across the gradient.

All current and future pages share one site background. A new route under `src/app/` inherits it automatically through the root layout; it does not need background configuration or its own atmosphere component.

- `src/lib/siteAtmosphere.ts` owns 24 hourly colors, starting at midnight. The visitor's local clock selects the color, blending toward the next hour in OKLab and wrapping continuously from 23:00 to midnight. The root layout selects the initial blend before paint; `SiteAtmosphere` refreshes it each minute and when the page becomes active.
- `--paper` is the stable warm-white base; `--paper-horizon` is the current hourly blend. `--paper-gradient` keeps the upper 23% warm white and builds color toward the bottom, bringing color in five percentage points earlier than the initial study. These tokens live in `src/app/globals.css` alongside the unchanged `--paper-grain`, `--paper-grain-size`, and `--paper-grain-blend`. Change these shared definitions to change the background everywhere.
- The document background is painted by `html` and `body`. The gradient spans the full document and travels with native scrolling: warm white at the top, the hourly color at the bottom. Opaque `site-surface` elements sample their position in that same gradient, including when navigation becomes sticky. Keep page wrappers, project articles, and content sections transparent so the same color and grain continue through navigation and the footer. Do not hardcode a page background or add route selectors to the background rule.
- An opaque interface surface, such as the sticky navigation or hero, uses the shared `site-surface` class. It includes both the current color and grain. Do not recreate that treatment with a separate `background: var(--paper)` declaration, which would omit the grain.
- Artwork, diagrams, and tool canvases may retain their intentional colors. The site texture stays behind imagery and text; it is not an overlay on the content.
- Site typography uses charcoal ink and dark hairlines on the light gradient. Images render in their original colors; do not use the former `lighten` blend treatment, which washes artwork out on the light background.
- The navigation's date readout uses `MM/DD/YYYY`. The graphical time tracker belongs in the footer, between the copyright and the Instagram/privacy/terms links. Use a straight line with a marker positioned by the visitor's local 24-hour day and filled with the current hourly color.
- Location-driven visual changes remain deferred. The approved behavior uses the visitor's local clock only.

For a new project, use the shared `ProjectEssay` component and author its content and imagery. Its page wrapper already follows this background contract.

The homepage hero uses the twenty supplied participant drawings from `blank` at every hour, preserving their full compositions and transparency. Every arrival starts with a random drawing, avoiding the preceding opening and last viewed drawing when storage is available. Every drawing links to Tell Me How You Feel: PIT Lab. Fade in the first drawing once after the arrival question; subsequent drawings change instantly every 1.5 seconds, without slides or fades. Pause on hover, keyboard focus, or when offscreen, and keep the image still for reduced motion. Do not add captions or the former square selectors.

On every homepage arrival, show one randomly selected question from `src/lib/homeQuestions.ts` in the full-screen intro, then reveal the drawing hero. This includes reloads, returns to the homepage, and browser back/forward restoration. The navigation and page are already painted beneath the question overlay; do not hide or animate them as a separate reveal stage. Fade the question away, then fade in the loaded first drawing. Do not use cookies, browser storage, or a saved "already seen" flag to suppress the question. Longer questions receive more reading time; clicking the screen or pressing Escape or Tab starts the reveal early. Reduced-motion visitors still see a question, with a static reveal. Questions no longer replace the hero at a particular time of day.

Chroma product links go to `https://chroma.studiolabbh.xyz/`. The former `/work/chroma` and `/chroma` routes permanently redirect there. The Chroma workshop remains a project page. The unlisted sequence-making utility is preserved at `/tools/chroma`; the existing privacy and terms documents retain their URLs.

The mockup routes, comparison toolbar, and files in `src/app/designs/` have been deleted at the user’s request. The production pages do not depend on them.
