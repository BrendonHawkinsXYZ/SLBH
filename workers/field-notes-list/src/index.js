// workers/field-notes-list/src/index.js
//
// Lists the slbh-field-notes R2 bucket and returns a JSON array of asset
// descriptors, so the /field-notes route can build its field directly from
// whatever currently lives in the bucket, with no manifest rebuild and no
// deploy. The Worker lists keys only, it never streams the media itself, so
// it stays well inside the R2 free tier, and the listing is cached at the
// edge for about sixty seconds so repeat views do not re-list.

const IMAGE = /\.(jpe?g|png|webp|gif|avif)$/i;
const VIDEO = /\.(mp4|webm|mov)$/i;

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": origin, // tighten to the SLBH origin in production
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
    };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });

    // Serve from the edge cache when warm, so repeat loads do not trigger a LIST op.
    const cache = caches.default;
    const cacheKey = new Request(new URL(request.url).toString(), request);
    let res = await cache.match(cacheKey);
    if (res) return res;

    const out = [];
    let cursor;
    do {
      const page = await env.BUCKET.list({ cursor, limit: 1000 });
      for (const obj of page.objects) {
        const type = IMAGE.test(obj.key) ? "image" : VIDEO.test(obj.key) ? "video" : null;
        if (type) out.push({ src: obj.key, type });
      }
      cursor = page.truncated ? page.cursor : undefined;
    } while (cursor);

    res = Response.json(
      { base: env.PUBLIC_BASE, assets: out },
      { headers: { ...cors, "Cache-Control": "public, max-age=60" } }
    );
    ctx.waitUntil(cache.put(cacheKey, res.clone()));
    return res;
  },
};
