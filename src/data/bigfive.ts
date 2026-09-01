export type TraitKey = "O" | "C" | "E" | "A" | "N";

export interface TraitMeta {
  key: TraitKey;
  name: string;
  fullName: string;
  kanji: string;
  hex: string;
  tagline: string;
  poles: { high: string; low: string };
  describes: string;
  highTraits: string[];
  lowTraits: string[];
  highStrengths: string[];
  highWatch: string[];
  lowStrengths: string[];
  lowWatch: string[];
  work: string[];
  underPressure: string;
}

export const TRAITS: Record<TraitKey, TraitMeta> = {
  O: {
    key: "O",
    name: "Openness",
    fullName: "Openness to Experience",
    kanji: "開",
    hex: "#29527a",
    tagline: " imagination · curiosity · the new",
    poles: { high: "Explorer", low: "Traditionalist" },
    describes:
      "How strongly you are drawn to ideas that don't exist yet — abstraction, aesthetics, novelty, and questions with no practical answer.",
    highTraits: [
      "Drawn to abstract ideas and unusual connections",
      "Aesthetic sensitivity — music, language, design move you",
      "Comfortable with ambiguity and open endings",
      "Tends to question inherited rules rather than obey them",
    ],
    lowTraits: [
      "Prefers the concrete, tested and demonstrable",
      "Practical over theoretical; useful over elegant",
      "Comfortable with routine and the familiar",
      "Trusts experience and precedent",
    ],
    highStrengths: ["Invention", "Reframing problems", "Long-range vision", "Creative taste"],
    highWatch: ["Starts more than it finishes", "Restless with routine work", "Ideas as procrastination"],
    lowStrengths: ["Execution", "Consistency", "Grounded judgement", "Preserves what works"],
    lowWatch: ["Dismisses the unfamiliar too fast", "Under-invests in new skills"],
    work: ["Research & strategy", "Design and concept work", "Writing, editing, art direction"],
    underPressure: "Under stress you may intellectualise instead of feeling, or chase a shiny exit.",
  },
  C: {
    key: "C",
    name: "Conscientiousness",
    fullName: "Conscientiousness",
    kanji: "律",
    hex: "#4c6b3c",
    tagline:  "order · duty · follow-through",
    poles: { high: "Steward", low: "Improviser" },
    describes:
      "How you relate to obligation and structure — planning, self-discipline, reliability, and the distance between saying and doing.",
    highTraits: [
      "Sets a goal and closes the loop",
      "Prepared, precise, and mindful of detail",
      "Others can depend on your word",
      "Delayed reward comes naturally",
    ],
    lowTraits: [
      "Flexible, spontaneous, tolerant of mess",
      "Works in bursts rather than schedules",
      "Optimistic about last-minute outcomes",
      "Comfortable leaving options open",
    ],
    highStrengths: ["Delivery", "Quality control", "Trust at scale", "Finishes things"],
    highWatch: ["Perfectionism paralysis", "Work as identity", "Hard on 'unreliable' people"],
    lowStrengths: ["Adaptability", "Saying yes to the unexpected", "Speed over ceremony"],
    lowWatch: ["Loose ends", "Commitments that quietly slip", "Underestimates prep time"],
    work: ["Operations & project delivery", "Finance, law, QA", "Any role with a deadline people rely on"],
    underPressure: "Under stress you may over-tighten — more checklists, less sleep, less grace.",
  },
  E: {
    key: "E",
    name: "Extraversion",
    fullName: "Extraversion",
    kanji: "陽",
    hex: "#c8552f",
    tagline: "stimulation · company · assertion",
    poles: { high: "Amplifier", low: "Introject" },
    describes:
      "Not shyness — dosage. How much social stimulation you need, and whether interaction costs you energy or generates it.",
    highTraits: [
      "Talks to think; energy rises in a room",
      "Assertive, easy to approach, enjoys being seen",
      "Seeks stimulation and activity",
      "Positive emotion shows on your face",
    ],
    lowTraits: [
      "Thinks before speaking; prefers depth to breadth",
      "Recharges in solitude",
      "Calm, low-key, deliberate presence",
      "Fewer, closer relationships",
    ],
    highStrengths: ["Networking", "Momentum in groups", "Public voice", "Warmth at scale"],
    highWatch: ["Solitude avoided", "Talks over thinking", "Needs an audience to feel steady"],
    lowStrengths: ["Deep focus", "Listening", "Written expression", "Calm under noise"],
    lowWatch: ["Visibility skipped entirely", "Good ideas stay unspoken", "Assumed to be disengaged"],
    work: ["Leadership, sales, teaching", "Facilitation & MC work", "Community and partnerships"],
    underPressure: "Under stress you may either fill every silence with noise, or vanish from the group.",
  },
  A: {
    key: "A",
    name: "Agreeableness",
    fullName: "Agreeableness",
    kanji: "和",
    hex: "#b86a86",
    tagline: "trust · cooperation · softness",
    poles: { high: "Harmoniser", low: "Challenger" },
    describes:
      "Where you land between cooperation and tough-mindedness — how readily you trust, forgive, compromise, and say the uncomfortable thing.",
    highTraits: [
      "Assumes good intentions",
      "Cooperative, forgiving, generous with credit",
      "Sensitive to how a room is feeling",
      "Prefers consensus to winning",
    ],
    lowTraits: [
      "Sceptical, direct, hard to sway",
      "Puts truth and leverage before harmony",
      "Comfortable with conflict and competition",
      "Guarded about motives — including your own",
    ],
    highStrengths: ["Psychological safety", "Mediation", "Loyalty", "Long relationships"],
    highWatch: ["Self erased from the deal", "Resentment built silently", "Avoids necessary conflict"],
    lowStrengths: ["Negotiation", "Objective calls", "Cuts dead weight fast", "Names the elephant"],
    lowWatch: ["Read as cold", "Trust deficit", "Wins arguments, loses people"],
    work: ["Care, counselling, HR", "Team leadership", "Client & community roles"],
    underPressure: "Under stress you may over-accommodate to keep the peace, or turn abruptly blunt.",
  },
  N: {
    key: "N",
    name: "Neuroticism",
    fullName: "Emotional Stability (reversed)",
    kanji: "波",
    hex: "#6d4c63",
    tagline: "sensitivity · volatility · vigilance",
    poles: { high: "Sensitive Antenna", low: "Steady Hand" },
    describes:
      "How loud your threat system runs — the intensity and duration of negative emotion, and how long it takes a system to settle.",
    highTraits: [
      "Feels things strongly and for a while",
      "Detects risk and tension early",
      "Reflects — sometimes loops",
      "Mood shifts with the weather of the day",
    ],
    lowTraits: [
      "Emotionally even, hard to rattle",
      "Recovers fast from setbacks",
      "Understates risk and stress",
      "Rarely dwells",
    ],
    highStrengths: ["Early warning", "Empathy depth", "Care about consequences", "Articulate inner life"],
    highWatch: ["Catastrophising", "Burnout from carrying", "Avoidance of risk that's actually fine"],
    lowStrengths: ["Crisis steadiness", "Decisive under pressure", "Perspective", "Doesn't spread panic"],
    lowWatch: ["Stress signals missed", "Others' distress underestimated", "Too slow to ask for help"],
    work: ["Editing, therapy, safety-critical roles", "Research, medicine, high-stakes decisions"],
    underPressure: "Under stress you may scan for the worst case and prepare for it — or assume it will simply not happen.",
  },
};

export const TRAIT_ORDER: TraitKey[] = ["O", "C", "E", "A", "N"];

export interface BigFiveItem {
  id: string;
  trait: TraitKey;
  text: string;
  reverse: boolean;
}

/** 40 items — 8 per trait, half reverse-keyed (IPIP-40 style). */
export const ITEMS: BigFiveItem[] = [
  // ── Openness ──
  { id: "o1", trait: "O", text: "Have a lot of ideas of my own.", reverse: false },
  { id: "o2", trait: "O", text: "Rarely question my own beliefs.", reverse: true },
  { id: "o3", trait: "O", text: "Am fascinated by things I have never seen before.", reverse: false },
  { id: "o4", trait: "O", text: "Prefer work that follows a clear, familiar pattern.", reverse: true },
  { id: "o5", trait: "O", text: "Enjoy playing with words, numbers or patterns.", reverse: false },
  { id: "o6", trait: "O", text: "Art and music leave me fairly unmoved.", reverse: true },
  { id: "o7", trait: "O", text: "Like to examine my own thoughts and feelings.", reverse: false },
  { id: "o8", trait: "O", text: "Find abstract discussions a waste of time.", reverse: true },

  // ── Conscientiousness ──
  { id: "c1", trait: "C", text: "Carry out my plans and see them through.", reverse: false },
  { id: "c2", trait: "C", text: "Leave my things lying about.", reverse: true },
  { id: "c3", trait: "C", text: "Do more than I am expected to do.", reverse: false },
  { id: "c4", trait: "C", text: "Often misplace my keys, wallet or phone.", reverse: true },
  { id: "c5", trait: "C", text: "Want things done right the first time.", reverse: false },
  { id: "c6", trait: "C", text: "Put off unpleasant tasks until later.", reverse: true },
  { id: "c7", trait: "C", text: "Am exacting about the details of my work.", reverse: false },
  { id: "c8", trait: "C", text: "Make a mess of things without meaning to.", reverse: true },

  // ── Extraversion ──
  { id: "e1", trait: "E", text: "Feel comfortable around people I have just met.", reverse: false },
  { id: "e2", trait: "E", text: "Prefer to be left alone with my own company.", reverse: true },
  { id: "e3", trait: "E", text: "Start conversations easily.", reverse: false },
  { id: "e4", trait: "E", text: "Keep to myself at gatherings where I know few people.", reverse: true },
  { id: "e5", trait: "E", text: "Am the life of the party when I want to be.", reverse: false },
  { id: "e6", trait: "E", text: "Find being the centre of attention draining.", reverse: true },
  { id: "e7", trait: "E", text: "Talk to others as much as I talk about myself.", reverse: false },
  { id: "e8", trait: "E", text: "Say little when I am with a group.", reverse: true },

  // ── Agreeableness ──
  { id: "a1", trait: "A", text: "Sympathise with others who are less fortunate.", reverse: false },
  { id: "a2", trait: "A", text: "Believe people should look after themselves first.", reverse: true },
  { id: "a3", trait: "A", text: "Forgive people quickly and easily.", reverse: false },
  { id: "a4", trait: "A", text: "Enjoy competing with others more than cooperating.", reverse: true },
  { id: "a5", trait: "A", text: "Am concerned about the feelings of others.", reverse: false },
  { id: "a6", trait: "A", text: "Criticise other people behind their backs.", reverse: true },
  { id: "a7", trait: "A", text: "Take time to listen to other people's problems.", reverse: false },
  { id: "a8", trait: "A", text: "Make demands rather than asking politely.", reverse: true },

  // ── Neuroticism ──
  { id: "n1", trait: "N", text: "Get stressed out easily.", reverse: false },
  { id: "n2", trait: "N", text: "Am relaxed and handle stress well.", reverse: true },
  { id: "n3", trait: "N", text: "Worry about things I have little control over.", reverse: false },
  { id: "n4", trait: "N", text: "Rarely feel sad or depressed.", reverse: true },
  { id: "n5", trait: "N", text: "Am easily disturbed by my own emotions.", reverse: false },
  { id: "n6", trait: "N", text: "Hardly ever notice my mood changing.", reverse: true },
  { id: "n7", trait: "N", text: "Fearful or nervous in situations I know well.", reverse: false },
  { id: "n8", trait: "N", text: "Am not bothered by things that upset most people.", reverse: true },
];

export const LIKERT5 = [
  { v: 1, label: "Very inaccurate" },
  { v: 2, label: "Somewhat inaccurate" },
  { v: 3, label: "Neutral" },
  { v: 4, label: "Somewhat accurate" },
  { v: 5, label: "Very accurate" },
];

export type Band = "very-low" | "low" | "moderate" | "high" | "very-high";

export const BAND_LABEL: Record<Band, string> = {
  "very-low": "Very low",
  low: "Moderately low",
  moderate: "Moderate",
  high: "Moderately high",
  "very-high": "Very high",
};

/** 32 archetypes — bit string is OCEAN, 1 = above midpoint. */
export const ARCHETYPES: Record<string, { name: string; line: string }> = {
  "00000": { name: "The Steady Hand", line: "Concrete, organised, reserved, practical and hard to rattle. You are the person a team quietly relies on when everything must simply work." },
  "00001": { name: "The Guarded Realist", line: "Unsentimental and self-contained, with a live wire under the floor. You see risk before most people see the room." },
  "00010": { name: "The Quiet Pillar", line: "Dependable, calm and warm without ceremony. People feel safe because you are consistent, not because you are loud." },
  "00011": { name: "The Watchful Guardian", line: "You protect what is yours — order, people, promises — and you are alert to anything that threatens it." },
  "00100": { name: "The Lone Operator", line: "Direct, economical, unbothered by applause. You prefer a clear task and your own company, and you finish both." },
  "00101": { name: "The Skeptic", line: "You take the temperature of a room and trust it a little less than everyone else. That reads situations others miss." },
  "00110": { name: "The Soft-Spoken Ally", line: "Reserved in public, devoted in private. Your loyalty is quiet, specific and rarely withdrawn." },
  "00111": { name: "The Wary Peacemaker", line: "You hold the group together while absorbing its static — often at a cost only you know about." },
  "01000": { name: "The Method Craftsman", line: "Structure without theatrics. You make systems that keep performing whether anyone is watching or not." },
  "01001": { name: "The Careful Auditor", line: "Precise, sceptical, prepared. You are the reason the flaw gets found before the client does." },
  "01010": { name: "The Reliable Anchor", line: "Warm and organised in equal measure — the person who remembers the deadline and the birthday." },
  "01011": { name: "The Conscientious Sentinel", line: "You take duty personally and feel the weight of what slips. Standards are a form of care for you." },
  "01100": { name: "The Foreman", line: "Practical, visible, in charge. You give a group a plan and a pace, and you don't mind being obeyed." },
  "01101": { name: "The Watchful Driver", line: "High standards, high voltage. You push hard because the risk of slack genuinely bothers you." },
  "01110": { name: "The Team Steward", line: "You combine reliability with warmth — the rare leader people both trust and want to please." },
  "01111": { name: "The Responsible Captain", line: "You carry the plan, the people and the worry. Everything is handled — the question is at what personal cost." },
  "10000": { name: "The Curious Outsider", line: "Ideas first, audience never. You wander intellectually alone and come back with something no one asked for." },
  "10001": { name: "The Restless Questioner", line: "Your mind is a door that won't stay shut, and your nerves are the hinge. Unusual ideas, uneasy silence." },
  "10010": { name: "The Quiet Explorer", line: "Deeply imaginative, gently withdrawn. You build whole worlds and share only the doorway." },
  "10011": { name: "The Tender Dreamer", line: "Imagination married to empathy — you feel for people and ideas that most never notice exist." },
  "10100": { name: "The Freelance Spark", line: "Ideas plus volume, minus structure. You light rooms and need someone else to hold the schedule." },
  "10101": { name: "The Provocateur", line: "You say the interesting thing loudly and don't much care if it's comfortable. Nothing dull happens near you." },
  "10110": { name: "The Open Host", line: "Curious, gregarious, generous. You collect people and ideas and delight in introducing them." },
  "10111": { name: "The Empathic Dreamer", line: "You imagine how things could be and feel how far they are from that. That tension is your gift and your tax." },
  "11000": { name: "The System Thinker", line: "Ideas with scaffolding. You design the elegant thing and then make it actually run." },
  "11001": { name: "The Precise Analyst", line: "Inventive and exacting, with a low tolerance for hand-waving. You will find the answer and the flaw in it." },
  "11010": { name: "The Diligent Innovator", line: "You don't just imagine the better version — you ship it, on time, with the details respected." },
  "11011": { name: "The Vigilant Strategist", line: "Imagination, discipline and a nervous system tuned for threats. You have thought three moves ahead and prepared for the worst." },
  "11100": { name: "The Visionary Lead", line: "Big ideas, strong structure, social engine. You can picture it, plan it and gather people around it." },
  "11101": { name: "The Fiery Pioneer", line: "You will sell the impossible, organise the team and out-work the risk — mostly by refusing to sit down." },
  "11110": { name: "The Connector", line: "Curious, organised, sociable, kind. You are the hub through which good things reach good people." },
  "11111": { name: "The Storm Riser", line: "Every channel turned up: ideas, drive, people, care and feeling. A life of extraordinary texture — and a nervous system that earns it." },
};
