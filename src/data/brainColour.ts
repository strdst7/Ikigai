export type ColourKey = "blue" | "green" | "red" | "yellow";

export interface ColourMeta {
  key: ColourKey;
  name: string;
  hex: string;
  soft: string;
  quadrant: string;
  mode: string;
  kanji: string;
  tagline: string;
  emoji: string;
  description: string;
  strengths: string[];
  blindSpots: string[];
  atWork: string[];
  grows: string;
  careers: string[];
  ideal: string;
}

export const COLOURS: Record<ColourKey, ColourMeta> = {
  blue: {
    key: "blue",
    name: "Blue",
    hex: "#2a3a6b",
    soft: "#2a3a6b",
    quadrant: "Cerebral · Left",
    mode: "Analytical Thinking",
    kanji: "析",
    tagline: "The Thinker",
    emoji: "🔹",
    description:
      "You make sense of the world by taking it apart. Facts, logic, and evidence are your native language — you feel safest when something can be explained, measured, and defended.",
    strengths: [
      "Rigorous, logical problem-solving",
      "Comfortable with numbers, systems & data",
      "Sees flaws and gaps others walk past",
      "Decides on evidence, not mood",
    ],
    blindSpots: [
      "Can over-analyse until the moment passes",
      "May dismiss feelings as 'not useful data'",
      "Risk of seeming cold or overly critical",
    ],
    atWork: [
      "Strategy, research & analysis",
      "Architecture of systems and models",
      "Quality, testing, auditing",
    ],
    grows:
      "Practise deciding at 70% certainty. Name the feeling in the room before you name the flaw in the plan.",
    careers: [
      "Data / systems analyst",
      "Researcher, engineer",
      "Strategist, actuary",
      "Product or QA architect",
    ],
    ideal: "Clear problems, real constraints, room to think deeply and be the smartest skeptic in the room.",
  },
  green: {
    key: "green",
    name: "Green",
    hex: "#6b7a5a",
    soft: "#6b7a5a",
    quadrant: "Limbic · Left",
    mode: "Organised Planning",
    kanji: "整",
    tagline: "The Organiser",
    emoji: "🟢",
    description:
      "You turn chaos into order. Process, sequence, and reliability are your craft — people trust you precisely because you do what you said you would, when you said you would.",
    strengths: [
      "Meticulous planning and follow-through",
      "Calm, consistent, deeply dependable",
      "Catches small errors before they compound",
      "Builds structure where there was none",
    ],
    blindSpots: [
      "Can resist change that breaks the plan",
      "May choose the safe path over the bold one",
      "Risk of rigidity under pressure",
    ],
    atWork: [
      "Operations, project & logistics",
      "Administration, compliance, finance",
      "Implementation and delivery",
    ],
    grows:
      "Build one 'unplanned' hour into each week. Ask: is this process serving the goal, or am I serving the process?",
    careers: [
      "Project / operations manager",
      "Planner, coordinator",
      "Accountant, auditor",
      "Teacher, administrator",
    ],
    ideal: "Clear expectations, steady rhythm, and the satisfaction of seeing a plan actually land on time.",
  },
  red: {
    key: "red",
    name: "Red",
    hex: "#b5384c",
    soft: "#b5384c",
    quadrant: "Limbic · Right",
    mode: "Relational Feeling",
    kanji: "情",
    tagline: "The Feeler",
    emoji: "🔴",
    description:
      "You read the room before anyone speaks. Warmth, empathy, and human connection are your instruments — you move through the world noticing who is okay and who is quietly not.",
    strengths: [
      "Exceptional emotional intelligence",
      "Builds trust fast and holds it long",
      "Mediates conflict and reads unspoken tension",
      "Puts people at the centre of every plan",
    ],
    blindSpots: [
      "Absorbs other people's stress as your own",
      "May avoid hard decisions to keep the peace",
      "Risk of taking criticism personally",
    ],
    atWork: [
      "Coaching, teaching & facilitation",
      "HR, people & culture, counselling",
      "Client relationships, care work",
    ],
    grows:
      "Practise saying no without a paragraph of apology. Your care is more sustainable when it has edges.",
    careers: [
      "Counsellor, coach, therapist",
      "HR / people partner",
      "Teacher, community builder",
      "Client success, nurse",
    ],
    ideal: "Warm, collaborative spaces where the work clearly helps a real human being.",
  },
  yellow: {
    key: "yellow",
    name: "Yellow",
    hex: "#d4a02c",
    soft: "#d4a02c",
    quadrant: "Cerebral · Right",
    mode: "Imaginative Creating",
    kanji: "創",
    tagline: "The Imaginer",
    emoji: "🟡",
    description:
      "You see the finished thing before anyone else sees the first step. Ideas arrive fast, in bunches, from strange directions — and they excite you more than the paperwork that follows.",
    strengths: [
      "Generates ideas relentlessly",
      "Sees the whole system before the parts",
      "Connects unrelated fields into something new",
      "Brings energy and possibility to a room",
    ],
    blindSpots: [
      "Starts brilliantly, finishes less often",
      "May underweight practical constraints",
      "Risk of losing the thread mid-project",
    ],
    atWork: [
      "Innovation, design & concepting",
      "Brand, story, and campaign work",
      "Early-stage product and R&D",
    ],
    grows:
      "Pick one idea and give it a deadline. Finishing one thing teaches you more than starting ten.",
    careers: [
      "Designer, creative director",
      "Founder, entrepreneur",
      "Writer, marketer, artist",
      "Product innovator",
    ],
    ideal: "Open briefs, freedom to experiment, and space to think out loud without being boxed in.",
  },
};

export const COLOUR_ORDER: ColourKey[] = ["blue", "green", "red", "yellow"];

export interface Statement {
  id: string;
  text: string;
  colour: ColourKey;
}

// 20 statements — interleaved so no colour clusters together.
export const STATEMENTS: Statement[] = [
  { id: "s1", text: "I enjoy breaking a complex problem into small, logical steps.", colour: "blue" },
  { id: "s2", text: "I feel calm when my plans, files and calendar are in order.", colour: "green" },
  { id: "s3", text: "I sense how people are feeling before they say a word.", colour: "red" },
  { id: "s4", text: "My mind jumps to new ideas faster than I can explain them.", colour: "yellow" },
  { id: "s5", text: "I trust data and evidence more than intuition.", colour: "blue" },
  { id: "s6", text: "I follow a routine and rarely leave things to the last minute.", colour: "green" },
  { id: "s7", text: "I would rather collaborate than work alone.", colour: "red" },
  { id: "s8", text: "I see the big picture long before the details exist.", colour: "yellow" },
  { id: "s9", text: "I like to know the 'why' behind a decision before I commit.", colour: "blue" },
  { id: "s10", text: "I read the instructions before I begin.", colour: "green" },
  { id: "s11", text: "People come to me when they need to be heard or comforted.", colour: "red" },
  { id: "s12", text: "I get restless when a task repeats exactly the same way twice.", colour: "yellow" },
  { id: "s13", text: "I spot flaws and inconsistencies in an argument quite easily.", colour: "blue" },
  { id: "s14", text: "I notice small errors in detail that other people miss.", colour: "green" },
  { id: "s15", text: "I value harmony in a group more than winning an argument.", colour: "red" },
  { id: "s16", text: "I connect ideas from totally unrelated fields.", colour: "yellow" },
  { id: "s17", text: "I would rather be accurate than fast.", colour: "blue" },
  { id: "s18", text: "I prefer clear rules and a defined process over improvising.", colour: "green" },
  { id: "s19", text: "I remember personal details about someone I met only once.", colour: "red" },
  { id: "s20", text: "I would rather try an untested idea than repeat a proven one.", colour: "yellow" },
];

export interface WordChoice {
  word: string;
  colour: ColourKey;
}

export const WORDS: WordChoice[] = [
  { word: "Logical", colour: "blue" },
  { word: "Organised", colour: "green" },
  { word: "Warm", colour: "red" },
  { word: "Inventive", colour: "yellow" },
  { word: "Curious", colour: "blue" },
  { word: "Reliable", colour: "green" },
  { word: "Empathetic", colour: "red" },
  { word: "Visionary", colour: "yellow" },
  { word: "Precise", colour: "blue" },
  { word: "Thorough", colour: "green" },
  { word: "Loyal", colour: "red" },
  { word: "Playful", colour: "yellow" },
  { word: "Objective", colour: "blue" },
  { word: "Patient", colour: "green" },
  { word: "Expressive", colour: "red" },
  { word: "Spontaneous", colour: "yellow" },
];

export const BLEND_NAMES: Record<string, { name: string; line: string }> = {
  "blue+green": { name: "The Architect", line: "You design systems that are both clever and correct. People come to you to make something complicated finally make sense." },
  "blue+red": { name: "The Advisor", line: "You pair a sharp mind with a warm delivery — you can tell someone a hard truth and have them thank you for it." },
  "blue+yellow": { name: "The Inventor", line: "You imagine the bold idea and then stress-test it. This is the rarest pairing — vision with a blueprint." },
  "green+red": { name: "The Steward", line: "You are the steady heart of a team. You protect people and process at the same time, quietly and without credit." },
  "green+yellow": { name: "The Builder", line: "You take a wild idea and give it a schedule. Ideas survive contact with reality because of people like you." },
  "red+yellow": { name: "The Storyteller", line: "You turn ideas into feelings people remember. Where others explain, you make people care." },
};
