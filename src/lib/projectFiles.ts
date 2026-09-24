import type { DocumentImage, FileLink, ProjectFileData } from "@/components/projects/ProjectFile.types";
import { acg, records, related } from "./acg";
import { CHROMA_URL } from "./site";

// Project narratives are edited from the existing detail pages. The index keeps
// its frontmatter source; these records define the richer project documents.
const theory: FileLink = { title: "Emotion as System", role: "The research foundation", href: "/research/emotion-as-system" };
const acgLink: FileLink = { title: "Tell Me How You Feel: ACG", role: "A shared encounter with affect", href: "/projects/acg" };
const americanLink: FileLink = { title: "American Emotions", role: "Interpreted public attention as color", href: "/projects/american-emotions" };
const geometryLink: FileLink = { title: "Affective Geometry", role: "Emotion as shape and color", href: "/projects/affective-geometry" };
const tihifLink: FileLink = { title: "This Is How I’m Feeling: NYC", role: "Private feeling in public space", href: "/projects/tihif-nyc" };
const workshopLink: FileLink = { title: "Tell Me How You Feel: Chroma", role: "Drawing, florals, food, and conversation", href: "/projects/tell-me-how-you-feel-chroma" };
const globalLink: FileLink = { title: "Global Emotions", role: "The current public-signal instrument", href: "/projects/global-emotions" };
const chromaLink: FileLink = { title: "Chroma", role: "A private emotional journal", href: CHROMA_URL };

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
    subtitle: "An installation series within Affective Computational Geometry",
    statement: "Emotional data,\nin shared space.",
    facts: [
      { label: "Period", value: acg.year },
      { label: "Location", value: acg.location },
      { label: "Form", value: "Installation / sensory systems" },
      { label: "Status", value: "Ongoing series · First activation complete" },
    ],
    summary: "What happens when different descriptions of affect are rendered into the same shared environment?",
    abstract: [
      "The first storefront activation placed two fields beside one another: one drawn from American Emotions, and another shaped by visitor input. Both were translated into light.",
      "Affective Computational Geometry is the broader thesis and conceptual program. Tell Me How You Feel: ACG is an installation series within it—one way to encounter its questions in shared space.",
    ],
    method: {
      title: "System",
      columns: [
        { title: "Public signal", steps: ["Public / computational signals", "Interpretation through American Emotions", "Light array 01"] },
        { title: "Participant input", steps: ["Visitors declare a feeling", "The response enters the color mapping", "Light array 02"] },
      ],
      paragraphs: ["One field begins with an interpretation of public signals; the other begins with what participants choose to express. They are different forms of evidence, even when rendered through the same visual system.", "Matching colors represent convergence inside the mapping system. They do not establish that the room and the outside world experienced the same emotion. The artwork asks what that convergence might mean."],
      details: [{ title: "System scope", paragraphs: ["Light is the first rendering method. The broader program explores translation between emotional descriptions and sensory forms, including color, scent, printed matter, and public displays."] }],
    },
    sections: [{
      id: "observations", title: "Observation / Open questions",
      paragraphs: ["At The Space, April 28–30, 2026, the two light arrays occupied adjacent storefront windows. The documentation records visitors gathering around an in-room prompt and, in one nighttime view, a blue public-signal field beside a red participant field."],
      questions: ["What do people read into a match—or a difference—between the windows?", "How does sharing a visual grammar change the way these different sources are understood?", "What remains private or unrepresented when a response becomes a color?"],
      links: [workshopLink],
    }],
    images: records.map((record) => ({ ...record, src: `/projects/acg/${record.file}.png` })),
    record: { title: "Activation record", facts: [
      { label: "Site", value: acg.activation.venue },
      { label: "Dates", value: acg.activation.dates },
      { label: "Hours", value: "24 hours a day" },
      { label: "Format", value: acg.activation.format },
      { label: "Series", value: "Ongoing · Next activation to be announced" },
    ] },
    references: [...related, workshopLink],
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
      { label: "Origin", value: "2024" },
      { label: "Scope", value: "United States" },
      { label: "Form", value: "Instrument" },
      { label: "Continuation", value: "Global Emotions" },
    ],
    actions: [{ title: "Explore the successor: Global Emotions", href: "/projects/global-emotions" }],
    summary: "An authored instrument that interprets public attention through emotion and color.",
    abstract: ["The project began in 2024 with a question: could public attention be interpreted as an affective field, and what would the right medium be? Color became a way to explore that question.", "The original election-period experiment used search activity as a proxy for attention. Its fields record the computational model’s interpretation of those signals, rather than a verified measurement of a population’s emotional state."],
    method: {
      title: "Signal → Interpretation → Rendering",
      columns: [
        { title: "Signal", steps: ["Public search activity", "Google Trends RSS"] },
        { title: "Interpretation", steps: ["Authored affective model", "Emotion weights and color assignments"] },
        { title: "Rendering", steps: ["Accumulation over time", "A luminous color field"] },
      ],
      paragraphs: ["Each query receives emotional weight and a color within the authored system. Its trace joins a field that can be read as an atmosphere. Search activity supplies the input; the model supplies the interpretation."],
      details: [
        { title: "Rendering method", paragraphs: ["The later American Emotions renderer uses float32 additive accumulation with Gaussian bloom. Individual queries leave soft traces that layer into a density map of interpreted attention."] },
        { title: "Taxonomy across versions", paragraphs: ["The retained 2024 pipeline asks a language model to assign emotion labels and RGB colors using an open vocabulary. The later American Emotions v2 source defines 171 emotions; Global Emotions documents 169. These describe different iterations, not interchangeable counts for the original experiment."] },
      ],
    },
    sections: [{
      id: "questions-opened", title: "What the experiment opened",
      paragraphs: ["The 2024 experiment opened questions about the distance between a public signal, an emotional interpretation, and a visual form. What can attention stand in for? What does the model introduce? What can color communicate that a label cannot?", "That line of inquiry later informed Emotion as System, Chroma, and the ACG installation series. Chroma gives the person authority to name a feeling; the installation places participant input beside interpreted public signals. Each returns the original question in a different form."],
      links: [theory, chromaLink, acgLink],
    }, {
      id: "continuation", title: "From American Emotions to Global Emotions",
      paragraphs: ["Global Emotions continues this inquiry across locations in a daily field interface. The current instrument is a later development, not a live replay of the 2024 American Emotions system. Its model and coverage should be read through its own dated records."],
      links: [globalLink],
    }],
    images: documentation("projects/american-emotions", [
      { file: "hero.png", title: "Interpreted field", caption: "American Emotions. Public attention interpreted as a luminous color field.", width: 2686, height: 1391 },
      { file: "render-2024.png", title: "2024 election run", caption: "An archival rendering from the 2024 election-period experiment.", width: 3040, height: 3040 },
    ]),
    record: { title: "Project record", facts: [
      { label: "Origin", value: "American Emotions · 2024 election-period experiment" },
      { label: "Related work", value: "New York Emotions · 2025 mayoral-election period" },
      { label: "Continuation", value: "Global Emotions · Current location-based interface" },
    ] },
    references: [theory, chromaLink, acgLink, globalLink, tihifLink, { title: "American Emotions archive", role: "Historical documentation", href: "https://www.instagram.com/americanemotions" }],
  },

  "global-emotions": {
    title: "Global Emotions",
    statement: "A weather system\nof attention.",
    facts: [
      { label: "Period", value: "2026–ongoing" },
      { label: "Scope", value: "Locations / world aggregate" },
      { label: "Form", value: "Instrument" },
      { label: "Status", value: "Live · Dated field archive" },
    ],
    actions: [{ title: "Open live instrument", href: "https://globalemotions.studiolabbh.xyz" }],
    summary: "Global Emotions interprets public search and news signals through an authored affective model, producing a daily visual field for each available location.",
    abstract: ["The work extends the inquiry of American Emotions beyond one country. Fields accumulate into an archive of the instrument’s interpretations of public signals, not a direct record of how everyone in a place felt."],
    method: {
      title: "System",
      columns: [
        { title: "Input", steps: ["Search trends and headline context", "Traffic and publication-time weighting"] },
        { title: "Output", steps: ["Authored emotional classification", "A color field for an available location", "A dated archive record"] },
      ],
      paragraphs: ["The published method maps signals into a taxonomy of 169 emotions with color and valence–arousal–dominance coordinates. Its categories and weights are choices made within the model.", "The affect label describes the model’s interpretation. Search pressure is a separate attention-intensity readout; it should not be read as a measure of how strongly a population feels an emotion."],
    },
    sections: [{
      id: "reading-the-record", title: "Reading a field",
      paragraphs: ["Use the location code, record date, and model version together. A US-NY field is a New York state view, not a national reading. WORLD is an aggregate view. Neither represents every person within its scope.", "On September 24, 2026, the location selector listed 177 places, including country and territory views, U.S. states, the District of Columbia, and a world aggregate. A listed location does not guarantee a field for every day.", "The archive is organized by day. The Today view may show the latest available dated field; check its generated timestamp rather than assuming it was produced today. An absent record provides no basis for inferring calm, neutrality, or zero activity."],
    }],
    images: documentation("projects/global-emotions", [
      { file: "field-world.png", title: "World field", caption: "The world view. An aggregate visual interpretation of available public signals.", width: 1919, height: 987 },
      { file: "location.png", title: "Location view", caption: "A location view. Scope is identified by its location code.", width: 1200, height: 900 },
      { file: "archive.png", title: "Daily archive", caption: "Dated fields preserve the instrument’s interpretations over time.", width: 1200, height: 900 },
    ]),
    record: { title: "Instrument record", facts: [
      { label: "Source", value: "Public search trends and headline context" },
      { label: "Taxonomy", value: "169 emotions in the published method" },
      { label: "Space", value: "Valence–arousal–dominance" },
      { label: "Readouts", value: "Interpreted affect / search pressure / attention velocity" },
      { label: "Cadence", value: "Daily archive · See each record’s generated date" },
      { label: "Model", value: "affect-field-v3 · US-NY record, September 23, 2026" },
    ], paragraphs: ["The model version above comes from the dated field’s View Data record. Historical fields retain their own provenance."] },
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
      { file: "hero.png", title: "Grammar overview", caption: "A collection of source portraits from the working corpus.", width: 2686, height: 1391 },
      { file: "example.png", title: "Extraction example", caption: "Layered geometric traces from the portrait study.", width: 2048, height: 2728 },
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
      details: [{ title: "Affect as a shared coordinate", paragraphs: ["The work gives a direct form to the lab’s proposition that affect is a field phenomenon: it moves beyond the body and can become visible in shared space. The subsequent work, Tell Me How You Feel: ACG, scales this premise."] }],
    },
    images: documentation("projects/tihif-nyc", [{ file: "cover.png", title: "A feeling on the street", caption: "Three studio windows glowing red above a New York street at night.", width: 800, height: 1000 }, { file: "hero.png", title: "Three windows at night", caption: "The installation from the street. Three colored windows broadcast a daily feeling as light.", width: 2686, height: 1391 }]),
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
    abstract: ["Speak or type what happened. Chroma turns the moment into color, form, and a private reflection—entirely on your iPhone.", "The shapes come from Affective Geometry. The product brings the studio’s inquiry into a personal, everyday practice—and raises questions of its own."],
    method: {
      title: "Experience",
      columns: [
        { title: "Give feeling a form", steps: ["Speak or type a moment", "Color, shape, and language", "A private reflection"] },
        { title: "Return over time", steps: ["A daily reading", "Weekly reflection", "An archive of your months"] },
      ],
      paragraphs: ["Individual moments become a record you can return to. Readings and reflections offer another way to notice the feelings that recur."],
    },
    sections: [{
      id: "research-position", title: "The person and the system",
      columns: [
        { title: "The person", items: ["Describes the moment", "Identifies the feeling", "Chooses color"] },
        { title: "The system", items: ["Translates those selections into visual form", "Preserves the person’s original description", "Generates reflective language around the entry"] },
      ],
      paragraphs: ["Chroma is designed around acknowledgment rather than emotional scoring or compulsory improvement. The system can offer reflection, but the person retains authority over the experience it represents.", "Calling Chroma a research instrument describes its role in developing and questioning the studio’s ideas. Studio Lab BH does not collect private journal data for research. Journal content and generated reflections remain on the person’s device."],
    }, {
      id: "returned-to-research", title: "What Chroma returned to the research",
      paragraphs: ["Building and releasing Chroma put a concrete tension into the product: the person supplies a description, feeling, and color, while the system generates another layer of language. Preserving the original description alongside that reflection makes the distinction visible.", "The questions below arise from those product decisions. They are open design questions, not findings drawn from people’s private journals."],
      questions: ["How can reflective language remain an invitation without becoming an authoritative account of someone’s experience?", "What changes when a person returns to a feeling’s visual form after the moment has passed?", "How can an archive acknowledge recurring experiences without turning them into targets for improvement?"],
      links: [workshopLink],
    }],
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
    references: [geometryLink, workshopLink, { title: "Diagrams", role: "Working definitions and visual studies", href: "/diagrams" }, theory, { title: "Privacy", role: "Chroma privacy policy", href: "/chroma/privacy" }, { title: "Terms", role: "Chroma terms of service", href: "/chroma/terms" }],
  },
};
