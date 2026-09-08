export type DiagramRecord = {
  id: string;
  title: string;
  image: string;
  width: number;
  height: number;
  alt: string;
};

// Original Studio Lab BH artwork, supplied by Brendon. The sequence moves from
// definitions to relationships, time, experience, and color.
export const diagrams: DiagramRecord[] = [
  {
    id: "emotional-system-definition",
    title: "The Emotional System",
    image: "/diagrams/emotional-system-definition.png",
    width: 800,
    height: 1000,
    alt: "Four circles of decreasing size accompany a definition of the emotional system as a generative, evaluative, adaptive, and translational architecture.",
  },
  {
    id: "emotion-definition",
    title: "Emotion — Field",
    image: "/diagrams/emotion-definition.png",
    width: 800,
    height: 1000,
    alt: "A wireframe sphere illustrates emotion as a global field condition that configures sensitivity, salience, and responsiveness within a system.",
  },
  {
    id: "mass-definition",
    title: "Meaning — Mass",
    image: "/diagrams/mass-definition.png",
    width: 800,
    height: 1000,
    alt: "Curved paths radiate from a central mass. Meaning introduces weight into an emotional field, exerting pull on perception and action.",
  },
  {
    id: "trajectory-definition",
    title: "Perception — Trajectory",
    image: "/diagrams/trajectory-definition.png",
    width: 800,
    height: 1000,
    alt: "Two eyes cross a wireframe field with directional arrows, illustrating perception as a path shaped by meaning, curvature, bias, and constraint.",
  },
  {
    id: "gradient-definition",
    title: "Action — Gradient",
    image: "/diagrams/gradient-definition.png",
    width: 800,
    height: 1000,
    alt: "Curved paths converge on a point, illustrating action as movement along gradients within the emotional field.",
  },
  {
    id: "structural-behavior-of-the-emotional-system",
    title: "Structural Behavior of the Emotional System",
    image: "/diagrams/structural-behavior-of-the-emotional-system.png",
    width: 800,
    height: 1000,
    alt: "Emotion, meaning, perception, and action form a feedback structure. They correspond to field, mass, trajectory, and gradient, alongside affect as energetic substrate.",
  },
  {
    id: "emotional-temporal-deformation",
    title: "Emotional Temporal Deformation",
    image: "/diagrams/emotional-temporal-deformation.png",
    width: 800,
    height: 1000,
    alt: "A circle labeled Today is compared with a deformed circle using the expression Today times e to the negative lambda plus XY; lambda is decay constant, X material memory, and Y force applied.",
  },
  {
    id: "sample-rate-of-affect-emotion-and-sentiment",
    title: "Sample Rate of Affect, Emotion, and Sentiment",
    image: "/diagrams/sample-rate-of-affect-emotion-and-sentiment.png",
    width: 3200,
    height: 4000,
    alt: "Three rows of rectangular pulses show affect at the slowest rate, emotion at a faster rate, and sentiment at the fastest rate. Colored outlines connect intervals across the rows.",
  },
  {
    id: "sample-rate-of-affect-emotion-and-sentiment-explained",
    title: "Sample Rate — Explanation",
    image: "/diagrams/sample-rate-of-affect-emotion-and-sentiment-explained.png",
    width: 3200,
    height: 4000,
    alt: "Feeling is described as a system sampling itself at multiple rates: affect defines conditions of possibility, emotion organizes temporary structures, and sentiment continuously interprets the present.",
  },
  {
    id: "generative-meaning-space-experiential",
    title: "Generative Meaning Space",
    image: "/diagrams/generative-meaning-space-experiential.png",
    width: 800,
    height: 1000,
    alt: "Experiences including nostalgia, falling in love, religion, grief, and fitness tracking are plotted between bounded and high-dimensional mind, and symbolic and embodied attachment.",
  },
  {
    id: "social-chromatic-field",
    title: "Social Chromatic Field",
    image: "/diagrams/social-chromatic-field.png",
    width: 800,
    height: 1000,
    alt: "Six concentric color bands correspond to perceptual contrast, survival signal, environmental differentiation, cognitive abstraction, material specificity, and symbolic proliferation.",
  },
  {
    id: "emotional-rendering-relativity",
    title: "Emotional Rendering Relativity",
    image: "/diagrams/emotional-rendering-relativity.png",
    width: 3200,
    height: 4000,
    alt: "Twelve differently colored versions of one portrait are labeled Happy, Sad, Angry, Excited, Afraid, Loved, Surprised, Desire, Envy, Fear, Interest, and Pride.",
  },
  {
    id: "no-chromophobia",
    title: "No Chromophobia",
    image: "/diagrams/no-chromophobia.png",
    width: 800,
    height: 1000,
    alt: "The word Chromophobia appears in a spectrum of colors behind a white prohibition symbol.",
  },
];
