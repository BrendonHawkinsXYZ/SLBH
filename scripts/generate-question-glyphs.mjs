import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const readFont = require("next/dist/compiled/@next/font/dist/fontkit").default;
const ts = require("typescript");
const root = path.resolve(import.meta.dirname, "..");
const source = await fs.readFile(path.join(root, "src/lib/homeQuestions.ts"), "utf8");
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const data = {};
new Function("exports", code)(data);
const copy = data.homeQuestions.map(q => q.text).join("");
const chars = [...new Set(copy + copy.toUpperCase())].filter(c => c !== " ");
const pairs = [...new Set(data.homeQuestions.flatMap(q => q.text.split(" ").flatMap(word => [...word].slice(1).map((c, i) => word[i] + c))))];

const families = ["spacegrotesk", "instrumentserif", "syne", "anton", "bitter", "ibmplexmono", "bodonimoda", "cormorantgaramond", "unbounded", "archivoblack"];
const directory = path.join(root, "public/question-type-licenses");
await fs.mkdir(directory, { recursive: true });
const buffers = new Map();
await Promise.all(families.map(async family => {
  const listing = await fetch(`https://api.github.com/repos/google/fonts/contents/ofl/${family}`).then(response => { if (!response.ok) throw new Error(`${family}: ${response.status}`); return response.json(); });
  for (const italic of [false, true]) {
    if (italic && family !== "instrumentserif") continue;
    const file = listing.find(file => file.name.endsWith(".ttf") && /Italic/.test(file.name) === italic && (!/Mono/.test(file.name) || /Regular/.test(file.name)));
    if (!file) throw new Error(`No font file for ${family}, italic=${italic}`);
    const response = await fetch(file.download_url);
    if (!response.ok) throw new Error(`${file.name}: ${response.status}`);
    buffers.set(family + (italic ? "-italic" : ""), { buffer: Buffer.from(await response.arrayBuffer()), url: file.download_url });
  }
  const license = listing.find(file => file.name === "OFL.txt");
  if (!license) throw new Error(`Missing OFL license: ${family}`);
  await fs.writeFile(path.join(directory, `${family}.txt`), await fetch(license.download_url).then(response => response.text()));
}));

const variants = {
  grotesk: ["spacegrotesk", { wght: 500 }], bold: ["spacegrotesk", { wght: 700 }],
  serif: ["instrumentserif", {}], italic: ["instrumentserif-italic", {}],
  display: ["syne", { wght: 800 }], condensed: ["anton", {}],
  slab: ["bitter", { wght: 600 }], mono: ["ibmplexmono", {}],
  didone: ["bodonimoda", { wght: 500, opsz: 96 }], humanist: ["cormorantgaramond", { wght: 600 }],
  wide: ["unbounded", { wght: 500 }], black: ["archivoblack", {}],
};
const catalog = {};
for (const [id, [family, variation]] of Object.entries(variants)) {
  const entry = buffers.get(family);
  let font = readFont(entry.buffer);
  if (Object.keys(variation).length) font = font.getVariation(variation);
  const glyphs = {};
  for (const char of chars) {
    if (!font.hasGlyphForCodePoint(char.codePointAt(0))) throw new Error(`Missing ${char} in ${family}`);
    const glyph = font.glyphForCodePoint(char.codePointAt(0));
    const b = glyph.bbox;
    glyphs[char] = {
      path: glyph.path.toSVG().replace(/-?\d*\.\d+(?:e[+-]?\d+)?/gi, value => String(Math.round(Number(value) * 100) / 100)),
      advance: glyph.advanceWidth, bounds: [b.minX, b.minY, b.maxX, b.maxY],
    };
  }
  const kerning = {};
  for (const pair of pairs) {
    const run = font.layout(pair, { liga: false, calt: false, kern: true });
    if (run.glyphs.length !== 2) continue;
    const delta = run.positions[0].xAdvance - run.glyphs[0].advanceWidth;
    if (delta) kerning[pair] = Math.round(delta * 100) / 100;
  }
  catalog[id] = { name: font.familyName, source: entry.url, units: font.unitsPerEm, glyphs, kerning };
}
await fs.writeFile(path.join(root, "src/lib/questionGlyphs.json"), JSON.stringify(catalog));
console.log(`Generated ${Object.keys(catalog).length} font styles from ${families.length} families, with painted glyph outlines and kerning.`);
