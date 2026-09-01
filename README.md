<img width="2240" height="1260" alt="Screenshot 2026-09-02 at 3 29 04 AM" src="https://github.com/user-attachments/assets/943b845a-885a-4c6b-92c8-96bd24af098d" />


# 🌸 MI4INC. Self-Discovery Series

### A web application built with **React**, **Vite**, **Tailwind CSS**, and **natalengine (VSOP87 ephemeris)** that translates inner self-discovery into interactive visual charts, cross-assessment readings, and actionable life guidance.

---

### 📑 Table of Contents

- [Overview](#-overview)
- [The Three Self-Discovery Instruments](#-the-four-self-discovery-instruments)
  - [1. Ikigai Discovery (生き甲斐)](#1-ikigai-discovery-生き甲斐)
  - [2. Brain Colour Personality (四色の脳)](#2-brain-colour-personality-四色の脳)
  - [3. Big Five / OCEAN Trait Profile (五つの気質)](#3-big-five--ocean-trait-profile-五つの気質)
- [Cross-Assessment Synthesis](#-cross-assessment-synthesis)
- [Bilingual Support (English & Bahasa Melayu)](#-bilingual-support-english--bahasa-melayu)
- [Design & Aesthetic](#-design--aesthetic)
- [Tech Stack](#-tech-scale)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Credits](#-credits)

---

## 👁️ Overview

Most personality tools look at a person through a single lens. This application provides three complementary perspectives on the self:

1. **Ikigai** → Your direction and purpose (*What should I do with my life?*)
2. **Brain Colour** → Your thinking style (*How does my mind process information?*)
3. **Big Five (OCEAN)** → Your scientific temperament (*What are my natural emotional and behavioral dials?*)

As you complete each assessment, the app cross-references your results, annotating your readings with insights drawn from your other completed maps.

---

## 🧪 The Three Self-Discovery Instruments

### 1. Ikigai Discovery (生き甲斐)
- **Method:** 12 open-ended reflective questions (3 per pillar).
- **Four Pillars:**
  - 🔴 **Love** (Passion / 愛) — What energizes you and makes you lose track of time.
  - 🔵 **Good at** (Vocation / 技) — Your natural and sharpened strengths.
  - 🟢 **World Needs** (Mission / 世) — Causes, people, and problems that move you.
  - 🟡 **Can be Paid for** (Profession / 生) — Offerings, roles, and skills that sustain life.
- **Engine:** Tokenization + bigram weighted NLP theme extraction (with English & Malay stopword filtering) to identify recurring identity threads across pillars.
- **Output:** Interactive four-circle Venn diagram, custom synthesized Ikigai statement, explanation, and 3 concrete next steps.

### 2. Brain Colour Personality (四色の脳)
- **Method:** 20 Likert statements + 4 self-selected identity word choices.
- **Model:** Herrmann 4-Quadrant Whole-Brain Model:
  - 🔹 **Blue** (Cerebral Left) — Analytical, logical, factual, skeptical.
  - 🟢 **Green** (Limbic Left) — Organised, sequential, reliable, planned.
  - 🔴 **Red** (Limbic Right) — Relational, empathetic, expressive, group-focused.
  - 🟡 **Yellow** (Cerebral Right) — Imaginative, visionary, holistic, spontaneous.
- **Output:** Custom SVG quadrant chart with variable wedge radii, Hemisphere (Left/Right) & Cortex (Cerebral/Limbic) split readouts, blend archetypes (*The Architect, The Advisor, The Inventor, The Steward, The Builder, The Storyteller*), dominant deep dive, strengths, blind spots, ideal work settings, and growth advice.

### 3. Big Five / OCEAN Trait Profile (五つの気質)
- **Method:** 40 IPIP-style statements (8 per trait, half reverse-keyed to prevent response bias).
- **Five Traits:** Openness (**O**), Conscientiousness (**C**), Extraversion (**E**), Agreeableness (**A**), Neuroticism (**N**).
- **Output:**
  - Interactive **Chart.js Radar Graph** comparing your profile to the population midpoint.
  - **32 Binary Archetype Codes** (e.g., `11011` → *The Vigilant Strategist*).
  - 5 expandable trait gauges with population distribution bands, best-fit work roles, and behavioral shifts **under pressure**.
  - Emotional stability analysis and response consistency checks (flagging flat or extreme answering).


---

## 🔀 Cross-Assessment Synthesis

When multiple assessments are completed, the application generates cross-reading insights:

- **Ikigai × Brain Colour:** Evaluates whether your daily execution strategy matches your natural thinking style.
- **Ikigai × Big Five:** Analyzes whether your temperament aligns with the direction of your purpose and highlights traits to leverage or scaffold.
- **Brain Colour × Big Five:** Cross-reads your whole-brain processing quadrant against your strongest and quietest personality dials.


## 🌐 Bilingual Support (English & Bahasa Melayu)

The entire application is fully bilingual:

- **Real-time Language Toggle (`EN` / `BM`):** Switch between English and Bahasa Melayu instantly on any screen without losing your progress.
- **Persisted Preference:** Saves your language choice to `localStorage` and detects browser locale defaults.
- **Malay-Aware NLP:** Includes Malay stopword filters in the Ikigai theme extraction engine for accurate Malay response analysis.

---

## 🎨 Design & Aesthetic

Inspired by Japanese **washi paper** and **sumi ink** aesthetics:

- **Color Palette:** Washi paper background (`#f6f1e8`), Sumi ink typography (`#1f1a14`), Beni red (`#b5384c`), Japanese Indigo (`#2a3a6b`), Moss green (`#6b7a5a`), and Hinoki gold (`#d4a02c`).
- **Typography:** `Fraunces` (serif italic display), `Zen Kaku Gothic New` (clean sans-serif body), and `Zen Old Mincho` (Japanese typography).
- **Animations:** Subtle paper grain texture overlays, ambient floating color washes, breathing SVG charts, scroll reveals, and counted-up numbers.
- **Accessibility:** Reduced motion (`prefers-reduced-motion`) support and responsive layout for mobile, tablet, and desktop screens.

---

## 🛠️ Tech Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Charts & Data Visualization:**
  - `chart.js` + `react-chartjs-2` (Big Five Radar Chart)
  - Custom SVG graphics (Ikigai Venn Diagram, Brain Quadrants, Human Design Bodygraph)
- **Ephemeris & Astronomical Calculations:**
  - `natalengine` (`astronomy-engine` VSOP87 ephemeris)
- **Icons & Typography:** Google Fonts (`Fraunces`, `Zen Kaku Gothic New`, `Zen Old Mincho`)

---

## 📁 Project Structure

```text
├── src/
│   ├── components/
│   │   └── ui.tsx             # Shared UI: Footer, Reveal, CountNumber, VennDiagram, PentagonChart, Minis
│   ├── data/
│   │   ├── bigfive.ts         # Big Five 40 items, traits metadata, 32 archetypes
│   │   ├── brainColour.ts     # Brain Colour 20 statements, 16 words, blend archetypes
│   │   └── questions.ts       # Ikigai 12 questions and pillar metadata
│   ├── screens/
│   │   ├── BigFive.tsx        # Big Five assessment screen & radar results
│   │   ├── BrainColour.tsx    # Brain Colour assessment screen & quadrant results
│   │   ├── Home.tsx           # Editorial index landing page with live mini-charts
│   │   └── Ikigai.tsx         # Ikigai question flow & synthesized results
│   ├── utils/
│   │   ├── analyze.ts         # Ikigai NLP theme extraction & synthesis logic
│   │   ├── bigfive.ts         # Big Five scoring, banding & archetype calculation
│   │   ├── brainColour.ts     # Brain Colour whole-brain scoring & axis split
│   ├── i18n.tsx               # Bilingual context (English / Bahasa Melayu), LangToggle, helper functions
│   ├── App.tsx                # Master state container & route switcher
│   ├── index.css              # Custom themes, animations, font definitions & grain overlay
│   └── main.tsx               # React entry point with LangProvider
├── index.html                 # HTML template with Google Fonts
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **pnpm** or **yarn**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/mi4inc-self-discovery.git
   cd mi4inc-self-discovery
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```
   The production-ready output will be generated in the `dist/` directory.

---

## 💳 Credits

Developed by **Nur Amirah Mohd Kamil** | **MI4INC.**
- 🌐 Website: [aimirah.com](https://aimirah.com)
- 📌 Concept & Design: Ikigai, Brain Colour Whole-Brain Model, Big Five (OCEAN) IPIP-40.
