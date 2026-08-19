/**
 * glyphSource — turning something pasted into a reference layer for the grid.
 *
 * Browser-side only. Takes a file, a clipboard blob, or a lump of SVG markup
 * and hands back a drawable canvas at a workable resolution, plus the bounds of
 * the artwork inside it. The studio lays that under the grid as tracing paper;
 * nothing is filled in automatically — the cells are the maker's to place.
 *
 * SVG needs the extra care. Markup copied out of Figma or Illustrator often
 * carries no intrinsic width and height — only a viewBox — and an <img> given
 * that renders at the browser's 300 × 150 default, which resamples to mush. So
 * the markup is parsed, sized from its own viewBox to a fixed long side, and
 * re-serialized before it ever reaches an image. Rendering happens through an
 * <img>, never an inline <svg>: that context runs no scripts and loads no
 * external references, which is what makes pasted markup safe to accept.
 */

/** Long side the rasteriser works at — fine for a 32-cell grid, cheap to filter. */
export const SOURCE_LONG_SIDE = 512;

/** A rectangle inside the rasterised canvas, in its pixels. */
export type Bounds = { x: number; y: number; w: number; h: number };

export type LoadedSource = {
  /** The rasterised artwork, ready to draw straight into the grid canvas. */
  canvas: HTMLCanvasElement;
  name: string;
  /** The source's own pixel dimensions, for the readout. */
  width: number;
  height: number;
  /** Where the artwork actually sits, ignoring dead margin. */
  bounds: Bounds;
  /**
   * Whether the pixels can be read back. False only when the artwork pulled in
   * something cross-origin, which taints the canvas: it still draws as a guide,
   * but it cannot be traced automatically.
   */
  readable: boolean;
  /** Any meaningful transparency — decides how a trace reads the image. */
  transparent: boolean;
};

export class SourceError extends Error {}

function parseLength(value: string | null): number {
  if (!value) return 0;
  const n = parseFloat(value);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/**
 * Give an SVG explicit pixel dimensions, scaled so its long side is
 * SOURCE_LONG_SIDE, and drop anything that has no business in a static render.
 */
export function normalizeSvg(markup: string): string {
  const doc = new DOMParser().parseFromString(markup, "image/svg+xml");
  const svg = doc.documentElement;
  // Chrome recovers from broken markup by grafting a <parsererror> block into
  // the tree rather than failing outright — which would otherwise trace as a
  // red error box. Anything with one in it is not artwork.
  if (!svg || svg.nodeName.toLowerCase() !== "svg" || doc.querySelector("parsererror")) {
    throw new SourceError("That does not parse as SVG.");
  }
  for (const node of Array.from(doc.querySelectorAll("script, foreignObject"))) node.remove();

  let w = parseLength(svg.getAttribute("width"));
  let h = parseLength(svg.getAttribute("height"));
  const viewBox = (svg.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number);
  if ((!w || !h) && viewBox.length === 4 && viewBox.every((v) => Number.isFinite(v))) {
    w = Math.abs(viewBox[2]);
    h = Math.abs(viewBox[3]);
  }
  if (!w || !h) {
    w = SOURCE_LONG_SIDE;
    h = SOURCE_LONG_SIDE;
  }
  if (viewBox.length !== 4) svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

  const scale = SOURCE_LONG_SIDE / Math.max(w, h);
  svg.setAttribute("width", String(Math.max(1, Math.round(w * scale))));
  svg.setAttribute("height", String(Math.max(1, Math.round(h * scale))));
  if (!svg.getAttribute("xmlns")) svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  return new XMLSerializer().serializeToString(svg);
}

/** Does this text look like SVG markup rather than prose? */
export function looksLikeSvg(text: string): boolean {
  return /<svg[\s>]/i.test(text);
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new SourceError("That image could not be decoded."));
    img.src = url;
  });
}

/**
 * Where the artwork sits inside its own frame.
 *
 * Transparency makes this easy — the opaque pixels are the artwork. Failing
 * that, the four corners vote on a ground colour and anything far enough from
 * it counts, which catches both a white scan and a dark screenshot. A frame
 * that reads as entirely ground (a flat fill, say) keeps its full rectangle
 * rather than collapsing to nothing.
 */
function artworkBounds(img: ImageData): { bounds: Bounds; transparent: boolean } {
  const { data, width: w, height: h } = img;
  const at = (x: number, y: number) => (y * w + x) * 4;
  let transparent = false;
  for (let p = 3; p < data.length; p += 4) {
    if (data[p] < 250) {
      transparent = true;
      break;
    }
  }

  // Ground colour: the median of the four corners, channel by channel.
  const corners = [at(0, 0), at(w - 1, 0), at(0, h - 1), at(w - 1, h - 1)];
  const ground = [0, 1, 2].map((c) => {
    const vals = corners.map((p) => data[p + c]).sort((a, b) => a - b);
    return (vals[1] + vals[2]) / 2;
  });

  let x0 = w;
  let y0 = h;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = at(x, y);
      const alpha = data[p + 3];
      const marks = transparent
        ? alpha > 8
        : Math.abs(data[p] - ground[0]) +
            Math.abs(data[p + 1] - ground[1]) +
            Math.abs(data[p + 2] - ground[2]) >
          24;
      if (!marks) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  const bounds = x1 < 0 ? { x: 0, y: 0, w, h } : { x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
  return { bounds, transparent };
}

/** Rasterise a file, blob, or SVG string into a canvas for the overlay. */
export async function loadSource(input: Blob | string, name: string): Promise<LoadedSource> {
  let markup: string | null = null;
  if (typeof input === "string") markup = input;
  else if (input.type === "image/svg+xml" || /\.svg$/i.test(name)) markup = await input.text();

  const blob = markup
    ? new Blob([normalizeSvg(markup)], { type: "image/svg+xml" })
    : (input as Blob);
  const url = URL.createObjectURL(blob);

  try {
    const img = await loadImage(url);
    const sw = img.naturalWidth || SOURCE_LONG_SIDE;
    const sh = img.naturalHeight || SOURCE_LONG_SIDE;
    // Only ever downscale: a small source keeps its pixels, and the box filter
    // in the tracer does the averaging either way.
    const scale = Math.min(1, SOURCE_LONG_SIDE / Math.max(sw, sh));
    const w = Math.max(1, Math.round(sw * scale));
    const h = Math.max(1, Math.round(sh * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new SourceError("This browser would not give up a canvas.");
    ctx.drawImage(img, 0, 0, w, h);

    let bounds: Bounds = { x: 0, y: 0, w, h };
    let transparent = false;
    let readable = true;
    try {
      const read = artworkBounds(ctx.getImageData(0, 0, w, h));
      bounds = read.bounds;
      transparent = read.transparent;
    } catch {
      // Only reachable if the source pulled in something cross-origin; the
      // overlay still works, it just cannot be trimmed or traced.
      readable = false;
    }
    return { canvas, name, width: sw, height: sh, bounds, readable, transparent };
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** The first image on a clipboard or drop, as a file. */
export function imageFileFrom(data: DataTransfer | null): File | null {
  if (!data) return null;
  for (const item of Array.from(data.files)) {
    if (item.type.startsWith("image/") || /\.svg$/i.test(item.name)) return item;
  }
  for (const item of Array.from(data.items)) {
    if (item.kind !== "file") continue;
    const file = item.getAsFile();
    if (file && (file.type.startsWith("image/") || /\.svg$/i.test(file.name))) return file;
  }
  return null;
}

/** The source's pixels, for the tracer. Null when the canvas is not readable. */
export function sourcePixels(source: LoadedSource): ImageData | null {
  if (!source.readable) return null;
  const ctx = source.canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  try {
    return ctx.getImageData(0, 0, source.canvas.width, source.canvas.height);
  } catch {
    return null;
  }
}
