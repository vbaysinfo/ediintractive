# D.Interactive — Digital Interactive Learning Platform

"Turn any school textbook into a hands-on digital classroom." A
multi-tenant, multi-school platform for Class 1–10 covering Science,
Maths, English, Telugu and Social Studies, built around one reusable
**Interactive Lab Engine** that renders every chapter's hands-on activity
from a single JSON schema — no custom UI per topic.

Built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4,
Framer Motion and Three.js (`@react-three/fiber`).

## Try it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and pick a role.
Quick demo logins:

| Role | How to enter |
|---|---|
| Student | Login screen → Student tab → "Go" on the featured student card (Aarav Patel, Class 6A, Sunrise Public School) |
| Teacher | Login screen → Teacher tab → name **Priya Sharma**, subject Science, school Sunrise Public School |
| Principal / Admin | Login screen → Admin tab → name **Krishna Murthy**, school Sunrise Public School |
| Super Admin | Login screen → Super Admin tab → Enter |

Typing any other name/class/section (or subject/school) creates a brand
new demo account on the fly — there's no real authentication backend, so
anything you type "logs in."

```bash
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## What's implemented

- **Auth & multi-tenant structure** — role-based login (Student/Teacher/
  Admin/Super Admin), 3 seeded demo schools with isolated rosters.
- **Student dashboard** — subject cards, interactive labs, assignments
  (Pending/Submitted/Graded), progress (XP, levels, streaks, badges),
  Ask Teacher.
- **Teacher dashboard** — overview, assignment creation + grading
  (auto-graded quizzes/labs, manual grading for written/project work),
  per-class/per-student performance analytics with at-risk flags,
  class announcements + doubt replies.
- **Admin/Principal dashboard** — school overview, teacher table (subject,
  classes, class average, grading turnaround), student table with
  Good/Average/Needs Attention status, auto-flagged alerts, CSV report
  exports (student performance, teacher summary, assignment completion —
  these are real, working downloads, not mocked).
- **Super Admin console** — platform-wide stats, school onboarding form.
- **The reusable Interactive Lab Engine** (`src/components/platform/
  lab-engine/`) — one engine, driven entirely by the JSON schema in
  `src/platform/types.ts` (`LabContent`). 10 interaction types are
  implemented — 6 with real drag gestures (Framer Motion `drag` /
  `Reorder`), 3 tap/click-only alternatives for a different, very
  graphical feel with zero dragging, and one real 3D engine — all with
  instant visual + audio feedback, unlimited retries, and a completion
  celebration with confetti, XP and badges. Every visual element (chips,
  drop zones, cards, bins) is generously sized for a bold, graphical look:
  - **Drag-Mix** — `DragMix.tsx` (Science: acid-base reactions)
  - **Drag-to-Count** — `DragCount.tsx` (Maths: counting into a basket)
  - **Drag-to-Match** — `DragMatch.tsx` (vocabulary/meaning matching, rhyme
    matching, picture matching, states & capitals — supports either a
    picture-style zone or a text "clue" zone via `LabCombo.zoneLabel`)
  - **Drag-to-Sequence** — `DragSequence.tsx` (ordering events/steps)
  - **Drag-to-Label** — `DragMatch.tsx` in label mode (labeling a diagram)
  - **Drag-to-Sort** — `DragSort.tsx` (classify items into 2+ category
    bins — e.g. sound classification, plant classification)
  - **Click-Match** — `ClickMatch.tsx` (tap an item, then tap its pair —
    a no-drag alternative to Drag-to-Match, same data shape)
  - **Tap-Sequence** — `TapSequence.tsx` (tap cards into order one at a
    time, tap the last card to undo — a no-drag alternative to
    Drag-to-Sequence, same `sequence` data)
  - **Story Mode** — `StoryReader.tsx` (an illustrated, page-by-page
    retelling of the real chapter story, with a tap-to-reveal word note
    on each page and inline "what happens next?" checkpoints, ending in
    the chapter's own reading-comprehension quiz)
  - **3D Simulation** — `Sim3D.tsx` (`lab-engine/sim3d/*.tsx`) — a real,
    orbit-controllable Three.js scene (`three` / `@react-three/fiber` /
    `@react-three/drei`, loaded client-side only via `next/dynamic`).
    Drag to rotate, scroll to zoom, tap a glowing hotspot to reveal a
    real textbook fact. Every scene is built from plain primitive
    geometry — no downloaded 3D models — and two of them are live
    simulations, not just static models: the circuit's switch actually
    opens/closes the loop and the bulb visibly lights or dims, and each
    skeletal joint plays a short demo of its own real range of motion
    (ball & socket wobbles freely, a hinge swings one way like a door,
    a pivot spins, a sliding joint glides) when tapped. Four scenes:
    `PlantScene.tsx` (Ch. 2 plant parts), `WaterCycleScene.tsx` (Ch. 4,
    a continuously-animated evaporation → condensation → precipitation
    → collection loop), `CircuitScene.tsx` (Ch. 10, the working switch),
    `JointsScene.tsx` (Ch. 12, the five joint types)
- **Real textbook content** (`src/platform/data/labs-blossoms6-english*.ts`,
  `labs-blossoms6-stories.ts`) — 28 labs generated from the complete
  Class 6 "Blossoms - 6" English Reader, all 8 units: Clever Tenali
  Ramakrishna, The Snake Catcher, Little Hearts, What Can a Dollar and
  Eleven Cents Do?, At the Vegetable Shop, A Lesson for All, Dr. B.R.
  Ambedkar, and Where There Is a Will There Is a Way — plus 3 of the
  book's poems (The Coromandel Fishers, My Dependence, What Can a Little
  Chap Do?), and a Story Mode lab per unit retelling the real story
  page-by-page. Every word, meaning, story line, sentence order and
  classification is taken verbatim (or lightly paraphrased for length)
  from the book's own story text, Glossary, Reading Comprehension and
  Vocabulary sections — nothing is
  fabricated.
- **Real Science content** (`src/platform/data/labs-science6*.ts`,
  `labs-science6-3dsims.ts`) — the **complete Class 6 State Board Science
  textbook, all 12 chapters**, 34 labs total: The Food We Need, Knowing
  About Plants, Animals and Their Food, Water, Materials - Separating
  Methods, Fun with Magnets, Let us Measure, How Fabrics are Made,
  Organisms and Habitat, Basic Electric Circuits, Shadows - Images, and
  Movement and Locomotion. Millet name matching, food-source and
  food-chain classification, leaf-part labeling, the water cycle, states
  of matter, separation methods (winnowing, filtration, crystallization,
  distillation, sublimation), magnetic/non-magnetic sorting, unit-symbol
  matching, natural/artificial fibre sorting, the cotton-to-fabric
  sequence, biotic/abiotic and aquatic/terrestrial classification,
  pond-habitat matching, conductor/insulator sorting,
  opaque/transparent/translucent classification, joint-type matching,
  and limbs/no-limbs locomotion sorting — all taken verbatim from the
  book's own tables and activities — plus 4 **3D Simulation** labs
  (plant parts, the water cycle, a working circuit, and joints in
  motion) built from those same real facts.
- **Content Pipeline (PDF → Lab)** — a *simulated* pipeline at
  `/teacher/content-pipeline`: pick a subject/class/topic (a real file
  picker is there for the demo, but the PDF isn't actually parsed), watch
  the extraction/segmentation/generation steps animate, then review and
  edit the generated draft before publishing it to students. See "What's
  simulated" below for how to wire in the real thing.
- **Gamification** — XP, levels, streak display, a badge catalog, and
  celebratory (never harsh) feedback.
- **Sound** — every pickup/drop/correct/incorrect/completion cue is
  synthesized on the fly with the Web Audio API (`src/platform/lib/
  sound.ts`) rather than shipped as audio files, so the whole engine has
  zero binary asset dependencies. Swap in real recorded SFX by replacing
  `playSound()`'s internals.

## What's simulated / mocked (by design, for this demo build)

This is a front-end-only build: there is no database and no server. State
lives in a React context (`src/platform/store.tsx`) seeded from
`src/platform/data/*.ts` and persisted to the browser's `localStorage` so
a reload doesn't lose your progress. To turn this into a production
system:

- **Auth** — replace `loginStudent`/`loginTeacher`/`loginAdmin` in
  `store.tsx` with real JWT-based auth + OTP/SSO; today any typed name
  "logs in" or silently creates an account.
- **Database** — replace the `localStorage`-persisted reducer with real
  API calls to Postgres (users/schools/grades) + MongoDB (lab content).
- **PDF → Lab pipeline** — `src/platform/lib/pdfPipeline.ts`'s
  `generateMockLab()` deterministically fabricates plausible items from a
  typed-in topic name. Replace it with real PDF/OCR text+image extraction
  and an LLM concept-extraction pass, keeping the same `LabContent` output
  shape so the Lab Engine and review UI need no changes.
- **Notifications** — email/SMS delivery isn't wired up; only in-app
  announcements/doubts exist.
- **Reports** — CSV exports are real; formatted PDF export would need a
  server-side renderer.

## Where things live

```
src/platform/            Domain layer (framework-agnostic)
  types.ts                All shared types, incl. the reusable LabContent schema
  store.tsx                App state: React context + reducer + localStorage persistence
  nav.ts                   Per-role sidebar navigation
  data/                    Seed data: schools, users, labs, assignments, announcements, badges
  lib/                     sound.ts, gamification.ts, pdfPipeline.ts, csv.ts

src/components/platform/ UI layer
  PlatformShell.tsx         Sidebar + topbar dashboard chrome
  RoleGuard.tsx              Route protection per role
  ui.tsx                     Shared primitives (cards, buttons, badges, stat tiles)
  LoginScreen.tsx, LabsBrowser.tsx, LabRunner.tsx
  lab-engine/                The reusable Interactive Lab Engine + all interaction types

src/app/                 Routes (thin — pages compose the above)
  page.tsx                   Landing page
  login/                     Role-tabbed login
  student/  teacher/  admin/  super-admin/
```

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/) for drag gestures & animation
- [Three.js](https://threejs.org) via [@react-three/fiber](https://r3f.docs.pmnd.rs) & [@react-three/drei](https://github.com/pmndrs/drei) for the 3D Simulation labs
- [lucide-react](https://lucide.dev) for iconography
