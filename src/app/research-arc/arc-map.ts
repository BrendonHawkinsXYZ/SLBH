/**
 * Transcribed from Brendon Hawkins' supplied Research Arc drawing.
 * Coordinates use the reference's 1824 × 1368 composition. Dates, categories,
 * the repeated “AS”, and arrow directions intentionally follow the drawing.
 * Catalog metadata must never add nodes or infer links in this map.
 */
export type ArcEntry = {
  id: string;
  title: string;
  category: "THEORY" | "RESEARCH" | "APPLICATION" | "THESIS";
  date?: string;
  lines: { text: string; x: number; y: number }[];
  categoryAt: { x: number; y: number };
  dateAt?: { x: number; y: number };
  center: { x: number; y: number };
  workId?: string;
};

export const ARC_WIDTH = 1824;
export const ARC_HEIGHT = 1368;

export const arcEntries: ArcEntry[] = [
  { id: "society-of-self", title: "Society of Self", category: "THEORY", date: "2025",
    lines: [{ text: "SOCIETY OF SELF", x: 174, y: 250 }], categoryAt: { x: 229, y: 293 }, dateAt: { x: 391, y: 211 }, center: { x: 300, y: 250 } },
  { id: "american-emotions", title: "American Emotions", category: "APPLICATION", date: "2024", workId: "american-emotions",
    lines: [{ text: "AMERICAN EMOTIONS", x: 763, y: 236 }], categoryAt: { x: 799, y: 272 }, dateAt: { x: 1018, y: 206 }, center: { x: 915, y: 240 } },
  { id: "color-as-language", title: "Color As As Language", category: "THEORY", date: "2018",
    lines: [{ text: "COLOR AS AS LANGUAGE", x: 1354, y: 173 }], categoryAt: { x: 1448, y: 204 }, dateAt: { x: 1607, y: 141 }, center: { x: 1530, y: 175 } },
  { id: "emotion-can-be-read", title: "Emotion Can Be Read, Organized Predicted", category: "THEORY", date: "2024",
    lines: [{ text: "EMOTION CAN BE", x: 77, y: 636 }, { text: "READ, ORGANIZED", x: 95, y: 674 }, { text: "PREDICTED", x: 164, y: 710 }],
    categoryAt: { x: 188, y: 752 }, dateAt: { x: 313, y: 626 }, center: { x: 232, y: 680 } },
  { id: "new-york-emotions", title: "New York Emotions", category: "APPLICATION", date: "2025",
    lines: [{ text: "NEW YORK", x: 628, y: 444 }, { text: "EMOTIONS", x: 640, y: 479 }],
    categoryAt: { x: 650, y: 516 }, dateAt: { x: 772, y: 428 }, center: { x: 738, y: 465 } },
  { id: "global-emotions", title: "Global Emotions", category: "APPLICATION", date: "2026", workId: "global-emotions",
    lines: [{ text: "GLOBAL", x: 986, y: 456 }, { text: "EMOTIONS", x: 1020, y: 488 }],
    categoryAt: { x: 1052, y: 520 }, dateAt: { x: 1149, y: 466 }, center: { x: 1103, y: 478 } },
  { id: "affective-computational-geometry", title: "Affective Computational Geometry", category: "THESIS",
    lines: [{ text: "AFFECTIVE COMPUTATIONAL", x: 825, y: 671 }, { text: "GEOMETRY", x: 891, y: 710 }],
    categoryAt: { x: 899, y: 752 }, center: { x: 987, y: 701 } },
  { id: "emotion-as-system", title: "Emotion as System", category: "RESEARCH", date: "2025-2026", workId: "emotion-as-system",
    lines: [{ text: "EMOTION AS SYSTEM", x: 1357, y: 386 }], categoryAt: { x: 1471, y: 423 }, dateAt: { x: 1635, y: 380 }, center: { x: 1556, y: 396 } },
  { id: "color-pain-study", title: "Color Pain Study", category: "RESEARCH", date: "2025",
    lines: [{ text: "COLOR PAIN STUDY", x: 1392, y: 856 }], categoryAt: { x: 1448, y: 894 }, dateAt: { x: 1661, y: 849 }, center: { x: 1560, y: 860 } },
  { id: "affective-geometry", title: "Affective Geometry", category: "APPLICATION", date: "2026", workId: "affective-geometry",
    lines: [{ text: "AFFECTIVE GEOMETRY", x: 220, y: 1009 }], categoryAt: { x: 244, y: 1051 }, dateAt: { x: 497, y: 987 }, center: { x: 372, y: 1018 } },
  { id: "chroma", title: "Chroma", category: "APPLICATION", date: "2020-", workId: "chroma",
    lines: [{ text: "CHROMA", x: 1533, y: 1026 }], categoryAt: { x: 1538, y: 1071 }, dateAt: { x: 1654, y: 1028 }, center: { x: 1630, y: 1040 } },
  { id: "acg-installation", title: "ACG Installation", category: "APPLICATION", date: "2026", workId: "acg",
    lines: [{ text: "ACG INSTALLATION", x: 818, y: 1185 }], categoryAt: { x: 910, y: 1228 }, dateAt: { x: 1105, y: 1182 }, center: { x: 1015, y: 1194 } },
];

export const arcEdges = [
  { from: "color-as-language", to: "american-emotions", path: "M 1350 154 C 1280 154 1153 186 1086 205" },
  { from: "color-as-language", to: "color-pain-study", path: "M 1642 216 C 1730 254 1814 302 1787 414 C 1763 527 1656 697 1598 785" },
  { from: "american-emotions", to: "society-of-self", path: "M 789 192 C 779 165 591 168 468 212" },
  { from: "society-of-self", to: "emotion-as-system", path: "M 288 215 C 541 147 864 83 1032 121 C 1183 154 1313 242 1398 342" },
  { from: "emotion-can-be-read", to: "american-emotions", path: "M 381 583 C 449 478 581 338 742 257" },
  { from: "emotion-can-be-read", to: "affective-geometry", path: "M 325 717 C 309 781 303 851 331 954" },
  { from: "american-emotions", to: "new-york-emotions", path: "M 824 285 Q 785 332 755 388" },
  { from: "american-emotions", to: "global-emotions", path: "M 1019 264 Q 1064 312 1069 419" },
  { from: "american-emotions", to: "affective-computational-geometry", path: "M 915 287 C 899 383 902 489 930 598" },
  { from: "american-emotions", to: "acg-installation", path: "M 1040 237 C 1240 324 1326 483 1290 695 C 1260 871 1119 1010 995 1122" },
  { from: "affective-computational-geometry", to: "emotion-as-system", path: "M 1161 653 Q 1314 559 1377 424" },
  { from: "affective-computational-geometry", to: "affective-geometry", path: "M 833 690 C 625 766 448 842 372 954" },
  { from: "emotion-as-system", to: "acg-installation", path: "M 1415 424 C 1382 654 1251 901 1053 1115" },
  { from: "emotion-as-system", to: "chroma", path: "M 1606 433 C 1720 577 1769 711 1752 831 Q 1745 899 1686 964" },
  { from: "color-pain-study", to: "chroma", path: "M 1597 898 Q 1597 940 1589 985" },
  { from: "affective-geometry", to: "chroma", path: "M 493 1009 C 755 1016 1231 1008 1510 1028" },
  { from: "chroma", to: "affective-computational-geometry", path: "M 1523 1008 C 1310 932 1186 865 1085 721" },
];

export const arcTimeline = [...arcEntries].sort((a, b) => (a.date || "9999").localeCompare(b.date || "9999"));
