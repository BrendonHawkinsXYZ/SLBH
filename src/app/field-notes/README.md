# /field-notes

A navigable three dimensional field of sketch images, rendered as billboarded
cards floating in dark space. Drag to orbit, scroll to zoom, right drag or two
finger drag to pan through the field, pinch to zoom on touch. The image is the
whole object, so there is no per card text, no metadata, and no titles.

## How the media flows

The page never holds the sketch media. On load it fetches a Cloudflare Worker
that lists the `slbh-field-notes` R2 bucket and returns JSON, then it samples a
field from those URLs. Dropping a file into the bucket makes it appear on the
next load within the Worker's roughly sixty second cache window, with no
manifest rebuild and no deploy.

```
R2 bucket  ->  listing Worker (JSON)  ->  /field-notes builds the field
```

The Worker and its setup live in `workers/field-notes-list/`.

## Wiring the page to the Worker

Set one public env var to the deployed Worker URL:

```bash
# .env.local for development, and the production environment for the live site
NEXT_PUBLIC_FIELD_NOTES_LIST_URL="https://field-notes-list.<subdomain>.workers.dev"
```

When the var is absent, or the fetch fails, the route falls back to a small set
of procedurally drawn placeholder textures, so the page is never empty and
nothing heavy is committed to the repository.

## Files

- `page.tsx`, server route, sets metadata and renders the client field.
- `FieldNotes.tsx`, client wrapper, loads the scene with ssr disabled.
- `FieldNotesScene.tsx`, the Three.js field, controls, motion, chrome, and the
  local drag and drop preview.
- `shaders.ts`, the billboard vertex shader and the feathered fragment shader.
- `assets.ts`, the Worker fetch, the sampler, and the placeholder builder.

## Controls and behaviour

- Drag orbits, scroll zooms, right drag or shift drag pans, touch supports
  pinch zoom.
- After about two and a half seconds of no input a very slow whole field yaw
  drift resumes; any interaction pauses it.
- Reshuffle re randomizes positions with a tween and reassigns textures.
- Dropping image or video files onto the canvas previews them across the field
  immediately, session only, with a clear note that the drop is not saved to R2.
- The FIELD MONITOR readout is off by default, behind the MONITOR toggle, since
  labels cut against the floating in a mind intent.

## Two flags for Brendon

1. Header face. Prior brand docs specify Orbitron for SLBH headers, while the
   Brand Kit v1.0 shows PP Neue Machina as the display face. This route uses
   Orbitron for the wordmark lockup, following the editorial rule and the rest
   of the live site; confirm which face is live before shipping, since they
   cannot both hold that role.
2. Licensed faces. Neue Haas Grotesk, PP Neue Machina, and Canela are licensed
   and are not committed here. The chrome uses the site's existing self hosted
   faces (Orbitron, Inter, IBM Plex Mono). To bring the kit faces in, drop the
   licensed files into the font directory and add `@font-face` rules, since
   public font CDNs are not allowed for the licensed faces.
