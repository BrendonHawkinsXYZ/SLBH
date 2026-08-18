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

export const GRID_SIZES = [12, 16, 24, 32] as const;
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

export function glyphSlug(g: Glyph): string {
  const code = glyphCode(g);
  const hex = code.slice(code.indexOf("·") + 1).toLowerCase();
  // Short, stable stamp: grid size plus a folded checksum of the bitmap.
  let sum = 0;
  for (let i = 0; i < hex.length; i++) sum = (sum * 31 + hex.charCodeAt(i)) >>> 0;
  return `${g.size}x${g.size}-${sum.toString(16).padStart(8, "0")}`;
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
export function drawGlyphCells(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  g: Glyph,
  ink: Ink
): void {
  const n = g.size;
  const { cell, ox, oy } = gridBox(w, h, n);
  ctx.fillStyle = INK_HEX[ink];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!g.cells[y * n + x]) continue;
      const x0 = Math.round(ox + x * cell);
      const y0 = Math.round(oy + y * cell);
      ctx.fillRect(x0, y0, Math.round(ox + (x + 1) * cell) - x0, Math.round(oy + (y + 1) * cell) - y0);
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
