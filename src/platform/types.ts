// Core domain types for D.Interactive, the multi-tenant learning platform.
// Everything here is intentionally serializable (no functions, no class
// instances) because it is persisted to localStorage in this demo build and
// is designed to map 1:1 onto future REST/GraphQL payloads.

export type Role = "super-admin" | "admin" | "teacher" | "student";

export type SubjectName =
  | "Maths"
  | "Science"
  | "English"
  | "Telugu"
  | "Social Studies";

export interface School {
  id: string;
  name: string;
  city: string;
  board: "State Board" | "CBSE" | "ICSE";
  logoEmoji: string;
  colorFrom: string;
  colorTo: string;
  classesOffered: number[]; // e.g. [1..10]
  onboardedOn: string; // ISO date
  status: "active" | "trial" | "suspended";
  studentCount: number;
  teacherCount: number;
}

export interface BaseUser {
  id: string;
  schoolId: string;
  name: string;
  avatarEmoji: string;
  role: Role;
}

export interface StudentUser extends BaseUser {
  role: "student";
  classNum: number; // 1-10
  section: string; // A, B, C
  xp: number;
  streakDays: number;
  lastActiveISO: string;
  badges: string[]; // badge ids
  completedLabIds: string[];
}

export interface TeacherUser extends BaseUser {
  role: "teacher";
  subjects: SubjectName[];
  classesHandled: number[];
}

export interface AdminUser extends BaseUser {
  role: "admin";
}

export interface SuperAdminUser extends BaseUser {
  role: "super-admin";
  schoolId: "platform";
}

export type PlatformUser = StudentUser | TeacherUser | AdminUser | SuperAdminUser;

// ---------------------------------------------------------------------------
// Interactive Lab Engine — the reusable content schema. One engine renders
// every subject's labs by branching on `interactionType`.
// ---------------------------------------------------------------------------

export type InteractionType =
  | "drag-mix"
  | "drag-to-count"
  | "drag-to-match"
  | "drag-to-sequence"
  | "drag-to-label"
  | "drag-to-sort"
  // Click/tap-based alternatives to the drag interactions above — same
  // content shape (correctCombos / sequence), a completely different feel.
  | "click-match" // click an item, then click its pair — no dragging
  | "tap-sequence" // tap cards into order, one at a time
  // An illustrated, page-by-page retelling of the actual textbook story,
  // with tap-to-reveal word notes and inline "what happens next?" checks.
  | "story-mode"
  // A real, orbit-controllable 3D scene (Three.js / react-three-fiber) —
  // drag to rotate, scroll to zoom, tap glowing hotspots on the model to
  // reveal real textbook facts. Some scenes are live simulations (a
  // working circuit you can switch on, joints that move the way the real
  // joint does) rather than a static model.
  | "sim-3d";

export interface SortBin {
  id: string;
  label: string;
  emoji: string;
}

// story-mode only: one "page" of the illustrated storybook. `text` is real
// narrative/dialogue lifted from the textbook. `highlight` (optional) makes
// one word in the text tappable, revealing `note` as a fun aside — a light,
// discovery-driven mechanic layered on top of real reading.
export interface StoryPage {
  id: string;
  emoji: string;
  text: string;
  speaker?: string; // for dialogue-style pages (play scripts), who's talking
  highlight?: { word: string; note: string };
}

// story-mode only: an inline "what do you think happens next?" checkpoint
// shown after a specific page, before the reader can continue.
export interface StoryCheckpoint {
  afterPageIndex: number; // 0-based index into storyPages
  question: string;
  options: string[];
  correctIndex: number;
  funFact: string; // shown after answering, right or wrong
}

// sim-3d only: which procedural 3D scene to render. Each scene is
// hand-built from primitive geometry (no external model files) and knows
// its own hotspot positions in 3D space — the `id` here just has to match
// the `id` on one of the scene's built-in hotspot meshes.
export type Sim3DTopic = "plant" | "water-cycle" | "circuit" | "joints";

// sim-3d only: the real fact revealed when a student taps a glowing
// hotspot on the 3D model. Positions live in code (they're tied to each
// scene's geometry); only the label/fact text is authored as content.
export interface Sim3DHotspot {
  id: string;
  label: string;
  fact: string;
}

export interface LabCombo {
  combo: string[]; // item ids that must be combined/matched (order-insensitive unless noted)
  result: string; // human-readable outcome shown to the student
  detail?: string; // equation / fact / caption revealed on success
  points: number;
  // drag-to-match only: override the drop zone's static clue (before it's
  // filled) with text instead of the target item's own emoji/label — used
  // when matching a word to a definition rather than to a picture.
  zoneLabel?: string;
  zoneEmoji?: string;
}

export interface LabItem {
  id: string;
  label: string;
  emoji: string; // stands in for a real illustration asset
  colorFrom: string;
  colorTo: string;
}

export interface LabSound {
  pickup?: boolean;
  correct?: boolean;
  incorrect?: boolean;
  complete?: boolean;
}

export interface LabContent {
  id: string;
  subject: SubjectName;
  classNum: number;
  topic: string;
  chapter: string;
  interactionType: InteractionType;
  description: string;
  // The scene/container students drag items into (beaker, basket, board...)
  targetLabel: string;
  targetEmoji: string;
  items: LabItem[];
  correctCombos: LabCombo[]; // drag-mix / drag-to-match / drag-to-label / drag-to-sort (combo = [itemId, binId])
  sequence?: string[]; // drag-to-sequence: correct order of item ids
  countTarget?: number; // drag-to-count: how many to drag in
  bins?: SortBin[]; // drag-to-sort: the category bins items get classified into
  storyPages?: StoryPage[]; // story-mode: the illustrated storybook pages
  storyCheckpoints?: StoryCheckpoint[]; // story-mode: inline comprehension checks
  sim3dTopic?: Sim3DTopic; // sim-3d: which procedural scene to render
  sim3dHotspots?: Sim3DHotspot[]; // sim-3d: real facts behind each hotspot
  hints: { default: string; onWrong?: string };
  xp: number;
  estMinutes: number;
  status: "published" | "draft" | "pending-review";
  source: "manual" | "pdf-generated";
  quiz: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

// ---------------------------------------------------------------------------
// Assignments, submissions, grading
// ---------------------------------------------------------------------------

export type AssignmentType = "lab" | "quiz" | "written" | "project";
export type AssignmentStatus = "pending" | "submitted" | "graded";

export interface Assignment {
  id: string;
  schoolId: string;
  subject: SubjectName;
  classNum: number;
  section: string;
  title: string;
  type: AssignmentType;
  labId?: string;
  teacherId: string;
  dueDateISO: string;
  createdISO: string;
  maxScore: number;
  instructions: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedISO?: string;
  status: AssignmentStatus;
  score?: number;
  feedback?: string;
  attempts: number;
  timeSpentSec: number;
}

// ---------------------------------------------------------------------------
// Communication
// ---------------------------------------------------------------------------

export interface Announcement {
  id: string;
  schoolId: string;
  authorId: string;
  authorName: string;
  audience: "class" | "school";
  classNum?: number;
  section?: string;
  title: string;
  body: string;
  createdISO: string;
}

export interface DoubtMessage {
  id: string;
  schoolId: string;
  studentId: string;
  teacherId: string;
  subject: SubjectName;
  message: string;
  createdISO: string;
  reply?: string;
  repliedISO?: string;
}

// ---------------------------------------------------------------------------
// Monitoring / alerts
// ---------------------------------------------------------------------------

export type AlertSeverity = "info" | "warning" | "critical";

export interface Alert {
  id: string;
  schoolId: string;
  severity: AlertSeverity;
  title: string;
  detail: string;
  createdISO: string;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
}
