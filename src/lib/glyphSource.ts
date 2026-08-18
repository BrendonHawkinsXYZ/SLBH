/**
 * glyphSource — turning something pasted into pixels the glyph tracer can read.
 *
 * Browser-side only. Takes a file, a clipboard blob, or a lump of SVG markup
 * and hands back one ImageData at a workable resolution; `traceImageToGlyph`
 * in glyphGrid does the rest.
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

export type LoadedSource = {
  image: ImageData;
  name: string;
  /** The source's own pixel dimensions, for the readout. */
  width: number;
  height: number;
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

/** Rasterise a file, blob, or SVG string into ImageData for the tracer. */
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

    try {
      return { image: ctx.getImageData(0, 0, w, h), name, width: sw, height: sh };
    } catch {
      // Only reachable if the source pulled in something cross-origin.
      throw new SourceError("That image is locked by its origin and cannot be read.");
    }
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
