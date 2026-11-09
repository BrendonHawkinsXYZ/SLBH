export type HeroDrawing = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

const descriptions = [
  "Happy: orange circular marks framed by purple and pink lines.",
  "Smug: a blue oval beneath a red arch and a yellow patterned border.",
  "Defiant: an atom surrounded by flowers and colorful figures.",
  "Disturbed: a red eye amid jagged black, red, and blue lines.",
  "Bored: a small oval below a long, thin curved line.",
  "Clear: flowing blue waves and spirals.",
  "Amazed: a wide-eyed figure, a rainbow, clouds, and a red star.",
  "Droopy: a gray figure beneath blue tears and cloudlike lines.",
  "Mystified: a red flower between rain clouds and a rising sun.",
  "Elated: a blue and pink exclamation mark in a yellow field.",
  "Shocked: an orange starburst over dense multicolored strokes.",
  "Grumpy: dark clouds, a wavy line, and descending triangular marks.",
  "Outraged: fiery eyes beneath orange spirals and flames.",
  "Patient: a blue circular center surrounded by flowing horizontal lines.",
  "Inspired: colorful waves between the black lines of a rectangular grid.",
  "Inspired: blue horizontal lines surrounded by colorful curls and zigzags.",
  "Ashamed: dark clouds above green spirals and grasslike marks.",
  "Elated: a face in profile with flowing multicolored hair and pink hearts.",
  "Hopeful: a yellow flower, a spiral sun, and a small face.",
  "Ashamed: a face obscured by red marks beneath a scribbled dark sky.",
];

/** Full, transparent exports of the twenty drawings supplied in `blank`. */
export const homeDrawings: HeroDrawing[] = descriptions.map((alt, index) => ({
  src: `/home/participant-drawings/blank-${String(index + 1).padStart(2, "0")}.webp`,
  alt: `Participant drawing — ${alt}`,
  width: 1200,
  height: 1500,
}));
