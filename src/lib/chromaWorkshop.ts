import { CHROMA_URL } from "@/lib/site";
import type { ProjectFileData } from "@/components/projects/ProjectFile.types";

export const chromaWorkshop: ProjectFileData = {
  title: "Tell Me How You Feel: Chroma",
  statement: "Feeling, around\na shared table.",
  facts: [
    { label: "Date", value: "September 2026" },
    { label: "Location", value: "Plated Studios, Brooklyn" },
    { label: "Form", value: "Program / Workshop" },
    { label: "Status", value: "Complete" },
  ],
  summary: "A participatory Chroma workshop exploring emotion and perception through drawing, flowers, food, and conversation.",
  abstract: [
    "At Plated Studios, the question of giving feeling a form moved from a private journal into a shared environment. A table, a meal, drawing prompts, and flowers offered different ways to approach it.",
    "The gathering was a designed encounter: an invitation to make, describe, and exchange. Drawing and conversation offered space for each person’s interpretation.",
  ],
  method: {
    title: "The encounter",
    columns: [
      { title: "Prepare and arrive", text: "Flower-market and material preparation shaped the table before anyone arrived. Tea offered an arrival and grounding ritual; florals, vessels, and printed materials formed the setting." },
      { title: "Draw and exchange", text: "Emotion drawing worksheets invited participants to give words such as Mystified, Surprised, and Defiant a visual form. Conversation moved between emotion, perception, and how differently a feeling might be represented." },
    ],
    paragraphs: [
      "Food was part of the experience. The menu moved through Refreshing, Grounding, and Brightening, placing sensory language alongside the drawing prompts and Chroma’s visual forms.",
      "At the end, the table was deconstructed and the flowers gathered into arrangements to take away. Materials that had shaped a shared environment became objects held by individual participants.",
    ],
  },
  sections: [{
    id: "questions-opened", title: "Questions opened by the encounter",
    paragraphs: ["Across the table, emotion words became drawings; flowers moved from a shared setting into individual arrangements. These different forms of expression open questions about what can be shared, what changes with context, and what remains personal."],
    questions: [
      "What does a shared emotion word make possible—and what different meanings can people give it?",
      "How do food, tea, flowers, and the pace of a gathering shape the way feeling is expressed?",
      "What changes when a representation is discussed with others rather than kept in a private journal?",
      "What remains of the encounter when the table is taken apart and its materials leave with people?",
    ],
  }],
  images: [
    { file: "tea", title: "Arrival", caption: "Tea is poured into a collection of ceramic cups before the shared activity.", width: 1052, height: 1060 },
    { file: "conversation", title: "Around the table", caption: "Conversation at Plated Studios, with flowers, drawing materials, and Chroma cards across the table.", width: 1280, height: 1920 },
    { file: "drawing", title: "Giving a word form", caption: "Participants draw responses to emotion prompts, including Pleased, Inspired, and Defiant.", width: 1920, height: 1280 },
    { file: "at-the-table", title: "Drawing together", caption: "Participants work on their emotion drawing sheets in a shared setting.", width: 1920, height: 1280 },
    { file: "perception", title: "Different visual descriptions", caption: "Drawings, flowers, and conversation share the table. The Surprised and Mystified sheets show different approaches to form.", width: 1280, height: 1920 },
    { file: "defiant", title: "Defiant", caption: "A participant’s drawing on the Defiant worksheet, beside the menu and a Chroma scratch card.", width: 1280, height: 1920 },
    { file: "mystified", title: "Mystified", caption: "A blue and violet spiral on the Mystified worksheet, alongside the printed menu and Chroma card.", width: 1920, height: 1280 },
    { file: "food", title: "A sensory menu", caption: "The food experience and its printed menu, with a Chroma scratch card at the place setting.", width: 1920, height: 1280 },
    { file: "flowers", title: "Taking the table apart", caption: "Flowers are gathered and bound into an arrangement as the shared table is deconstructed.", width: 1206, height: 991 },
    { file: "together", title: "Leaving with a form", caption: "The group with flowers and arrangements at the close of the gathering.", width: 1920, height: 1280 },
  ].map(({ file, ...item }, index) => ({ ...item, id: String(index + 1).padStart(2, "0"), src: `/projects/tell-me-how-you-feel-chroma/${file}.webp`, alt: item.caption })),
  record: { title: "Workshop record", facts: [
    { label: "Context", value: "Chroma participatory program at Plated Studios" },
    { label: "Date", value: "September 2026" },
    { label: "Materials", value: "Flowers, tea, food, emotion drawing sheets, color, and conversation" },
    { label: "Documentation", value: "Ten photographs and stills from the encounter" },
  ] },
  references: [
    { title: "Chroma", role: "The private journal", href: CHROMA_URL },
    { title: "Tell Me How You Feel: ACG", role: "A related encounter in shared space", href: "/projects/acg" },
    { title: "Affective Geometry", role: "Emotion as shape and color", href: "/projects/affective-geometry" },
    { title: "Studio Lab BH", role: "Theory ↔ Research ↔ Application", href: "/studio" },
  ],
};
