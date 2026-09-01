import { Pillar, QUESTIONS } from "../data/questions";

export type Answers = Record<string, string>;

// Common English stopwords to drop before extraction.
const STOPWORDS = new Set(
  (
    "i me my we us our you your he him his she her they them their it its this that these those " +
    "a an the is are was were be been being am have has had do does did will would could should " +
    "may might can shall of in on at to for with by about as from into through during before after " +
    "above below between under again further then once here there when where why how all any both " +
    "each few more most other some such no nor not only own same so than too very just really " +
    "also because but and or if while because since until even much many lot lots get got like " +
    "love enjoy doing help make making made work working worked think thought feel felt want wanted " +
    "thing things people person time times way ways day days life live living"
  ).split(/\s+/)
);

const tokenize = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w));

const extractBigrams = (text: string): string[] => {
  const words = text.toLowerCase().replace(/[^a-z0-9\s'-]/g, " ").split(/\s+/);
  const out: string[] = [];
  for (let i = 0; i < words.length - 1; i++) {
    const a = words[i];
    const b = words[i + 1];
    if (a.length > 2 && b.length > 2 && !STOPWORDS.has(a) && !STOPWORDS.has(b)) {
      out.push(`${a} ${b}`);
    }
  }
  return out;
};

type Theme = { term: string; count: number; pillars: Set<Pillar> };

export interface IkigaiResult {
  loveThemes: string[];
  goodThemes: string[];
  needsThemes: string[];
  paidThemes: string[];
  intersection: string;
  explanation: string;
  nextSteps: string[];
}

const pillarThemes = (pillar: Pillar, answers: Answers): string[] => {
  const pool = QUESTIONS.filter((q) => q.pillar === pillar)
    .map((q) => answers[q.id] || "")
    .join(" ");
  const unigrams = tokenize(pool);
  const bigrams = extractBigrams(pool);

  const counts = new Map<string, number>();
  for (const w of unigrams) counts.set(w, (counts.get(w) || 0) + 1);
  for (const b of bigrams) counts.set(b, (counts.get(b) || 0) + 2); // bigrams weighted higher

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map((e) => e[0])
    .filter((t) => t.length > 3)
    .slice(0, 4)
    .map(pretty);
};

const pretty = (s: string): string =>
  s
    .split(" ")
    .map((w) => (w.length <= 2 ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");

const findIntersections = (answers: Answers): { shared: string[]; all: Map<string, Theme> } => {
  const themes = new Map<string, Theme>();
  const pillars: Pillar[] = ["love", "good", "needs", "paid"];
  for (const p of pillars) {
    const pool = QUESTIONS.filter((q) => q.pillar === p)
      .map((q) => answers[q.id] || "")
      .join(" ");
    const terms = [...tokenize(pool), ...extractBigrams(pool)];
    const seen = new Set<string>();
    for (const t of terms) {
      if (seen.has(t)) continue;
      seen.add(t);
      const cur = themes.get(t) || { term: t, count: 0, pillars: new Set() };
      cur.count += 1;
      cur.pillars.add(p);
      themes.set(t, cur);
    }
  }
  const shared = [...themes.values()]
    .filter((t) => t.pillars.size >= 2)
    .sort((a, b) => b.pillars.size - a.pillars.size || b.count - a.count)
    .slice(0, 5)
    .map((t) => pretty(t.term));
  return { shared, all: themes };
};

const buildIntersectionStatement = (
  _answers: Answers,
  love: string[],
  good: string[],
  needs: string[],
  paid: string[],
  shared: string[]
): string => {
  // Prefer cross-pillar shared terms; otherwise compose from top themes.
  const seed = shared[0] || love[0] || good[0] || "a practice you are still discovering";
  const audience = needs[0] || "people around you";
  const vehicle = paid[0] || good[0] || love[0] || "your craft";
  return `To weave ${seed.toLowerCase()} into a life of service — offering ${vehicle.toLowerCase()} to ${audience.toLowerCase()}, in a way that sustains you and quietly changes the people it touches.`;
};

const buildExplanation = (
  love: string[],
  good: string[],
  needs: string[],
  paid: string[],
  shared: string[]
): string => {
  const parts: string[] = [];
  if (shared.length) {
    parts.push(
      `Words like "${shared.slice(0, 3).join(", ")}" surfaced across multiple pillars — a sign they aren't just interests, they're threads of your identity.`
    );
  }
  parts.push(
    `Your passions (${love.slice(0, 2).join(" & ") || "what you named"}) light you up. Your strengths (${good.slice(0, 2).join(" & ") || "what others see in you"}) are the tools. The world you want to serve (${needs.slice(0, 2).join(" & ") || "the people you named"}) gives the work meaning. And ${paid.slice(0, 2).join(" & ") || "what you can offer"} is how it sustains itself.`
  );
  parts.push("Where these overlap is not a single job — it's a direction. Your ikigai is a compass, not a destination.");
  return parts.join(" ");
};

const buildNextSteps = (love: string[], good: string[], paid: string[]): string[] => {
  const craft = paid[0] || good[0] || love[0] || "your craft";
  return [
    `Spend one hour this week doing ${love[0] ? love[0].toLowerCase() : craft.toLowerCase()} purely for joy — no output, no audience. Reconnect with the spark.`,
    `Find three people who already live near your ikigai (practicing ${good[0] ? good[0].toLowerCase() : "what you admire"}) and ask each of them one honest question.`,
    `Design a 30-day small experiment: offer ${paid[0] ? paid[0].toLowerCase() : "your skill"} to one person, in one format, and notice what feels alive and what feels heavy.`,
  ];
};

export const analyzeIkigai = (answers: Answers): IkigaiResult => {
  const love = pillarThemes("love", answers);
  const good = pillarThemes("good", answers);
  const needs = pillarThemes("needs", answers);
  const paid = pillarThemes("paid", answers);
  const { shared } = findIntersections(answers);

  return {
    loveThemes: love.length ? love : ["the things you described"],
    goodThemes: good.length ? good : ["the strengths you named"],
    needsThemes: needs.length ? needs : ["the causes you care about"],
    paidThemes: paid.length ? paid : ["what you can offer"],
    intersection: buildIntersectionStatement(answers, love, good, needs, paid, shared),
    explanation: buildExplanation(love, good, needs, paid, shared),
    nextSteps: buildNextSteps(love, good, paid),
  };
};
