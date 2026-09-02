import type { LabContent } from "@/platform/types";

// Part 3 of the Class 6 State Board Science textbook content — Chapters
// 11-12: Shadows - Images, and Movement and Locomotion. These are the
// final two chapters of the book. Same rule as parts 1 and 2: every
// match, classification and sequence is taken verbatim from the book's
// own tables, activities and "Improve Your Learning" exercises.

export const science6LabsPart3: LabContent[] = [
  // ---------------------------------------------------------------------
  // CHAPTER 11 — Shadows - Images
  // ---------------------------------------------------------------------
  {
    id: "sci-c11-materials-sort",
    subject: "Science",
    classNum: 6,
    chapter: "Chapter 11 · Shadows - Images",
    topic: "Opaque, Transparent or Translucent?",
    interactionType: "drag-to-sort",
    description: "Sort each material by how much light passes through it — from the book's classification exercise.",
    targetLabel: "Materials",
    targetEmoji: "💡",
    items: [
      { id: "c11m-book", label: "Book", emoji: "📕", colorFrom: "#fdba74", colorTo: "#9a3412" },
      { id: "c11m-duster", label: "Duster", emoji: "🧽", colorFrom: "#fdba74", colorTo: "#9a3412" },
      { id: "c11m-chalk", label: "Chalk", emoji: "🖍️", colorFrom: "#fb923c", colorTo: "#c2410c" },
      { id: "c11m-glass", label: "Glass", emoji: "🥃", colorFrom: "#93c5fd", colorTo: "#2563eb" },
      { id: "c11m-air", label: "Air", emoji: "💨", colorFrom: "#7dd3fc", colorTo: "#0284c7" },
      { id: "c11m-polythene", label: "Polythene Cover", emoji: "🛍️", colorFrom: "#fde68a", colorTo: "#d97706" },
      { id: "c11m-oilypaper", label: "Oily Paper", emoji: "📄", colorFrom: "#fef08a", colorTo: "#a16207" },
    ],
    correctCombos: [
      { combo: ["c11m-book", "opaque"], result: "A book is opaque — it blocks light completely", points: 10 },
      { combo: ["c11m-duster", "opaque"], result: "A duster is opaque — it blocks light completely", points: 10 },
      { combo: ["c11m-chalk", "opaque"], result: "Chalk is opaque — it blocks light completely", points: 10 },
      { combo: ["c11m-glass", "transparent"], result: "Glass is transparent — light passes through easily", points: 10 },
      { combo: ["c11m-air", "transparent"], result: "Air is transparent — light passes through easily", points: 10 },
      { combo: ["c11m-polythene", "translucent"], result: "A polythene cover is translucent — it partially allows light", points: 10 },
      { combo: ["c11m-oilypaper", "translucent"], result: "Oily paper is translucent — it partially allows light", points: 10 },
    ],
    bins: [
      { id: "opaque", label: "Opaque", emoji: "⬛" },
      { id: "transparent", label: "Transparent", emoji: "🔍" },
      { id: "translucent", label: "Translucent", emoji: "🌫️" },
    ],
    hints: { default: "Opaque blocks all light, transparent lets it all through, translucent lets some through." },
    xp: 40,
    estMinutes: 6,
    status: "published",
    source: "manual",
    quiz: [
      { id: "q1", question: "Which of these is translucent?", options: ["Glass", "Book", "Polythene cover", "Air"], correctIndex: 2 },
    ],
  },
  {
    id: "sci-c11-concepts-match",
    subject: "Science",
    classNum: 6,
    chapter: "Chapter 11 · Shadows - Images",
    topic: "Shadow, Image or Reflection?",
    interactionType: "drag-to-match",
    description: "Match each term to its correct meaning.",
    targetLabel: "Meanings",
    targetEmoji: "📖",
    items: [
      { id: "c11c-shadow", label: "Shadow", emoji: "🌑", colorFrom: "#fdba74", colorTo: "#9a3412" },
      { id: "c11c-image", label: "Image", emoji: "🪞", colorFrom: "#fb923c", colorTo: "#c2410c" },
      { id: "c11c-opaque", label: "Opaque", emoji: "⬛", colorFrom: "#fde68a", colorTo: "#d97706" },
      { id: "c11c-transparent", label: "Transparent", emoji: "🔍", colorFrom: "#93c5fd", colorTo: "#2563eb" },
      { id: "c11c-reflection", label: "Reflection", emoji: "✨", colorFrom: "#7dd3fc", colorTo: "#0284c7" },
    ],
    correctCombos: [
      { combo: ["c11c-shadow", "pic-c11c-shadow"], result: "A shadow is a colourless outline formed when an opaque object blocks light", points: 10, zoneLabel: "A colourless outline formed when an opaque object blocks light" },
      { combo: ["c11c-image", "pic-c11c-image"], result: "An image has the same colours as the object, like in a mirror", points: 10, zoneLabel: "Has the same colours as the object, like in a mirror" },
      { combo: ["c11c-opaque", "pic-c11c-opaque"], result: "Opaque objects do not allow light to pass through", points: 10, zoneLabel: "Does not allow light to pass through it" },
      { combo: ["c11c-transparent", "pic-c11c-transparent"], result: "Transparent objects allow almost all light to pass through", points: 10, zoneLabel: "Allows almost all light to pass through it" },
      { combo: ["c11c-reflection", "pic-c11c-reflection"], result: "Reflection is light bouncing back after hitting an object", points: 10, zoneLabel: "Light bouncing back after hitting an object" },
    ],
    hints: { default: "Think about the difference between your shadow and your reflection in a mirror." },
    xp: 35,
    estMinutes: 5,
    status: "published",
    source: "manual",
    quiz: [
      { id: "q1", question: "Unlike a shadow, an image...", options: ["is always black", "has the same colours as the object", "needs no light", "cannot be seen in a mirror"], correctIndex: 1 },
    ],
  },

  // ---------------------------------------------------------------------
  // CHAPTER 12 — Movement and Locomotion
  // ---------------------------------------------------------------------
  {
    id: "sci-c12-joints-match",
    subject: "Science",
    classNum: 6,
    chapter: "Chapter 12 · Movement and Locomotion",
    topic: "Match the Joint",
    interactionType: "drag-to-match",
    description: "Match each type of joint to where it's found and how it moves.",
    targetLabel: "Where & How It Moves",
    targetEmoji: "🦴",
    items: [
      { id: "c12j-ballsocket", label: "Ball & Socket Joint", emoji: "🏀", colorFrom: "#e9d5ff", colorTo: "#7c3aed" },
      { id: "c12j-hinge", label: "Hinge Joint", emoji: "🚪", colorFrom: "#e9d5ff", colorTo: "#7c3aed" },
      { id: "c12j-pivot", label: "Pivot Joint", emoji: "🔄", colorFrom: "#d8b4fe", colorTo: "#9333ea" },
      { id: "c12j-sliding", label: "Sliding Joint", emoji: "🐍", colorFrom: "#d8b4fe", colorTo: "#9333ea" },
      { id: "c12j-fixed", label: "Fixed Joint", emoji: "🔒", colorFrom: "#c4b5fd", colorTo: "#6d28d9" },
    ],
    correctCombos: [
      { combo: ["c12j-ballsocket", "pic-c12j-ballsocket"], result: "Ball & socket joint: shoulder and hip, moves in all directions", points: 10, zoneLabel: "Found at the shoulder and hip; allows movement in all directions" },
      { combo: ["c12j-hinge", "pic-c12j-hinge"], result: "Hinge joint: elbow and knee, moves like a door", points: 10, zoneLabel: "Found at the elbow and knee; moves in one direction like a door" },
      { combo: ["c12j-pivot", "pic-c12j-pivot"], result: "Pivot joint: neck, lets the head turn", points: 10, zoneLabel: "Joins the skull to the backbone; lets the head turn" },
      { combo: ["c12j-sliding", "pic-c12j-sliding"], result: "Sliding joint: backbone, wrist and ankle, bones slide over each other", points: 10, zoneLabel: "Found in the backbone, wrist and ankle; bones slide over each other" },
      { combo: ["c12j-fixed", "pic-c12j-fixed"], result: "Fixed joint: skull, does not allow movement", points: 10, zoneLabel: "Found in the skull; does not allow any movement" },
    ],
    hints: { default: "Think about how each part of your body actually moves — in a circle, like a door, or not at all." },
    xp: 40,
    estMinutes: 6,
    status: "published",
    source: "manual",
    quiz: [
      { id: "q1", question: "Which joint lets you turn your head from side to side?", options: ["Hinge joint", "Pivot joint", "Fixed joint", "Ball & socket joint"], correctIndex: 1 },
    ],
  },
  {
    id: "sci-c12-limbs-sort",
    subject: "Science",
    classNum: 6,
    chapter: "Chapter 12 · Movement and Locomotion",
    topic: "Limbs or No Limbs?",
    interactionType: "drag-to-sort",
    description: "Some animals move using legs or wings; others move without any limbs at all. Sort each animal.",
    targetLabel: "How Animals Move",
    targetEmoji: "🐾",
    items: [
      { id: "c12l-cow", label: "Cow", emoji: "🐄", colorFrom: "#e9d5ff", colorTo: "#7c3aed" },
      { id: "c12l-bird", label: "Bird", emoji: "🐦", colorFrom: "#e9d5ff", colorTo: "#7c3aed" },
      { id: "c12l-insect", label: "Insect", emoji: "🐜", colorFrom: "#d8b4fe", colorTo: "#9333ea" },
      { id: "c12l-snake", label: "Snake", emoji: "🐍", colorFrom: "#a5b4fc", colorTo: "#4338ca" },
      { id: "c12l-fish", label: "Fish", emoji: "🐟", colorFrom: "#a5b4fc", colorTo: "#4338ca" },
      { id: "c12l-snail", label: "Snail", emoji: "🐌", colorFrom: "#93c5fd", colorTo: "#1d4ed8" },
    ],
    correctCombos: [
      { combo: ["c12l-cow", "haslimbs"], result: "A cow walks using its legs", points: 10 },
      { combo: ["c12l-bird", "haslimbs"], result: "A bird flies using its wings", points: 10 },
      { combo: ["c12l-insect", "haslimbs"], result: "An insect walks using its legs", points: 10 },
      { combo: ["c12l-snake", "nolimbs"], result: "A snake has no limbs — it moves using loops of its body", points: 10 },
      { combo: ["c12l-fish", "nolimbs"], result: "A fish has no limbs — it swims using its streamlined body and fins", points: 10 },
      { combo: ["c12l-snail", "nolimbs"], result: "A snail has no limbs — it crawls using a muscular foot", points: 10 },
    ],
    bins: [
      { id: "haslimbs", label: "Moves with Limbs", emoji: "🦵" },
      { id: "nolimbs", label: "Moves without Limbs", emoji: "〰️" },
    ],
    hints: { default: "Does the animal have legs or wings, or does its whole body do the moving?" },
    xp: 35,
    estMinutes: 4,
    status: "published",
    source: "manual",
    quiz: [
      { id: "q1", question: "How does a snake move without any legs?", options: ["It rolls", "It uses loops of its body pressing against the ground", "It flies", "It swims"], correctIndex: 1 },
    ],
  },
  {
    id: "sci-c12-terms-match",
    subject: "Science",
    classNum: 6,
    chapter: "Chapter 12 · Movement and Locomotion",
    topic: "Muscles & Bones Vocabulary",
    interactionType: "drag-to-match",
    description: "Match each word to its correct meaning.",
    targetLabel: "Meanings",
    targetEmoji: "📖",
    items: [
      { id: "c12t-tendon", label: "Tendon", emoji: "🔗", colorFrom: "#e9d5ff", colorTo: "#7c3aed" },
      { id: "c12t-ligament", label: "Ligament", emoji: "🦴", colorFrom: "#d8b4fe", colorTo: "#9333ea" },
      { id: "c12t-cartilage", label: "Cartilage", emoji: "👂", colorFrom: "#c4b5fd", colorTo: "#6d28d9" },
      { id: "c12t-muscle", label: "Muscle", emoji: "💪", colorFrom: "#a5b4fc", colorTo: "#4338ca" },
      { id: "c12t-skeleton", label: "Skeleton", emoji: "💀", colorFrom: "#93c5fd", colorTo: "#1d4ed8" },
    ],
    correctCombos: [
      { combo: ["c12t-tendon", "pic-c12t-tendon"], result: "A tendon connects a muscle to a bone", points: 10, zoneLabel: "Connects a muscle to a bone" },
      { combo: ["c12t-ligament", "pic-c12t-ligament"], result: "A ligament connects one bone to another bone", points: 10, zoneLabel: "Connects one bone to another bone" },
      { combo: ["c12t-cartilage", "pic-c12t-cartilage"], result: "Cartilage is a flexible bone found in the ear and nose", points: 10, zoneLabel: "A flexible bone found in the ear and nose" },
      { combo: ["c12t-muscle", "pic-c12t-muscle"], result: "A muscle is a tender, fleshy structure that contracts to move a bone", points: 10, zoneLabel: "A tender, fleshy structure that contracts to move a bone" },
      { combo: ["c12t-skeleton", "pic-c12t-skeleton"], result: "The skeleton is the whole framework of bones in the body", points: 10, zoneLabel: "The whole framework of bones in the body" },
    ],
    hints: { default: "Think about what connects muscle to bone, and what connects bone to bone." },
    xp: 35,
    estMinutes: 5,
    status: "published",
    source: "manual",
    quiz: [
      { id: "q1", question: "What connects a bone to another bone?", options: ["Tendon", "Ligament", "Cartilage", "Skeleton"], correctIndex: 1 },
    ],
  },
];
