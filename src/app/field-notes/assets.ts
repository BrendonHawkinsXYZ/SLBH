// Asset plumbing for the field. The page fetches the listing Worker on load,
// resolves each key against the manifest base, and samples a pool of cards;
// when the Worker is missing or unreachable it falls back to a handful of
// procedurally drawn placeholder textures, so the field is never empty and
// nothing heavy has to live in the repository.

export type FieldAssetType = "image" | "video";

export type FieldAsset = {
  // A URL the browser can fetch, already resolved against the manifest base,
  // or a data or blob URL for placeholders and local session drops.
  url: string;
  type: FieldAssetType;
};

type RawAsset = { src: string; type: FieldAssetType };
type Manifest = { base?: string; assets?: RawAsset[] };

const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif)$/i;
const VIDEO_RE = /\.(mp4|m4v|webm|mov)$/i;

export function classifyFile(name: string): FieldAssetType | null {
  if (IMAGE_RE.test(name)) return "image";
  if (VIDEO_RE.test(name)) return "video";
  return null;
}

function joinUrl(base: string, src: string): string {
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  if (!base) return src;
  const left = base.endsWith("/") ? base : base + "/";
  return left + src.replace(/^\//, "");
}

// Fetches the listing Worker and returns a resolved pool, returning an empty
// array when the URL is absent or the request fails, so the caller can fall
// back to placeholders and keep the field populated.
export async function fetchAssetPool(
  workerUrl: string | undefined,
  signal?: AbortSignal
): Promise<FieldAsset[]> {
  if (!workerUrl) return [];
  try {
    const res = await fetch(workerUrl, { signal });
    if (!res.ok) return [];
    const data = (await res.json()) as Manifest;
    const base = data.base ?? "";
    const assets = Array.isArray(data.assets) ? data.assets : [];
    return assets
      .filter(
        (a) =>
          a &&
          typeof a.src === "string" &&
          (a.type === "image" || a.type === "video")
      )
      .map((a) => ({ url: joinUrl(base, a.src), type: a.type }));
  } catch {
    return [];
  }
}

// Samples the pool down to at most `max` cards, shuffling and slicing so a
// fresh subset shows per session, and never repeating an asset, so the field
// holds only what is in the bucket with no duplicates. A pool smaller than
// `max` returns every asset once, and an empty pool returns an empty array.
export function sampleUnique(pool: FieldAsset[], max: number): FieldAsset[] {
  if (pool.length === 0) return [];
  const shuffled = pool.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(max, shuffled.length));
}

// Builds a small set of quiet placeholder textures as data URLs, drawn in the
// dark base palette with a soft gradient and a faint highlight, in varied
// aspect ratios, so the field reads as floating sketch cards even when the
// Worker is unreachable; the brand accents stay off the cards by design.
export function buildPlaceholderPool(): FieldAsset[] {
  if (typeof document === "undefined") return [];
  const aspects: Array<[number, number]> = [
    [4, 5],
    [1, 1],
    [5, 4],
    [3, 4],
    [4, 3],
    [2, 3],
    [3, 2],
    [9, 16],
    [16, 9],
  ];
  const tones = [
    "#20202a",
    "#1a1a23",
    "#262630",
    "#1d1d27",
    "#15151c",
    "#191921",
    "#23232e",
    "#14141a",
  ];
  const out: FieldAsset[] = [];
  const count = 36;
  for (let i = 0; i < count; i++) {
    const [aw, ah] = aspects[i % aspects.length];
    const w = 360;
    const h = Math.max(1, Math.round((w * ah) / aw));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;
    const lin = ctx.createLinearGradient(0, 0, w, h);
    lin.addColorStop(0, tones[i % tones.length]);
    lin.addColorStop(1, "#0b0b0f");
    ctx.fillStyle = lin;
    ctx.fillRect(0, 0, w, h);
    const ang = (((i * 37) % 360) * Math.PI) / 180;
    const cx = w * 0.5 + Math.cos(ang) * w * 0.28;
    const cy = h * 0.5 + Math.sin(ang) * h * 0.28;
    const rad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7);
    rad.addColorStop(0, "rgba(242, 242, 242, 0.055)");
    rad.addColorStop(1, "rgba(242, 242, 242, 0)");
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, w, h);
    out.push({ url: canvas.toDataURL("image/png"), type: "image" });
  }
  return out;
}
