export type QuestionTreatment = "editorial" | "condensed" | "quiet" | "mixed" | "staggered" | "serif" | "spaced" | "split" | "outlined" | "mono" | "oversized" | "right";

export const questionProjects = {
  american: { title: "American Emotions", href: "/projects/american-emotions" },
  theory: { title: "Emotion as System", href: "/research/emotion-as-system" },
  chroma: { title: "Chroma", href: "https://chroma.studiolabbh.xyz/" },
  acg: { title: "Tell Me How You Feel: ACG", href: "/projects/acg" },
  workshop: { title: "Tell Me How You Feel: Chroma", href: "/projects/tell-me-how-you-feel-chroma" },
  pitLab: { title: "Tell Me How You Feel: PIT Lab", href: "/projects/tell-me-how-you-feel-pit-lab" },
  newYork: { title: "New York Emotions", href: "/projects/new-york-emotions" },
  global: { title: "Global Emotions", href: "/projects/global-emotions" },
  geometry: { title: "Affective Geometry", href: "/projects/affective-geometry" },
  sculpture: { title: "Affective Sculptural Sketches", href: "/projects/affective-sculptural-sketches" },
  windows: { title: "This Is How I’m Feeling: NYC", href: "/projects/tihif-nyc" },
  grammar: { title: "Convergent Grammar", href: "/projects/convergent-grammar" },
} as const;

export type HomeQuestion = {
  id: number;
  project: keyof typeof questionProjects;
  treatment: QuestionTreatment;
  text: string;
  lines: string[];
  emphasis: string[];
};

function q(id: number, project: HomeQuestion["project"], treatment: QuestionTreatment, copy: string, emphasis = ""): HomeQuestion {
  return { id, project, treatment, text: copy.replaceAll("|", " "), lines: copy.split("|"), emphasis: emphasis.split(" ").filter(Boolean) };
}

// Arrival questions for Tell Me How You Feel. Each homepage visit selects one.
export const homeQuestions: HomeQuestion[] = [
  q(1, "pitLab", "condensed", "Who gets to participate|in society simply|due to proximity?", "proximity"),
  q(2, "acg", "split", "Who is left out|of technology’s|representation?", "representation"),
  q(3, "pitLab", "serif", "What does ownership mean|for a community|archive?", "ownership archive"),
  q(4, "pitLab", "editorial", "How might a community project|become financially equitable|for those organizing it?", "equitable organizing"),
  q(5, "workshop", "staggered", "Can organizers profit|off of something meant|for a community?", "profit community"),
  q(6, "workshop", "oversized", "What are|the terms?", "terms"),
  q(7, "pitLab", "mono", "What does scale mean|for community|efforts?", "scale"),
  q(8, "pitLab", "quiet", "Does it|add value?", "value"),
  q(9, "workshop", "condensed", "How does someone contribute|to community without|requiring documentation?", "documentation"),
  q(10, "acg", "right", "Why would someone want|to be read|or interpreted?", "interpreted"),
  q(11, "acg", "mixed", "Is interpretation|ever|correct?", "interpretation correct"),
  q(12, "acg", "oversized", "Correct|to whom?", "whom"),
  q(13, "workshop", "serif", "Does reflection|or recognition|lead to resolve?", "recognition resolve"),
  q(14, "workshop", "quiet", "Should|it?", "should"),
  q(15, "acg", "outlined", "Does technology enhance|representation|possibilities?", "representation"),
  q(16, "acg", "split", "How much of the frictions|of life should be|automated away?", "automated"),
  q(17, "pitLab", "editorial", "As a society increases|in complexity and size,|what are the requirements|for that system to maintain and grow?", "complexity grow"),
];
