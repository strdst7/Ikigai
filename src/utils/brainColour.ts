import {
  COLOUR_ORDER,
  COLOURS,
  BLEND_NAMES,
  STATEMENTS,
  WORDS,
  ColourKey,
} from "../data/brainColour";

export const LIKERT = [
  { value: 1, label: "Not me" },
  { value: 2, label: "Rarely" },
  { value: 3, label: "Sometimes" },
  { value: 4, label: "Often" },
  { value: 5, label: "Exactly me" },
];

export type Ratings = Record<string, number>; // statementId -> 1..5
export type PickedWords = string[];

export interface ColourScore {
  key: ColourKey;
  raw: number;
  percent: number;
}

export interface BrainResult {
  scores: ColourScore[];
  byColour: Record<ColourKey, ColourScore>;
  dominant: ColourKey;
  secondary: ColourKey;
  least: ColourKey;
  blend: { name: string; line: string };
  axis: { label: string; left: number; right: number };
  cortex: { label: string; cerebral: number; limbic: number };
  headline: string;
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

export const scoreBrain = (ratings: Ratings, words: PickedWords): BrainResult => {
  const raw: Record<ColourKey, number> = { blue: 0, green: 0, red: 0, yellow: 0 };

  // Part 1 — 20 statements (5 per colour), each scored 0–5
  for (const st of STATEMENTS) {
    raw[st.colour] += clamp(ratings[st.id] ?? 0, 0, 5);
  }

  // Part 2 — self-selected identity words add extra weight
  const wordWeight = 2.2;
  for (const w of words) {
    const found = WORDS.find((x) => x.word === w);
    if (found) raw[found.colour] += wordWeight;
  }

  const total = COLOUR_ORDER.reduce((sum, c) => sum + raw[c], 0) || 1;

  const byColour = {} as Record<ColourKey, ColourScore>;
  const scores: ColourScore[] = COLOUR_ORDER.map((c) => {
    const cs: ColourScore = {
      key: c,
      raw: raw[c],
      percent: Math.round((raw[c] / total) * 100),
    };
    byColour[c] = cs;
    return cs;
  }).sort((a, b) => b.percent - a.percent);

  const dominant = scores[0].key;
  const secondary = scores[1].key;
  const least = scores[3].key;

  const pairKey = [dominant, secondary].sort().join("+");
  const blend = BLEND_NAMES[pairKey] ?? {
    name: COLOURS[dominant].tagline,
    line: `You lead with ${COLOURS[dominant].mode.toLowerCase()}, supported by ${COLOURS[
      secondary
    ].mode.toLowerCase()}.`,
  };

  const left = byColour.blue.percent + byColour.green.percent;
  const right = byColour.red.percent + byColour.yellow.percent;
  const cerebral = byColour.blue.percent + byColour.yellow.percent;
  const limbic = byColour.green.percent + byColour.red.percent;

  const headline = `${COLOURS[dominant].name} · ${blend.name} — you lead with ${COLOURS[
    dominant
  ].mode.toLowerCase()}, backed by ${COLOURS[secondary].mode.toLowerCase()}.`;

  return {
    scores,
    byColour,
    dominant,
    secondary,
    least,
    blend,
    axis: {
      label: Math.abs(left - right) < 8 ? "Balanced brain" : left > right ? "Left-dominant" : "Right-dominant",
      left,
      right,
    },
    cortex: {
      label: Math.abs(cerebral - limbic) < 8 ? "Integrated cortex" : cerebral > limbic ? "Cerebral lean" : "Limbic lean",
      cerebral,
      limbic,
    },
    headline,
  };
};
