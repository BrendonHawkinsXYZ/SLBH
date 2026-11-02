import type { Artwork } from "./artwork";
import { questionProjects } from "./homeQuestions";

type HomeSelection = Omit<Artwork, "project" | "href" | "year"> & {
  edition: "pitLab" | "workshop" | "acg";
};

// The complete Tell Me How You Feel / website selection, in an authored sequence.
// Each source filename stays beside its web export for future archive updates.
const selections: HomeSelection[] = [
  // Frame 23.png
  {"edition": "pitLab", "src": "/home/tell-me-how-you-feel/pit-lab-window.webp", "title": "An invitation at the Oculus", "alt": "The PIT Lab storefront with participant drawings across the window and the Tell Me How You Feel invitation on a screen.", "width": 1764, "height": 1454, "color": "#74655f"},
  // Frame 14.png
  {"edition": "workshop", "src": "/home/tell-me-how-you-feel/chroma-shared-table.webp", "title": "Around the table", "alt": "Participants in conversation around a flower-filled table at the Chroma workshop.", "width": 1764, "height": 1454, "color": "#6b5c4a"},
  // 542CC303-D1DC-4812-9B01-A2FD9D86AEF1.JPG
  {"edition": "acg", "src": "/home/tell-me-how-you-feel/acg-storefront.webp", "title": "Two windows", "alt": "The ACG storefront illuminated in pink and amber as a passerby moves along the street.", "width": 2400, "height": 1920, "color": "#5d4549"},
  // Frame 1.png
  {"edition": "pitLab", "src": "/home/tell-me-how-you-feel/pit-lab-inspired-drawing.webp", "title": "Inspired, in progress", "alt": "A participant draws on an Inspired worksheet with colored pencils at PIT Lab.", "width": 1454, "height": 1764, "color": "#655b51"},
  // Frame 17.png
  {"edition": "workshop", "src": "/home/tell-me-how-you-feel/chroma-drawing-together.webp", "title": "Drawing together", "alt": "Participants draw emotion prompts around the shared Chroma table, with flowers and a bowl of markers between them.", "width": 1764, "height": 1454, "color": "#6e5a48"},
  // 086919AA-90C0-4180-9ABF-15E4109F7B60.JPG
  {"edition": "acg", "src": "/home/tell-me-how-you-feel/acg-presentation.webp", "title": "A shared conversation", "alt": "An audience listens to a presentation inside the ACG installation.", "width": 2400, "height": 1600, "color": "#3f2e26"},
  // Frame 8.png
  {"edition": "pitLab", "src": "/home/tell-me-how-you-feel/pit-lab-inspired-portrait.webp", "title": "Inspired", "alt": "A monochrome portrait of a participant holding an Inspired drawing against a pink background.", "width": 1454, "height": 1764, "color": "#c6afb0"},
  // Frame 20.png
  {"edition": "workshop", "src": "/home/tell-me-how-you-feel/chroma-gathering.webp", "title": "Leaving with a form", "alt": "Participants gather with drawings and flowers around the Chroma workshop table.", "width": 1764, "height": 1454, "color": "#75695b"},
  // 221D57FE-8418-4360-9AB2-791AA7A29EC9.JPG
  {"edition": "acg", "src": "/home/tell-me-how-you-feel/acg-audience.webp", "title": "In the room", "alt": "Audience members seated together during the ACG gathering.", "width": 2400, "height": 1920, "color": "#513c33"},
  // Frame 25.png
  {"edition": "pitLab", "src": "/home/tell-me-how-you-feel/pit-lab-grumpy-drawing.webp", "title": "Grumpy, in progress", "alt": "A participant adds black marks and a wavy line to a Grumpy emotion worksheet.", "width": 1764, "height": 1454, "color": "#8e7f74"},
  // Frame 16.png
  {"edition": "workshop", "src": "/home/tell-me-how-you-feel/chroma-tea.webp", "title": "Tea at the table", "alt": "Tea is poured into ceramic cups on the Chroma workshop table.", "width": 1764, "height": 1454, "color": "#73654a"},
  // F1E055C4-6936-4B3D-8DE2-36FD4B9BEBDE.JPG
  {"edition": "acg", "src": "/home/tell-me-how-you-feel/acg-food.webp", "title": "Food for the gathering", "alt": "Bowls of colorful vegetables and prepared food at the ACG gathering.", "width": 2400, "height": 1920, "color": "#6e4f3c"},
  // Frame 11.png
  {"edition": "pitLab", "src": "/home/tell-me-how-you-feel/pit-lab-hurt-portrait.webp", "title": "Hurt", "alt": "A monochrome participant portrait on a pale yellow background, holding a Hurt drawing with a short reflection above.", "width": 1454, "height": 1764, "color": "#b5b19e"},
  // Frame 18.png
  {"edition": "workshop", "src": "/home/tell-me-how-you-feel/chroma-food.webp", "title": "A sensory menu", "alt": "A plate of food beside the printed Chroma menu and scratch card at a place setting.", "width": 1764, "height": 1454, "color": "#715b47"},
  // F0582A25-F178-4357-ADB2-B0592D6819C3.JPG
  {"edition": "acg", "src": "/home/tell-me-how-you-feel/acg-shared-meal.webp", "title": "A table for guests", "alt": "Prepared food, flowers, and glasses arranged for the ACG gathering.", "width": 1600, "height": 2400, "color": "#78633f"},
  // Frame 12.png
  {"edition": "pitLab", "src": "/home/tell-me-how-you-feel/pit-lab-drawing-materials.webp", "title": "An open prompt", "alt": "Emotion worksheets, colored pencils, and cups of markers across the PIT Lab drawing table.", "width": 1454, "height": 1764, "color": "#767676"},
  // Frame 15.png
  {"edition": "workshop", "src": "/home/tell-me-how-you-feel/chroma-flowers.webp", "title": "Taking the table apart", "alt": "Hands bind a bouquet of flowers at the close of the Chroma workshop.", "width": 1454, "height": 1764, "color": "#89622b"},
  // 8C8C81DE-B83B-4052-AA38-3A3C175E7716.JPG
  {"edition": "acg", "src": "/home/tell-me-how-you-feel/acg-conversation.webp", "title": "An encounter in shared space", "alt": "Visitors talk beside the illuminated windows inside the ACG installation.", "width": 1600, "height": 2400, "color": "#38302e"},
  // Frame 9.png
  {"edition": "pitLab", "src": "/home/tell-me-how-you-feel/pit-lab-sad-portrait.webp", "title": "Sad", "alt": "A monochrome participant portrait against lavender, holding a Sad drawing with a reflection about a poem above.", "width": 1454, "height": 1764, "color": "#b5a9bd"},
  // Frame 21.png
  {"edition": "workshop", "src": "/home/tell-me-how-you-feel/chroma-menu.webp", "title": "Refreshing, grounding, brightening", "alt": "The Chroma workshop menu and scratch card rest on the wooden table.", "width": 1454, "height": 1764, "color": "#7e6d63"},
  // DA677BD8-F612-4914-8004-897E4B889600.JPG
  {"edition": "acg", "src": "/home/tell-me-how-you-feel/acg-street-gathering.webp", "title": "Beyond the storefront", "alt": "People gather outside the ACG installation in the evening, with violet light entering the street.", "width": 2400, "height": 1600, "color": "#2b1f23"},
  // Frame 22.png
  {"edition": "pitLab", "src": "/home/tell-me-how-you-feel/pit-lab-ashamed-drawing.webp", "title": "Ashamed, in progress", "alt": "A participant uses a marker to give Ashamed a visual form on a printed worksheet.", "width": 1764, "height": 1454, "color": "#7a7778"},
  // FullSizeRender_VSCO.JPG
  {"edition": "acg", "src": "/home/tell-me-how-you-feel/acg-participant-response.webp", "title": "Adding a response", "alt": "A visitor uses a phone at the ACG storefront beside an emotion prompt and QR code.", "width": 2400, "height": 1920, "color": "#774b27"},
  // Frame 5.png
  {"edition": "pitLab", "src": "/home/tell-me-how-you-feel/pit-lab-tea-and-cookies.webp", "title": "Tea and cookies", "alt": "Tea, two-tone cookies, paper cups, and a printed menu arranged as part of the PIT Lab welcome.", "width": 1454, "height": 1764, "color": "#585049"},
  // Frame 6.png
  {"edition": "pitLab", "src": "/home/tell-me-how-you-feel/pit-lab-table.webp", "title": "A place to begin", "alt": "Emotion drawing sheets, markers, pencils, and a vase of flowers at the PIT Lab table.", "width": 1454, "height": 1764, "color": "#414c51"},
  // Frame 10.png
  {"edition": "pitLab", "src": "/home/tell-me-how-you-feel/pit-lab-outraged-portrait.webp", "title": "Outraged", "alt": "A monochrome participant portrait against pale green, holding an Outraged drawing with a short reflection above.", "width": 1454, "height": 1764, "color": "#afbba3"},
  // Frame 13.png
  {"edition": "pitLab", "src": "/home/tell-me-how-you-feel/pit-lab-surprised-portrait.webp", "title": "Surprised", "alt": "A monochrome participant portrait against a light blue background, holding a Surprised emotion drawing.", "width": 1454, "height": 1764, "color": "#a8c1c1"},
  // Frame 24.png
  {"edition": "pitLab", "src": "/home/tell-me-how-you-feel/pit-lab-conversation.webp", "title": "Drawing and conversation", "alt": "A participant sits with drawing materials at the PIT Lab table during a conversation.", "width": 1764, "height": 1454, "color": "#78726b"},
  // Frame 26.png
  {"edition": "pitLab", "src": "/home/tell-me-how-you-feel/pit-lab-hurt-drawing.webp", "title": "Giving Hurt a form", "alt": "A participant draws yellow lightning on a Hurt emotion worksheet at PIT Lab.", "width": 1764, "height": 1454, "color": "#5a4336"},
];

export const homeArtwork: Artwork[] = selections.map(({ edition, ...image }) => ({
  ...image,
  project: questionProjects[edition].title,
  href: questionProjects[edition].href,
  year: "2026",
}));
