/**
 * glyphGrid — the model behind the glyph instrument: a square bitmap, the edits
 * that shape it, and a contour tracer that turns filled cells into one clean
 * outline path.
 *
 * The reference is Shigetaka Kurita's 1999 set for NTT DoCoMo's i-mode — 176
 * pictograms drawn on a 12 × 12 monochrome grid, where every glyph had to read
 * at a glance with roughly a hundred and forty squares of budget. This module
 * keeps that constraint honest: one bit per cell, no colour, no anti-aliasing,
 * and a fixed square grid the maker chooses up front.
 *
 * Export is not a screenshot of the grid. `glyphOutline` walks the boundary
 * between filled and empty cells and stitches the directed edges into closed
 * loops — outer contours clockwise, holes the other way — so the SVG carries a
 * single path with real corners (evenodd, same shape as the trace instrument's
 * output) rather than a mosaic of abutting rectangles that seam when scaled.
 *
 * Every mutator returns a NEW glyph, or the SAME reference when the edit is a
 * no-op. That identity check is what lets the studio keep an undo stack without
 * recording empty steps.
 */

// Kurita's 12 at one end, a 256 canvas at the other, doubling-ish in between
// so every step is a clean re-sample of the one before it.
export const GRID_SIZES = [12, 16, 24, 32, 48, 64, 96, 128, 192, 256] as const;
export type GridSize = (typeof GRID_SIZES)[number];

export const DEFAULT_SIZE: GridSize = 16;

export type Background = "white" | "black" | "transparent";
export type Ink = "black" | "white";

export const INK_HEX: Record<Ink, string> = { black: "#000000", white: "#FFFFFF" };

/** A square monochrome bitmap. `cells` is row-major, one byte per cell (0 | 1). */
export type Glyph = {
  size: number;
  cells: Uint8Array;
};

export function createGlyph(size: number): Glyph {
  return { size, cells: new Uint8Array(size * size) };
}

export function cloneGlyph(g: Glyph): Glyph {
  return { size: g.size, cells: Uint8Array.from(g.cells) };
}

export function cellAt(g: Glyph, x: number, y: number): number {
  if (x < 0 || y < 0 || x >= g.size || y >= g.size) return 0;
  return g.cells[y * g.size + x];
}

export function filledCount(g: Glyph): number {
  let n = 0;
  for (let i = 0; i < g.cells.length; i++) n += g.cells[i];
  return n;
}

export function isEmpty(g: Glyph): boolean {
  return filledCount(g) === 0;
}

/** Set a list of cells to one value. Returns the same glyph when nothing moves. */
export function withCells(g: Glyph, pts: readonly (readonly [number, number])[], value: 0 | 1): Glyph {
  let next: Glyph | null = null;
  for (const [x, y] of pts) {
    if (x < 0 || y < 0 || x >= g.size || y >= g.size) continue;
    const i = y * g.size + x;
    if (g.cells[i] === value) continue;
    if (!next) next = cloneGlyph(g);
    next.cells[i] = value;
  }
  return next ?? g;
}

/** Whole cells on the straight line between two grid points — no gaps on a fast drag. */
export function cellLine(x0: number, y0: number, x1: number, y1: number): [number, number][] {
  const pts: [number, number][] = [];
  let x = x0;
  let y = y0;
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  for (;;) {
    pts.push([x, y]);
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y += sy;
    }
  }
  return pts;
}

// ── Transforms ──────────────────────────────────────────────────────────────

export function invertGlyph(g: Glyph): Glyph {
  const next = createGlyph(g.size);
  for (let i = 0; i < g.cells.length; i++) next.cells[i] = g.cells[i] ? 0 : 1;
  return next;
}

export function flipGlyph(g: Glyph, axis: "h" | "v"): Glyph {
  const n = g.size;
  const next = createGlyph(n);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const sx = axis === "h" ? n - 1 - x : x;
      const sy = axis === "v" ? n - 1 - y : y;
      next.cells[y * n + x] = g.cells[sy * n + sx];
    }
  }
  return next;
}

/** Quarter turn clockwise — the cheapest way to re-aim an arrow or a hand. */
export function rotateGlyph(g: Glyph): Glyph {
  const n = g.size;
  const next = createGlyph(n);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      next.cells[x * n + (n - 1 - y)] = g.cells[y * n + x];
    }
  }
  return next;
}

/** Nudge by whole cells. Anything pushed past the edge falls off the grid. */
export function nudgeGlyph(g: Glyph, dx: number, dy: number): Glyph {
  const n = g.size;
  const next = createGlyph(n);
  let moved = false;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!g.cells[y * n + x]) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= n || ny >= n) {
        moved = true;
        continue;
      }
      next.cells[ny * n + nx] = 1;
      moved = true;
    }
  }
  return moved ? next : g;
}

/** Pull the drawing to the middle of its own grid — centring by bounding box. */
export function centerGlyph(g: Glyph): Glyph {
  const n = g.size;
  let minX = n;
  let minY = n;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!g.cells[y * n + x]) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX < 0) return g;
  const dx = Math.round((n - 1 - maxX - minX) / 2);
  const dy = Math.round((n - 1 - maxY - minY) / 2);
  return dx === 0 && dy === 0 ? g : nudgeGlyph(g, dx, dy);
}

/**
 * Re-grid to a new pixel count. Nearest-neighbour, so switching 16 → 24 keeps
 * the drawing (blockier, but there) instead of throwing the work away.
 */
export function resizeGlyph(g: Glyph, size: number): Glyph {
  if (size === g.size) return g;
  const next = createGlyph(size);
  if (isEmpty(g)) return next;
  for (let y = 0; y < size; y++) {
    const sy = Math.min(g.size - 1, Math.floor((y * g.size) / size));
    for (let x = 0; x < size; x++) {
      const sx = Math.min(g.size - 1, Math.floor((x * g.size) / size));
      next.cells[y * size + x] = g.cells[sy * g.size + sx];
    }
  }
  return next;
}

// ── Identity ────────────────────────────────────────────────────────────────

/** Compact code — grid size, then the bitmap packed to hex, row-major. */
export function glyphCode(g: Glyph): string {
  let hex = "";
  for (let i = 0; i < g.cells.length; i += 4) {
    const nib =
      (g.cells[i] << 3) | ((g.cells[i + 1] ?? 0) << 2) | ((g.cells[i + 2] ?? 0) << 1) | (g.cells[i + 3] ?? 0);
    hex += nib.toString(16);
  }
  return `${g.size}·${hex.toUpperCase()}`;
}

/** Folded checksum of the bitmap — eight hex characters, read off the bytes. */
export function glyphStamp(g: Glyph): string {
  let sum = 2166136261;
  for (let i = 0; i < g.cells.length; i++) {
    sum = ((sum ^ g.cells[i]) * 16777619) >>> 0;
  }
  return sum.toString(16).padStart(8, "0");
}

export function glyphSlug(g: Glyph): string {
  return `${g.size}x${g.size}-${glyphStamp(g)}`;
}

/**
 * Pixels per cell for the exported document, so every grid lands near a
 * 1024 px square. The path is in cell units either way — this only sets the
 * width and height an editor opens the file at.
 */
export function exportUnit(size: number): number {
  return Math.max(2, Math.round(1024 / size));
}

// ── Contour trace ───────────────────────────────────────────────────────────

/**
 * Closed boundary loops, in cell units. Each loop is a flat [x0, y0, x1, y1, …]
 * ring of integer grid vertices with the collinear points already dropped.
 *
 * Method: every filled cell contributes the edges it does not share with
 * another filled cell, wound so the ink stays on the same side. Walking those
 * directed edges start-to-end closes each contour; where two cells meet only at
 * a corner, the walk takes the clockwise turn so the loops touch without
 * crossing.
 */
export function glyphOutline(g: Glyph): number[][] {
  const n = g.size;
  const on = (x: number, y: number) => cellAt(g, x, y) === 1;
  const key = (x: number, y: number) => y * (n + 1) + x;

  const ax: number[] = [];
  const ay: number[] = [];
  const bx: number[] = [];
  const by: number[] = [];
  const adj = new Map<number, number[]>();

  const edge = (x0: number, y0: number, x1: number, y1: number) => {
    const i = ax.length;
    ax.push(x0);
    ay.push(y0);
    bx.push(x1);
    by.push(y1);
    const k = key(x0, y0);
    const list = adj.get(k);
    if (list) list.push(i);
    else adj.set(k, [i]);
  };

  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!on(x, y)) continue;
      if (!on(x, y - 1)) edge(x, y, x + 1, y);
      if (!on(x + 1, y)) edge(x + 1, y, x + 1, y + 1);
      if (!on(x, y + 1)) edge(x + 1, y + 1, x, y + 1);
      if (!on(x - 1, y)) edge(x, y + 1, x, y);
    }
  }

  const used = new Uint8Array(ax.length);
  const loops: number[][] = [];

  for (let seed = 0; seed < ax.length; seed++) {
    if (used[seed]) continue;
    const ring: number[] = [];
    let e = seed;
    while (e >= 0 && !used[e]) {
      used[e] = 1;
      ring.push(ax[e], ay[e]);
      const dx = bx[e] - ax[e];
      const dy = by[e] - ay[e];
      const cands = adj.get(key(bx[e], by[e]));
      let next = -1;
      let best = -1;
      if (cands) {
        for (const c of cands) {
          if (used[c]) continue;
          const qx = bx[c] - ax[c];
          const qy = by[c] - ay[c];
          // Screen coords run y-down, so a positive cross is a clockwise turn.
          const cross = dx * qy - dy * qx;
          const score = cross > 0 ? 2 : dx * qx + dy * qy > 0 ? 1 : 0;
          if (score > best) {
            best = score;
            next = c;
          }
        }
      }
      e = next;
    }
    if (ring.length >= 6) loops.push(dropCollinear(ring));
  }

  return loops;
}

function dropCollinear(ring: number[]): number[] {
  const count = ring.length / 2;
  const out: number[] = [];
  for (let i = 0; i < count; i++) {
    const px = ring[((i - 1 + count) % count) * 2];
    const py = ring[((i - 1 + count) % count) * 2 + 1];
    const cx = ring[i * 2];
    const cy = ring[i * 2 + 1];
    const nx = ring[((i + 1) % count) * 2];
    const ny = ring[((i + 1) % count) * 2 + 1];
    if ((cx - px) * (ny - cy) - (cy - py) * (nx - cx) === 0) continue;
    out.push(cx, cy);
  }
  return out.length >= 6 ? out : ring;
}

/** The whole glyph as one `d` string, in cell units (1 unit = 1 pixel of grid). */
export function glyphPathD(g: Glyph): string {
  let d = "";
  for (const ring of glyphOutline(g)) {
    d += `M${ring[0]} ${ring[1]}`;
    for (let i = 2; i < ring.length; i += 2) d += `L${ring[i]} ${ring[i + 1]}`;
    d += "Z";
  }
  return d;
}

/** Serialize a glyph as a standalone SVG document (single evenodd path). */
export function glyphToSvg(g: Glyph, ink: Ink, background: Background, unit = 32): string {
  const n = g.size;
  const box = n * unit;
  const ground =
    background === "transparent"
      ? ""
      : `<rect width="${n}" height="${n}" fill="${background === "white" ? "#FFFFFF" : "#000000"}"/>`;
  const d = glyphPathD(g);
  const path = d ? `<path d="${d}" fill="${INK_HEX[ink]}" fill-rule="evenodd"/>` : "";
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} ${n}" ` +
    `width="${box}" height="${box}" shape-rendering="crispEdges">` +
    `${ground}${path}` +
    `</svg>`
  );
}

/** The grid's square inside a canvas box: cell size and the centring offset. */
export function gridBox(w: number, h: number, n: number): { cell: number; ox: number; oy: number; side: number } {
  const cell = Math.min(w, h) / n;
  const side = cell * n;
  return { cell, ox: (w - side) / 2, oy: (h - side) / 2, side };
}

/** Clear the box and lay the ground down. */
export function paintGround(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  background: Background
): void {
  ctx.clearRect(0, 0, w, h);
  if (background === "transparent") return;
  ctx.fillStyle = background === "white" ? "#FFFFFF" : "#000000";
  ctx.fillRect(0, 0, w, h);
}

/**
 * Draw the filled cells only, no ground — split out from `renderGlyph` so the
 * studio can slide a reference image between the ground and the ink. Cells land
 * on whole device pixels, so the preview and the thumbnails stay crisp.
 */
/**
 * Past this many cells a grid counts as dense: the studio widens its stage,
 * thins the lattice, and stops printing the bitmap as hex.
 */
export const DENSE_GRID = 64;

// One n × n bitmap per glyph, kept as long as the glyph is. Glyphs are
// immutable, so the cache can never go stale — only unused, and the WeakMap
// lets those fall away with the glyph itself.
const bitmaps = new WeakMap<Glyph, { ink: Ink; canvas: HTMLCanvasElement }>();

function glyphBitmap(g: Glyph, ink: Ink): HTMLCanvasElement {
  const held = bitmaps.get(g);
  if (held && held.ink === ink) return held.canvas;

  const n = g.size;
  const canvas = held?.canvas ?? document.createElement("canvas");
  canvas.width = n;
  canvas.height = n;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const img = ctx.createImageData(n, n);
    const data = img.data;
    const level = ink === "black" ? 0 : 255;
    for (let i = 0, p = 0; i < g.cells.length; i++, p += 4) {
      if (!g.cells[i]) continue;
      data[p] = level;
      data[p + 1] = level;
      data[p + 2] = level;
      data[p + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }
  bitmaps.set(g, { ink, canvas });
  return canvas;
}

export function drawGlyphCells(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  g: Glyph,
  ink: Ink
): void {
  const n = g.size;
  const { cell, ox, oy, side } = gridBox(w, h, n);

  // A dense grid goes through one bitmap blit instead of a fill per run: at 256
  // across, a checkerboard is 32,768 separate rectangles a frame, which is the
  // one pattern that pushes past a frame's budget. Blitting is flat in the
  // pattern — only the cell count matters. Smoothing follows the direction:
  // hard edges going up in scale, averaged coming down so a thumbnail of a
  // dense glyph reads as tone rather than aliased specks.
  if (n > DENSE_GRID) {
    ctx.save();
    ctx.imageSmoothingEnabled = cell < 1;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(glyphBitmap(g, ink), ox, oy, side, side);
    ctx.restore();
    return;
  }

  const edge = (i: number, o: number) => Math.round(o + i * cell);
  ctx.fillStyle = INK_HEX[ink];
  for (let y = 0; y < n; y++) {
    const y0 = edge(y, oy);
    const rowH = edge(y + 1, oy) - y0;
    const row = y * n;
    let x = 0;
    while (x < n) {
      if (!g.cells[row + x]) {
        x++;
        continue;
      }
      // One fill per run of neighbouring cells — at 256 across, the difference
      // between a few hundred calls a frame and sixty-five thousand.
      let end = x + 1;
      while (end < n && g.cells[row + end]) end++;
      const x0 = edge(x, ox);
      ctx.fillRect(x0, y0, edge(end, ox) - x0, rowH);
      x = end;
    }
  }
}

/** Ground plus ink — the whole glyph, for thumbnails and proofs. */
export function renderGlyph(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  g: Glyph,
  ink: Ink,
  background: Background
): void {
  paintGround(ctx, w, h, background);
  drawGlyphCells(ctx, w, h, g, ink);
}
// ── Image → grid ────────────────────────────────────────────────────────────

/**
 * How a source image is read into ink.
 *
 * `silhouette` takes the alpha channel — anything opaque is ink, whatever
 * colour it is. That is the right read for a cut-out icon or a pasted SVG on a
 * transparent ground. `darkness` composites over white and reads luminance, the
 * right call for a scan, a screenshot, or anything drawn on a solid ground.
 */
export type ReadMode = "silhouette" | "darkness";

export type TraceOptions = {
  size: number;
  read: ReadMode;
  /** Fraction of a cell that must be inked for the cell to land — 0…1. */
  threshold: number;
  /** The region of the source to fit — the same one the guide is drawing. */
  crop: { x: number; y: number; w: number; h: number };
  invert: boolean;
};

/** Per-source-pixel ink coverage in 0…1, under the chosen read. */
function inkCoverage(src: ImageData, read: ReadMode): Float32Array {
  const { data } = src;
  const cov = new Float32Array(src.width * src.height);
  for (let i = 0, p = 0; i < cov.length; i++, p += 4) {
    const a = data[p + 3] / 255;
    if (a === 0) continue;
    if (read === "silhouette") {
      cov[i] = a;
    } else {
      // Rec. 709 luma, composited over white so a clear ground reads as paper.
      const luma = (0.2126 * data[p] + 0.7152 * data[p + 1] + 0.0722 * data[p + 2]) / 255;
      cov[i] = a * (1 - luma);
    }
  }
  return cov;
}

/**
 * Resample an image onto the glyph grid.
 *
 * Every cell takes the mean coverage of the source pixels under it — a box
 * filter, not a point sample, so a hairline stroke still registers as partial
 * ink instead of disappearing between two samples — and lands when that mean
 * clears the threshold. The artwork is contain-fitted into the square and
 * centred, so a wide image keeps its proportions rather than stretching.
 *
 * `crop` is the region to fit, and it is the caller's job to pass the same one
 * the guide overlay is drawing — that is what makes a trace land exactly where
 * the artwork appeared to sit, rather than a few cells off it.
 */
export function traceImageToGlyph(src: ImageData, o: TraceOptions): Glyph {
  const n = o.size;
  const out = createGlyph(n);
  const { width: w, height: h } = src;
  if (w === 0 || h === 0) return out;

  const cov = inkCoverage(src, o.read);

  const x0 = Math.max(0, Math.min(w - 1, o.crop.x));
  const y0 = Math.max(0, Math.min(h - 1, o.crop.y));
  const x1 = Math.max(x0 + 1, Math.min(w, o.crop.x + o.crop.w));
  const y1 = Math.max(y0 + 1, Math.min(h, o.crop.y + o.crop.h));

  const bw = x1 - x0;
  const bh = y1 - y0;
  const scale = Math.min(n / bw, n / bh); // contain fit, in cells per source px
  const ox = (n - bw * scale) / 2;
  const oy = (n - bh * scale) / 2;

  for (let cy = 0; cy < n; cy++) {
    // The cell's span back in source pixels, clamped to the cropped box.
    const sy0 = y0 + (cy - oy) / scale;
    const sy1 = y0 + (cy + 1 - oy) / scale;
    const ry0 = Math.max(y0, Math.floor(sy0));
    const ry1 = Math.min(y1, Math.ceil(sy1));
    for (let cx = 0; cx < n; cx++) {
      const sx0 = x0 + (cx - ox) / scale;
      const sx1 = x0 + (cx + 1 - ox) / scale;
      const rx0 = Math.max(x0, Math.floor(sx0));
      const rx1 = Math.min(x1, Math.ceil(sx1));

      let sum = 0;
      let count = 0;
      if (rx1 > rx0 && ry1 > ry0) {
        for (let y = ry0; y < ry1; y++) {
          for (let x = rx0; x < rx1; x++) {
            sum += cov[y * w + x];
            count++;
          }
        }
      } else if (sx1 > x0 && sx0 < x1 && sy1 > y0 && sy0 < y1) {
        // Cell narrower than a source pixel — take the nearest one.
        const x = Math.min(x1 - 1, Math.max(x0, Math.floor((sx0 + sx1) / 2)));
        const y = Math.min(y1 - 1, Math.max(y0, Math.floor((sy0 + sy1) / 2)));
        sum = cov[y * w + x];
        count = 1;
      }

      const mean = count > 0 ? sum / count : 0;
      if ((mean >= o.threshold) !== o.invert) out.cells[cy * n + cx] = 1;
    }
  }

  return out;
}
