import {
  ARCHETYPES,
  ITEMS,
  TRAITS,
  TRAIT_ORDER,
  type Band,
  type TraitKey,
} from "../data/bigfive";

export type BigFiveAnswers = Record<string, number>; // itemId -> 1..5

export interface TraitScore {
  key: TraitKey;
  raw: number; // 8..40 keyed
  percent: number; // 0..100
  band: Band;
  pole: "high" | "low" | "mid";
}

export interface BigFiveResult {
  scores: Record<TraitKey, TraitScore>;
  ordered: TraitScore[];
  code: string;
  archetype: { name: string; line: string };
  most: TraitScore;
  least: TraitScore;
  stabilityNote: string;
  responseNote: string | null;
  headline: string;
  fiveLetters: string;
}

const ITEMS_PER_TRAIT = 8;

export const bandFor = (percent: number): Band => {
  if (percent < 15) return "very-low";
  if (percent < 40) return "low";
  if (percent < 60) return "moderate";
  if (percent < 85) return "high";
  return "very-high";
};

const keyedValue = (itemId: string, value: number): number => {
  const item = ITEMS.find((i) => i.id === itemId);
  if (!item) return value;
  return item.reverse ? 6 - value : value;
};

export const scoreBigFive = (answers: BigFiveAnswers): BigFiveResult => {
  const scores = {} as Record<TraitKey, TraitScore>;

  for (const trait of TRAIT_ORDER) {
    const items = ITEMS.filter((i) => i.trait === trait);
    let sum = 0;
    for (const it of items) {
      const v = answers[it.id];
      if (typeof v === "number") sum += keyedValue(it.id, v);
      else sum += 3; // neutral default if skipped
    }
    const min = ITEMS_PER_TRAIT * 1;
    const max = ITEMS_PER_TRAIT * 5;
    const percent = Math.round(((sum - min) / (max - min)) * 100);
    const band = bandFor(percent);
    scores[trait] = {
      key: trait,
      raw: sum,
      percent,
      band,
      pole: percent >= 60 ? "high" : percent < 40 ? "low" : "mid",
    };
  }

  const ordered = TRAIT_ORDER.map((t) => scores[t]).sort((a, b) => b.percent - a.percent);
  const code = TRAIT_ORDER.map((t) => (scores[t].percent >= 50 ? "1" : "0")).join("");
  const archetype = ARCHETYPES[code] ?? {
    name: "The Balanced Five",
    line: "Your profile sits close to the middle on every dimension — adaptable, hard to type, and free to choose.",
  };

  const most = ordered[0];
  const least = ordered[ordered.length - 1];

  const stability = 100 - scores.N.percent;
  const stabilityNote =
    scores.N.percent >= 70
      ? `Emotional stability reads at ${stability}% — your threat system runs loud. That means the shape of your life matters: sleep, workload and who is around you move your whole profile.`
      : scores.N.percent <= 30
        ? `Emotional stability reads at ${stability}% — you are hard to rattle. The risk isn't panic, it's under-reacting to signals that need attention.`
        : `Emotional stability reads at ${stability}% — you feel stress and recover from it in roughly equal measure, which is the most workable place to sit.`;

  // response style
  const values = ITEMS.map((i) => answers[i.id]).filter((v): v is number => typeof v === "number");
  let responseNote: string | null = null;
  if (values.length) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const sd = Math.sqrt(values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length);
    if (sd < 0.5) {
      responseNote =
        "Your answers were unusually uniform. The direction is readable, but the detail of the shape may be flatter than you really are — retake it on a different day for contrast.";
    } else if (mean > 4.15 || mean < 1.85) {
      responseNote =
        "You leaned consistently toward one end of the scale. Try answering with the middle option where a statement is true only in some seasons of your life.";
    }
  }

  const fiveLetters = `${TRAITS.O.poles[scores.O.pole === "mid" ? "low" : scores.O.pole]} · ${TRAITS.C.poles[scores.C.pole === "mid" ? "low" : scores.C.pole]}`;

  const headline = `${archetype.name} — ${most.key === "N" ? TRAITS.N.name.toLowerCase() : TRAITS[most.key].name.toLowerCase()} leads your five at ${most.percent}%.`;

  return {
    scores,
    ordered,
    code,
    archetype,
    most,
    least,
    stabilityNote,
    responseNote,
    headline,
    fiveLetters,
  };
};

export const CODE_LETTERS = TRAIT_ORDER.map((t) => ({ trait: t, letter: TRAITS[t].name[0] }));
