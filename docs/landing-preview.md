# Studio Lab BH landing preview

The separate landing experience lives at `/preview`. The existing homepage remains at `/`. The preview is excluded from search indexing and is not added to the existing site navigation.

The opening uses the studio biography, Orbitron wordmark, Inter text, and the shared local-time background and grain. Click, tap, scroll down, or press Enter to enter the work. The footer includes a replay action.

Tell Me How You Feel leads through three photographs representing ACG, PIT Lab, and Chroma. The collection contains those three project records followed by Affective Geometry and New York Emotions. There is no decade index, commerce, newsletter form, or additional CV inventory.

The Collection view supports text search, series and supporting-study groups, empty results, and reset. Its view, group, and search query live in the URL, including direct entry and browser Back and Forward. The Studio view gives a short account of the practice and links to the existing biography and CV. Project images and titles open the existing shared Essay pages.

The header reuses `LocalReadout`: time follows the browser clock and the approximate city comes from the browser time zone. It does not request precise location. Opaque navigation, introduction, and dialog surfaces use the shared `site-surface` class. Page wrappers and image areas remain transparent; artwork retains its original canvas colors.

The preview supplies its own header and footer through a route-specific `DefaultSiteChrome` boundary. Other routes retain the original navigation and footer.

## Local viewing

Run the existing development command and open `/preview` on its local URL. If port 3000 is occupied, use:

```sh
npm run dev -- --hostname 127.0.0.1 --port 3001
```

No new dependency or hosted service is required.

## Verification

- TypeScript passes with `npx tsc --noEmit`.
- The preview route returns HTTP 200.
- Browser checks cover 1440 × 1000, 800 × 1000, and 390 × 844 layouts without horizontal overflow.
- Matching search, empty results, reset, both collection groups, header search, direct URL entry, and browser Back were exercised.
- Mobile menu opening, Escape dismissal, search submission, and scroll locking were exercised.
- A project link opens the existing Chroma Essay with the original header and footer; Back restores the collection.
- Inline colophon, introduction replay, keyboard entry, and entry at scroll position zero were exercised.
- The tested browser emitted no console errors or warnings.

Reference captures are in [landing preview screenshots](references/landing-preview/).
