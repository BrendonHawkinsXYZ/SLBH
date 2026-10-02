import type { ProjectFileData } from "@/components/projects/ProjectFile.types";


// The artist approved these four anonymous, verbatim excerpts for this page.
// CSV row numbers include the header; labels and colors come from the same row.
export const newYorkResponses = [
  { row: 2, text: "Hopeful because a candidate with fresh policies is popular and isn’t held back by his religion and race", emotion: "hope", color: "#ADD8E6" },
  { row: 6, text: "I’m anxious but happy", emotion: "ambivalence", color: "#AAB43C" },
  { row: 19, text: "I’m excited but also tired from, midterms. I am thankful and happy about the opportunities I’m given to explore!", emotion: "gratitude", color: "#FFDF7F" },
  { row: 23, text: "Exhausted and burnt out but still a little hopeful a better world is possible if we build it", emotion: "encumbered", color: "#7B68EE" },
];

const pictures = [
  { file: "participation.webp", title: "An invitation to participate", alt: "An iPad asks how visitors feel beside a monitor showing a daily color field and three colored circles.", caption: "The iPad prompt and shared display at NYC PIT Pop-ups, 2025.", width: 2400, height: 1800 },
  { file: "daily-fields.webp", title: "The daily archive", alt: "A white archival plate of multicolored vertical fields, titled New York Emotions 14 Days.", caption: "The archival plate titled New York Emotions 14 Days, shown in full.", width: 2400, height: 2400 },
  { file: "daily-field.webp", title: "The day’s reading", alt: "Vertical bands of orange, red, violet, and blue blend into the day’s inferred emotional field.", caption: "The daily reading shown beside visitor responses at the pop-up.", width: 1440, height: 1800 },
  { file: "pit-popup.webp", title: "In public", alt: "The installation seen through a window beside an illuminated NYC Public Interest Technology Pop Up sign.", caption: "New York Emotions at NYC PIT Pop-ups.", width: 1800, height: 2400 },
  { file: "screen-early.webp", title: "Early responses", alt: "The display pairs a banded color field with two visitor-response circles on black.", caption: "Early in the session: two responses beside the day’s reading.", width: 2400, height: 1800 },
  { file: "screen-later.webp", title: "The field grows", alt: "The same daily color field beside a growing collection of colored visitor-response circles.", caption: "The display later in the session.", width: 2400, height: 1800 },
  { file: "six-hours-contact-sheet.webp", title: "Six hours together", alt: "A sequence of black panels records colored circles accumulating through the six-hour session.", caption: "The six-hour sequence, shown as a contact sheet.", width: 2400, height: 2297 },
];

export const newYorkEmotions: ProjectFileData = {
  title: "New York Emotions",
  statement: "The day’s reading.\nThe people in the room.",
  facts: [
    { label: "Period", value: "2025 mayoral-election period" },
    { label: "Location", value: "NYC PIT Pop-ups, New York" },
    { label: "Form", value: "Instrument / participatory study" },
    { label: "Duration", value: "About one month / six-hour live study" },
  ],
  summary: "A daily interpretation of public attention meets six hours of people describing how they feel.",
  abstract: [
    "New York Emotions ran for about a month leading up to New York City’s 2025 mayoral election. It brought the inquiry of American Emotions into a shorter period and a local political context, using public search activity to produce a daily interpretation of emotion through color.",
    "Days before the election, a six-hour study at NYC PIT Pop-ups added another source: people present in the room. Visitors responded to an iPad prompt, and each response appeared as a colored blip among those already contributed. The growing field was displayed beside the day’s inferred reading.",
    "This was the first project in the series to put the system’s inferred emotional state into direct conversation with what people said they felt. That comparison led directly to Tell Me How You Feel: ACG.",
  ],
  method: {
    title: "Two sources, two timescales",
    columns: [
      { title: "The daily reading", steps: ["Public search trends collected once a day", "Emotion labels and colors assigned within the system", "A daily field of vertical color bands"] },
      { title: "The live responses", steps: ["A visitor responds to “How are you feeling right now?”", "The response receives an emotion label and color", "A colored blip joins the shared display"] },
    ],
    paragraphs: [
      "The daily field remained beside a participant field that grew as responses arrived during the six-hour session. Their different timescales were part of the comparison: a daily interpretation of public attention and immediate descriptions of feeling.",
      "The live input begins with a person’s own words. Its appearance still passes through a system that selects a label and color. A response containing several feelings can become a single blip.",
    ],
    details: [{ title: "Scope of the public signal", paragraphs: ["The retained search data uses Google Trends’ US-NY feed, which is scoped to New York state. The city’s mayoral election supplies the project’s context; the feed also includes sports, entertainment, and other public interests."] }],
  },
  sections: [{
    id: "words-and-interpretations", title: "From a response to an interpretation",
    paragraphs: [
      "The response archive contains 27 submissions, each with text, an emotion label, and a color. These are submission records; the file does not identify distinct participants or include timestamps.",
      "The quotations on this page retain the wording of the submitted text. The labels and colors beside them are the recorded interpretations.",
      "The comparison opens a question about the system itself. A visitor speaks from their own experience, while a model interprets a public signal. Both then pass through decisions about how emotion should be labeled and rendered.",
    ],
    questions: [
      "What is lost when several feelings become one color?",
      "How does a daily interpretation relate to a feeling expressed in the moment?",
      "What can agreement or difference between these two fields tell us?",
    ],
  }, {
    id: "continuation", title: "From New York Emotions to ACG",
    paragraphs: [
      "American Emotions, and later Global Emotions, develop autonomous systems that infer emotional states from public signals. New York Emotions opened a participatory line of inquiry by asking people directly and placing their responses beside the inference.",
      "Tell Me How You Feel: ACG carried that comparison into a shared physical environment. The relationship between inferred states and feelings expressed in person became an installation in light.",
    ],
    links: [{ title: "Tell Me How You Feel: ACG", href: "/projects/acg", role: "The comparison continues in shared space" }],
  }],
  images: pictures.map((picture, index) => ({ ...picture, id: String(index + 1).padStart(2, "0"), src: `/projects/new-york-emotions/${picture.file}` })),
  record: {
    title: "Study record",
    facts: [
      { label: "Context", value: "New York City’s 2025 mayoral election" },
      { label: "Live setting", value: "NYC PIT Pop-ups · Public Interest Technology" },
      { label: "Live duration", value: "Six hours" },
      { label: "Prompt", value: "How are you feeling right now?" },
      { label: "Response archive", value: "27 submissions" },
      { label: "Search archive", value: "170 search-trend records · US-NY" },
    ],
    paragraphs: ["The retained search records carry publication dates from October 21 to November 6, 2025. These describe the supplied archive, rather than establishing the exact start and end of the project. The plate titled “14 Days” is a separate visual selection."],
  },
  references: [
    { title: "American Emotions", href: "/projects/american-emotions", role: "The earlier inquiry into inferred emotion" },
    { title: "Tell Me How You Feel: ACG", href: "/projects/acg", role: "The direct continuation of the live comparison" },
    { title: "Global Emotions", href: "/projects/global-emotions", role: "The autonomous inquiry across locations" },
  ],
};
