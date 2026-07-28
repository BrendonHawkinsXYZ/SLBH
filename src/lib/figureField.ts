/**
 * figureField — the pixel-figure instrument: a parametric character rendered as
 * a low-resolution mosaic, in the same register as the Field shapes.
 *
 * The figure is drawn once at a fixed internal resolution (a 100 × 182 logical
 * box at 3× supersample), then *re-sampled* on a coarse lattice: one square
 * block per `pixels` step, coloured from the baked frame and dropped wherever
 * the frame is transparent. That resample is what gives the sprite look, and it
 * is why the same code makes both the live preview and the export — the block
 * grid is keyed to the figure box, not to the canvas, so a 1000px PNG is the
 * preview at higher fidelity rather than a different composition.
 *
 * Everything is a pure function of `FigureParams` plus a background, so a look
 * is fully described by the settings the tool exports.
 */

export type Background = "white" | "black" | "transparent";

// ── Palette ─────────────────────────────────────────────────────────────────
// The curated garment / skin / hair range. Sorted below into hue bins (then
// light → dark inside a bin) so the swatch grid reads as a spectrum strip.
const RAW: string[] = [
  "#5B2A86", "#FF5A1F", "#FFD000", "#B6D936", "#7A1FA2", "#3A0D3F", "#D6E84A", "#FF8A00",
  "#FF2E2E", "#314D1F", "#B44E5A", "#6F38C5", "#8C5E72", "#1A061F", "#8FAE3F", "#6B5A8E",
  "#00A676", "#5F6C2E", "#D72638", "#E76F51", "#8A4F22", "#4B1D5C", "#2146C7", "#5A2A6E",
  "#FF1E1E", "#FF6B35", "#F04E23", "#B00020", "#7B5A46", "#2B0308", "#A31621", "#C1125A",
  "#D00000", "#FF7A45", "#C81D25", "#38405F", "#B84A62", "#E0003C", "#6E2639", "#3D1A4F",
  "#7A0F2B", "#4A4E69", "#3A2A2A", "#36000B", "#4A0012", "#6F7D86", "#2B2F4A", "#1F2A44",
  "#3A1748", "#5C6573", "#37406B", "#4B3A5F", "#83909A", "#313A4A", "#15132E", "#2F1F4F",
  "#6A3D5C", "#858A94", "#315A7C", "#4E76A6", "#20283A", "#5F746E", "#4D625F", "#3F6C9A",
  "#6F7F8F", "#24122F", "#3A4A66", "#596272", "#596BA3", "#3B3B46", "#FF8FA3", "#B8F7D4",
  "#FFD60A", "#8FCB68", "#FFB703", "#FF4FD8", "#FF9F1C", "#D7FF2F", "#6FBF73", "#F9C80E",
  "#FFE156", "#FF7A00", "#F4B860", "#A3B18A", "#FF5E5B", "#D99A00", "#C78BE8", "#AFA4FF",
  "#F6B64A", "#FF3D8B", "#F7C59F", "#F15B7A", "#B48EAD", "#C9B6FF", "#D49AB3", "#D8A7D8",
  "#F2C14E", "#4FD1A5", "#5BCBFF", "#8C4CFF", "#B8F23A", "#A8E6CF", "#7FC8C2", "#A7B77B",
  "#8ED6C9", "#8FA7C8", "#BDECCF", "#7DDE92", "#5E9F78", "#9ADBE8", "#33C7FF", "#00A6FB",
  "#3A2FBD", "#B8A7D9", "#8A7F96", "#7B61FF", "#8E8CD8", "#9AA7C8", "#A7B6C8", "#00E5FF",
  "#667085", "#4F5D2F", "#A3B000", "#FF3F6C", "#FFB000", "#FF6A00", "#FF8C00", "#00C2A8",
  "#FF5EBE", "#5DE2E7", "#FF2E63", "#4B2E83", "#C9184A", "#8F2D56", "#9A6A78", "#6A3F5F",
  "#D77A8A", "#5A4A3F", "#3F1F2F", "#2A121A", "#B98A95", "#6F5A6B", "#D6A100", "#2563EB",
  "#8A7A1F", "#B23A48", "#B6A27E", "#7F8FB3", "#7F7A52", "#9A9288", "#A58C6A", "#5F5A54",
  "#B8A4D4", "#C8BFAE", "#6F7A89", "#555A60", "#2F2D3A", "#D8A7C8", "#8FAE1B", "#8A6F1F",
  "#315C3A", "#FF1F8F", "#9B3D5C", "#A6ADB4", "#C9D6DD", "#9BA8A0", "#7E8A00", "#6ED6B8",
];

function parseColor(c: string): [number, number, number] {
  if (c.charCodeAt(0) === 35) {
    return [
      parseInt(c.slice(1, 3), 16),
      parseInt(c.slice(3, 5), 16),
      parseInt(c.slice(5, 7), 16),
    ];
  }
  // rgb(r,g,b) — tint()/mix() results feed back into tint(), so both forms parse.
  const m = /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(c);
  if (!m) return [0, 0, 0];
  return [+m[1], +m[2], +m[3]];
}

function lum(c: string): number {
  const [r, g, b] = parseColor(c);
  return r * 0.3 + g * 0.59 + b * 0.11;
}

function hsl(c: string): { h: number; s: number; l: number } {
  const [r, g, b] = parseColor(c).map((v) => v / 255);
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  const d = mx - mn;
  const l = (mx + mn) / 2;
  let h = 0;
  if (d) {
    if (mx === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return { h, s: d ? d / (1 - Math.abs(2 * l - 1)) : 0, l };
}

// Hue bins for the swatch sort: red, orange, yellow, green, teal, blue,
// violet, magenta — then bin 8 for anything desaturated enough to read grey.
const BINS: [number, number][] = [
  [345, 15],
  [15, 45],
  [45, 75],
  [75, 165],
  [165, 200],
  [200, 250],
  [250, 290],
  [290, 345],
];

function binOf(c: string): number {
  const t = hsl(c);
  if (t.s < 0.14) return 8;
  for (let i = 0; i < BINS.length; i++) {
    const [a, b] = BINS[i];
    if (a > b ? t.h >= a || t.h < b : t.h >= a && t.h < b) return i;
  }
  return 8;
}

/** The swatch palette: deduped, hue-binned, light → dark within each bin. */
export const PALETTE: string[] = (() => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const c of RAW) {
    if (!seen.has(c)) {
      seen.add(c);
      out.push(c);
    }
  }
  out.sort((a, b) => {
    const ba = binOf(a);
    const bb = binOf(b);
    return ba !== bb ? ba - bb : hsl(b).l - hsl(a).l;
  });
  return out;
})();

export function colorIndex(hex: string): number {
  const i = PALETTE.indexOf(hex);
  return i < 0 ? 0 : i;
}

function tint(c: string, f: number): string {
  const [r, g, b] = parseColor(c);
  return `rgb(${Math.min(255, Math.round(r * f))},${Math.min(255, Math.round(g * f))},${Math.min(255, Math.round(b * f))})`;
}

function mix(a: string, b: string, t: number): string {
  const A = parseColor(a);
  const B = parseColor(b);
  return `rgb(${Math.round(A[0] + (B[0] - A[0]) * t)},${Math.round(A[1] + (B[1] - A[1]) * t)},${Math.round(A[2] + (B[2] - A[2]) * t)})`;
}

// ── Wardrobe vocabulary ─────────────────────────────────────────────────────

export const DIRECTIONS = ["Front", "3/4", "Side", "3/4 back", "Back"];
export const HAIR_TYPES = ["Crop", "Bowl", "Long", "Bun", "Locs", "Afro", "Bald", "Spiky"];
// Every slot starts with "None" — the figure can be undressed down to briefs,
// which are the one thing that never comes off. The body underneath is a single
// agender build: no chest shaping, no gendered proportions, nothing the
// wardrobe doesn't put there.
export const BASE_LAYERS = [
  "None",
  "Tank",
  "Crop tank",
  "Tee",
  "Crop tee",
  "Sheer tank",
  "Crewneck",
  "Turtleneck",
  "Shirt",
  "CHROMA tee",
  "SLBH tee",
  "Dress",
];
export const OUTER_LAYERS = [
  "None",
  "Hoodie",
  "Hood up",
  "Long coat",
  "Trench",
  "Big blazer",
  "Suit jacket",
  "Cropped knit",
  "Puffer",
];
export const BOTTOMS = [
  "None",
  "Wide-leg",
  "Flare",
  "Straight",
  "Suit trouser",
  "Midi skirt",
  "Long skirt",
  "Shorts",
  "Overalls",
];
export const SHOES = ["Barefoot", "Chunky boot", "Thigh boot", "Sneaker", "Loafer", "Derby"];
export const ACCESSORIES = ["None", "Shades", "Tote", "Shoulder bag", "Scarf", "Beanie", "Tie"];

type DirSpec = { w: number; fx: number; face: number; arm: number };
type BaseSpec = {
  tw: number; // torso half-width at the shoulder
  hem: number;
  slv: number; // -1 sleeveless, 0 short, 1 long
  bare?: boolean; // nothing on the torso — the body shows
  sheer?: boolean;
  neck?: boolean;
  collar?: boolean;
  print?: string;
  dress?: boolean;
  flare?: number;
};
type OuterSpec = {
  top: number;
  hem: number;
  w: number;
  slit?: boolean; // open front — what's under it shows through
  belt?: boolean;
  quilt?: boolean;
  hood?: "down" | "up";
  pocket?: boolean; // kangaroo pocket
  cords?: boolean;
  lapel?: boolean;
  buttons?: boolean;
};
// Trousers are a profile, not a box: a width multiplier on the leg at the hip,
// at the knee, and at the hem. That's what makes a flare a flare — the leg has
// to pull in at the knee before it can open out.
type BottomSpec = {
  kind: "none" | "pants" | "skirt";
  hip?: number;
  knee?: number;
  hem?: number;
  stop?: number; // where the leg ends (below 172 = cropped, above = it drags)
  hemY?: number; // skirt hem
  bib?: boolean;
  crease?: boolean;
  puddle?: boolean; // fabric pools over the shoe instead of stopping at it
};
type ShoeSpec = { shaft: number; tuck: boolean; rz: number; foot: number; bare?: boolean };
type HairSpec = {
  cy: number;
  ch: number;
  sw?: number; // side-fall width
  st?: number; // side-fall top
  sb?: number; // side-fall bottom
  bun?: boolean;
  locs?: boolean;
  wide?: number;
  spike?: boolean;
};

// Per-direction: body width scale, feature offset, face visibility, arm count.
const DIR: DirSpec[] = [
  { w: 1, fx: 0, face: 2, arm: 2 },
  { w: 0.9, fx: 3.5, face: 1, arm: 2 },
  { w: 0.62, fx: 8, face: 0, arm: 1 },
  { w: 0.9, fx: 0, face: -1, arm: 2 },
  { w: 1, fx: 0, face: -1, arm: 2 },
];

const BSPEC: BaseSpec[] = [
  { tw: 15, hem: 118, slv: -1, bare: true },
  { tw: 16, hem: 120, slv: -1 },
  { tw: 16, hem: 102, slv: -1 },
  { tw: 18, hem: 120, slv: 0 },
  { tw: 18, hem: 102, slv: 0 },
  { tw: 16, hem: 126, slv: -1, sheer: true },
  { tw: 19, hem: 122, slv: 1 },
  { tw: 18, hem: 120, slv: 1, neck: true },
  { tw: 19, hem: 124, slv: 1, collar: true },
  { tw: 18, hem: 120, slv: 0, print: "CHROMA" },
  { tw: 18, hem: 120, slv: 0, print: "SLBH" },
  { tw: 17, hem: 168, slv: 1, dress: true, flare: 20 },
];

const OSPEC: (OuterSpec | null)[] = [
  null,
  { top: 60, hem: 124, w: 21.8, hood: "down", pocket: true, cords: true },
  { top: 60, hem: 124, w: 21.8, hood: "up", pocket: true, cords: true },
  { top: 60, hem: 150, w: 21.4, slit: true },
  { top: 60, hem: 146, w: 21.4, slit: true, belt: true },
  { top: 58, hem: 128, w: 23, slit: true },
  { top: 60, hem: 128, w: 20, slit: true, lapel: true, buttons: true },
  { top: 60, hem: 104, w: 21.4 },
  { top: 60, hem: 118, w: 23, quilt: true },
];

// The flare is the shape the whole leg vocabulary is built around: pulled in
// hard at the knee, then opened to well past the width of the body and left
// long enough to break over the shoe and pool on the floor.
const BOT_SPEC: BottomSpec[] = [
  { kind: "none" },
  { kind: "pants", hip: 1.06, knee: 1.3, hem: 1.66 },
  { kind: "pants", hip: 1, knee: 0.76, hem: 2.7, stop: 179, puddle: true },
  { kind: "pants", hip: 1, knee: 1, hem: 1.04 },
  { kind: "pants", hip: 1.04, knee: 0.94, hem: 1.18, crease: true },
  { kind: "skirt", hemY: 148 },
  { kind: "skirt", hemY: 170 },
  { kind: "pants", hip: 1.08, knee: 1.12, hem: 1.14, stop: 140 },
  { kind: "pants", hip: 1.14, knee: 1.12, hem: 1.22, bib: true },
];

const SSPEC: ShoeSpec[] = [
  { shaft: 0, tuck: false, rz: 0.6, foot: 6, bare: true },
  { shaft: 162, tuck: false, rz: 3, foot: 9 },
  { shaft: 128, tuck: true, rz: 1.4, foot: 9 },
  { shaft: 0, tuck: false, rz: 2.4, foot: 9 },
  { shaft: 0, tuck: false, rz: 1.4, foot: 6 },
  { shaft: 0, tuck: false, rz: 1.4, foot: 9 },
];

const HC: HairSpec[] = [
  { cy: 11, ch: 9 },
  { cy: 11, ch: 10, sw: 6, st: 11, sb: 38 },
  { cy: 11, ch: 9, sw: 6.5, st: 11, sb: 56 },
  { cy: 11, ch: 9, bun: true },
  { cy: 11, ch: 9, locs: true },
  { cy: 3, ch: 17, sw: 9, st: 5, sb: 44, wide: 9 },
  { cy: 0, ch: 0 }, // bald — never drawn
  { cy: 10, ch: 10, spike: true },
];

/** How far a hairstyle reaches from the centre of the head — what a hood, or
 *  anything else that has to go over it, needs to clear. */
function hairSpan(ht: number): number {
  if (ht === 6) return 16; // bald — just the head
  const c = HC[ht];
  let half = 16 + (c.wide ?? 0);
  if (c.sw) half = Math.max(half, 16 + c.sw);
  if (c.locs) half = Math.max(half, 23);
  return half;
}

// 3 × 5 glyphs, one row per bit-triple, for the printed tees.
const FONT: Record<string, number[]> = {
  C: [7, 4, 4, 4, 7],
  H: [5, 5, 7, 5, 5],
  R: [6, 5, 6, 5, 5],
  O: [7, 5, 5, 5, 7],
  M: [5, 7, 7, 5, 5],
  A: [7, 5, 7, 5, 5],
  S: [7, 4, 7, 1, 7],
  L: [4, 4, 4, 4, 7],
  B: [6, 5, 6, 5, 6],
};

// ── Params ──────────────────────────────────────────────────────────────────

export type FigureParams = {
  px: number; // block size, in logical units (the sprite grain)
  dir: number;
  skin: number;
  hair: number;
  hairT: number;
  weight: number; // 0..1
  height: number; // 0..1
  base: number;
  basec: number;
  out: number;
  outc: number;
  bot: number;
  botc: number;
  sho: number;
  acc: number;
};

export const PIXEL_SPEC = { min: 0.6, max: 4.4, step: 0.1 };

export const DEFAULT_FIGURE: FigureParams = {
  px: 1.2,
  dir: 1,
  skin: colorIndex("#F7C59F"),
  hair: colorIndex("#3A0D3F"),
  hairT: 2,
  weight: 0.4,
  height: 0.5,
  base: BASE_LAYERS.indexOf("CHROMA tee"),
  basec: colorIndex("#2B2F4A"),
  out: 0,
  outc: colorIndex("#4A4E69"),
  bot: BOTTOMS.indexOf("Overalls"),
  botc: colorIndex("#38405F"),
  sho: SHOES.indexOf("Sneaker"),
  acc: 0,
};

/** A dress fills the bottom slot, so the bottom garment is inert. */
export function isDress(p: FigureParams): boolean {
  return !!BSPEC[p.base].dress;
}

/** Nothing on the torso and nothing on the legs — briefs only. */
export function isBare(p: FigureParams): boolean {
  return !!BSPEC[p.base].bare && BOT_SPEC[p.bot].kind === "none";
}

/** Trousers tucked into the boot shaft (thigh boots). */
export function isTucked(p: FigureParams): boolean {
  return SSPEC[p.sho].tuck;
}

// ── Geometry ────────────────────────────────────────────────────────────────

const SC = 3; // supersample of the bake
export const FIG_W = 100;
export const FIG_H = 182;
export const FIGURE_ASPECT = FIG_W / FIG_H;
const BAKE_W = FIG_W * SC;
const BAKE_H = FIG_H * SC;
/** Inset of the figure inside its frame, as a fraction of the frame height. */
export const MARGIN_FRAC = 0.06;
/** Below this grain the mosaic closes up and reads as a solid figure. */
const GRAIN_SOLID = 2;
/** Gutter between blocks once the grain is coarse, as a fraction of the cell. */
const GUTTER_FRAC = 0.15;
/** Leg width at the ankle, as a fraction of the width at the thigh. */
const LEG_TAPER = 0.76;
/**
 * The shoulder line. Torso, base layer, and sleeves all start here so the
 * shoulders read as one edge — start the body above the garment and a band of
 * it shows across the top of every top in the wardrobe.
 */
const SHOULDER = 59;

/**
 * Draw the figure at bake resolution. Coordinates are logical (100 × 182, y
 * down from the crown); `Y()` folds in the height dial by scaling everything
 * about the ground line, so a taller figure grows upward from its feet.
 *
 * Order is the whole game — a garment is only "over" another because it was
 * painted after it. Back to front:
 *
 *   body (legs, torso) → briefs → boot shaft → bottom → shoe → base layer and
 *   sleeves → overall bib → outer layer, its sleeves, its open front → hands,
 *   neck, collars, tie, scarf → head → hair → hat or hood → face → carried bags
 *
 * Two exceptions earn their place: a tuck-in boot jumps ahead of the trousers
 * (that's what tucking is), and a hem long enough to puddle is painted after
 * the shoe so the fabric breaks over it instead of stopping at the ankle.
 */
function paintFigure(ctx: CanvasRenderingContext2D, P: FigureParams, shadow: string | null): void {
  const hs = 0.9 + P.height * 0.2;
  const Y = (y: number) => (FIG_H - (FIG_H - y) * hs) * SC;

  const box = (x: number, y: number, w: number, h: number, col: string) => {
    if (h <= 0) return;
    ctx.fillStyle = col;
    ctx.fillRect(x * SC, Y(y), w * SC, Y(y + h) - Y(y));
  };
  // A box plus its shaded right third — the whole figure is built from these,
  // which is what gives every limb the same one-light-source read.
  const vol = (x: number, y: number, w: number, h: number, col: string) => {
    if (h <= 0) return;
    box(x, y, w, h, col);
    box(x + w * 0.6, y, w * 0.4, h, tint(col, 0.78));
  };
  const poly = (pts: [number, number][], col: string) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    pts.forEach((v, i) => {
      if (i) ctx.lineTo(v[0] * SC, Y(v[1]));
      else ctx.moveTo(v[0] * SC, Y(v[1]));
    });
    ctx.closePath();
    ctx.fill();
  };
  const text = (str: string, cx: number, cy: number, u: number, col: string) => {
    const wp = str.length * 4 - 1;
    const x0 = cx - (wp * u) / 2;
    for (let i = 0; i < str.length; i++) {
      const g = FONT[str[i]];
      if (!g) continue;
      for (let r = 0; r < 5; r++) {
        for (let k = 0; k < 3; k++) {
          if ((g[r] >> (2 - k)) & 1) box(x0 + (i * 4 + k) * u, cy + r * u, u * 1.02, u * 1.02, col);
        }
      }
    }
  };
  const hairMass = (hx: number, hcol: string, ht: number, back: boolean, side: boolean) => {
    if (ht === 6) return; // bald
    const c = HC[ht];
    const HL = hx - 16;
    const HR = hx + 16;
    const wd = c.wide ?? 0;
    const st = c.st ?? 0;
    const sb = c.sb ?? 0;
    const bot = back ? Math.max(sb, 46) : c.cy + c.ch;
    vol(HL - wd, c.cy, HR + wd - (HL - wd), bot - c.cy, hcol);
    if (c.spike) {
      poly(
        [
          [HL, c.cy + 3],
          [HL + 8, c.cy - 7],
          [hx, c.cy + 3],
          [hx + 8, c.cy - 7],
          [HR, c.cy + 3],
        ],
        hcol,
      );
    }
    if (c.bun) vol(hx - 6, c.cy - 10, 12, 11, tint(hcol, 1.1));
    if (c.sw) {
      if (side) {
        vol(HL - c.sw, st, c.sw + 4, sb - st, tint(hcol, 0.9));
      } else {
        vol(HL - c.sw, st, c.sw + 2.5, sb - st, tint(hcol, 1.05));
        vol(HR - 2.5, st, c.sw + 2.5, sb - st, tint(hcol, 0.8));
      }
    }
    if (c.locs) {
      const LN = [54, 58, 48];
      const OF = [-23, -19.5, -16];
      if (side) {
        for (let k = 0; k < 3; k++) vol(hx - 23 + k * 3.7, 12, 3, LN[k] - 12, tint(hcol, k % 2 ? 1.04 : 0.88));
      } else {
        for (let k = 0; k < 3; k++) {
          vol(hx + OF[k], 12, 3, LN[k] - 12, tint(hcol, k % 2 ? 1.06 : 0.92));
          vol(hx - OF[k] - 3, 12, 3, LN[2 - k] - 12, tint(hcol, k % 2 ? 0.84 : 0.76));
        }
      }
    }
  };

  const D = DIR[P.dir];
  const w = (0.84 + P.weight * 0.46) * D.w;
  const s = PALETTE[P.skin];
  const hr = PALETTE[P.hair];
  const bc = PALETTE[P.basec];
  const oc = PALETTE[P.outc];
  const pc = PALETTE[P.botc];
  const B = BSPEC[P.base];
  const O = OSPEC[P.out];
  const S = SSPEC[P.sho];
  const bt = P.bot;
  const ac = P.acc;
  const back = D.face < 0;
  const side = P.dir === 2;
  const dress = !!B.dress;
  // A dress fills the bottom slot, so the bottom garment stops existing.
  const bottom: BottomSpec = dress ? { kind: "none" } : BOT_SPEC[bt];
  const ovr = !!bottom.bib;
  const skirt = bottom.kind === "skirt";
  const sHem = bottom.hemY ?? 170;
  const bootTop = S.shaft || 172;
  const legStop = bottom.stop ?? 172;
  const pantStop = S.tuck ? Math.min(bootTop, legStop) : legStop;
  // What shows below the base-layer hem when a coat falls open: the trousers,
  // or the body if the leg is bare that far up.
  const underCol = bottom.kind === "none" || legStop < 150 ? s : pc;

  ctx.clearRect(0, 0, BAKE_W, BAKE_H);

  // Ground shadow — opaque so it survives the resample, and keyed to the
  // background so it reads on white and on black. Dropped when transparent,
  // which keeps the export a clean cut-out.
  if (shadow) {
    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.ellipse(50 * SC, Y(178), 24 * w * SC, 4.5 * SC, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── The body ── one build, drawn before anything is put on it.
  const legs: [number, number][] = side
    ? [[50 - 6.5 * w, 13 * w]]
    : [
        [50 - 14 * w, 12 * w],
        [50 + 2 * w, 12 * w],
      ];
  // The leg tapers thigh → ankle. That taper is what lets a trouser pull in at
  // the knee without going narrower than the body inside it.
  const legMul = (y: number) => 1 - (1 - LEG_TAPER) * Math.min(1, Math.max(0, (y - 116) / 56));
  legs.forEach((L) => {
    const cx = L[0] + L[1] / 2;
    const h = (L[1] - 1.2) / 2;
    const at = (f: number, y: number): [number, number] => [cx + f * h * legMul(y), y];
    poly([at(-1, 116), at(1, 116), at(1, 174), at(-1, 174)], s);
    poly([at(0.2, 116), at(1, 116), at(1, 174), at(0.2, 174)], tint(s, 0.78));
  });
  vol(50 - 14.5 * w, SHOULDER, 29 * w, 118 - SHOULDER, s);

  // Briefs — the layer that never comes off, in the bottom colour. They have to
  // clear the hips down their whole depth: the leg tops run to 14w, so a
  // tapered cut leaves the body showing at the outside of the seat.
  const brf = tint(pc, 1.06);
  poly(
    [
      [50 - 14.8 * w, 105],
      [50 + 14.8 * w, 105],
      [50 + 14.2 * w, 124],
      [50 - 14.2 * w, 124],
    ],
    brf,
  );
  poly(
    [
      [50 + 1 * w, 105],
      [50 + 14.8 * w, 105],
      [50 + 14.2 * w, 124],
      [50 + 1 * w, 124],
    ],
    tint(brf, 0.78),
  );

  const feet = () =>
    legs.forEach((L) => {
      const fw = L[1] + S.rz;
      vol(
        L[0] - (fw - L[1]) / 2,
        S.foot === 6 ? 173 : 170,
        fw,
        S.foot,
        S.bare ? tint(s, 0.9) : tint(pc, S.shaft ? 0.42 : 0.6),
      );
    });

  // Boots under the trousers unless they're tuck-in (thigh boots), which go over.
  if (!S.tuck && S.shaft) {
    legs.forEach((L) => vol(L[0] + 0.4, S.shaft, L[1] - 0.8, 172 - S.shaft, tint(pc, 0.42)));
  }
  // A hem long enough to puddle lands on top of the shoe, so the shoe goes first.
  if (bottom.puddle) feet();

  if (skirt) {
    poly(
      [
        [50 - 15 * w, 116],
        [50 + 15 * w, 116],
        [50 + 19 * w, sHem],
        [50 - 19 * w, sHem],
      ],
      pc,
    );
    poly(
      [
        [50 + 2 * w, 116],
        [50 + 15 * w, 116],
        [50 + 19 * w, sHem],
        [50 + 2 * w, sHem],
      ],
      tint(pc, 0.78),
    );
  } else if (bottom.kind === "pants" && pantStop > 116) {
    // Trouser leg by profile: hip → knee → hem. A cropped or tucked leg is cut
    // off wherever it stops, so it keeps the taper it had at that height.
    const KNEE = 142;
    const hip = bottom.hip ?? 1;
    const knee = bottom.knee ?? 1;
    const hem = bottom.hem ?? 1;
    // Coverage is structural, not a tuning exercise: whatever profile a garment
    // asks for, the cloth is never drawn narrower than the leg inside it, so a
    // pinched knee closes on the body instead of exposing it.
    const inset = 1 - 1.2 / legs[0][1];
    const profile = (y: number) =>
      y <= KNEE
        ? hip + (knee - hip) * ((y - 116) / (KNEE - 116))
        : knee + (hem - knee) * ((y - KNEE) / Math.max(1, legStop - KNEE));
    const mul = (y: number) => Math.max(profile(y), inset * legMul(y) + 0.03);
    const ys = pantStop > KNEE ? [116, KNEE, pantStop] : [116, pantStop];
    // The seat: above the crotch a pair of trousers is one piece of cloth, not
    // two tubes. Without it the gap between the legs runs up into the waistband
    // and the body shows through it.
    const seatL = legs[0][0];
    const seatR = legs[legs.length - 1][0] + legs[legs.length - 1][1];
    const seatC = (seatL + seatR) / 2;
    // Never narrower than the briefs, or the underwear shows past the waistband.
    const seatH = ((seatR - seatL) / 2) * Math.max(hip, 1.06);
    vol(seatC - seatH, 116, seatH * 2, Math.min(134, pantStop) - 116, pc);
    legs.forEach((L) => {
      const cx = L[0] + L[1] / 2;
      const hw = L[1] / 2;
      const edge = (f: number) => ys.map((y) => [cx + f * hw * mul(y), y] as [number, number]);
      const right = edge(1).reverse();
      poly([...edge(-1), ...right], pc);
      poly([...edge(0.2), ...right], tint(pc, 0.78));
      if (bottom.crease) box(cx - 0.5, 118, 1, pantStop - 118, tint(pc, 1.12));
      if (bottom.puddle) {
        // Two folds where the fabric stacks up on the floor.
        const hh = hw * mul(pantStop);
        box(cx - hh, pantStop - 7.5, hh * 2, 3.4, tint(pc, 1.08));
        box(cx - hh, pantStop - 4, hh * 2, 4, tint(pc, 0.84));
      }
    });
  }

  if (S.tuck && S.shaft) {
    legs.forEach((L) => vol(L[0] + 0.2, S.shaft, L[1] - 0.4, 172 - S.shaft, tint(pc, 0.42)));
  }
  if (!bottom.puddle) feet();

  // ── Base layer ──
  const bcol = B.bare ? s : B.sheer ? mix(bc, s, 0.42) : bc;
  const fl = B.flare ?? 0;
  const bHemW = fl ? fl : B.tw - 1.6;
  if (!B.bare) {
    poly(
      [
        [50 - B.tw * w, SHOULDER],
        [50 + B.tw * w, SHOULDER],
        [50 + bHemW * w, B.hem],
        [50 - bHemW * w, B.hem],
      ],
      bcol,
    );
    poly(
      [
        [50 + 1 * w, SHOULDER],
        [50 + B.tw * w, SHOULDER],
        [50 + bHemW * w, B.hem],
        [50 + 1 * w, B.hem],
      ],
      tint(bcol, 0.78),
    );
    if (B.print && !back && !side) {
      const u = 26 / (B.print.length * 4 - 1);
      text(B.print, 50, 80, u, lum(bcol) > 110 ? tint(bcol, 0.32) : tint(bcol, 2.4));
    }
  }

  const ax: [number, number][] =
    D.arm === 1
      ? [[50 + 9 * w, 7 * w]]
      : [
          [50 - B.tw * w - 6 * w, 6.4 * w],
          [50 + B.tw * w - 0.4 * w, 6.4 * w],
        ];
  // Sleeves hang from the same shoulder line as the body, so the armhole is a
  // single edge rather than a notch.
  ax.forEach((A) => {
    if (B.slv < 0) vol(A[0], SHOULDER, A[1], 112 - SHOULDER, s);
    else if (B.slv === 0) {
      vol(A[0], SHOULDER, A[1], 22, bcol);
      vol(A[0] + 0.4, SHOULDER + 22, A[1] - 0.8, 90 - SHOULDER, s);
    } else vol(A[0], SHOULDER, A[1], 112 - SHOULDER, bcol);
  });

  // Head position and, if there's a raised hood, the box it occupies — the hood
  // is painted in two passes around the head, so both need these up front.
  const hx = 50 + (side ? D.fx * 0.35 : 0);
  const hoodH = hairSpan(P.hairT) + 3.6;
  const hoodTop = Math.max(0.5, Math.min(P.hairT === 6 ? 14 : HC[P.hairT].cy, 12) - 4);
  const hoodBot = SHOULDER + 4;

  // ── Overalls: bib and straps, worn over the base layer ──
  if (ovr && !back) {
    poly(
      [
        [50 - 13 * w, 78],
        [50 + 13 * w, 78],
        [50 + 14 * w, 118],
        [50 - 14 * w, 118],
      ],
      pc,
    );
    poly(
      [
        [50 + 1 * w, 78],
        [50 + 13 * w, 78],
        [50 + 14 * w, 118],
        [50 + 1 * w, 118],
      ],
      tint(pc, 0.78),
    );
    vol(50 - 11 * w, 64, 3.6, 15, tint(pc, 1.08));
    vol(50 + 7.4 * w, 64, 3.6, 15, tint(pc, 0.88));
    box(50 - 11.4 * w, 77, 4.4, 3, tint(pc, 1.3)); // buckles
    box(50 + 7 * w, 77, 4.4, 3, tint(pc, 1.15));
  }

  // ── Outer layer ──
  if (O) {
    const oB = O.slit ? O.w + 1.2 : O.w - 1.4;
    poly(
      [
        [50 - O.w * w, O.top],
        [50 + O.w * w, O.top],
        [50 + oB * w, O.hem],
        [50 - oB * w, O.hem],
      ],
      oc,
    );
    poly(
      [
        [50 + 1 * w, O.top],
        [50 + O.w * w, O.top],
        [50 + oB * w, O.hem],
        [50 + 1 * w, O.hem],
      ],
      tint(oc, 0.78),
    );
    if (O.quilt) {
      for (let k = 1; k < 4; k++) {
        box(50 - O.w * w, O.top + k * ((O.hem - O.top) / 4), O.w * 2 * w, 1.4, tint(oc, 0.66));
      }
    }
    const oa: [number, number][] =
      D.arm === 1
        ? [[50 + 10 * w, 7.6 * w]]
        : [
            [50 - O.w * w - 5.4 * w, 6.6 * w],
            [50 + O.w * w - 1.2 * w, 6.6 * w],
          ];
    // Sleeves start on the coat's own shoulder line — a unit lower and the
    // outer shoulder opens into a notch on every coat in the wardrobe.
    oa.forEach((A) => vol(A[0], O.top, A[1], (O.hem < 110 ? 104 : 110) - O.top, oc));
    // The back of a raised hood goes behind the head, so the hood reads as a
    // volume the head sits inside rather than a rim stuck to it.
    if (O.hood === "up") box(hx - hoodH, hoodTop, hoodH * 2, hoodBot - hoodTop, tint(oc, 0.7));
    // Open front: whatever is underneath shows through the slit.
    if (O.slit && !back) {
      const cut = Math.min(B.hem, O.hem);
      box(50 - 3, O.top + 2, 6, cut - O.top - 2, tint(bcol, 0.94));
      if (O.hem > cut) box(50 - 3, cut, 6, O.hem - cut, tint(ovr ? pc : underCol, 0.94));
    }
    if (O.belt) box(50 - 14 * w, 102, 28 * w, 5, tint(oc, 0.6));
    // Pullover details: kangaroo pocket, drawcords, and the hood at rest.
    if (O.pocket && !back) {
      box(50 - 8.6 * w, O.hem - 17, 17.2 * w, 12, tint(oc, 0.9));
      box(50 - 8.6 * w, O.hem - 17, 17.2 * w, 1.6, tint(oc, 0.66));
    }
    if (O.cords && !back) {
      box(50 - 3.6, 65, 1.6, 13, tint(oc, 1.35));
      box(50 + 2, 65, 1.6, 13, tint(oc, 1.35));
    }
    if (O.hood === "down") {
      vol(50 - 13.5 * w, 46, 27 * w, 20, tint(oc, 1.1));
      box(50 - 13.5 * w, 62, 27 * w, 3.4, tint(oc, 0.66)); // fold at the shoulders
    }
    // Suit lapels sit on top of the open front, buttons on the right side.
    if (O.lapel && !back) {
      poly(
        [
          [50 - 8.5, O.top],
          [50 - 1.5, O.top],
          [50 - 2.5, 88],
          [50 - 9, 74],
        ],
        tint(oc, 1.14),
      );
      poly(
        [
          [50 + 1.5, O.top],
          [50 + 8.5, O.top],
          [50 + 9, 74],
          [50 + 2.5, 88],
        ],
        tint(oc, 0.9),
      );
    }
    if (O.buttons && !back) {
      box(50 + 2.6, 96, 2.6, 2.6, tint(oc, 1.4));
      box(50 + 2.6, 104, 2.6, 2.6, tint(oc, 1.4));
    }
  }

  ax.forEach((A) => vol(A[0] + 0.3, 112, A[1] - 0.6, 10, s)); // hands
  if (!side) vol(45.5, 54, 9, 8, tint(s, 0.86)); // neck, tucked into the neckline
  if (B.neck) vol(50 - 8, 48, 16, 14, tint(bcol, 1.06)); // turtleneck collar
  if (B.collar && !back) {
    poly(
      [
        [50 - 8, 62],
        [50 - 1, 62],
        [50 - 1, 72],
        [50 - 8, 68],
      ],
      tint(bcol, 1.14),
    );
    poly(
      [
        [50 + 1, 62],
        [50 + 8, 62],
        [50 + 8, 68],
        [50 + 1, 72],
      ],
      tint(bcol, 0.92),
    );
  }
  if (ac === 4) {
    // Scarf: a wrap plus two tails.
    vol(50 - 11, 50, 22, 13, tint(oc, 1.18));
    vol(50 - 9, 62, 5, 30, tint(oc, 1.06));
    vol(50 + 4, 62, 5, 22, tint(oc, 0.9));
  }
  // A tie only reads if something is open over it, so it goes on last of the
  // neckline layers — knot at the collar, blade down the shirt.
  if (ac === 6 && !back && !side) {
    // Pushed away from the shirt behind it, the way the printed tees are.
    const tie = lum(bcol) > 110 ? tint(oc, 0.52) : tint(oc, 1.65);
    box(50 - 2.8, 60, 5.6, 5, tie);
    poly(
      [
        [50 - 2.2, 65],
        [50 + 2.2, 65],
        [50 + 3.4, 92],
        [50, 97],
        [50 - 3.4, 92],
      ],
      tie,
    );
  }

  // ── Head ──
  vol(hx - 16, 16, 32, 42, s);
  hairMass(hx, hr, P.hairT, back, side);
  if (ac === 5) {
    vol(hx - 17, 9, 34, 15, tint(oc, 0.94));
    vol(hx - 17, 20, 34, 4, tint(oc, 0.76)); // beanie band
  }
  // Hood up goes over the hair — and over a beanie, if there's one under it.
  if (O?.hood === "up") {
    // The front of the hood, over the hair. It takes the shape of what's inside
    // it — clearing the widest hairstyle by a margin and sitting above its crown,
    // so an afro or locs push it out instead of poking through — and it runs
    // past the shoulder line to meet the body.
    const cw = Math.max(6.5, hoodH * 0.28);
    box(hx - hoodH, hoodTop, hoodH * 2, 12, oc);
    box(hx - hoodH, hoodTop, cw, hoodBot - hoodTop, tint(oc, 1.06));
    box(hx + hoodH - cw, hoodTop, cw, hoodBot - hoodTop, tint(oc, 0.82));
    if (back) box(hx - hoodH, hoodTop, hoodH * 2, hoodBot - hoodTop, tint(oc, 0.94));
  }

  const fd = lum(s) > 120 ? 0.5 : 1.7; // features read dark on light skin, light on dark
  const bcl = tint(hr, lum(hr) > 120 ? 0.66 : 1);
  if (D.face > 0) {
    const fx = hx + D.fx * (D.face === 1 ? 1 : 0);
    poly(
      [
        [fx - 10, 32],
        [fx - 3.6, 33.8],
        [fx - 3.6, 36.6],
        [fx - 10, 34.8],
      ],
      bcl,
    );
    poly(
      [
        [fx + 3.6, 33.8],
        [fx + 10, 32],
        [fx + 10, 34.8],
        [fx + 3.6, 36.6],
      ],
      bcl,
    );
    if (ac === 1) {
      box(fx - 10.5, 32.6, 7.6, 4.6, "#14120F");
      box(fx + 2.9, 32.6, 7.6, 4.6, "#14120F");
      box(fx - 3, 34, 6, 1.6, "#14120F"); // bridge
    }
    box(fx - 4.6, 49, 9.2, 1.6, tint(s, fd)); // mouth
  } else if (D.face === 0) {
    const f2 = hx + D.fx;
    poly(
      [
        [f2 - 2, 32],
        [f2 + 4, 33.4],
        [f2 + 4, 36.2],
        [f2 - 2, 34.8],
      ],
      bcl,
    );
    if (ac === 1) box(f2 - 2, 32.6, 7, 4.6, "#14120F");
  }

  // ── Carried accessories ──
  if (ac === 2 && !side) {
    const ex = (O ? O.w : B.tw) * w + 7;
    box(50 + ex - 8, 66, 2.4, 40, tint(oc, 0.72)); // tote handle
    vol(50 + ex - 6, 104, 13, 22, tint(oc, 0.86));
    box(50 + ex - 6, 104, 13, 2.4, tint(oc, 0.6));
  }
  if (ac === 3 && !side) {
    const sx = (O ? O.w : B.tw) * w;
    poly(
      [
        [50 - sx + 2, 66],
        [50 - sx + 6, 66],
        [50 + sx - 2, 104],
        [50 + sx - 6, 104],
      ],
      tint(oc, 0.66),
    ); // cross-body strap
    vol(50 + sx - 8, 102, 12, 17, tint(oc, 0.88));
  }
}

function shadowFor(background: Background): string | null {
  if (background === "black") return "#141412";
  if (background === "white") return "#E6E6E2";
  return null;
}

let bakeCanvas: HTMLCanvasElement | null = null;

function bakeFigure(p: FigureParams, background: Background): ImageData | null {
  if (!bakeCanvas) {
    bakeCanvas = document.createElement("canvas");
    bakeCanvas.width = BAKE_W;
    bakeCanvas.height = BAKE_H;
  }
  const ctx = bakeCanvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  paintFigure(ctx, p, shadowFor(background));
  return ctx.getImageData(0, 0, BAKE_W, BAKE_H);
}

/**
 * Render one figure into the box [0,boxW] × [0,boxH]. The caller owns the
 * canvas: pass device pixels with an identity transform (preview and export
 * alike) so the sprite blocks land on whole pixels and stay crisp.
 */
export function renderFigure(
  ctx: CanvasRenderingContext2D,
  boxW: number,
  boxH: number,
  p: FigureParams,
  background: Background,
): void {
  ctx.clearRect(0, 0, boxW, boxH);
  if (background === "white") {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, boxW, boxH);
  } else if (background === "black") {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, boxW, boxH);
  }
  if (boxW <= 0 || boxH <= 0) return;

  const im = bakeFigure(p, background);
  if (!im) return;

  // Fit the figure inside the box with a margin, keeping its 100:182 aspect.
  const inset = 1 - MARGIN_FRAC * 2;
  const dh = Math.min(boxH * inset, (boxW * inset) / FIGURE_ASPECT);
  const dw = dh * FIGURE_ASPECT;
  const x0 = (boxW - dw) / 2;
  const y0 = (boxH - dh) / 2;

  const px = Math.min(PIXEL_SPEC.max, Math.max(PIXEL_SPEC.min, p.px));
  const scale = dh / FIG_H;
  const step = px * scale; // one cell, in destination pixels
  const cols = Math.ceil(FIG_W / px);
  const rows = Math.ceil(FIG_H / px);
  // Fine grain reads as one solid mass — blocks butt together, no seam at any
  // render size. Coarse grain is a mosaic, so it keeps a gutter proportional to
  // the block (never below a pixel, or it would vanish in a small preview).
  const gutter = px < GRAIN_SOLID ? 0 : Math.max(1, Math.round(step * GUTTER_FRAC));
  // Block edges come from the rounded lattice rather than a rounded width, so
  // the cells tile exactly instead of drifting in and out of alignment.
  const edgeX = (i: number) => Math.round(x0 + i * step);
  const edgeY = (j: number) => Math.round(y0 + j * step);

  let lastFill = "";
  for (let i = 0; i < cols; i++) {
    const bx = edgeX(i);
    const bw = Math.max(1, edgeX(i + 1) - bx - gutter);
    for (let j = 0; j < rows; j++) {
      const sx = Math.floor((i + 0.5) * px * SC);
      const sy = Math.floor((j + 0.5) * px * SC);
      if (sx >= BAKE_W || sy >= BAKE_H) continue;
      const k = (sy * BAKE_W + sx) * 4;
      if (im.data[k + 3] < 120) continue; // sample the centre of the cell only
      const fill = `rgb(${im.data[k]},${im.data[k + 1]},${im.data[k + 2]})`;
      if (fill !== lastFill) {
        ctx.fillStyle = fill;
        lastFill = fill;
      }
      const by = edgeY(j);
      ctx.fillRect(bx, by, bw, Math.max(1, edgeY(j + 1) - by - gutter));
    }
  }
}

// ── Randomize ───────────────────────────────────────────────────────────────

function pickIn(lo: number, hi: number, fam?: number): number {
  const pool: number[] = [];
  PALETTE.forEach((c, i) => {
    const l = hsl(c).l;
    if (l >= lo && l <= hi && (fam === undefined || binOf(c) === fam)) pool.push(i);
  });
  if (!pool.length) {
    PALETTE.forEach((c, i) => {
      const l = hsl(c).l;
      if (l >= lo && l <= hi) pool.push(i);
    });
  }
  return pool.length ? pool[Math.floor(Math.random() * pool.length)] : Math.floor(Math.random() * PALETTE.length);
}

/**
 * Roll a whole look. Garment colours are drawn from three separate lightness
 * bands (shuffled) so the outfit lands with contrast rather than mud, and the
 * outer/bottom share a hue family. Skin and hair are held apart in luminance so
 * the hairline reads. Grain and direction are the user's — they carry over.
 */
export function randomFigure(prev: FigureParams): FigureParams {
  const fam = Math.floor(Math.random() * 9);
  const bands: [number, number][] = [
    [0, 0.3],
    [0.3, 0.58],
    [0.58, 1],
  ].sort(() => Math.random() - 0.5) as [number, number][];

  const skin = Math.floor(Math.random() * PALETTE.length);
  let hair = 0;
  let tries = 0;
  do {
    hair = Math.floor(Math.random() * PALETTE.length);
    tries++;
  } while (Math.abs(lum(PALETTE[skin]) - lum(PALETTE[hair])) < 58 && tries < 60);

  return {
    ...prev,
    skin,
    hair,
    hairT: Math.floor(Math.random() * HAIR_TYPES.length),
    weight: Math.random(),
    height: Math.random(),
    // Randomize dresses the figure: the empty slots at index 0 are a choice, so
    // a roll never lands on undressed.
    base: 1 + Math.floor(Math.random() * (BASE_LAYERS.length - 1)),
    basec: pickIn(bands[0][0], bands[0][1]),
    out: Math.floor(Math.random() * OUTER_LAYERS.length),
    outc: pickIn(bands[1][0], bands[1][1], fam),
    bot: 1 + Math.floor(Math.random() * (BOTTOMS.length - 1)),
    botc: pickIn(bands[2][0], bands[2][1], fam),
    sho: 1 + Math.floor(Math.random() * (SHOES.length - 1)),
    acc: Math.floor(Math.random() * ACCESSORIES.length),
  };
}

/** Re-roll the three garment colours only, leaving the figure and cut alone. */
export function randomFigureColors(prev: FigureParams): FigureParams {
  const fam = Math.floor(Math.random() * 9);
  const bands: [number, number][] = [
    [0, 0.3],
    [0.3, 0.58],
    [0.58, 1],
  ].sort(() => Math.random() - 0.5) as [number, number][];
  return {
    ...prev,
    basec: pickIn(bands[0][0], bands[0][1]),
    outc: pickIn(bands[1][0], bands[1][1], fam),
    botc: pickIn(bands[2][0], bands[2][1], fam),
  };
}

// ── Readouts ────────────────────────────────────────────────────────────────

/** The mono spec line under the preview. */
export function figureSummary(p: FigureParams): string[] {
  const dress = isDress(p);
  const top = BSPEC[p.base].bare ? "BARE" : BASE_LAYERS[p.base].toUpperCase();
  const leg = dress
    ? "NO BOTTOM SLOT"
    : BOT_SPEC[p.bot].kind === "none"
      ? "BRIEFS"
      : BOTTOMS[p.bot].toUpperCase();
  return [
    `PX ${p.px.toFixed(1)} · ${DIRECTIONS[p.dir].toUpperCase()} · ${HAIR_TYPES[p.hairT].toUpperCase()}`,
    `${top}${p.out ? ` + ${OUTER_LAYERS[p.out].toUpperCase()}` : ""}`,
    `${leg}${isTucked(p) ? " TUCKED · " : " · "}${SHOES[p.sho].toUpperCase()}`,
  ];
}

/**
 * A short figure code, after the way Habbo encodes a look: one `type-part-colour`
 * group per slot, joined by dots. Slot names follow the same shorthand — hd body,
 * hr hair, ch chest, cc coat, lg legs, sh shoes, ea accessory — so a whole
 * character is one line you can read and pass around.
 */
export function figureCode(p: FigureParams): string {
  return [
    `hd-${p.skin}`,
    `hr-${p.hairT}-${p.hair}`,
    `ch-${p.base}-${p.basec}`,
    `cc-${p.out}-${p.outc}`,
    `lg-${p.bot}-${p.botc}`,
    `sh-${p.sho}`,
    `ea-${p.acc}`,
  ].join(".");
}

/** The exported settings — readable names up top, raw state for a round-trip. */
export function figureSettings(p: FigureParams, background: Background) {
  const dress = isDress(p);
  return {
    tool: "slbh-figure",
    figure: figureCode(p),
    render: {
      pixels: +p.px.toFixed(1),
      direction: DIRECTIONS[p.dir],
      background,
    },
    demographics: {
      skin: PALETTE[p.skin],
      hair: PALETTE[p.hair],
      hairType: HAIR_TYPES[p.hairT],
      weight: +p.weight.toFixed(2),
      height: +p.height.toFixed(2),
    },
    clothing: {
      base: BASE_LAYERS[p.base],
      baseColor: PALETTE[p.basec],
      outer: OUTER_LAYERS[p.out],
      outerColor: PALETTE[p.outc],
      bottom: dress ? null : BOTTOMS[p.bot],
      bottomColor: dress ? null : PALETTE[p.botc],
      shoes: SHOES[p.sho],
      shoeColor: PALETTE[p.botc],
      tucked: isTucked(p),
      accessory: ACCESSORIES[p.acc],
    },
    state: { ...p, px: +p.px.toFixed(1), weight: +p.weight.toFixed(2), height: +p.height.toFixed(2) },
  };
}

/** Filename stem for exports — the look, in one slug. */
export function figureSlug(p: FigureParams): string {
  if (isBare(p)) return "bare";
  const part = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const parts = [BSPEC[p.base].bare ? "bare" : part(BASE_LAYERS[p.base])];
  if (!isDress(p)) parts.push(BOT_SPEC[p.bot].kind === "none" ? "briefs" : part(BOTTOMS[p.bot]));
  parts.push(part(SHOES[p.sho]));
  return parts.join("-");
}
