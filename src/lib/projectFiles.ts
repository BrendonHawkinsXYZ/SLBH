import type { DocumentImage, FileLink, ProjectFileData } from "@/components/projects/ProjectFile.types";
import { acg, records, related } from "./acg";

// Project narratives are edited from the existing detail pages. The index keeps
// its frontmatter source; these records define the richer project documents.
const theory: FileLink = { title: "Emotion as System", role: "The research foundation", href: "/research/emotion-as-system" };
const acgLink: FileLink = { title: "ACG by SLBH", role: "Applied affective research", href: "/projects/acg" };
const americanLink: FileLink = { title: "American Emotions", role: "Collective affect as color", href: "/projects/american-emotions" };
const geometryLink: FileLink = { title: "Affective Geometry", role: "Emotion as shape and color", href: "/projects/affective-geometry" };
const tihifLink: FileLink = { title: "This Is How I’m Feeling: NYC", role: "Private feeling in public space", href: "/projects/tihif-nyc" };
const chromaLink: FileLink = { title: "Chroma", role: "A private emotional journal", href: "/work/chroma" };

function documentation(folder: string, items: { file: string; title: string; caption: string; width: number; height: number; alt?: string }[]): DocumentImage[] {
  return items.map((item, index) => ({
    id: String(index + 1).padStart(2, "0"),
    src: `/${folder}/${item.file}`,
    title: item.title,
    caption: item.caption,
    alt: item.alt ?? item.caption,
    width: item.width,
    height: item.height,
  }));
}

export const projectFiles: Record<string, ProjectFileData> = {
  acg: {
    title: acg.title,
    subtitle: acg.name,
    statement: "Emotional data,\nin shared space.",
    facts: [
      { label: "Period", value: acg.year },
      { label: "Location", value: acg.location },
      { label: "Form", value: "Installation / sensory systems" },
      { label: "Status", value: "Ongoing series" },
    ],
    summary: acg.summary,
    abstract: [
      "Its first storefront activation places two emotional fields beside one another: a collective field drawn from American Emotions, and a local field shaped by visitors. Both are translated into light.",
      "The work asks how affect becomes legible outside a diagram—in the space people share.",
    ],
    method: {
      title: "System",
      columns: [
        { title: "Collective field", steps: ["Public data", "American Emotions", "Light array 01"] },
        { title: "Local field", steps: ["Visitor response", "Emotion + color interpretation", "Light array 02"] },
      ],
      paragraphs: ["Two inputs. A shared color logic. When the fields converge, the installation expresses a moment of alignment between the room and the world outside it."],
      details: [{ title: "System scope", paragraphs: ["Light is the first rendering method. The underlying system is designed to move between sites and sensory outputs, including color, scent, printed matter, and public displays. The ongoing research concerns this translation from emotional data to experience.", "A storefront, a retail activation, a public program, or a temporary installation can each become a site for the system. Inputs may include public data, visitor response, location-based signals, temporal field states, and sensory pairings."] }],
    },
    images: records.map((record) => ({ ...record, src: `/projects/acg/${record.file}.png` })),
    record: { title: "Activation record", facts: [
      { label: "Site", value: acg.activation.venue },
      { label: "Dates", value: acg.activation.dates },
      { label: "Hours", value: "24 hours a day" },
      { label: "Format", value: acg.activation.format },
      { label: "Series", value: "Ongoing · Next activation to be announced" },
    ] },
    references: related,
  },

  "affective-geometry": {
    title: "Affective Geometry",
    statement: "A feeling has a form.",
    facts: [
      { label: "Period", value: "2026–ongoing" },
      { label: "Location", value: "New York" },
      { label: "Form", value: "Art / geometric studies" },
      { label: "Status", value: "Active study" },
    ],
    summary: "An art project that theorizes emotion as shape and color.",
    abstract: ["Each sketch takes an emotional state and renders it as a bounded geometric figure filled with a field of color. The plates are a proof of concept for giving affective computational geometry a visible form.", "These are sketches. The shapes drawn here became the shapes in Chroma."],
    method: {
      title: "Study",
      columns: [
        { title: "Shape", text: "A bounded geometric figure gives an emotional state a form." },
        { title: "Field", text: "Color fills the figure, giving that form an affective character." },
      ],
      paragraphs: ["The study works across 25 shapes and 25 palettes within a 169-colour field gamut. Individual plates hold the shape apart so its relationship to the color field can be read."],
    },
    images: documentation("projects/affective-geometry", [
      { file: "premise.png", title: "The premise", caption: "Affective Geometry. An initial sketch of emotion as shape and field.", width: 1600, height: 1200 },
      { file: "contact-sheet.jpeg", title: "Contact sheet", caption: "25 shapes / 25 palettes. 4:4. A 169-colour field gamut.", width: 1638, height: 2048 },
      ...["circle", "triangle", "square", "rhombus", "heptagon"].map((shape) => ({ file: `plate-${shape}.png`, title: `${shape[0].toUpperCase()}${shape.slice(1)}`, caption: `${shape[0].toUpperCase()}${shape.slice(1)}. A geometric plate filled with a color field.`, width: 1000, height: 1000 })),
    ]),
    record: { title: "Study record", facts: [
      { label: "Material", value: "2D geometric plates" },
      { label: "Range", value: "25 shapes / 25 palettes" },
      { label: "Gamut", value: "169 colours" },
      { label: "Application", value: "The shapes became part of Chroma" },
    ] },
    references: [theory, chromaLink, acgLink],
  },

  "affective-sculptural-sketches": {
    title: "Affective Sculptural Sketches",
    statement: "Feeling, built out of\nlight and space.",
    facts: [
      { label: "Period", value: "2026–ongoing" },
      { label: "Location", value: "New York" },
      { label: "Form", value: "Art / spatial studies" },
      { label: "Status", value: "Active study" },
    ],
    summary: "An ongoing study of light and space as sculptural material for affect.",
    abstract: ["How does a constructed environment produce a feeling—and can it carry one person’s feeling to another? Each sketch takes a single affective state and asks what it would have to be built out of.", "Proportion, the temperature and angle of light, the distance between a body and a surface, and the rate of change all become materials in the study."],
    method: {
      title: "Study",
      columns: [
        { title: "Authored", text: "A state is composed deliberately into light and volume." },
        { title: "Received", text: "An occupant enters and undergoes something that began in somebody else." },
      ],
      paragraphs: ["The work concerns the gap between the two. A sketch is high fidelity when what was encoded is what gets felt: which qualities survive the passage from maker to occupant, and which remain private to the maker?"],
      details: [{ title: "Why sketches?", paragraphs: ["The medium resists finish. A room can be specified but not held still: light moves, occupants move, and the same construction reads differently at a different hour. Each sketch is a fixed proposal about something that will not sit still."] }],
    },
    images: documentation("projects/affective-sculptural-sketches", [
      { file: "first-date.png", title: "First Date", caption: "High Fidelity Sketch: First Date.", width: 1473, height: 1964 },
      { file: "affective-infrastructure.png", title: "Affective Infrastructure", caption: "High Fidelity Sketch for Affective Infrastructure.", width: 1536, height: 2048 },
      { file: "temporary-emotional-architectures.png", title: "Temporary Emotional Architectures", caption: "Temporary Emotional Architectures. A proposal for a constructed affective environment.", width: 1512, height: 2016 },
    ]),
    record: { title: "Study record", facts: [
      { label: "Material", value: "Light, volume, proportion, duration" },
      { label: "Studies", value: "Three spatial sketches" },
      { label: "Question", value: "Transmission of feeling from maker to occupant" },
    ] },
    references: [acgLink, geometryLink],
  },

  "american-emotions": {
    title: "American Emotions",
    statement: "Public attention,\nrendered as color.",
    facts: [
      { label: "Period", value: "2024–ongoing" },
      { label: "Location", value: "New York" },
      { label: "Form", value: "Art / live instrument" },
      { label: "Status", value: "Active · Third iteration" },
    ],
    actions: [{ title: "Open live instrument", href: "https://americanemotions.studiolabbh.xyz" }],
    summary: "A living instrument that renders collective affect as color, using public attention as the signal.",
    abstract: ["The project began in 2024 with a question: could a nation’s emotional state be rendered, and what would the right medium be? The answer arrived as color.", "Its first seven-month run led up to the 2024 presidential election. Tracking public attention and watching its inferred affect move over time established the philosophy that grounds the lab’s work."],
    method: {
      title: "System",
      columns: [
        { title: "Interpretation", steps: ["Google Trends RSS", "Language-model emotion scoring", "171-emotion taxonomy + color"] },
        { title: "Rendering", steps: ["Emotional weights", "Accumulation over time", "A luminous color field"] },
      ],
      paragraphs: ["Search trends serve as a proxy for collective attention. Each query receives emotional weight and a color from the continuous spectrum. Its trace joins a field that can be read as an atmosphere."],
      details: [
        { title: "Rendering method", paragraphs: ["The renderer uses float32 additive accumulation with Gaussian bloom. Individual queries leave soft traces that layer into a density map of collective attention."] },
        { title: "The art project became the lab", paragraphs: ["American Emotions established the lab’s axiom that affect has value: it is structured, measurable, collective, and shaped. Its pipeline informed Chroma, its renderer became a research instrument, and its questions became papers."] },
      ],
    },
    images: documentation("projects/american-emotions", [
      { file: "hero.png", title: "Collective field", caption: "American Emotions. Collective affect rendered as a luminous color field.", width: 2686, height: 1391 },
      { file: "render-2024.png", title: "2024 election run", caption: "An archival rendering from the seven-month 2024 election run.", width: 3040, height: 3040 },
    ]),
    record: { title: "Iteration record", facts: [
      { label: "2024", value: "American Emotions · Seven months leading up to the presidential election · Complete" },
      { label: "2025", value: "New York Emotions · Six weeks leading up to the mayoral election · Complete" },
      { label: "April 2026–", value: "American Emotions · Ongoing, through midterms and into the next presidential cycle" },
    ] },
    references: [theory, acgLink, tihifLink, { title: "2024 election archive", role: "Archival documentation", href: "https://www.instagram.com/americanemotions" }],
  },

  "global-emotions": {
    title: "Global Emotions",
    statement: "The world, one\nemotional field a day.",
    facts: [
      { label: "Period", value: "2026–ongoing" },
      { label: "Scope", value: "Global / by country" },
      { label: "Form", value: "Art / live instrument" },
      { label: "Status", value: "Seasonal instrument" },
    ],
    actions: [{ title: "Open live instrument", href: "https://globalemotions.studiolabbh.xyz" }],
    summary: "A public emotional observatory that reads the world as a weather system of attention.",
    abstract: ["Each day, search behavior across countries is classified into emotional categories and mapped to a color field. The fields accumulate into an archive—a record of how the world felt, one day at a time.", "The work extends the inquiry of American Emotions beyond one country. Each place receives an atmospheric reading of its public mood."],
    method: {
      title: "System",
      columns: [
        { title: "Input", steps: ["Daily search trends", "Headline context", "Traffic + publication-time weighting"] },
        { title: "Output", steps: ["Emotional classification", "A color field per place", "A daily archive"] },
      ],
      paragraphs: ["Signals are aggregated by country and stripped of individual identity. Attention intensity shapes the reading; a valence–arousal–dominance space provides the emotional coordinates."],
    },
    images: documentation("projects/global-emotions", [
      { file: "field-world.png", title: "World field", caption: "The world field. A daily view of collective affect across countries.", width: 1919, height: 987 },
      { file: "location.png", title: "Country view", caption: "The location view. One country’s emotional and chromatic field.", width: 1200, height: 900 },
      { file: "archive.png", title: "Daily archive", caption: "The archive. Daily fields accumulate into a record over time.", width: 1200, height: 900 },
    ]),
    record: { title: "Instrument record", facts: [
      { label: "Source", value: "Google Trends · Daily" },
      { label: "Taxonomy", value: "169 emotions" },
      { label: "Space", value: "Valence–arousal–dominance" },
      { label: "Weighting", value: "Attention intensity" },
      { label: "Output", value: "One field per place per day" },
      { label: "Version", value: "Affect-field-v2" },
    ], paragraphs: ["The live instrument is the canonical source. Each day is an artifact that can be cited."] },
    references: [americanLink, acgLink, theory],
  },

  "convergent-grammar": {
    title: "Convergent Grammar",
    statement: "What structure\ndo images share?",
    facts: [
      { label: "Period", value: "2026–ongoing" },
      { label: "Location", value: "New York" },
      { label: "Form", value: "Computational study" },
      { label: "Status", value: "In development" },
    ],
    summary: "A computational study of latent visual grammar across portraiture and adjacent image regimes.",
    abstract: ["Across centuries, cultures, and media, do painted portraits share an underlying spatial grammar? The study began with portraiture and now extends to landscapes, interiors, garments, photographs, and machine-generated images.", "It looks for compositional structure that survives a change of artist, period, style, or mode of image making."],
    method: {
      title: "Method",
      columns: [
        { title: "Extraction", steps: ["Open collection images", "Genre classification", "Geometric relationships"] },
        { title: "Comparison", steps: ["Vector primitives", "Comparison across the corpus", "Convergence and divergence"] },
      ],
      paragraphs: ["The pipeline extracts relationships between figures, horizons, focal points, and negative space. Each documentation plate pairs a source portrait with its extracted spatial grammar.", "The study’s finding so far is that grammar follows the spatial problem a genre addresses. Portrait and landscape grammars diverge; portrait and figure-study grammars converge."],
      details: [{ title: "Research scope", paragraphs: ["Portraiture is the most densely sampled genre and the reference grammar for every other scan. The work widens into other image types and sources, including photographic archives, contemporary image libraries, and machine-generated imagery. Each source tests whether the grammar survives a change of regime."] }],
    },
    images: documentation("projects/convergent-grammar", [
      { file: "hero.png", title: "Grammar overview", caption: "Source images with extracted spatial grammar traced in vectors.", width: 2686, height: 1391 },
      { file: "example.png", title: "Extraction example", caption: "A source portrait with its extracted spatial grammar.", width: 2048, height: 2728 },
      ...[1, 2, 3].map((number) => ({ file: `portrait-0${number}.png`, title: `Portrait study ${number}`, caption: `Portrait study ${number}. Source image and extracted relationships between figure, ground, focal point, and negative space.`, width: 2048, height: 2728 })),
    ]),
    record: { title: "Research record", facts: [
      { label: "Reference", value: "Portraiture" },
      { label: "Corpus", value: "Open collections and adjacent image sources" },
      { label: "Output", value: "Diagrams and a planned longitudinal paper" },
      { label: "Stage", value: "Active research" },
    ] },
    references: [americanLink, acgLink],
  },

  "tihif-nyc": {
    title: "This Is How I’m Feeling: NYC",
    statement: "A private feeling,\nin public light.",
    facts: [
      { label: "Period", value: "2025" },
      { label: "Location", value: "New York" },
      { label: "Form", value: "Site-specific installation" },
      { label: "Status", value: "Complete" },
    ],
    summary: "An installation that streamed one person’s daily emotion into three windows as colored light.",
    abstract: ["What happens if you put one person’s emotion onto the street, in plain view, every night? A studio in New York became a nightly broadcast of a feeling.", "The installation investigated how private emotion moves through shared space. One person, one studio, one feeling per day, three points of light."],
    method: {
      title: "System",
      columns: [
        { title: "Translation", steps: ["Daily journal", "Emotion scoring", "Color assignment"] },
        { title: "Broadcast", steps: ["A color signal", "Three networked LED fixtures", "Three studio windows"] },
      ],
      paragraphs: ["Each day began with a journal entry. The entry was translated into an emotion and then a color, using the scoring process shared with American Emotions. As the day’s feeling shifted, so did the light."],
      details: [{ title: "Affect as a shared coordinate", paragraphs: ["The work gives a direct form to the lab’s proposition that affect is a field phenomenon: it moves beyond the body and can become visible in shared space. The subsequent work, ACG by SLBH, scales this premise."] }],
    },
    images: documentation("projects/tihif-nyc", [{ file: "hero.png", title: "Three windows at night", caption: "The installation from the street. Three colored windows broadcast a daily feeling as light.", width: 2686, height: 1391 }]),
    record: { title: "Installation record", facts: [
      { label: "Site", value: "A studio in New York City" },
      { label: "Run", value: "2025 · Complete" },
      { label: "Input", value: "One person’s daily journal" },
      { label: "Output", value: "Three networked LED fixtures" },
    ] },
    references: [acgLink, americanLink, theory],
  },

  chroma: {
    title: "Chroma",
    statement: "See your feelings\ntake shape.",
    facts: [
      { label: "Period", value: "2026" },
      { label: "Form", value: "Product / emotional journal" },
      { label: "Platform", value: "iPhone" },
      { label: "Status", value: "Available" },
    ],
    actions: [{ title: "View on the App Store", href: "https://apps.apple.com/us/app/mood-tracker-journal-chroma/id6784464340" }, { title: "Visit Chroma", href: "https://chroma.studiolabbh.xyz/" }],
    summary: "A private place to give a moment color and form, then return to it over time.",
    abstract: ["Speak or type what happened. Chroma turns the moment into color, form, and a private reflection—entirely on your iPhone.", "The shapes come from Affective Geometry. The product carries the lab’s work on emotion as a system into a personal, everyday practice."],
    method: {
      title: "Experience",
      columns: [
        { title: "Give feeling a form", steps: ["Speak or type a moment", "Color, shape, and language", "A private reflection"] },
        { title: "Return over time", steps: ["A daily reading", "Weekly reflection", "An archive of your months"] },
      ],
      paragraphs: ["Individual moments become a record you can return to. Readings and reflections offer another way to notice the feelings that recur."],
    },
    images: documentation("chroma", [
      { file: "collection.png", title: "Chroma overview", caption: "Voice journaling, daily readings, weekly reflection, and on-device privacy.", width: 6686, height: 5376 },
      { file: "screen-01.png", title: "Daily reading", caption: "A daily reading. A moment remembered in color, form, and language.", width: 690, height: 1493 },
      { file: "screen-02.png", title: "Give feeling a form", caption: "An emotional state represented through color, shape, and language.", width: 690, height: 1493 },
      { file: "screen-03.png", title: "The archive", caption: "An archive of your months. Return to the feelings each month held.", width: 690, height: 1493 },
      { file: "screen-04.png", title: "Past patterns", caption: "A reflection grounded in recurring feelings across your moments.", width: 690, height: 1493 },
      { file: "screen-05.png", title: "On-device privacy", caption: "The published research foundation and Chroma’s on-device privacy model.", width: 690, height: 1493 },
    ]),
    record: { title: "Product record", facts: [
      { label: "Platform", value: "iPhone" },
      { label: "Input", value: "Voice or text" },
      { label: "Output", value: "Color, form, and a private reflection" },
      { label: "Privacy", value: "Entirely on your device" },
    ] },
    references: [geometryLink, { title: "Diagrams", role: "Working definitions and visual studies", href: "/diagrams" }, theory, { title: "Privacy", role: "Chroma privacy policy", href: "/chroma/privacy" }, { title: "Terms", role: "Chroma terms of service", href: "/chroma/terms" }],
  },
};
