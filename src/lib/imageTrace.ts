/**
 * imageTrace — raster → vector tracing engine behind the /trace instrument.
 *
 * Illustrator's Image Trace (black-and-white mode), distilled: threshold a
 * sketch into ink, pull exact contours off the pixel grid, clean the noise,
 * then refit everything as smooth cubic Bézier paths — few anchors, real
 * curves, holes preserved — ready to serialize as an SVG path or rasterize
 * onto a transparent canvas.
 *
 * The pipeline, stage by stage:
 *   1. luminance + Otsu       — grey map (alpha composited over white) and an
 *                               automatic threshold suggestion.
 *   2. boundary extraction    — walk the edges between ink and empty pixels
 *                               into closed lattice loops. Outer boundaries and
 *                               holes fall out of the same walk; diagonal ink
 *                               stays connected (8-connectivity), so thin
 *                               sketch strokes don't shatter into specks.
 *   3. despeckle              — drop loops under an area floor (dust and
 *                               pinholes both), like Illustrator's Noise.
 *   4. simplify + corners     — melt the pixel staircase (Ramer–Douglas–
 *                               Peucker), then split the loop at genuine
 *                               corners by turn angle.
 *   5. curve fitting          — least-squares cubic Bézier fitting between
 *                               corners (Schneider's algorithm, Graphics Gems,
 *                               reimplemented), with Newton reparameterization
 *                               and recursive splitting to a pixel tolerance.
 *
 * Everything is pure and framework-free; the caller owns canvases and DOM.
 * All loops are emitted into ONE path with fill-rule "evenodd", so holes
 * knock out automatically in both SVG and canvas rendering.
 */

export type TraceOptions = {
  threshold: number; // 0..255 — ink cutoff on the luminance map
  invert: boolean; // trace light marks on a dark ground instead
  despeckle: number; // px² — minimum region area kept (dust + pinholes)
  simplify: number; // px — pre-fit RDP tolerance (higher = simpler)
  smoothing: number; // px — Bézier fit tolerance (higher = smoother)
  cornerAngle: number; // deg — interior angles sharper than this stay corners
};

export const DEFAULT_TRACE: TraceOptions = {
  threshold: 128,
  invert: false,
  despeckle: 12,
  simplify: 0.8,
  smoothing: 1.2,
  cornerAngle: 100,
};

export type TraceResult = {
  width: number;
  height: number;
  d: string; // combined SVG path data (evenodd)
  loops: number; // closed subpaths kept
  anchors: number; // fitted cubic segments — the "how vector is it" number
};

type Pt = { x: number; y: number };

// ── 1. Luminance + Otsu ─────────────────────────────────────────────────────

/** Per-pixel luminance 0..255, alpha composited over white (scans, PNGs). */
export function luminanceMap(img: ImageData): Uint8Array {
  const { data } = img;
  const n = img.width * img.height;
  const out = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const j = i * 4;
    const a = data[j + 3] / 255;
    const l = 0.2126 * data[j] + 0.7152 * data[j + 1] + 0.0722 * data[j + 2];
    out[i] = Math.round(l * a + 255 * (1 - a));
  }
  return out;
}

/** Otsu's method: the threshold that best separates ink from ground. */
export function otsuThreshold(lum: Uint8Array): number {
  const hist = new Float64Array(256);
  for (let i = 0; i < lum.length; i++) hist[lum[i]]++;
  let sum = 0;
  for (let t = 0; t < 256; t++) sum += t * hist[t];
  let sumB = 0;
  let wB = 0;
  let best = 128;
  let bestVar = -1;
  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (wB === 0) continue;
    const wF = lum.length - wB;
    if (wF === 0) break;
    sumB += t * hist[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const v = wB * wF * (mB - mF) * (mB - mF);
    if (v > bestVar) {
      bestVar = v;
      best = t + 1; // ink is v < threshold, so cut just above the class split
    }
  }
  return Math.min(255, best);
}

// ── 2. Boundary extraction ──────────────────────────────────────────────────
//
// Directed edges on the lattice between ink and empty pixels, each keeping ink
// on its right. Every ink pixel contributes its exposed sides; shared sides
// cancel, so what remains is exactly the region boundaries. Walking the edge
// graph yields closed loops; at saddle points (two ink pixels touching
// diagonally) we prefer the LEFT turn, which keeps diagonal ink in one loop
// (8-connected) instead of shattering a thin stroke into per-pixel specks.

const DX = [1, 0, -1, 0]; // R, D, L, U
const DY = [0, 1, 0, -1];

function extractLoops(ink: Uint8Array, w: number, h: number): Pt[][] {
  const vw = w + 1;
  const vh = h + 1;
  const inkAt = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < w && y < h && ink[y * w + x] === 1;

  // Outgoing boundary edges per lattice vertex, one bit per direction.
  const edges = new Uint8Array(vw * vh);
  for (let vy = 0; vy < vh; vy++) {
    for (let vx = 0; vx < vw; vx++) {
      const tl = inkAt(vx - 1, vy - 1);
      const tr = inkAt(vx, vy - 1);
      const bl = inkAt(vx - 1, vy);
      const br = inkAt(vx, vy);
      let m = 0;
      if (br && !tr) m |= 1; // → right, along the top of pixel (vx,vy)
      if (bl && !br) m |= 2; // ↓ down, along the right of pixel (vx-1,vy)
      if (tl && !bl) m |= 4; // ← left, along the bottom of pixel (vx-1,vy-1)
      if (tr && !tl) m |= 8; // ↑ up, along the left of pixel (vx,vy-1)
      edges[vy * vw + vx] = m;
    }
  }

  const loops: Pt[][] = [];
  for (let vi = 0; vi < vw * vh; vi++) {
    for (let d0 = 0; d0 < 4; d0++) {
      if (!(edges[vi] & (1 << d0))) continue;
      let vx = vi % vw;
      let vy = (vi / vw) | 0;
      let dir = d0;
      const pts: Pt[] = [];
      for (;;) {
        edges[vy * vw + vx] &= ~(1 << dir); // consume this edge
        pts.push({ x: vx, y: vy });
        vx += DX[dir];
        vy += DY[dir];
        const m = edges[vy * vw + vx];
        const left = (dir + 3) & 3;
        const right = (dir + 1) & 3;
        if (m & (1 << left)) dir = left;
        else if (m & (1 << dir)) {
          // straight on — dir unchanged; dedupeCollinear collapses the run
        } else if (m & (1 << right)) dir = right;
        else break; // back at the start — loop closed
      }
      if (pts.length >= 4) loops.push(dedupeCollinear(pts));
    }
  }
  return loops;
}

/** Remove consecutive duplicates and collinear midpoints from a closed loop. */
function dedupeCollinear(pts: Pt[]): Pt[] {
  const out: Pt[] = [];
  const n = pts.length;
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const prev = out[out.length - 1];
    if (prev && prev.x === p.x && prev.y === p.y) continue;
    out.push(p);
  }
  const res: Pt[] = [];
  const m = out.length;
  for (let i = 0; i < m; i++) {
    const a = out[(i + m - 1) % m];
    const b = out[i];
    const c = out[(i + 1) % m];
    const cross = (b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x);
    if (cross !== 0) res.push(b);
  }
  return res.length >= 3 ? res : out;
}

/** Signed shoelace area of a closed loop — |area| ≈ region size in px². */
function loopArea(pts: Pt[]): number {
  let a = 0;
  for (let i = 0, n = pts.length; i < n; i++) {
    const p = pts[i];
    const q = pts[(i + 1) % n];
    a += p.x * q.y - q.x * p.y;
  }
  return a / 2;
}

// ── 4. Simplification + corners ─────────────────────────────────────────────

function rdpOpen(pts: Pt[], eps: number): Pt[] {
  const n = pts.length;
  if (n < 3 || eps <= 0) return pts.slice();
  const keep = new Uint8Array(n);
  keep[0] = keep[n - 1] = 1;
  const e2 = eps * eps;
  const stack: [number, number][] = [[0, n - 1]];
  while (stack.length) {
    const [a, b] = stack.pop()!;
    const ax = pts[a].x;
    const ay = pts[a].y;
    const dx = pts[b].x - ax;
    const dy = pts[b].y - ay;
    const len2 = dx * dx + dy * dy;
    let maxD = -1;
    let idx = -1;
    for (let i = a + 1; i < b; i++) {
      let d: number;
      if (len2 === 0) {
        const ex = pts[i].x - ax;
        const ey = pts[i].y - ay;
        d = ex * ex + ey * ey;
      } else {
        let t = ((pts[i].x - ax) * dx + (pts[i].y - ay) * dy) / len2;
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        const px = ax + t * dx - pts[i].x;
        const py = ay + t * dy - pts[i].y;
        d = px * px + py * py;
      }
      if (d > maxD) {
        maxD = d;
        idx = i;
      }
    }
    if (maxD > e2 && idx > 0) {
      keep[idx] = 1;
      stack.push([a, idx], [idx, b]);
    }
  }
  const out: Pt[] = [];
  for (let i = 0; i < n; i++) if (keep[i]) out.push(pts[i]);
  return out;
}

/** RDP for a closed loop: split at the point farthest from p0, simplify halves. */
function rdpClosed(pts: Pt[], eps: number): Pt[] {
  const n = pts.length;
  if (n < 5 || eps <= 0) return pts.slice();
  let k = 1;
  let maxD = -1;
  for (let i = 1; i < n; i++) {
    const dx = pts[i].x - pts[0].x;
    const dy = pts[i].y - pts[0].y;
    const d = dx * dx + dy * dy;
    if (d > maxD) {
      maxD = d;
      k = i;
    }
  }
  const a = rdpOpen(pts.slice(0, k + 1), eps);
  const b = rdpOpen([...pts.slice(k), pts[0]], eps);
  return [...a.slice(0, -1), ...b.slice(0, -1)];
}

// Tangents for corner detection are estimated over a short arc of the
// polyline, not a single segment — single-segment turns on lattice-derived
// points are raster noise (a clean circle would read as all corners).
const CORNER_WINDOW = 3; // px

/** Indices whose interior angle is sharper than cornerAngle — kept as corners. */
function cornerIndices(pts: Pt[], cornerAngle: number): number[] {
  const n = pts.length;
  if (n < 3) return [];
  const maxTurn = 180 - cornerAngle; // turn sharper than this ⇒ corner
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    // Walk ≥ CORNER_WINDOW px backward and forward along the ring.
    let j = i;
    let acc = 0;
    for (let g = 0; acc < CORNER_WINDOW && g < n; g++) {
      const k = (j + n - 1) % n;
      acc += Math.hypot(pts[j].x - pts[k].x, pts[j].y - pts[k].y);
      j = k;
    }
    let m = i;
    acc = 0;
    for (let g = 0; acc < CORNER_WINDOW && g < n; g++) {
      const k = (m + 1) % n;
      acc += Math.hypot(pts[k].x - pts[m].x, pts[k].y - pts[m].y);
      m = k;
    }
    const ux = pts[i].x - pts[j].x;
    const uy = pts[i].y - pts[j].y;
    const vx = pts[m].x - pts[i].x;
    const vy = pts[m].y - pts[i].y;
    const lu = Math.hypot(ux, uy);
    const lv = Math.hypot(vx, vy);
    if (lu < 1e-9 || lv < 1e-9) continue;
    let cos = (ux * vx + uy * vy) / (lu * lv);
    cos = cos < -1 ? -1 : cos > 1 ? 1 : cos;
    const turn = (Math.acos(cos) * 180) / Math.PI;
    if (turn > maxTurn) out.push(i);
  }
  return out;
}

/**
 * One corner-preserving relaxation pass (¼–½–¼): nudges lattice points onto
 * the curve they sample, so the fitter chases the drawing, not the pixel grid.
 */
function relaxLoop(pts: Pt[], corners: number[]): Pt[] {
  const n = pts.length;
  if (n < 3) return pts;
  const isCorner = new Set(corners);
  return pts.map((p, i) => {
    if (isCorner.has(i)) return p;
    const a = pts[(i + n - 1) % n];
    const c = pts[(i + 1) % n];
    return { x: (a.x + 2 * p.x + c.x) / 4, y: (a.y + 2 * p.y + c.y) / 4 };
  });
}

// ── 5. Cubic Bézier fitting (Schneider, Graphics Gems, reimplemented) ───────

type Cubic = [Pt, Pt, Pt, Pt];

const vAdd = (a: Pt, b: Pt): Pt => ({ x: a.x + b.x, y: a.y + b.y });
const vSub = (a: Pt, b: Pt): Pt => ({ x: a.x - b.x, y: a.y - b.y });
const vScale = (a: Pt, s: number): Pt => ({ x: a.x * s, y: a.y * s });
const vDot = (a: Pt, b: Pt): number => a.x * b.x + a.y * b.y;
const vLen = (a: Pt): number => Math.hypot(a.x, a.y);
const vNorm = (a: Pt): Pt => {
  const l = vLen(a);
  return l > 1e-12 ? { x: a.x / l, y: a.y / l } : { x: 0, y: 0 };
};

function bezPoint(bez: Cubic, t: number): Pt {
  const s = 1 - t;
  const b0 = s * s * s;
  const b1 = 3 * t * s * s;
  const b2 = 3 * t * t * s;
  const b3 = t * t * t;
  return {
    x: b0 * bez[0].x + b1 * bez[1].x + b2 * bez[2].x + b3 * bez[3].x,
    y: b0 * bez[0].y + b1 * bez[1].y + b2 * bez[2].y + b3 * bez[3].y,
  };
}

function chordParam(pts: Pt[], first: number, last: number): number[] {
  const u = [0];
  for (let i = first + 1; i <= last; i++) {
    u.push(u[u.length - 1] + vLen(vSub(pts[i], pts[i - 1])));
  }
  const total = u[u.length - 1] || 1;
  return u.map((v) => v / total);
}

/** Least-squares cubic for a run of points with fixed end tangents. */
function generateBezier(
  pts: Pt[],
  first: number,
  last: number,
  u: number[],
  tHat1: Pt,
  tHat2: Pt,
): Cubic {
  const p0 = pts[first];
  const p3 = pts[last];
  let c00 = 0;
  let c01 = 0;
  let c11 = 0;
  let x0 = 0;
  let x1 = 0;
  for (let i = first; i <= last; i++) {
    const t = u[i - first];
    const s = 1 - t;
    const b0 = s * s * s;
    const b1 = 3 * t * s * s;
    const b2 = 3 * t * t * s;
    const b3 = t * t * t;
    const a0 = vScale(tHat1, b1);
    const a1 = vScale(tHat2, b2);
    c00 += vDot(a0, a0);
    c01 += vDot(a0, a1);
    c11 += vDot(a1, a1);
    const tmp = vSub(pts[i], {
      x: p0.x * (b0 + b1) + p3.x * (b2 + b3),
      y: p0.y * (b0 + b1) + p3.y * (b2 + b3),
    });
    x0 += vDot(a0, tmp);
    x1 += vDot(a1, tmp);
  }
  const det = c00 * c11 - c01 * c01;
  let alphaL = det !== 0 ? (x0 * c11 - x1 * c01) / det : 0;
  let alphaR = det !== 0 ? (c00 * x1 - c01 * x0) / det : 0;
  const segLen = vLen(vSub(p3, p0));
  const eps = 1e-6 * segLen;
  // Degenerate or wild solutions fall back to the Wu/Barsky heuristic.
  if (alphaL < eps || alphaR < eps || alphaL > segLen * 3 || alphaR > segLen * 3) {
    alphaL = alphaR = segLen / 3;
  }
  return [p0, vAdd(p0, vScale(tHat1, alphaL)), vAdd(p3, vScale(tHat2, alphaR)), p3];
}

function maxFitError(
  pts: Pt[],
  first: number,
  last: number,
  bez: Cubic,
  u: number[],
): { err: number; split: number } {
  let err = 0;
  let split = (first + last + 1) >> 1;
  for (let i = first + 1; i < last; i++) {
    const p = bezPoint(bez, u[i - first]);
    const d = vSub(p, pts[i]);
    const dist = d.x * d.x + d.y * d.y;
    if (dist > err) {
      err = dist;
      split = i;
    }
  }
  return { err, split };
}

/** One Newton–Raphson step per point, pulling parameters toward the curve. */
function reparameterize(pts: Pt[], first: number, last: number, u: number[], bez: Cubic): void {
  for (let i = first; i <= last; i++) {
    const t = u[i - first];
    const p = pts[i];
    const q = bezPoint(bez, t);
    // Q'(t) and Q''(t) via derivative control polygons.
    const d1: Pt[] = [0, 1, 2].map((k) => vScale(vSub(bez[k + 1], bez[k]), 3));
    const d2: Pt[] = [0, 1].map((k) => vScale(vSub(d1[k + 1], d1[k]), 2));
    const s = 1 - t;
    const q1 = {
      x: s * s * d1[0].x + 2 * s * t * d1[1].x + t * t * d1[2].x,
      y: s * s * d1[0].y + 2 * s * t * d1[1].y + t * t * d1[2].y,
    };
    const q2 = { x: s * d2[0].x + t * d2[1].x, y: s * d2[0].y + t * d2[1].y };
    const diff = vSub(q, p);
    const num = vDot(diff, q1);
    const den = vDot(q1, q1) + vDot(diff, q2);
    if (Math.abs(den) < 1e-12) continue;
    let nt = t - num / den;
    nt = nt < 0 ? 0 : nt > 1 ? 1 : nt;
    u[i - first] = nt;
  }
}

// A single cubic only reads clean up to ~90° of net turning. Beyond that a
// fit can pass the point-error test yet still show flat spots (a 150° arc of
// a circle squeaks under a 1px tolerance while being visibly un-round), so
// wide arcs are split at their turning midpoint before any fitting happens.
const SEG_TURN_CAP = (90 * Math.PI) / 180;

function fitCubicRec(
  pts: Pt[],
  first: number,
  last: number,
  tHat1: Pt,
  tHat2: Pt,
  errSq: number,
  out: Cubic[],
  depth: number,
): void {
  if (last - first + 1 > 3 && depth <= 24) {
    const cum: number[] = [];
    let total = 0;
    for (let i = first + 1; i < last; i++) {
      const ax = pts[i].x - pts[i - 1].x;
      const ay = pts[i].y - pts[i - 1].y;
      const bx = pts[i + 1].x - pts[i].x;
      const by = pts[i + 1].y - pts[i].y;
      total += Math.atan2(ax * by - ay * bx, ax * bx + ay * by);
      cum.push(total);
    }
    // Split where the turning crosses half, so the two arcs come out balanced.
    let split = -1;
    for (let k = 0; k < cum.length; k++) {
      if (Math.abs(cum[k]) >= Math.abs(total) / 2) {
        split = first + 1 + k;
        break;
      }
    }
    if (Math.abs(total) > SEG_TURN_CAP && split > first && split < last) {
      const tC = vNorm(vSub(pts[split - 1], pts[split + 1]));
      const tHatC = tC.x === 0 && tC.y === 0 ? vNorm(vSub(pts[first], pts[last])) : tC;
      fitCubicRec(pts, first, split, tHat1, tHatC, errSq, out, depth + 1);
      fitCubicRec(pts, split, last, vScale(tHatC, -1), tHat2, errSq, out, depth + 1);
      return;
    }
  }
  if (last - first + 1 === 2) {
    const dist = vLen(vSub(pts[last], pts[first])) / 3;
    out.push([
      pts[first],
      vAdd(pts[first], vScale(tHat1, dist)),
      vAdd(pts[last], vScale(tHat2, dist)),
      pts[last],
    ]);
    return;
  }
  const u = chordParam(pts, first, last);
  let bez = generateBezier(pts, first, last, u, tHat1, tHat2);
  let { err, split } = maxFitError(pts, first, last, bez, u);
  if (err < errSq) {
    out.push(bez);
    return;
  }
  if (err < errSq * 16) {
    for (let i = 0; i < 4; i++) {
      reparameterize(pts, first, last, u, bez);
      bez = generateBezier(pts, first, last, u, tHat1, tHat2);
      ({ err, split } = maxFitError(pts, first, last, bez, u));
      if (err < errSq) {
        out.push(bez);
        return;
      }
    }
  }
  if (depth > 24 || split <= first || split >= last) {
    out.push(bez);
    return;
  }
  // Split at the worst point with a smooth centre tangent, and recurse.
  const tC = vNorm(vSub(pts[split - 1], pts[split + 1]));
  const tHatC = tC.x === 0 && tC.y === 0 ? vNorm(vSub(pts[first], pts[last])) : tC;
  fitCubicRec(pts, first, split, tHat1, tHatC, errSq, out, depth + 1);
  fitCubicRec(pts, split, last, vScale(tHatC, -1), tHat2, errSq, out, depth + 1);
}

function fitOpenRun(pts: Pt[], errSq: number): Cubic[] {
  const out: Cubic[] = [];
  if (pts.length < 2) return out;
  const tHat1 = vNorm(vSub(pts[1], pts[0]));
  const tHat2 = vNorm(vSub(pts[pts.length - 2], pts[pts.length - 1]));
  fitCubicRec(pts, 0, pts.length - 1, tHat1, tHat2, errSq, out, 0);
  return out;
}

/** Fit one closed loop: split at the given corners, fit smooth runs between. */
function fitLoop(pts: Pt[], corners: number[], errSq: number): Cubic[] {
  const n = pts.length;

  if (corners.length === 0) {
    // Fully smooth loop (a circle, a blob): wrap and fit with a matched seam.
    const run = [...pts, pts[0]];
    const tHat1 = vNorm(vSub(pts[1], pts[n - 1]));
    const out: Cubic[] = [];
    fitCubicRec(run, 0, n, tHat1, vScale(tHat1, -1), errSq, out, 0);
    return out;
  }

  const out: Cubic[] = [];
  for (let k = 0; k < corners.length; k++) {
    const a = corners[k];
    const b = corners[(k + 1) % corners.length];
    const run: Pt[] = [];
    let i = a;
    for (;;) {
      run.push(pts[i]);
      if (i === b && run.length > 1) break;
      i = (i + 1) % n;
      if (run.length > n + 1) break; // single-corner loop wraps fully once
    }
    out.push(...fitOpenRun(run, errSq));
  }
  return out;
}

// ── Assembly ────────────────────────────────────────────────────────────────

const fmt = (v: number): string => String(Math.round(v * 100) / 100);

function loopToPathD(segs: Cubic[]): string {
  if (segs.length === 0) return "";
  let d = `M${fmt(segs[0][0].x)} ${fmt(segs[0][0].y)}`;
  for (const [, c1, c2, p3] of segs) {
    d += `C${fmt(c1.x)} ${fmt(c1.y)} ${fmt(c2.x)} ${fmt(c2.y)} ${fmt(p3.x)} ${fmt(p3.y)}`;
  }
  return d + "Z";
}

/** Run the full trace. `lum` is a luminanceMap() of the working image. */
export function traceImage(
  lum: Uint8Array,
  w: number,
  h: number,
  o: TraceOptions,
): TraceResult {
  const ink = new Uint8Array(w * h);
  for (let i = 0; i < ink.length; i++) {
    const v = lum[i];
    ink[i] = (o.invert ? v > 255 - o.threshold : v < o.threshold) ? 1 : 0;
  }

  const errSq = Math.max(0.05, o.smoothing) ** 2;
  let d = "";
  let loops = 0;
  let anchors = 0;
  for (const raw of extractLoops(ink, w, h)) {
    if (Math.abs(loopArea(raw)) < Math.max(o.despeckle, 0.5)) continue;
    // Simplify — retrying tighter if a thin sliver (a 1px stroke) collapses,
    // so hairlines that survived despeckle can't vanish here.
    let eps = o.simplify;
    let simp = rdpClosed(raw, eps);
    while (simp.length < 4 && eps > 0.15) {
      eps /= 2;
      simp = rdpClosed(raw, eps);
    }
    if (simp.length < 3) simp = raw;
    if (simp.length < 3) continue;
    const corners = cornerIndices(simp, o.cornerAngle);
    const segs = fitLoop(relaxLoop(simp, corners), corners, errSq);
    if (segs.length === 0) continue;
    loops++;
    anchors += segs.length;
    d += loopToPathD(segs);
  }
  return { width: w, height: h, d, loops, anchors };
}

/** Serialize a trace as a standalone SVG document (evenodd, single fill). */
export function traceToSvg(res: TraceResult, fill: string): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${res.width} ${res.height}" ` +
    `width="${res.width}" height="${res.height}">` +
    `<path d="${res.d}" fill="${fill}" fill-rule="evenodd"/>` +
    `</svg>`
  );
}
