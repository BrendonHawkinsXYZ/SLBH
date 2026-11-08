import type { ProjectFileData } from "@/components/projects/ProjectFile.types";

export const wallOfTruthFilm = {
  src: "/projects/wall-of-truth/archive.mp4",
  poster: "/projects/wall-of-truth/archive-poster.webp",
  width: 2874,
  height: 1630,
};

export const affectiveLighting: ProjectFileData = {
  title: "Affective Lighting",
  statement: "A rendered state.\nAn environmental object.",
  facts: [
    { label: "Origin", value: "2024" },
    { label: "Form", value: "Light sculpture / environmental object" },
    { label: "Materials", value: "Aluminum, LEDs, clay, polymer paint, data inputs, time" },
    { label: "Dimensions", value: "Variable" },
  ],
  summary: "A ready-made smart light and a hand-built clay structure translate American Emotions data into an environmental object.",
  abstract: [
    "Begun in 2024, Affective Lighting was Brendon Hawkins’s first investigation into translating rendered emotional states into environmental objects. A clay structure was built around a ready-made smart light, bringing a computational interpretation into a domestic setting.",
    "The work used American Emotions data. Its interpretation of public signals became light encountered through a physical object and the atmosphere around it.",
    "The experiment opened a material line of inquiry that later informed Tell Me How You Feel: ACG. Alongside Wall of Truth’s investigation of public vulnerability, it helps locate the early questions that continued through the studio’s participatory work.",
  ],
  method: {
    title: "Material & translation",
    columns: [
      { title: "The source", text: "American Emotions supplied an interpretation of public signals through emotion and color." },
      { title: "The object", text: "A ready-made smart light was combined with a hand-built clay structure. Its colored light extended beyond the object into the surrounding room." },
    ],
    paragraphs: [
      "The intervention brings a manufactured light, a sculptural form, and an emotional data source together. Material, orientation, and the surrounding surfaces become part of how the rendered state is encountered.",
    ],
  },
  images: [
    { id: "01", src: "/projects/affective-lighting/cover.webp", title: "A state in the room", alt: "A tall light rises from a dark clay base, casting bands of pink, blue, amber, and red across a wall.", caption: "Affective Lighting. The object and its surrounding field of light.", width: 2400, height: 1920 },
    { id: "02", src: "/projects/affective-lighting/object.webp", title: "The constructed object", alt: "In ambient light, a slim multicolored LED light is held in a textured black clay structure on a wooden floor.", caption: "The ready-made light and hand-built clay structure, seen in ambient light.", width: 1920, height: 2400 },
  ],
  record: {
    title: "Project record",
    facts: [
      { label: "Original title", value: "Chroma: Affective Lighting" },
      { label: "Origin", value: "2024" },
      { label: "Input", value: "American Emotions data" },
      { label: "Setting", value: "Domestic space" },
    ],
  },
  references: [
    { title: "American Emotions", href: "/projects/american-emotions", role: "The computational source" },
    { title: "Tell Me How You Feel: ACG", href: "/projects/acg", role: "Light becomes a shared environment" },
    { title: "Wall of Truth", href: "/projects/wall-of-truth", role: "The parallel inquiry into public vulnerability" },
    { title: "New York Emotions", href: "/projects/new-york-emotions", role: "Public signals meet participant expression" },
  ],
};

export const wallOfTruth: ProjectFileData = {
  title: "Wall of Truth",
  statement: "An anonymous message.\nA public encounter.",
  facts: [
    { label: "Origin", value: "2024" },
    { label: "Form", value: "Distributed installation / digital confessional" },
    { label: "Materials", value: "QR-code stickers, web interface, anonymous text, time" },
    { label: "Setting", value: "Distributed physical locations / shared digital wall" },
  ],
  summary: "A distributed installation inviting anonymous public expression through QR-code stickers and a shared digital wall.",
  abstract: [
    "Wall of Truth began in 2024 as a distributed installation and anonymous public confessional. QR-code stickers placed in physical locations lead to a shared digital wall, where visitors can leave a message.",
    "A person encounters an invitation in one place and joins people encountered elsewhere through their words. Separate moments accumulate into a public space for disclosure, humor, anger, affection, and performance.",
    "For Brendon Hawkins, the project was an early investigation of vulnerability in public: what makes someone willing to share, and what kind of encounter can an invitation create? Those questions continued through New York Emotions and Tell Me How You Feel.",
  ],
  method: {
    title: "The invitation & encounter",
    columns: [
      { title: "Encounter", steps: ["Find a QR-code sticker in a physical location", "Follow the invitation to the digital wall"] },
      { title: "Contribute", steps: ["Leave an anonymous message", "Encounter the message among contributions from other people"] },
    ],
    paragraphs: [
      "The sticker carries the invitation “Tell Your Story.” The wall provides a place for that expression to be encountered by others over time.",
      "The setting, the prompt, and anonymity are part of the work. The archive records different uses of the invitation, from intimate disclosures to jokes and declarations.",
    ],
  },
  images: [
    { id: "01", src: "/projects/wall-of-truth/cover.webp", title: "Tell Your Story", alt: "A black sticker with a colorful QR code and the words Tell Your Story sits among layers of colorful chewing gum.", caption: "The invitation in place: a “Tell Your Story” QR-code sticker among layers of chewing gum.", width: 1800, height: 2400 },
  ],
  sections: [{
    id: "questions-opened",
    title: "What the invitation opened",
    paragraphs: [
      "Wall of Truth made the conditions of participation part of the practice. A public invitation could offer a place for a private thought, while leaving the participant to decide what to say.",
      "New York Emotions later asked people how they felt and placed their responses beside an inferred emotional field. Tell Me How You Feel continued to develop the invitation through light, drawing, conversation, and shared settings.",
    ],
    questions: [
      "What makes a person willing to disclose something in public?",
      "How do anonymity and the place of encounter shape what someone chooses to say?",
      "What happens when a private thought becomes something a stranger can encounter?",
    ],
  }],
  record: {
    title: "Project record",
    facts: [
      { label: "Origin", value: "2024" },
      { label: "Physical entry", value: "Distributed QR-code stickers" },
      { label: "Digital setting", value: "walloftruth.xyz" },
      { label: "Documentation", value: "Sticker photograph / proof-of-concept recording of 2025 entries" },
    ],
  },
  references: [
    { title: "New York Emotions", href: "/projects/new-york-emotions", role: "An invitation to describe a feeling" },
    { title: "Tell Me How You Feel: ACG", href: "/projects/acg", role: "Participant expression in a shared environment" },
    { title: "Affective Lighting", href: "/projects/affective-lighting", role: "The parallel inquiry into environmental objects" },
    { title: "Tell Me How You Feel: PIT Lab", href: "/projects/tell-me-how-you-feel-pit-lab", role: "An invitation through drawing and conversation" },
    { title: "Tell Me How You Feel: Chroma", href: "/projects/tell-me-how-you-feel-chroma", role: "Expression around a shared table" },
  ],
};
