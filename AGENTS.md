# Studio Lab BH

Read `docs/design-principles.md` before visual or page-layout changes.

## Shared site background

- Every new page inherits the background from the root layout. Keep route wrappers and project articles transparent; do not add hardcoded page backgrounds or per-route background rules.
- The palette lives in `src/lib/siteAtmosphere.ts`. The current color (`--paper`) and grain tokens live in `src/app/globals.css`.
- Use the existing `site-surface` class when an interface element needs an opaque background. It supplies both the shared color and grain.
- Preserve intentional artwork and canvas colors. Do not put the grain over images or text.
- Add project content through the shared Essay components. Do not create a separate background system for a new project.
