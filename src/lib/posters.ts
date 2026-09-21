export type PosterRecord = {
  id: string;
  title: string;
  image: string;
  width: number;
  height: number;
  alt: string;
};

// Original artwork supplied by Brendon, in the order provided.
export const posters: PosterRecord[] = [
  {
    id: "techno-savior",
    title: "Techno Savior",
    image: "/posters/techno-savior.png",
    width: 1652,
    height: 2065,
    alt: "A white, many-armed figure carries the letters of Techno Savior across a blue and green pixel pattern, with a yellow circle and border.",
  },
  {
    id: "attention-receipt",
    title: "Brendon’s Attention Receipt",
    image: "/posters/attention-receipt.png",
    width: 1620,
    height: 2024,
    alt: "A receipt-style ledger lists experiences, where they happened, and the time spent on each, ending with a total of 326:34 and a barcode.",
  },
  {
    id: "language",
    title: "Language",
    image: "/posters/language.png",
    width: 1413,
    height: 2065,
    alt: "The word Language in dark red above a black-and-white photograph of a hand on a keyboard whose keys contain individual stones.",
  },
  {
    id: "transformative-ai",
    title: "Transformative AI",
    image: "/posters/transformative-ai.png",
    width: 1602,
    height: 2002,
    alt: "Repeated lines about transformative AI and radical uncertainty fill a black poster, with sections of text displaced, overlapped, and interrupted by empty space.",
  },
  {
    id: "was-war-won",
    title: "Was War Won",
    image: "/posters/was-war-won.png",
    width: 1449,
    height: 2024,
    alt: "Three rows of mirrored words, Was, War, and Won, outlined in bright pink on black. The middle row is filled with a reflective photograph.",
  },
  {
    id: "an-unsettled-feeling",
    title: "An Unsettled Feeling",
    image: "/posters/an-unsettled-feeling.png",
    width: 1501,
    height: 1942,
    alt: "On a vivid blue background, repeated black lines reading An unsettled feeling keeps the body front and center gradually break apart above numbered white silhouettes of a desk, monitor, and chair.",
  },
];
