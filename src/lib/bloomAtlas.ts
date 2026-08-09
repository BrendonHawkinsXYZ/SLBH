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
  /** Which size tier of the atlas this bloom draws from. */
  tier: number;
  /** Index of the sprite within that tier. */
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
  tier: number;
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

  // Blooms stretch hard — as far as 0.52 — which squeezes the mosaic lattice
  // under the dot width and melts the shape into a smooth airbrushed blob. Shrink
  // the dot by the same factor so a squashed bloom keeps its pixels, without
  // narrowing the stretch range and inflating how much of the field it covers.
  const shape = resolveShape(familyId, values, modifiers);
  return {
    ...shape,
    dotScale: Math.min(1, Math.sqrt(modifiers.stretchX * modifiers.stretchY)),
  };
}

/**
 * Build one atomic shape with the canonical Field renderer.
 *
 * `cssSize` is the largest size the sprite will ever be drawn at, in CSS px, and
 * sets the mosaic density — so the grain reads the same whatever the device. The
 * backing store is `cssSize × dpr`, matching the DPR-scaled context the sprite is
 * blitted into, so a bloom is never magnified past the pixels it was drawn with.
 */
export function makeBloomSprite(
  cssSize: number,
  dpr = 1,
  pixelScale = 1.35,
): HTMLCanvasElement {
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = Math.max(1, Math.round(cssSize * dpr));
  const ctx = sprite.getContext("2d");
  if (!ctx) return sprite;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  renderShapeField(
    ctx,
    cssSize,
    makePalette(),
    randomShape(),
    "transparent",
    pixelScale,
  );
  return sprite;
}

export function makeAtlas(n: number, cssSize: number, dpr = 1): HTMLCanvasElement[] {
  return Array.from({ length: n }, () => makeBloomSprite(cssSize, dpr));
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
): BloomInstance[] {
  const out: BloomInstance[] = [];
  const mobile = w < 640;
  const minScale = mobile
    ? Math.max(52, Math.min(w, h) * 0.115)
    : Math.max(76, Math.min(w, h) * 0.09);
  const maxScale = mobile
    ? Math.max(134, Math.min(w, h) * 0.3)
    : Math.max(190, Math.min(w, h) * 0.25);
  // A deterministic coverage skeleton prevents random sampling from leaving
  // monitor-sized holes. Three top rows and three columns on each side are laid
  // down first; the remaining objects retain the loose chaotic distribution.
  const coverageCount = mobile ? count : Math.floor(count * 0.5);
  const topCoverageCount = Math.floor(coverageCount * (mobile ? 0.3 : 0.42));
  const sideCoverageCount = Math.floor((coverageCount - topCoverageCount) / 2);
  let guard = 0;

  while (out.length < count && guard < count * 30) {
    guard++;
    const index = out.length;
    const scale = random(minScale, maxScale);
    let x: number;
    let y: number;

    if (index < topCoverageCount) {
      const topIndex = index;
      const row = topIndex % 3;
      const column = Math.floor(topIndex / 3);
      const columns = Math.ceil(topCoverageCount / 3);
      const spacing = w / columns;
      x = spacing * (column + 0.5) + random(-spacing * 0.38, spacing * 0.38);
      y = row === 0
        ? random(-scale * 0.12, scale * 0.18)
        : row === 1
          ? random(h * 0.12, h * 0.24)
          : random(h * 0.26, h * 0.38);
    } else if (index < topCoverageCount + sideCoverageCount) {
      const sideIndex = index - topCoverageCount;
      const column = sideIndex % 3;
      const row = Math.floor(sideIndex / 3);
      const rows = Math.ceil(sideCoverageCount / 3);
      const spacing = h / rows;
      x = column === 0
        ? random(-scale * 0.1, scale * 0.2)
        : column === 1
          ? random(w * 0.12, w * 0.21)
          : random(w * 0.24, w * 0.33);
      y = spacing * (row + 0.5) + random(-spacing * 0.36, spacing * 0.36);
    } else if (index < topCoverageCount + sideCoverageCount * 2) {
      const sideIndex = index - topCoverageCount - sideCoverageCount;
      const column = sideIndex % 3;
      const row = Math.floor(sideIndex / 3);
      const rows = Math.ceil(sideCoverageCount / 3);
      const spacing = h / rows;
      x = column === 0
        ? w - random(-scale * 0.1, scale * 0.2)
        : column === 1
          ? random(w * 0.79, w * 0.88)
          : random(w * 0.67, w * 0.76);
      y = spacing * (row + 0.5) + random(-spacing * 0.36, spacing * 0.36);
    } else {
      const region = Math.random();
      if (region < 0.5) {
      x = random(-w * 0.08, w * 1.08);
      // The hero now scrolls in a viewport beneath the fixed nav, so shapes can
      // safely press through this clipped edge without entering the nav plane.
      y = random(-scale * 0.12, h * 0.52);
      } else if (region < 0.75) {
        x = random(-w * 0.08, w * 0.46);
        y = random(h * 0.13, h * 1.08);
      } else {
        x = random(w * 0.54, w * 1.08);
        y = random(h * 0.13, h * 1.08);
      }
    }

    // Desktop rejects by the sprite's visible footprint to keep the phone path
    // clean. Mobile's dedicated top/left/right field must keep its side rails;
    // applying the phone-width gap there erases almost the entire composition.
    const pad = scale * 0.58;
    const inOpening =
      x > gapRect.x - pad &&
      x < gapRect.x + gapRect.width + pad &&
      y > gapRect.y - pad &&
      y < gapRect.y + gapRect.height + pad;
    if (!mobile && inOpening) continue;

    out.push({
      // Placeholders. Sprites are pooled by draw size, so the caller assigns the
      // tier and index once every instance's final scale is known.
      tier: 0,
      spriteIndex: 0,
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
      tier: item.tier,
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
    tier: item.tier,
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
      tier: item.tier,
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
