# field-notes-list Worker

A tiny Cloudflare Worker that lists the `slbh-field-notes` R2 bucket on each
`GET` and returns a JSON array of asset descriptors. The `/field-notes` route
fetches this Worker on load and builds its field from whatever the bucket
currently holds, so the ongoing workflow is simply to drop a file into the
bucket and have it appear on the next page load, with no manifest rebuild and
no deploy.

## Response shape

```json
{
  "base": "https://media.studiolabbh.xyz/field-notes/",
  "assets": [
    { "src": "sketch-001.webp", "type": "image" },
    { "src": "loop-004.mp4", "type": "video" }
  ]
}
```

The descriptors carry no dimensions on purpose, since reading dimensions
would add upload friction; the page reads each asset's real aspect ratio
client side once the texture loads, then sizes that card.

## One-time setup (Brendon)

1. Create the R2 bucket `slbh-field-notes`.
2. Expose the media for the browser to fetch, either through a custom domain
   (for example `media.studiolabbh.xyz`) bound to the bucket, or through the
   bucket's `r2.dev` public URL, then set `PUBLIC_BASE` in `wrangler.toml` to
   match (include the trailing slash, and the `field-notes/` prefix if the
   media lives under a prefix in the bucket).
3. Set a CORS policy on the bucket allowing `GET` from the SLBH origin, so
   Three.js can use the textures without tainting the canvas; video textures
   require this too. A minimal policy:

   ```json
   [
     {
       "AllowedOrigins": ["https://studiolabbh.xyz", "http://localhost:3000"],
       "AllowedMethods": ["GET"],
       "AllowedHeaders": ["*"],
       "MaxAgeSeconds": 3600
     }
   ]
   ```

4. Deploy the Worker and note its URL:

   ```bash
   cd workers/field-notes-list
   npx wrangler deploy
   ```

5. Point the site at the Worker by setting the public env var the route reads,
   `NEXT_PUBLIC_FIELD_NOTES_LIST_URL`, to the deployed Worker URL (in
   `.env.local` for local development, and in the production environment for
   the live site). When the var is absent or the fetch fails, the route falls
   back to bundled placeholder textures so the page is never empty.

After that, the entire ongoing workflow is to drop files into the bucket.

## Tightening CORS for production

The Worker currently reflects the request `Origin` so it is easy to develop
against. Before shipping, restrict it to the SLBH origins by replacing the
reflected value with an allow list check, returning the origin only when it
appears in that list.
