export type QuestionTreatment = "editorial" | "condensed" | "quiet" | "mixed" | "staggered" | "serif" | "spaced" | "split" | "outlined" | "mono" | "oversized" | "right";

export const questionProjects = {
  american: { title: "American Emotions", href: "/projects/american-emotions" },
  theory: { title: "Emotion as System", href: "/research/emotion-as-system" },
  chroma: { title: "Chroma", href: "https://chroma.studiolabbh.xyz/" },
  acg: { title: "Tell Me How You Feel: ACG", href: "/projects/acg" },
  workshop: { title: "Tell Me How You Feel: Chroma", href: "/projects/tell-me-how-you-feel-chroma" },
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

// The original review numbers are stable, independent of the eventual sequence.
export const homeQuestions: HomeQuestion[] = [
  q(1, "american", "mixed", "Can I|image|emotion?", "image emotion"),
  q(2, "american", "serif", "What does|emotion|look like?", "emotion"),
  q(3, "american", "condensed", "Can a country|have an emotional|atmosphere?", "atmosphere"),
  q(4, "american", "quiet", "What do our searches reveal|about what moves us?", "moves"),
  q(5, "american", "split", "Whose interpretation|becomes|the picture?", "picture"),
  q(6, "theory", "oversized", "What if|emotion is|a system?", "system"),
  q(7, "theory", "mono", "Can emotion be|modeled,|predicted,|and rendered?", "modeled predicted rendered"),
  q(8, "theory", "staggered", "How does meaning|change|what we notice?", "meaning change"),
  q(9, "theory", "spaced", "What makes one possibility|feel closer|than another?", "closer"),
  q(10, "theory", "editorial", "Does a feeling change the world,|or how we|move through it?", "move"),
  q(11, "chroma", "right", "Have you seen|your emotions|today?", "today"),
  q(12, "chroma", "condensed", "Who has the right|to author|your internal state?", "author"),
  q(13, "chroma", "outlined", "Can a journal|reflect you|without defining you?", "reflect"),
  q(14, "chroma", "serif", "What would a month|of your feelings|look like?", "month feelings"),
  q(15, "chroma", "quiet", "Does a feeling need to be improved|to deserve attention?", "attention"),
  q(16, "acg", "staggered", "What happens when|your feeling|becomes part of the room?", "feeling room"),
  q(17, "acg", "mixed", "Can a room hold|more than one|emotional truth?", "truth"),
  q(18, "acg", "split", "What happens when|a machine’s reading|disagrees with your own?", "disagrees"),
  q(19, "acg", "spaced", "Does a shared color|mean|a shared feeling?", "color feeling"),
  q(20, "acg", "oversized", "Can you change|the atmosphere|by describing how you feel?", "atmosphere"),
  q(21, "acg", "quiet", "What stays private|when a feeling becomes public?", "private public"),
  q(22, "workshop", "mixed", "If we draw|the same feeling,|will it look the same?", "draw same"),
  q(23, "workshop", "oversized", "What does|“defiant”|look like to you?", "defiant"),
  q(24, "workshop", "editorial", "Can you recognize|a feeling|in someone else’s drawing?", "feeling drawing"),
  q(25, "workshop", "right", "How does a shared table|change what we’re|willing to express?", "express"),
  q(26, "workshop", "staggered", "Can a feeling move between|a word, a meal,|and a flower?", "word meal flower"),
  q(27, "workshop", "serif", "What remains of a gathering|after the table|is cleared?", "remains"),
  q(28, "newYork", "quiet", "How are you|feeling right now?", "feeling"),
  q(29, "newYork", "condensed", "Does the city’s mood|have room|for yours?", "yours"),
  q(30, "newYork", "mono", "What changes|when we ask people|instead of inferring?", "ask people"),
  q(31, "newYork", "split", "Can one color hold|“anxious|but happy”?", "anxious happy"),
  q(32, "newYork", "staggered", "Can a daily reading|keep up with|a changing room?", "changing"),
  q(33, "global", "spaced", "Can public attention|become a kind of|emotional weather?", "weather"),
  q(34, "global", "right", "Does the same event|take on a different|emotional shape elsewhere?", "elsewhere"),
  q(35, "global", "outlined", "What disappears|when many places|become one world view?", "disappears"),
  q(36, "global", "editorial", "What does an archive remember|about what held|our attention?", "remember attention"),
  q(37, "geometry", "mixed", "What shape|would you give|a feeling?", "shape feeling"),
  q(38, "geometry", "serif", "Can a color|say something|a word cannot?", "color word"),
  q(39, "geometry", "outlined", "What happens|when a feeling|gets an edge?", "edge"),
  q(40, "geometry", "split", "Would the same shape|feel different|in another color?", "different color"),
  q(41, "sculpture", "quiet", "Can a room carry a feeling|from one person to another?", "carry"),
  q(42, "sculpture", "serif", "What would|a first date|look like as a space?", "first date"),
  q(43, "sculpture", "spaced", "Can light|and distance become|emotional materials?", "light distance"),
  q(44, "windows", "condensed", "What happens when|a private feeling|lights up the street?", "lights street"),
  q(45, "windows", "quiet", "Can you share how you feel|without telling your story?", "story"),
  q(46, "windows", "staggered", "Can three windows|become|an emotional portrait?", "windows portrait"),
  q(47, "grammar", "mono", "What do images share|before we recognize|what they depict?", "share"),
  q(48, "grammar", "mixed", "Can a portrait|and a landscape speak|the same visual language?", "portrait landscape"),
  q(49, "grammar", "right", "What survives|a change of artist,|medium, or century?", "survives"),
  q(50, "grammar", "editorial", "Can a machine find|a visual grammar|we haven’t named?", "grammar"),
];
