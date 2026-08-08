import {
  DEFAULT_MODIFIERS,
  defaultValues,
  familyById,
  makePalette,
  renderShapeField,
  resolveShape,
  type Modifiers,
  type ParamValues,
} from "@/lib/shapeField";

export type Rect = { x: number; y: number; width: number; height: number };

export type GridPoint = {
  x: number;
  y: number;
  scale: number;
};

export type BloomInstance = {
  spriteIndex: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  depth: number;
  collapseX: number;
  collapseY: number;
  collapseScale: number;
  grid?: GridPoint;
};

export type BloomFrame = {
  spriteIndex: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  depth: number;
  alpha: number;
};

// Seven families (up from five) increases the silhouette vocabulary by 40%.
const FAMILIES = [
  "rose",
  "spike",
  "star",
  "superellipse",
  "round",
  "gear",
  "polygon",
] as const;

const random = (min: number, max: number) => min + Math.random() * (max - min);
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => {
  const n = clamp01(t);
  return n * n * (3 - 2 * n);
};

function randomShape() {
  const familyId = FAMILIES[Math.floor(Math.random() * FAMILIES.length)];
  const family = familyById(familyId);
  const values: ParamValues = defaultValues(familyId);

  for (const spec of family.params) {
    const value = random(spec.min, spec.max);
    values[spec.id] = spec.integer ? Math.round(value) : value;
  }

  const modifiers: Modifiers = {
    ...DEFAULT_MODIFIERS,
    rotation: random(0, 360),
    stretchX: random(0.52, 1),
    stretchY: random(0.52, 1),
    hole: Math.random() < 0.16 ? random(0.18, 0.58) : 0,
    wobble: familyId === "round" ? random(0.1, 0.42) : random(0, 0.18),
    wobbleFreq: Math.round(random(3, 14)),
  };

  return resolveShape(familyId, values, modifiers);
}

/** Build one atomic shape with the canonical Field renderer. */
export function makeBloomSprite(size: number, pixelScale = 1.35): HTMLCanvasElement {
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = size;
  const ctx = sprite.getContext("2d");
  if (!ctx) return sprite;
  ctx.imageSmoothingEnabled = false;
  renderShapeField(
    ctx,
    size,
    makePalette(),
    randomShape(),
    "transparent",
    pixelScale,
  );
  return sprite;
}

export function makeAtlas(n: number, size: number): HTMLCanvasElement[] {
  return Array.from({ length: n }, () => makeBloomSprite(size));
}

/**
 * Build an overloaded arch around a phone-sized bottom-centre opening. The
 * layout intentionally varies scale, rotation, overlap and depth.
 */
export function archLayout(
  w: number,
  h: number,
  count: number,
  gapRect: Rect,
  atlasSize = 10,
): BloomInstance[] {
  const out: BloomInstance[] = [];
  const mobile = w < 640;
  const minScale = mobile
    ? Math.max(44, Math.min(w, h) * 0.09)
    : Math.max(76, Math.min(w, h) * 0.09);
  const maxScale = mobile
    ? Math.max(112, Math.min(w, h) * 0.24)
    : Math.max(190, Math.min(w, h) * 0.25);
  let guard = 0;

  while (out.length < count && guard < count * 30) {
    guard++;
    const region = Math.random();
    const scale = random(minScale, maxScale);
    let x: number;
    let y: number;

    if (region < 0.5) {
      x = random(-w * 0.08, w * 1.08);
      // The hero now scrolls in a viewport beneath the fixed nav, so shapes can
      // safely press through this clipped edge without entering the nav plane.
      y = random(-scale * 0.12, h * 0.42);
    } else if (region < 0.75) {
      x = random(-w * 0.08, w * 0.38);
      y = random(h * 0.13, h * 1.08);
    } else {
      x = random(w * 0.62, w * 1.08);
      y = random(h * 0.13, h * 1.08);
    }

    // Reject by the sprite's visible footprint, not only its centre. That keeps
    // the phone entrance clean even when a large bloom sits beside the gap.
    const pad = scale * 0.58;
    const inOpening =
      x > gapRect.x - pad &&
      x < gapRect.x + gapRect.width + pad &&
      y > gapRect.y - pad &&
      y < gapRect.y + gapRect.height + pad;
    if (inOpening) continue;

    out.push({
      // When the atlas and instance counts match, every visible object owns a
      // unique generated shape instead of reusing a composite bloom tile.
      spriteIndex: out.length % Math.max(1, atlasSize),
      x,
      y,
      scale,
      rotation: random(-180, 180),
      depth: Math.random(),
      collapseX: w / 2,
      collapseY: h / 2,
      collapseScale: minScale,
    });
  }

  return out.sort((a, b) => a.depth - b.depth);
}

/** Build the ordered, flat arrangement used inside the phone screen. */
export function gridLayout(rect: Rect, cols: number, rows: number): GridPoint[] {
  const cell = Math.min(rect.width / cols, rect.height / rows);
  const gridWidth = cell * cols;
  const gridHeight = cell * rows;
  const originX = rect.x + (rect.width - gridWidth) / 2;
  const originY = rect.y + (rect.height - gridHeight) / 2;
  const scale = cell * 0.94;
  const points: GridPoint[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      points.push({
        x: originX + cell * (col + 0.5),
        y: originY + cell * (row + 0.5),
        scale,
      });
    }
  }

  return points;
}

/**
 * Solve the four hero beats. Grid members appear at their final positions;
 * they never travel outward from the collapse point.
 */
export function solveFrame(instances: BloomInstance[], p: number): BloomFrame[] {
  if (instances.length === 0) return [];
  const progress = clamp01(p);

  if (progress < 0.42) {
    const t = ease(progress / 0.42);
    return instances.map((item) => ({
      spriteIndex: item.spriteIndex,
      x: lerp(item.x, item.collapseX, t),
      y: lerp(item.y, item.collapseY, t),
      scale: lerp(item.scale, item.collapseScale, t),
      rotation: item.rotation,
      depth: item.depth,
      alpha: 1,
    }));
  }

  const collapsed: BloomFrame[] = instances.map((item) => ({
    spriteIndex: item.spriteIndex,
    x: item.collapseX,
    y: item.collapseY,
    scale: item.collapseScale,
    rotation: item.rotation,
    depth: item.depth,
    alpha: 1,
  }));

  if (progress < 0.58) return collapsed;

  const t = ease((progress - 0.58) / 0.32);
  const grid = instances
    .filter((item) => item.grid)
    .map((item): BloomFrame => ({
      spriteIndex: item.spriteIndex,
      x: item.grid!.x,
      y: item.grid!.y,
      scale: item.grid!.scale * lerp(0.12, 1, t),
      rotation: 0,
      depth: 1,
      alpha: t,
    }));

  const fadingStack = collapsed.map((item) => ({ ...item, alpha: 1 - t }));
  return [...fadingStack, ...grid];
}
