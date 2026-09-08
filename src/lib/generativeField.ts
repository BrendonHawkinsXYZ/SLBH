import { DEFAULT_MODIFIERS, makePalette, resolveShape } from "./shapeField";
import { SequenceField, type Slot } from "./sequenceField";

type Destination = { family: string; slot: Slot };

const between = (min: number, max: number) => min + Math.random() * (max - min);
const integer = (min: number, max: number) => Math.floor(between(min, max + 1));

/** Fresh parameters, not a shuffle of the finite preset list. */
function destination(previousFamily?: string): Destination {
  const families = ["round", "polygon", "superellipse", "star", "spike", "rose", "gear", "heart"]
    .filter(family => family !== previousFamily);
  const family = families[integer(0, families.length - 1)];
  const values: Record<string, number> = {};
  switch (family) {
    case "polygon": values.sides = integer(3, 9); break;
    case "superellipse": values.n = between(0.8, 6); break;
    case "star": Object.assign(values, { points: integer(3, 9), inner: between(0.3, 0.75) }); break;
    case "spike": Object.assign(values, { points: integer(3, 9), inner: between(0.25, 0.65), concavity: between(0.8, 2) }); break;
    case "rose": Object.assign(values, { petals: integer(3, 9), fatness: between(0.35, 1.1) }); break;
    case "gear": Object.assign(values, { teeth: integer(6, 14), depth: between(0.65, 0.9), duty: between(0.3, 0.7) }); break;
  }
  const stretch = between(0.68, 1);
  const vertical = Math.random() < 0.5;
  return {
    family,
    slot: {
      shape: resolveShape(family, values, {
        ...DEFAULT_MODIFIERS,
        rotation: between(0, 360),
        stretchX: vertical ? 1 : stretch,
        stretchY: vertical ? stretch : 1,
        wobble: Math.random() < 0.5 ? 0 : between(0.04, 0.18),
        wobbleFreq: integer(2, 7),
        hole: Math.random() < 0.12 ? between(0.15, 0.4) : 0,
      }),
      palette: makePalette(),
    },
  };
}

/** Reset for each segment so its first frame preserves the prior pixel lattice. */
function grainRandom(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

/** An open-ended walk through Chroma's shape families and affect palettes. */
export class GenerativeField {
  private from = destination();
  private to = destination(this.from.family);
  private readonly grainSeed = Math.floor(Math.random() * 4294967296);
  private elapsed = 0;
  private duration = between(4500, 7000);
  private field: SequenceField;

  constructor(private size: number) {
    this.field = this.build();
  }

  private build(): SequenceField {
    return new SequenceField(this.size, [this.from.slot, this.to.slot], 1.25, grainRandom(this.grainSeed));
  }

  advance(milliseconds: number): void {
    this.elapsed += Math.max(0, milliseconds);
    while (this.elapsed >= this.duration) {
      this.elapsed -= this.duration;
      this.from = this.to;
      this.to = destination(this.from.family);
      this.duration = between(4500, 7000);
      this.field = this.build();
    }
  }

  resize(size: number): void {
    this.size = size;
    this.field = this.build();
  }

  render(context: CanvasRenderingContext2D, cx: number, cy: number): void {
    // The first half of a two-slot sequence goes A → B; never enter B → A.
    this.field.render(context, cx, cy, (this.elapsed / this.duration) * 0.5, 0);
  }
}
