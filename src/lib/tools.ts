export type Tool = {
  index: string;
  title: string;
  href: string;
  line: string;
  out: string;
};

/** Browser instruments, shared by the studio index and the tools directory. */
export const TOOLS: Tool[] = [
  {
    index: "01",
    title: "Shapes",
    href: "/shapes",
    line: "Shape families, colour, and a field of pixels.",
    out: "PNG · SVG",
  },
  {
    index: "02",
    title: "Steps",
    href: "/steps",
    line: "Colour stops and the intervals between them.",
    out: "PNG",
  },
  {
    index: "03",
    title: "Trace",
    href: "/trace",
    line: "Sketches and scans into vector curves.",
    out: "SVG · PNG",
  },
  {
    index: "04",
    title: "Chroma",
    href: "/chroma",
    line: "A sequence of shapes in a 15-second loop.",
    out: "MP4 · WEBM",
  },
  {
    index: "05",
    title: "Bloom",
    href: "/bloom",
    line: "A seed shape growing into another form.",
    out: "ANIMATION",
  },
  {
    index: "06",
    title: "Figure",
    href: "/figure",
    line: "Pixel characters, dress, grain, and ground.",
    out: "PNG · JSON",
  },
  {
    index: "07",
    title: "Glyph",
    href: "/glyph",
    line: "A grid, a drawing, and one vector path.",
    out: "SVG",
  },
];
