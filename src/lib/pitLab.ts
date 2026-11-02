import type { ProjectFileData } from "@/components/projects/ProjectFile.types";

export const pitLab: ProjectFileData = {
  title: "Tell Me How You Feel: PIT Lab",
  statement: "Emotion, drawn\nin public.",
  facts: [
    { label: "Dates", value: "October 7 & 28, 2026" },
    { label: "Location", value: "CUNY PIT Lab pop-up, Oculus, New York City" },
    { label: "Program", value: "Social Wednesdays" },
    { label: "Form", value: "Participatory drawing / public research" },
  ],
  summary: "Two public encounters for the launch of Social Wednesdays at CUNY PIT Lab, exploring emotion through participant drawings and conversation.",
  abstract: [
    "On October 7 and 28, 2026, Studio Lab BH brought Tell Me How You Feel to the CUNY PIT Lab pop-up at the Oculus for the launch of Social Wednesdays. Participants selected from 25 emotion prompts, gave a word a visual form, and, where possible, shared what their drawing meant to them.",
    "The two encounters form one developing body of research. The drawings hold individual responses; conversations supply meanings that cannot always be recovered from the image alone. Returning to the same space also made it possible to reconsider the invitation, documentation, and hospitality between sessions.",
  ],
  method: {
    title: "The invitation & method",
    columns: [
      { title: "Choose and draw", text: "A participant selected an emotion from a set of 25 printed prompts and represented it through drawing. The activity invited a personal interpretation, without a correct image to reproduce or a drawing skill to demonstrate." },
      { title: "Describe and share", text: "Where time and comfort allowed, participants explained their drawings. By October 28, the documentation also included portraits and some interviews, approached gradually according to each person’s willingness to take part." },
    ],
    paragraphs: [
      "On October 7, describing the activity as research proved more effective in inviting participation than describing it as an art project. Personal invitations from the corridor mattered; being present inside the pop-up did not by itself bring people to the table.",
      "Some visitors were hesitant about drawing. This raised a question for the next invitation: how could the activity make clear that a contribution did not depend on artistic confidence?",
      "The interviews were not standardized. Some participants spoke about the meaning of their drawing; others described the experience of taking part. The archive therefore distinguishes the drawing, its participant-defined interpretation, and the encounter itself.",
    ],
  },
  sections: [
    {
      id: "participant-meanings",
      title: "What participants brought to the words",
      paragraphs: [
        "In conversations recorded in the October 7 field reflections, one participant represented Hopeful through an airplane and travel to America. Another used sunlight, prayer, and blooming flowers to speak about renewal. A shared word opened onto different memories and aspirations.",
        "A participant associated Defiant with diversity and inclusion in STEM. Other accounts connected Mystified to layered sun and flower imagery, and Patient to clinical color associations alongside the chaos of life. These meanings come from participants’ explanations, rather than an interpretation of their colors alone.",
      ],
    },
    {
      id: "hospitality",
      title: "Hospitality & the pace of participation",
      paragraphs: [
        "After October 7, the reflection was that tea had not been integrated into the encounter as fully as intended. For October 28, Studio Lab BH tea and cookies became a more deliberate part of the welcome.",
        "One participant described tea as helping them slow down, feel centered, and reconnect with a childlike sense of creativity. This account opens a question about how the sensory and social setting shaped that person’s experience of participating.",
      ],
    },
    {
      id: "observations",
      title: "Observations & open questions",
      paragraphs: [
        "The two sessions made the conditions of collection part of the research: how an activity is named, where an invitation happens, whether drawing feels accessible, and how much time a person has to explain their contribution.",
        "The drawings and conversations offer material for studying differences in representation. Two public encounters do not establish universal emotional patterns or conclusions about cultural differences.",
      ],
      questions: [
        "How does describing an invitation as research or art change who feels able to participate?",
        "What does a participant’s explanation preserve that an image alone might leave ambiguous?",
        "How do hospitality, time, language, and confidence with drawing shape whose contributions enter an archive?",
        "How can future documentation keep the drawing, its meaning, and the experience of making it connected?",
      ],
    },
  ],
  images: [
    { file: "cover", title: "An invitation at the Oculus", caption: "The CUNY PIT Lab pop-up, with participant drawings across the window. October 7, 2026.", width: 2400, height: 1800 },
    { file: "drawing", title: "A word becomes a drawing", caption: "A participant works on the Ashamed prompt, with markers and emotion worksheets across the table. October 7, 2026.", width: 1800, height: 2400 },
    { file: "hurt", title: "Hurt", caption: "Hurt. A participant holds a drawing of yellow lightning and a multicolored form against a gray field. October 28, 2026.", width: 1800, height: 2400 },
    { file: "inspired", title: "Inspired", caption: "Inspired. A participant holds a drawing with a light bulb, figures, and a window of color. October 28, 2026.", width: 1800, height: 2400 },
    { file: "conversation", title: "The conversation around the drawing", caption: "Brendon Hawkins in conversation with a participant at the drawing table. October 7, 2026.", width: 2400, height: 1800 },
    { file: "tea-and-cookies", title: "Tea & cookies", caption: "Holy Black Passion tea, Black & Red Sablé cookies, paper cups, and a printed menu at the pop-up.", width: 1978, height: 2400 },
    { file: "at-the-table", title: "Drawing together", caption: "Participants give different emotion prompts a visual form at the shared table. October 7, 2026.", width: 2400, height: 1800 },
  ].map(({ file, ...item }, index) => ({
    ...item,
    id: String(index + 1).padStart(2, "0"),
    src: `/projects/tell-me-how-you-feel-pit-lab/${file}.webp`,
    alt: item.caption,
  })),
  record: {
    title: "October project record",
    facts: [
      { label: "Project", value: "Tell Me How You Feel: PIT Lab" },
      { label: "Dates", value: "October 7 and 28, 2026" },
      { label: "Setting", value: "CUNY PIT Lab pop-up, Oculus, New York City" },
      { label: "Program", value: "Social Wednesdays launch" },
      { label: "Practice", value: "Studio Lab BH / Brendon Hawkins" },
      { label: "Materials", value: "25 emotion prompts, paper, markers, crayons, tea, cookies, and conversation" },
      { label: "Documentation", value: "Participant drawings, field reflections, photographs, and selected interviews" },
    ],
  },
  references: [
    { title: "Tell Me How You Feel: Chroma", role: "An earlier encounter around a shared table", href: "/projects/tell-me-how-you-feel-chroma" },
    { title: "Tell Me How You Feel: ACG", role: "Participant expression in a shared environment", href: "/projects/acg" },
    { title: "Affective Geometry", role: "Emotion as shape and color", href: "/projects/affective-geometry" },
    { title: "Emotion as System", role: "The research foundation", href: "/research/emotion-as-system" },
  ],
};
