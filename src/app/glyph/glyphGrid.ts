// ── Glyph: a 1-bit pixel grid, the Kurita register ──
// One byte per cell, row-major. Everything here is pure so the studio can
// snapshot grids for history, thumbnails, and export without side effects.

export type Grid = { size: number; cells: Uint8Array };
export type Ink = "black" | "white";
export type Ground = "white" | "black" | "transparent";

export const SIZES = [12, 16, 24, 32];

export const HEX: Record<Ink, string> = { black: "#000000", white: "#FFFFFF" };

export function makeGrid(size: number): Grid {
  return { size, cells: new Uint8Array(size * size) };
}

export function cloneGrid(g: Grid): Grid {
  return { size: g.size, cells: Uint8Array.from(g.cells) };
}

export function countInk(g: Grid): number {
  let n = 0;
  for (let i = 0; i < g.cells.length; i++) if (g.cells[i]) n++;
  return n;
}

export function invertGrid(g: Grid): Grid {
  const cells = new Uint8Array(g.cells.length);
  for (let i = 0; i < g.cells.length; i++) cells[i] = g.cells[i] ? 0 : 1;
  return { size: g.size, cells };
}

// Changing the grid keeps the drawing centred — a 16 square dropped into 24
// gains a four-cell margin, and stepping back down crops it symmetrically.
export function resizeGrid(g: Grid, next: number): Grid {
  if (next === g.size) return cloneGrid(g);
  const out = makeGrid(next);
  const off = Math.floor((next - g.size) / 2);
  for (let y = 0; y < g.size; y++) {
    const ny = y + off;
    if (ny < 0 || ny >= next) continue;
    for (let x = 0; x < g.size; x++) {
      const nx = x + off;
      if (nx < 0 || nx >= next) continue;
      out.cells[ny * next + nx] = g.cells[y * g.size + x];
    }
  }
  return out;
}

// Greedy rectangle decomposition: grow each unclaimed cell right as far as it
// runs, then down while the whole span holds. Keeps the exported path to a
// handful of subpaths instead of one rect per pixel.
export function toRects(g: Grid): { x: number; y: number; w: number; h: number }[] {
  const { size, cells } = g;
  const used = new Uint8Array(cells.length);
  const rects: { x: number; y: number; w: number; h: number }[] = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = y * size + x;
      if (!cells[i] || used[i]) continue;

      let w = 1;
      while (x + w < size && cells[i + w] && !used[i + w]) w++;

      let h = 1;
      let growing = true;
      while (growing && y + h < size) {
        for (let k = 0; k < w; k++) {
          const j = (y + h) * size + x + k;
          if (!cells[j] || used[j]) {
            growing = false;
            break;
          }
        }
        if (growing) h++;
      }

      for (let yy = y; yy < y + h; yy++) {
        for (let xx = x; xx < x + w; xx++) used[yy * size + xx] = 1;
      }
      rects.push({ x, y, w, h });
    }
  }
  return rects;
}

// One unit per cell in the viewBox, so the glyph stays integer-aligned at any
// scale. Ground is omitted entirely when transparent.
export function gridToSvg(g: Grid, ink: Ink, ground: Ground, px = 512): string {
  const rects = toRects(g);
  const d = rects.map((r) => `M${r.x} ${r.y}h${r.w}v${r.h}h${-r.w}z`).join("");
  const bg =
    ground === "transparent"
      ? ""
      : `\n  <rect width="${g.size}" height="${g.size}" fill="${HEX[ground === "white" ? "white" : "black"]}"/>`;
  const path = d ? `\n  <path fill="${HEX[ink]}" d="${d}"/>` : "";
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${g.size} ${g.size}"`,
    ` width="${px}" height="${px}" shape-rendering="crispEdges">${bg}${path}\n</svg>\n`,
  ].join("");
}

// Short stable signature for the filename — the cell pattern in base 36.
export function gridSlug(g: Grid): string {
  let hash = 2166136261;
  for (let i = 0; i < g.cells.length; i++) {
    hash ^= g.cells[i] ? i + 1 : 0;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36).padStart(6, "0").slice(0, 6);
}
