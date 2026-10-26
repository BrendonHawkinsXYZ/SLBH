import outlines from "./questionGlyphs.json";
import type { HomeQuestion, QuestionTreatment } from "./homeQuestions";

type FontName = keyof typeof outlines;
type Glyph = { path: string; advance: number; bounds: number[] };
type Font = { name: string; units: number; glyphs: Record<string, Glyph>; kerning: Record<string, number> };
const fonts: Record<FontName, Font> = outlines;
const cream = "#f2efdf";
const accents = ["#e0fa93", "#eaa6b8", "#9ec5e8", "#c7b7ed", "#edc889", "#a6d9c5"];
const mixedFonts: FontName[] = ["serif", "display", "didone", "bold", "italic", "slab", "wide", "humanist"];

type Treatment = {
  font: FontName; accent: FontName; align: "left" | "center" | "right";
  width: number; height: number; tracking: number; scales: number[];
  upper?: boolean; mixed?: boolean; stagger?: boolean; outline?: boolean;
};
const treatments: Record<QuestionTreatment, Treatment> = {
  editorial: { font: "grotesk", accent: "italic", align: "left", width: .88, height: .72, tracking: -.025, scales: [.55, 1.2, 1] },
  condensed: { font: "condensed", accent: "condensed", align: "left", width: .84, height: .82, tracking: -.015, scales: [.85, 1, 1.1], upper: true },
  quiet: { font: "grotesk", accent: "italic", align: "center", width: .65, height: .25, tracking: .015, scales: [1, 1] },
  mixed: { font: "grotesk", accent: "display", align: "left", width: .88, height: .80, tracking: -.035, scales: [.45, 1, 1.12], mixed: true },
  staggered: { font: "didone", accent: "black", align: "left", width: .82, height: .76, tracking: -.035, scales: [.65, 1.15, .9], stagger: true },
  serif: { font: "serif", accent: "italic", align: "center", width: .83, height: .74, tracking: -.025, scales: [.8, 1.2, .85] },
  spaced: { font: "mono", accent: "wide", align: "center", width: .85, height: .52, tracking: .12, scales: [.6, 1.1, .7] },
  split: { font: "grotesk", accent: "condensed", align: "left", width: .86, height: .75, tracking: -.02, scales: [.55, 1.3, .85], stagger: true },
  outlined: { font: "grotesk", accent: "black", align: "left", width: .88, height: .74, tracking: -.025, scales: [.7, 1.25, .75], outline: true },
  mono: { font: "mono", accent: "slab", align: "left", width: .80, height: .76, tracking: -.025, scales: [.6, 1, 1, 1] },
  oversized: { font: "display", accent: "italic", align: "center", width: .94, height: .82, tracking: -.04, scales: [.45, 1.5, .5] },
  right: { font: "humanist", accent: "display", align: "right", width: .84, height: .74, tracking: -.015, scales: [1, .8, 1.2] },
};

export type QuestionGlyph = {
  path: string; transform: string; color: string; outline: boolean;
};

function plain(word: string) { return word.toLowerCase().replace(/[^a-z]/g, ""); }

/** Arrange letterforms and expose the full question rectangle for interaction. */
export function layoutQuestion(question: HomeQuestion, width: number, height: number) {
  const treatment = treatments[question.treatment];
  const mobile = width < 620;
  const accent = accents[(question.id - 1) % accents.length];
  const lines = mobile
    ? question.lines.flatMap(line => {
      const words = line.split(" ");
      if (line.length < 24 || words.length < 4) return [line];
      const split = Math.ceil(words.length / 2);
      return [words.slice(0, split).join(" "), words.slice(split).join(" ")];
    })
    : question.lines;
  const draft = lines.map((line, lineIndex) => {
    let pen = 0, minY = 0, maxY = 0;
    const items: { glyph: Glyph; x: number; scale: number; stretch: number; color: string; outline: boolean }[] = [];
    const base = 100 * (mobile ? 1 : treatment.scales[lineIndex % treatment.scales.length]);
    for (const [wordIndex, original] of line.split(" ").entries()) {
      const word = treatment.upper ? original.toUpperCase() : original;
      const emphasized = question.emphasis.includes(plain(original));
      const size = base * (emphasized && question.treatment !== "quiet" ? 1.12 : 1);
      const defaultFont = emphasized ? treatment.accent : treatment.font;
      const letters = [...word];
      let previousFont: FontName | null = null;
      for (const [letterIndex, letter] of letters.entries()) {
        const fontName = treatment.mixed && emphasized
          ? mixedFonts[(letterIndex + wordIndex * 3 + question.id) % mixedFonts.length] : defaultFont;
        const font = fonts[fontName];
        const glyph = font.glyphs[letter];
        if (!glyph) continue;
        const scale = size / font.units;
        const stretch = treatment.mixed && emphasized ? [1, .88, 1.08, .94][letterIndex % 4] : 1;
        if (previousFont === fontName && letterIndex) pen += (font.kerning[letters[letterIndex - 1] + letter] ?? 0) * scale;
        items.push({ glyph, x: pen, scale, stretch, color: emphasized && (!treatment.mixed || letterIndex % 3 !== 1) ? accent : cream, outline: Boolean(treatment.outline && emphasized) });
        minY = Math.min(minY, -glyph.bounds[3] * scale);
        maxY = Math.max(maxY, -glyph.bounds[1] * scale);
        pen += glyph.advance * scale * stretch + size * treatment.tracking;
        previousFont = fontName;
      }
      pen += base * .28;
    }
    return { items, width: Math.max(1, pen - base * .28), minY, height: Math.max(1, maxY - minY) };
  });
  const lineGap = question.treatment === "condensed" ? 12 : 24;
  const draftWidth = Math.max(...draft.map(line => line.width));
  const draftHeight = draft.reduce((total, line) => total + line.height, 0) + lineGap * (draft.length - 1);
  const gutter = mobile ? 24 : 48;
  const availableWidth = Math.max(1, width - gutter * 2);
  const availableHeight = Math.max(1, height - (mobile ? 72 : 64));
  const fraction = mobile ? .96 : treatment.width;
  const fit = Math.min(availableWidth * fraction / draftWidth, availableHeight * (mobile ? .84 : treatment.height) / draftHeight);
  const blockWidth = draftWidth * fit;
  const blockHeight = draftHeight * fit;
  const left = treatment.align === "left" && !mobile ? gutter : treatment.align === "right" && !mobile ? width - gutter - blockWidth : (width - blockWidth) / 2;
  let top = (height - blockHeight) / 2 - (mobile ? 4 : 12);
  const result: QuestionGlyph[] = [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [lineIndex, line] of draft.entries()) {
    let offset = treatment.align === "center" ? (draftWidth - line.width) / 2 : treatment.align === "right" ? draftWidth - line.width : 0;
    if (treatment.stagger && !mobile) offset = (draftWidth - line.width) * [0, 1, .5][lineIndex % 3];
    const baseline = top - line.minY * fit;
    for (const item of line.items) {
      const scale = item.scale * fit;
      const x = left + (offset + item.x) * fit;
      minX = Math.min(minX, x + item.glyph.bounds[0] * scale * item.stretch);
      maxX = Math.max(maxX, x + item.glyph.bounds[2] * scale * item.stretch);
      minY = Math.min(minY, baseline - item.glyph.bounds[3] * scale);
      maxY = Math.max(maxY, baseline - item.glyph.bounds[1] * scale);
      result.push({ path: item.glyph.path, transform: `translate(${x.toFixed(2)} ${baseline.toFixed(2)}) scale(${(scale * item.stretch).toFixed(6)} ${(-scale).toFixed(6)})`, color: item.color, outline: item.outline });
    }
    top += (line.height + lineGap) * fit;
  }
  return { glyphs: result, bounds: { x: minX, y: minY, width: maxX - minX, height: maxY - minY } };
}
